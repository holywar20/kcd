# Habit: append-session-log

**When:** at session close, if work produced concrete changes to `_Claude/`.
**Action:** prepend one line to `_Claude/logs/sessions/MM_session_log.md` for the current month. One entry per meaningful checkpoint — don't log micro-edits.

**Format:** `YYYY-MM-DD : !{lens_name} : 1-2 sentence description of the action.`

- Newest at the top (prepended). `MM_session_log.md` = `05_session_log.md` for May, etc.
- `!lens` is the active lens command. For cross-cutting work use `!lens_crafter`, `!infra`, or a descriptive label.
- Past entries are never edited or deleted.
