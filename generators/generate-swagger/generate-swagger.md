---
type: generator
status: disabled
model: claude-sonnet-4-6
base: _generator_base
---

# generate-swagger — Generator (canonical)

*Generic across any swagger-php-style PHP API project. The deployed copy solves the requirements
below with project-specific values.*

Base rules: [_generator_base](_Claude/kcd/generators/_generator_base.md) — composition model,
requirement resolution, fail behavior, output conventions, modifiers.

---

## Parameters

Output: `_Claude/audits/swagger-candidates.md`

*Swagger candidates are a staging/review artifact for paste-in, not a durable reference — so
`Output` is the generator-output bucket `audits/`. The `--test` redirect is defined in
`_generator_base`. `name` / `#{name}` derive from the filename; `model` / `base` live in
frontmatter.*

---

## Requirements

*Declared generically here; solved in the deployed copy. See `_generator_base` for pre-flight
resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `openapi-compiler` | Tooling | An OpenAPI compiler that processes the project's annotation source. Used in Phase 4 as a compile check — it catches annotations the compiler cannot parse at all. It does not verify schema correctness. |
| `controller-source` | Input | Glob of API route-handler source files to scan for annotation gaps. |
| `route-map` | Input | File registering HTTP routes against handler methods — source of verb + full path per method. |
| `security-scheme` | Input | File defining the API security scheme — source of the scheme name applied to every route. |
| `openapi-version` | Input | Target OpenAPI specification version (e.g. `3.0.0`). |

---

## Care

**Defends:**
- The security scheme is declared on every generated route — no exceptions.
- Detection is per-method, not per-handler — a handler with some annotated methods gets candidates only for the unannotated ones.
- Output is review-only — no source file is modified.
- Every candidate is compile-checked (Phase 4) before it reaches the output file — a backstop against catastrophic errors, not a correctness guarantee.

**Will not touch:**
- Any method that already carries an OpenAPI operation annotation block.
- Any non-handler file.

**Surfaces (notes inline, does not block):**
- A route in `route-map` with no matching handler method — note as "unmatched route".
- Ambiguous response body (no visible return structure) — annotate with a bare JSON content block, flag "shape inferred — verify".
- A handler method absent from `route-map` — note as "unrouted method — skip or verify".

---

## Do

*Pre-flight runs first, per `_generator_base` — deployment check, then requirement resolution.
Phases below assume the generator is deployed and all requirements are solved.*

### Phase 1 — Route Map

Read `route-map`. Build a lookup: `{HandlerClass}::{method} → {http_verb, full_path}`, including
any group prefixes. Read `security-scheme` to obtain the security scheme name.

### Phase 2 — Annotation Gap Detection

For each file in `controller-source`:

1. List all public methods.
2. For each method, check whether the annotation block immediately above it contains an OpenAPI operation annotation (`@OA\Get`, `@OA\Post`, `@OA\Patch`, `@OA\Put`, `@OA\Delete`).
3. Classify as **annotated** (skip) or **candidate** (proceed).

Produce a per-file summary: total public methods, annotated count, candidate count.

### Phase 3 — Annotation Generation

For each candidate method, build a complete `@OA\{Verb}` block:

- **Path params** — variables from the method's route arguments.
- **Query params** — keys read from the query string.
- **Request body** — keys read from the parsed body (write verbs only).
- **Responses** — status codes inferred from explicit response-status calls; body properties inferred from response writes and visible SQL columns.
- **Summary** — one short phrase from existing comments or the method name.

Rules:
- The security scheme is declared on every route.
- Query params `in="query"`, path params `in="path"`, body via `@OA\RequestBody` + `@OA\JsonContent`.
- 200 responses include `@OA\JsonContent` with inferred properties.
- Only response codes explicitly returned or clearly implied are included.
- Generated annotations target the `openapi-version` spec.

### Phase 4 — Compile Check

Run the generated candidates through `openapi-compiler` to catch annotations it cannot parse.

1. Construct source stubs containing the candidate annotations. Candidates may be **batched** into stub files (e.g. one per handler) rather than compiled one at a time — a parse error still surfaces against the annotation that caused it.
2. Run `openapi-compiler` against the stub(s).
3. Record each candidate as `COMPILED` (the compiler parsed it) or `COMPILE ERROR: {message}`.

**Scope of this check:** the compiler is lenient — it rejects only annotations it genuinely
cannot parse, not subtly malformed or schema-incorrect ones. `COMPILED` means "well-formed
enough to load", not "correct". The real correctness gate is human review of the candidates
file — which is why output is review-only.

A failing candidate is still written to output — flagged, not dropped — so it can be corrected
by hand.

### Phase 5 — Output Declaration

Write `_Claude/audits/swagger-candidates.md` — flush-and-fill. Under `--test`, the destination is
redirected per `_generator_base`.

**Output format:**

```markdown
# Swagger Candidates — {date}

Generated by #generate-swagger. Each block is paste-ready above the named method.
`[COMPILED]` blocks parsed cleanly; `[COMPILE ERROR]` blocks need correction first.
Compiling is a backstop, not a correctness check — review every block before pasting.

---

## {HandlerName} ({candidate_count} candidates / {total} methods)

#### {MethodName} — [COMPILED]
**Route:** `{HTTP_VERB} {full_path}`

```php
/**
 * @OA\{Verb}(
 *   path="...",
 *   summary="...",
 *   security={{"bearerAuth":{}}},
 *   ...
 * )
 */
```

#### {MethodName} — [COMPILE ERROR: {message}]
...

---

## {FullyAnnotatedHandler} (0 candidates / {total} methods)

*Fully annotated — no candidates.*

---
```

Handlers with zero candidates still appear with the "fully annotated" note, so the coverage
picture is complete.

This generator produces no other output.
