---
type: habit
status: disabled
---

# Habit — plan-routing

**When:** a new plan needs to be created, or a plan (in any location) is referenced or invoked
in a session.

---

**All new plans go to `_Claude/work/{lens}/plans/` — never directly to `_Claude/plans/`.**

Plans in `work/` are thinking tools. They are drafts. **A plan in `work/` must not be used as
authorization to make changes to the system.** If the user references a `work/` plan as the
basis for doing work, pause and surface this: the plan needs to be promoted first. Only a plan
in `_Claude/plans/` authorizes action.

When any plan is invoked, check its location. If it is in `work/`, treat it as a design artifact
to review and align on — not a task list to execute.

**Filename in `work/`:** `YYYY-MM-DD_{description}.md` — dated, kebab-case description.

**Filename in `_Claude/plans/`:** `{lens}_{description}.md` — no date, same description. The date
is stripped at promotion time.

**Promotion is always explicit.** A plan moves from `work/` to `_Claude/plans/` only when the
user directs it and it meets the quality bar (per the plan contract). No plan self-promotes.
