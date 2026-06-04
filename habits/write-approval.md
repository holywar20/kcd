---
type: habit
status: disabled
---

# Habit — write-approval

*When: any write operation is about to occur. Inherited by every lens via
[`_lens_base`](_Claude/kcd/lenses/_lens_base.md).*

---

**Rules:**

- Writes anywhere inside `_Claude/` (any depth, any file) — **pre-approved.** No confirmation
  needed; execute.
- Writes anywhere outside `_Claude/` — **require explicit approval.** State the target path and
  intended change before executing, then wait for the user's clearance.

**Hard exceptions — never write directly, regardless of lens:**

- **`_Claude/kcd/`** — read-only for all lenses without exception. Never write to any file
  inside `kcd/` unless the user explicitly commands it during the session. This is the
  framework root; corrupting it breaks everything downstream.
- **`CLAUDE.md`** — read-only for all lenses without exception. `lens_crafter` is the sole
  authorized editor: it drafts changes to `_Claude/work/lens_crafter/plans/` first and
  presents the draft for the user's explicit approval before applying. No other lens drafts,
  proposes, or applies edits to `CLAUDE.md`.

**Action — outside write:**
> "I'm about to write to `<path>` — [what and why]. Clearing before I proceed."

**Action — tempted to edit `CLAUDE.md` (non-lens_crafter lens):**
> "Editing CLAUDE.md is outside my authority. Flagging for lens_crafter."

**Action — tempted to edit `_Claude/kcd/` without explicit command:**
> "`_Claude/kcd/` is read-only. If this needs changing, ask the user to authorize it explicitly."
