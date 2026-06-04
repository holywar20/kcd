---
type: generator
status: disabled
model: claude-sonnet-4-6
base: _generator_base
kcd:
  lifecycle: draft
---

# index-codebase — Generator (canonical) · **DRAFT**

> **⚠ DRAFT — not deployable yet.** The requirements and Care below are settled; the **output
> format is not defined** (see *Design Notes & Open Questions*). Deploy manually only, and only
> once the output-contract is pinned. Tracked as a draft via `kcd: lifecycle: draft`.

*Generic across any codebase. Reads a **globbed** set of source files and emits a navigation /
"smart reference" index over them — structure and visible symbols only, never prose or logic.
Replaces the old project-specific prototype (hardcoded ad-tech paths + a fixed output taxonomy)
with a glob-scoped, contract-driven generator. The deployed copy solves the requirements below
with project values.*

Base rules: [_generator_base](_Claude/kcd/generators/_generator_base.md) — composition model,
requirement resolution, fail behavior, output conventions, modifiers.

---

## Parameters

Output: a single consolidated index at `{output-path}` (flush-and-fill). *(One file for now — see
Design Notes on whether this should fan out.)*

*`name` / `#{name}` derive from the filename; `model` / `base` live in frontmatter.*

---

## Requirements

*Declared generically here; solved in the deployed copy. See `_generator_base` for pre-flight
resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `include-glob` | Input | **Strict** glob defining which files the indexer may read. This is the *entire* scope — nothing outside the expanded set is ever touched. |
| `exclude-globs` | Input | User-entered exclusions subtracted from the include set (e.g. `vendor/`, build output, fixtures). May be empty. |
| `output-path` | Input | Where the consolidated index is written (a single file, for now). |
| `output-contract` | Input | The **format the index must conform to** — the standardized "smart reference" shape. Points at a format definition the deployed copy supplies; **canonical ships a default, the project tunes its own.** *(The default's content is the open question — see Design Notes.)* |

---

## Care

**Defends:**
- Scope is **exactly** `include-glob` minus `exclude-globs` — never a file outside it.
- Output is a navigation index only — not human documentation, not design commentary.
- Output conforms to `output-contract` — the generator does not invent its own shape.
- Flush-and-fill — the index is destroyed and recreated each run; no accumulation.
- The output directory is created if missing; no other directories are created.

**Will not touch:**
- Any file outside the resolved scope or the `{output-path}`.
- Prose, business logic, or commented-out code in source files — reads structure and visible
  symbols only.
- Source files (read-only) — writes only the index.

**Surfaces (notes inline, does not block):**
- An `include-glob` that expands to zero files — write an empty index, note it in the summary.
- A file in scope that cannot be parsed for symbols — skip it, list it in the summary.

---

## Do *(provisional — pending the output-contract)*

*Pre-flight runs first, per `_generator_base` — deployment check, then requirement resolution.*

### Phase 1 — Scope Resolution

Expand `include-glob`; subtract every pattern in `exclude-globs`. The result is the file set —
the strict, complete scope for the run. An empty set is not a failure (Care: write an empty
index and note it).

### Phase 2 — Inventory

List the in-scope file paths. Do not read content yet.

### Phase 3 — Extract *(shape governed by `output-contract`)*

Per file, read structure and visible symbols only (exports, signatures, routes, types — whatever
the contract names) and extract the fields the `output-contract` defines. **What gets extracted
and how it is shaped is the contract's call, not this generator's** — that is the whole point of
making the format a tunable requirement.

### Phase 4 — Emit (flush-and-fill)

Write the consolidated index to `{output-path}`, conforming to `output-contract`. Create the
output directory if missing.

### Phase 5 — Output Declaration

Writes `{output-path}` (flush-and-fill). Modifies no source file. Prints a summary: files
indexed, files skipped (unparseable / out of scope), and whether the scope was empty.

After Phase 5, the `run-report` habit fires automatically (declared at `_generator_base`).

---

## Design Notes & Open Questions *(DRAFT — Bryan, 2026-06-04)*

The observations that make this a draft rather than a finished generator:

1. **Strict glob + user exclusions are required.** Scope is `include-glob` minus `exclude-globs`
   — both are requirements, no implicit defaults. (Captured above.)
2. **Manual deploy for now** — but the deployed copy must still solve these fields; there is no
   auto-deploy path yet.
3. **Output contracts are required.** The generator emits to a format, not freehand. For now it
   **drops everything into a single file** (`output-path`); fan-out (one file per category, like
   the old prototype's `routes.md` / `controllers.md` / …) is a later contract option.
4. **The core tension — standardized format vs. user tuning.** The goal is *smart references in a
   standardized format*, which means **defining the format** — but users must be able to tune it.
   The proposed resolution mirrors the rest of the framework: **`output-contract` is a deployed
   requirement — canonical ships a default contract, the project overrides its own copy.** That
   gives a standard *and* tunability. **What is still unresolved: the default contract's actual
   content** — the field set, the section layout, what "smart" means for an extracted symbol.
   This is also **cross-cutting** — `generate-css-docs`, `generate-codebase-docs`, and any future
   reference generator share the same "what is a good reference format" question. Worth solving
   once, as a shared standard, not per-generator. *(Lodged as OQ14 in plan-starmind.)*
