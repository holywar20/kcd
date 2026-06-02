---
Status: Active
Role: Generator
Base: _generator_base
---

# <name> — Procedure (canonical)

*Canonical generator definition. Holds all generic logic; declares — never solves — its requirements. Names no project-specific path or value.*

*Scaffold use: copy to `kcd/procedures/generators/<name>.md`, fill in, then create the thin deployed copy at `procedures/generators/<name>.md` using the Deployed Copy stub at the end.*

Base rules: [_generator_base](_generator_base.md) — composition model, requirement resolution, fail behavior, output conventions.

---

## Parameters

Name  : <name>
Task  : #<name>
Model : claude-sonnet-4-6
Type  : Generator
Output: `<the artifact's real home — e.g. references/style_guides/<name>.md>`

*Output is the artifact's destination, declared per procedure. If the destination is project-specific, declare it as an Input requirement and solve it in the deployed copy.*

---

## Flags

*Optional. Flags modify a run's behavior or scope. Each flag is `--`-prefixed, globally unique across the entire document base, and registered in the master procedure index (Flag Registry). A flag may be omitted; no flag = default (full) behavior. An unknown flag fails the run. This slot may be empty. `--test` is inherited from `_generator_base` — do not redeclare it.*

| Flag | Effect |
|---|---|
| `--<flag>` | <what it changes — a scoped subset of the run, a mode, or a concern it raises> |

---

## Requirements

*Declared generically; solved in the deployed copy. See `_generator_base` for pre-flight resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `<requirement-name>` | Tooling \| Input | <what it is, generically — no concrete path or value> |

---

## Care

**Defends:**
- <invariant the procedure enforces>

**Will not touch:**
- <out-of-scope files or paths>

**Flags to output (does not block execution):**
- <ambiguous case> — note inline; do not silently skip or invent

---

## Do

*Pre-flight requirement resolution runs first, per `_generator_base`. Phases below assume all requirements are solved and reachable.*

### Phase 1 — <Source Load>

<What to read, by requirement name. What signal to extract from each.>

### Phase 2 — <Generation>

<What to produce. Structure and content rules for the artifact.>

### Phase 3 — Lens Wiring *(reference-producing generators only)*

For each lens in the `reference-lenses` requirement, ensure its Know table has a `What | Where | Why` row pointing to the reference — add if missing, correct if stale. Skipped under `--test`.

### Phase N — Output Declaration

Write `<Output path>` — flush-and-fill.

<Output format — be specific.>

This procedure produces no other output.

---

## Deployed Copy

*The deployed copy is **fat** — a self-contained, runnable inlined copy of the canonical. Create it at `procedures/generators/<name>.md` (same relative path as the canonical). It carries the canonical's `Role`/`Base` frontmatter plus a `kcd:` pointer back, inlines the Parameters / Flags / Care / Do blocks (substituting requirement variables for concrete values), and solves every declared requirement. Opening it requires no cross-file assembly — "the thing is the thing."*

````markdown
---
Status: Active
Role: Generator
Base: _generator_base
kcd:
  canonical: kcd/procedures/generators/<name>.md
---

# <name> — Procedure (deployed)

*Fully inlined deployed copy for <project>. Traces to the canonical [<name> (canonical)](/_Claude/kcd/procedures/generators/<name>.md) for provenance; requirements below are solved with project-specific values. This file is self-contained and runnable on its own.*

Base rules: [_generator_base](/_Claude/kcd/procedures/generators/_generator_base.md).

---

## Parameters

<inlined from canonical>

## Flags

<inlined from canonical, with concrete flags substituted for placeholders>

## Requirements — solved

| Name | Kind | Description | Solution |
|---|---|---|---|
| `<requirement-name>` | Tooling \| Input | <description from canonical> | `<concrete project path or value>` |

## Care

<inlined from canonical>

## Do

<inlined from canonical, with requirement variables substituted>

## Project Notes

- <project-specific quirk, if any>
````
