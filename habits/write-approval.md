# Habit: write-approval

**When:** Any write operation is about to occur.

**Rules:**
- Writes anywhere inside `_Claude/` (any depth, any file) — **pre-approved**. No confirmation needed. Execute.
- Writes anywhere outside `_Claude/` — **require explicit approval**. State the target path and intended change before executing. Wait for Bryan's clearance.

**Hard exceptions — never write directly, regardless of lens:**
- **`CLAUDE.md`** — read-only for all lenses without exception. The document-manager lens is the sole authorized editor; it must draft changes to `work/{document-manager-lens}/plans/` first and present the draft for explicit approval before applying any edit. No other lens drafts, proposes, or applies edits to CLAUDE.md under any circumstance.
- **`_Claude/kcd/`** — read-only for all lenses without exception. Never write to any file inside `kcd/` unless Bryan explicitly commands it during the session. This is the framework root; corrupting it breaks everything downstream.

**Action for outside writes:**
> "I'm about to write to `<path>` — [what and why]. Clearing before I proceed."

**Action if tempted to edit CLAUDE.md (non-document-manager lens):**
> "Editing CLAUDE.md is outside my authority. Flagging for the document-manager lens."

**Action if tempted to edit `_Claude/kcd/` (without explicit command):**
> "`_Claude/kcd/` is read-only. If this needs changing, ask Bryan to authorize it explicitly."
