---
type: generator
status: disabled
model: claude-haiku-4-5
base: _generator_base
---

# merge-todos — Generator (canonical)

*Generic across any project that tracks per-lens todos. Mechanical aggregation — extracts and
counts verbatim, no interpretation — so this is the textbook haiku case. The deployed copy
solves the requirements below with project-specific values.*

Base rules: [_generator_base](_Claude/kcd/generators/_generator_base.md) — composition model,
requirement resolution, fail behavior, output conventions, modifiers.

---

## Parameters

Output: `_Claude/audits/merge-todos.md` — the aggregated todo digest, flush-and-fill.

*`name` / `#{name}` derive from the filename; `model` / `base` live in frontmatter.*

---

## Requirements

*Declared generically here; solved in the deployed copy. See `_generator_base` for pre-flight
resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `lenses-index` | Input | The lens roster (`lenses/index.md`) — used to enumerate active lenses. |
| `todo-root` | Input | Directory holding per-lens todo stores (each lens's `todo_path`, e.g. `_Claude/logs/{lensname}/todo/`). |
| `lenses-skip` | Input | Lens names to exclude from the scan (typically `_lens_base`). |

---

## Care

**Defends:**
- Todo item text is reproduced verbatim — no rewording or interpretation.
- Flush-and-fill — the prior digest is destroyed and recreated each run.
- Only unchecked items (`- [ ]`) are aggregated — completed (`- [x]`) items are excluded.

**Will not touch:**
- Lens files or todo stores — read-only.
- Completed logs.

**Surfaces (notes inline, does not block):**
- A lens with no todos — include as a zero-todo entry, note the absence.
- Todo items with no date prefix (`[YYYY-MM-DD]`) — include but mark `undated`.

---

## Do

*Pre-flight runs first, per `_generator_base` — deployment check, then requirement resolution.*

### Phase 1 — Todo Extraction

Enumerate active lenses from `lenses-index` (excluding names in `lenses-skip`). For each lens,
read its todo store under `todo-root` (`_Claude/logs/{lensname}/todo/`). Extract every unchecked
item `- [ ] [YYYY-MM-DD] {text}`. Record `{date (parsed from the prefix, or undated), text, lens}`.

### Phase 2 — Statistics

Compute from the collected records:
- Total unchecked todos across all lenses
- Count per lens
- Age of the oldest todo in days (from today)
- Average age in days
- Most active lens (highest count)

### Phase 3 — Write Digest (flush-and-fill)

Destroy and recreate `_Claude/audits/merge-todos.md`:

```markdown
# Todos Digest — {YYYY-MM-DD}

## Summary

- **Total active todos**: N across all lenses
- **Age of oldest todo**: X days

## Active todos by lens

### {LensName} (N todos)

- YYYY-MM-DD :: [item text]

## Statistics

| Metric | Value |
|---|---|
| Total active todos | N |
| Lenses with active work | N |
| Most active lens | {lens} (N todos) |
| Average todo age | X days |
| Oldest active todo | YYYY-MM-DD |
```

### Phase 4 — Output Declaration

Writes `_Claude/audits/merge-todos.md` (flush-and-fill). Modifies nothing — todo stores are
read-only. No console output, logs, or side effects outside the digest path.
