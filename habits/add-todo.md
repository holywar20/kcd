---
type: habit
status: disabled
---

# Habit — add-todo

**When:** a session surfaces an open design decision, a deferred item, or a pending dependency
worth tracking.

**Action:** append a dated entry `- [ ] [YYYY-MM-DD] {item}` to the active lens's todo list at
its `todo_path` (`_Claude/logs/{lensname}/todo/`). Group under a sub-header if the lens already
organizes todos by topic.

*Todos live at the lens's `todo_path`, not in the lens body — agents know where they are but do
not read them unless asked.*
