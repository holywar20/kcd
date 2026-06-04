---
type: habit
status: disabled
---

# Habit — append-session-log

**When:** at session close, if work produced concrete changes to `_Claude/`.

**Action:** prepend one line to `_Claude/logs/session.md`. One entry per meaningful checkpoint —
do not log micro-edits.

**Format:** `YYYY-MM-DD : !{lens} : 1–2 sentence description of the action.`

- Newest at the top (prepended).
- `!{lens}` is the active lens command. For cross-cutting work use `!lens_crafter` or a
  descriptive label.
- **Append-only history.** The session log accumulates; current-state-only rule — it *is* the history.
