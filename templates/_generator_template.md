---
type: template
status:   # the authored generator gets: active | disabled
---

# {name} — Generator (template)

*Scaffold for authoring a canonical generator. Copy to
`_Claude/kcd/generators/{name}/{name}.md` (a generator is a folder: the `.md` trunk plus a
`context/` subfolder). Holds all generic logic; **declares — never solves — its requirements**,
and names no project-specific path or value. Fill every placeholder and delete these scaffold
notes.*

> **Frontmatter for the authored generator** (replaces this template's frontmatter):
> - `type: generator`
> - `status:` — `active` or `disabled`
> - `model: claude-sonnet-4-6` — default; downgrade to haiku only for genuinely trivial mechanical work
> - `base: _generator_base`

Base rules: [_generator_base](_Claude/kcd/generators/_generator_base.md) — composition model,
requirement resolution, fail behavior, output conventions, modifiers.

---

## Parameters

Output: `{the artifact's real home — e.g. references/style_guides/{name}.md}`

*`name` is the folder/file name, `#{name}` the task tag, `model` lives in frontmatter — none are
retyped here. `Output` is the artifact's destination; if it is project-specific, declare it as
an Input requirement and solve it in the deployed copy.*

---

## Modifiers

*Optional. Each modifier is `--`-prefixed, globally unique across the document base, and
registered in the Modifier Registry (a block in `CLAUDE.md` — a temporary home). A modifier may
be omitted; no modifier = default (full) behavior. An unknown modifier fails the run. `--test`
is inherited from `_generator_base` — do not redeclare it. This slot may be empty.*

| Modifier | Effect |
|---|---|
| `--{modifier}` | {what it changes — a scoped subset of the run, or a mode} |

---

## Requirements

*Declared generically; solved in the deployed copy. See `_generator_base` for pre-flight
resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `{requirement-name}` | Tooling \| Input | {what it is, generically — no concrete path or value} |

---

## Care

**Defends:**
- {invariant the generator enforces}

**Will not touch:**
- {out-of-scope files or paths}

**Surfaces (notes inline, does not block):**
- {ambiguous case} — note inline; do not silently skip or invent

---

## Do

*Pre-flight requirement resolution runs first, per `_generator_base`. Phases below assume all
requirements are solved and reachable.*

### Phase 1 — {Source Load}

{What to read, by requirement name. What signal to extract from each.}

### Phase 2 — {Generation}

{What to produce. Structure and content rules for the artifact.}

### Phase 3 — Lens Wiring *(reference-producing generators only)*

For each lens in the `reference-lenses` requirement, ensure its Know table has a
`What | Where | Why` row pointing to the reference — add if missing, correct if stale. Skipped
under `--test`.

### Phase N — Output Declaration

Write `{Output path}` — flush-and-fill.

{Output format — be specific.}

This generator produces no other output.

---

## Deployed copy

Not hand-authored. The deploy script produces it: a full copy of this canonical with
requirements solved to project values, `status: active`, and a `kcd: { canonical: … }` pointer
for provenance (see [_generator_base](_Claude/kcd/generators/_generator_base.md) → Composition
Model). Project-specific quirks, if any, go in a `## Project Notes` section there.
