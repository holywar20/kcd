---
type: habit
status: active
---

# Habit — append-completed-entry

**When:** at session close, for each lens this session advanced.

**Action:** prepend one entry to the lens's completed log at its `completed_path`
(`_Claude/logs/{lensname}/completed/`). Capture what was done, why, and what it unlocks.

**Format:** `- [YYYY-MM-DD] {what, why, what it unlocks}`

Thin (avoid): `- [2026-05-09] Updated frontend lens.`
Rich (target): `- [2026-05-09] Frontend: encoded accordion rebuild
the old expansion panels, unblocks the detail left-panel work.`
