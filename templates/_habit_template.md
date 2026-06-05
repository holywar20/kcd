---
type: template
status:
---

# Habit (template)

A **habit** is a tiny, composable unit of behavior — a fragment of *how* an agent acts, not a
task it performs. It fires on a trigger (a **When**) and does one small thing (an **Action**), or
it states a **don't** (a negative constraint). Habits are inherited by lenses through their Do
block, normally via `_lens_base`.

> **Frontmatter for the authored habit** (replaces this template's frontmatter):
> - `type: habit`
> - `status: disabled` — habits ship disabled in canonical `kcd/`; the deploy flips the copy to `active`

*Keep it atomic. If it needs phases, a human gate, or judgment, it is not a habit — it is a
contract, a pipeline, or an analyzer.*

---

## Shape

File goes in `_Claude/kcd/habits/{verb-noun}.md` (kebab-case, named for what it does).

```markdown
---
type: habit
status: disabled
---

# Habit — {name}

**When:** the trigger — the precise moment or condition that fires this habit.

**Action:** the single step to take — concrete, mechanical, no deliberation. Name exact paths
(vault-root-relative) and formats where they matter.

*Optional one-line note — a clarifying constraint or a pointer to where the affected artifact
lives.*
```

A **don't**-style habit replaces **Action** with **Rules:** (the constraints) and an
**Action — {situation}:** line giving the exact phrasing to use when the constraint bites. See
[`write-approval`](_Claude/kcd/habits/write-approval.md) for that form.

---

## Rules

- **One trigger, one behavior.** A habit that does two things is two habits.
- **No judgment.** A habit is a reflex; if it requires weighing options, it belongs elsewhere.
- **Explicit paths.** Reference stores by vault-root-relative path, never implied.
- **Register it.** Add the habit to [`habits/index.md`](_Claude/kcd/habits/index.md) and wire it
  into the lens (or `_lens_base`) Do block that should inherit it — an unwired habit never runs.

---

## Example (filled)

```markdown
---
type: habit
status: disabled
---

# Habit — add-todo

**When:** a session surfaces an open design decision, a deferred item, or a pending dependency
worth tracking.

**Action:** append a dated entry `- [ ] [YYYY-MM-DD] {item}` to the active lens's todo list at
its `todo_path` (`_Claude/logs/{lensname}/todo/`).

*Todos live at the lens's `todo_path`, not in the lens body — agents know where they are but do
not read them unless asked.*
```
