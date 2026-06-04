---
type: habit
status: disabled
---

# Habit — run-report

*Invoked at the end of every automated generator or analyst run. Writes a per-phase
self-assessment chart so unusual runs can be spotted at a glance, and so the agent gets a forced
reflection pass on its own work before exit.*

---

## When

After the procedure's final phase (i.e. after Output Declaration if it has one). Runs
unconditionally — every generator and analyst declared by an `_*_base` emits a run report.

## Output

File: `_Claude/audits/{name}-run.md` — one file per procedure, flush-and-fill. `{name}` is the
procedure's canonical name. Create `_Claude/audits/` if it does not exist.

## Format

```markdown
# {name} — Run Report

**Run:** YYYY-MM-DD HH:MM:SS

| # | Action | Confidence |
|---|---|---|
| 1 | {Phase 1 name} | N |
| 2 | {Phase 2 name} | N |
| ... | ... | ... |

## Notes

{optional free text}
```

## Rules

- **One row per phase.** Use the exact phase name from the canonical's Do section.
- **Skipped or unrun phases get confidence `0`.** Row count stays positionally stable across
  runs so a downstream parser can rely on row N referring to the same phase every time.
- **Confidence scale anchors** (numbers between anchors are fine):
  - `10` — clean, no ambiguity
  - `8` — solid; minor uncertainty or trivial edge cases
  - `5` — completed but with reservations the human should know about
  - `3` — partial output; significant doubt about correctness
  - `1` — could not complete the work; output is unreliable
  - `0` — phase did not run (skipped, pre-empted, or not reached)
- **Notes section is optional and unconstrained.** Use it for anything the agent wants the human
  to know — unusual conditions, things it worked around, ambiguity it resolved one way and not
  another. Silence is acceptable.
- **No outcome status line.** The chart is the structured surface; the parser derives run state
  from it.

## Calibration note

Self-assessment by the agent is noisy in absolute terms. Use this habit as an **outlier
detector** and a **reflection prompt**, not as a calibrated quality metric. The differential
across phases and the contents of the Notes section carry more signal than absolute confidence
numbers.
