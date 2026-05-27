---
Status: Active
Role: Analyst
Base: _analyst_base
---

# merge-todos — Procedure (canonical)

*Canonical definition. Generic across any project that organizes work under lens files carrying `## TODO` blocks. The deployed copy at `procedures/analysts/merge-todos.md` solves the requirements below with project-specific values.*

Base rules: [_analyst_base](_analyst_base.md) — composition model, requirement resolution, fail behavior, output conventions.

---

## Parameters

Name  : merge-todos
Task  : #merge-todos
Model : claude-haiku-4-5-20251001
Type  : Analyst

---

## Requirements

*Declared generically here; solved in the deployed copy. See `_analyst_base` for pre-flight resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `lenses-source` | Input | Directory containing lens files to scan for TODO blocks. |
| `lenses-skip` | Input | Lens names (without `.md`) to exclude from the scan — typically a global base lens. |

---

## Know

| What | Path | Load When |
|---|---|---|
| Lenses index | `{lenses-source}/index.md` | Phase 1 — to enumerate active lens files |
| Each lens file | `{lenses-source}/{name}.md` | Phase 1 — one at a time to extract TODO blocks |

---

## Care

**Defends:**
- TODO item text is reproduced verbatim — no rewording or interpretation
- One report per run; prior report is destroyed and recreated (flush-and-fill)
- Only unchecked items (`- [ ]`) are aggregated — completed (`- [x]`) items are excluded

**Will not touch:**
- Any content in lens files other than the `## TODO` block
- The `## Completed` block or completed log files

**Flags to output (does not block execution):**
- A lens file with no `## TODO` block — include as a zero-TODO entry in the report, note the absence
- TODO items with no date prefix (`[YYYY-MM-DD]`) — include but mark as `undated`

---

## Do

*Pre-flight runs first, per `_analyst_base` — deployment check, then requirement resolution. Phases below assume the procedure is deployed and all requirements are solved.*

### Phase 1 — TODO Extraction

Load `{lenses-source}/index.md` to enumerate active lens files. For each lens (excluding names in `lenses-skip`):
- Read the lens file
- Locate the `## TODO` block
- Extract all unchecked checkbox items: `- [ ] [YYYY-MM-DD] <text>`
- Record: date (parsed from `[YYYY-MM-DD]` prefix, or `undated` if absent), text, source lens name

Output: a flat collection of `{date, text, lens}` records.

### Phase 2 — Statistics

Compute from the collected records:
- Total unchecked TODOs across all lenses
- Count per lens
- Age of oldest TODO in days (from today's date)
- Average age in days
- Most active lens (highest count)

### Phase 3 — Report (flush and fill)

Destroy and recreate `_Claude/automation/reports/merge-todos.md` with this structure:

```markdown
# TODOs Report — {YYYY-MM-DD}

## Summary

- **Total Active TODOs**: N across all lenses
- **Age of oldest TODO**: X days

## Active TODOs by Lens

### {LensName} (N TODOs)

- YYYY-MM-DD :: [item text]

## Statistics

| Metric | Value |
|---|---|
| Total active TODOs | N |
| Lenses with active work | N |
| Most active lens | {lens} (N TODOs) |
| Average TODO age | X days |
| Oldest active TODO | YYYY-MM-DD |
```

### Phase 4 — Output Declaration

This procedure produces:
- `_Claude/automation/reports/merge-todos.md`

Modifies: nothing — source lens files are read-only; report is flush-and-fill.
Does not produce console output, logs, or side effects outside the report path.
