---
Status: Disabled
Role: base
Depends on: Nothing
---

# Base — Lens

*Loaded automatically into every session. Carries the project-wide stance and universal habits. All other lenses inherit from this and extend it — they do not replace it.*

---

## Know
*Read-only inputs. What this lens loads from the knowledge store.*

### References
*Specific named files. Load explicitly by path.*

| What | Where | Why |
|---|---|---|
| Framework concepts | [kcd_framework](../kcd/kcd_framework.md) | orientation — the primitives and composition rules that govern all KCD sessions |

### Domains
*No domains at base level — individual lenses declare their own domains.*

---

## Care
*Project-wide stance. Applies to every session regardless of which lens is loaded.*

### Purpose

Base establishes the default operating posture for all sessions in this project. It is not a personality — it is the floor that all personalities stand on. Every lens inherits these defaults; none may override the hard rules here.

### Philosophy & Prerogatives

**Write posture:** All writes inside `_Claude/` are pre-approved. Writes outside `_Claude/` require explicit user approval before executing — state the target path and intent, then wait. `_Claude/kcd/` is read-only without explicit command.

**Work routing:** All session output goes to `_Claude/work/{lens_name}/`. Never write directly to `references/` or `lenses/` — those are read-only during sessions. Promotion to permanent locations is always the user's decision.

**kcd is canonical:** The `_Claude/kcd/` directory is the source of truth for all framework artifacts. Do not modify it without explicit instruction.

**Surface data, trust judgment:** When designing habits, contracts, or procedures, prefer surfacing the raw artifact (a log, a state file, a directory listing) over scripting the workflow that consumes it. Agents have judgment — given good data, they handle edge cases without explicit step-by-step instruction. A habit that names "this log records X" and trusts the next agent to read it is more durable than one that lists "tail the log, then for each entry do Y."

**Obsidian conventions:** All markdown must render correctly in Obsidian — blank line before every table, markdown links not backtick spans, no leading underscores in link display text.

**Link paths:** Cross-document links use vault-root-relative paths — written from the
project root with **no leading slash** (e.g. `_Claude/lenses/backend.md`, never
`/_Claude/lenses/backend.md`). Prefer this over `../` chains: it is readable and stable
regardless of how deeply the source file is nested. This single form satisfies every reader
at once — the project root, the Obsidian vault root, and the agent's working directory are all
the same path:
- **Obsidian** resolves it from the vault root. Requires *Settings → Files & Links → New link
  format → Absolute path in vault*; vault-root resolution then takes precedence over
  document-relative.
- **Claude Code** renders it as a clickable link relative to the working directory.
- **A naive agent** resolves it correctly, since cwd is the project root.

A leading `/` is **not** valid: Obsidian has no vault-root slash syntax and treats such links
as broken. Never use OS-absolute paths.

---

## Do
*Universal execution layer. Inherited by all lenses.*

### Habits
*Atomic single-step operations active in every session.*

| What | Where | Why |
|---|---|---|
| write-approval | [write-approval](../kcd/habits/write-approval.md) | Before any write operation |
| work-routing | [work-routing](../kcd/habits/work-routing.md) | All output goes to work/{lens_name}/ |

### Contracts
*Universal behavioral agreements active in every session.*

| What | Where | Why |
|---|---|---|
| Plan | [plan](../kcd/contracts/plan.md) | whenever a plan is created, promoted, or retired |

### Working Space
*Per-lens working space is declared in each lens. Base does not have its own.*
