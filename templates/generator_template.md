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

For each lens in the `reference-lenses` requirement, ensure its Know table has a `What | Path | Use When` row pointing to the reference — add if missing, correct if stale. Skipped under `--test`.

### Phase N — Output Declaration

Write `<Output path>` — flush-and-fill.

<Output format — be specific.>

This procedure produces no other output.

---

## Deployed Copy

*The deployed copy is thin. Create it at `procedures/generators/<name>.md` — same relative path as the canonical. It references this canonical and solves every declared requirement.*

````markdown
---
Status: Active
Canonical: kcd/procedures/generators/<name>.md
---

# <name> — Procedure (deployed)

*Deployed copy. All logic lives in the canonical: [<name> (canonical)](../../kcd/procedures/generators/<name>.md). This file solves the canonical's requirements for <project>.*

---

## Requirements — solved

| Name | Kind | Solution |
|---|---|---|
| `<requirement-name>` | Tooling \| Input | `<concrete project path or value>` |

---

## Notes

- <project-specific quirk, if any>
````
