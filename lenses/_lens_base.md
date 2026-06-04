---
type: lens
status: disabled
---

# Base — Lens

*The auto-loaded floor. Loaded into every session; carries the project-wide stance and the
universal habits. Every other lens inherits this and extends it — none replaces it. Ships
`disabled` here in `kcd/lenses/`; the deploy contract activates the deployed copy.*

---

## Know
*Read-only inputs. What this lens loads from the knowledge store.*

### References
*Specific named files. Load explicitly by path.*

| What | Where | Why |
|---|---|---|
| Framework concepts | [kcd_framework](_Claude/kcd/kcd_framework.md) | orientation — the primitives, structure, and composition rules that govern all KCD sessions |
| Session log | [logs](_Claude/logs/) | where this project's sessions are recorded — so every lens inherits where session history lives |

### Domains
*No domains at base level — individual lenses declare their own.*

---

## Care
*Project-wide stance. Applies to every session regardless of which lens is loaded.*

### Purpose

Base establishes the default operating posture for all sessions in this project. It is not a
personality — it is the floor that all personalities stand on. Every lens inherits these
defaults; none may override the hard rules here.

### Philosophy & Prerogatives

**kcd is canonical:** `_Claude/kcd/` is the source of truth for all framework artifacts.
Do not modify it without explicit instruction. *(Mechanically enforced by the
[write-approval](_Claude/kcd/habits/write-approval.md) habit.)*

**Delegation is by manifest, not brief.** When you hand work to a generator — or dispatch any
unsupervised sub-agent — deliver a **manifest it can execute without further judgment**, every
consequence resolved in advance, not a loose brief. A generator executes a spec; it does not
improvise. If the work cannot yet be specified that tightly, it is not ready to delegate: keep
reasoning, or keep it inside an analyst. This is the forcing function the two-agent model runs
on — see [kcd_framework](_Claude/kcd/kcd_framework.md).

**Obsidian conventions:** All markdown must render correctly in Obsidian — blank line before
every table, markdown links not backtick spans, no leading underscores in link display text.

**Link paths:** Cross-document links are vault-root-relative — written from the project root
with **no leading slash** (e.g. `_Claude/lenses/backend.md`), never `../` chains, never a
leading `/`, never OS-absolute. One form resolves for every reader at once (Obsidian vault
root, Claude Code working directory, a naive agent at the project root). Full rationale:
[kcd_framework](_Claude/kcd/kcd_framework.md).

---

## Do
*Universal execution layer. Inherited by all lenses.*

### Habits
*Atomic single-step operations active in every session.*

| What | Where | Why |
|---|---|---|
| write-approval | [write-approval](_Claude/kcd/habits/write-approval.md) | before any write operation |
| work-routing | [work-routing](_Claude/kcd/habits/work-routing.md) | all output goes to work/{lensname}/ |
| append-session-log | [append-session-log](_Claude/kcd/habits/append-session-log.md) | record the session before it compacts or ends |

### Contracts
*Universal behavioral agreements active in every session.*

| What | Where | Why |
|---|---|---|
| Plan | [plan](_Claude/kcd/contracts/plan.md) | whenever a plan is created, promoted, or retired |

### Working Space
*Base has no working space of its own — per-lens working space is declared in each lens
(`_Claude/work/{lensname}/`).*
