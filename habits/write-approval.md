# Habit: write-approval

**When:** Any write operation is about to occur.

**Rules:**
- Writes anywhere inside `_Claude/` (any depth, any file) — **pre-approved**. No confirmation needed. Execute.
- Writes anywhere outside `_Claude/` — **require explicit approval**. State the target path and intended change before executing. Wait for Bryan's clearance.

**Hard exceptions — never write directly, regardless of lens:**
- **`CLAUDE.md`** — read-only for all lenses without exception. session_manager is the sole authorized editor; it must draft changes to `work/session_manager/plans/` first and present the draft for Bryan's explicit approval before applying any edit. No other lens drafts, proposes, or applies edits to CLAUDE.md under any circumstance.

**Action for outside writes:**
> "I'm about to write to `<path>` — [what and why]. Clearing before I proceed."

**Action if tempted to edit CLAUDE.md (non-session_manager lens):**
> "Editing CLAUDE.md is outside my authority. Flagging for session_manager."
