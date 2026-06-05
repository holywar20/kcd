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
reasoning, or keep it inside an analyzer. This is the forcing function the two-agent model runs
on — see [kcd_framework](_Claude/kcd/kcd_framework.md).

**Obsidian rendering:** Blank line before every table. Markdown must render correctly in Obsidian.

**Paths are links.** Every real path mentioned in body text is a markdown link of the form
`[label](_Claude/...)`. The link target carries the path (active for humans and AI); the
display label is human-readable.

**Link target form:**
- Vault-root-relative — starts with the top-level folder name (typically `_Claude/...`).
- No leading slash, no `../` chains, no OS-absolute paths.
- One form resolves for every reader: Obsidian vault root, Claude Code working directory, an
  agent reading from the project root.

**Display label form:**
- For a file: the artifact's short name (the filename without `.md`).
- For a directory: a meaningful phrase, often the trailing segment — `[AI/]`, `[lens_crafter work area]`.
- **Leading underscores are preserved** when the source filename carries one — `[_lens_base]`,
  `[_lens_template]`. The `_` prefix is the framework's signal for non-functional / infrastructure
  entities, and the display label keeps it.

**Backticks-around-paths are reserved for these three cases only:**

1. **Pattern paths** with `{placeholder}` segments — `_Claude/lenses/{name}/` — these don't name a real navigation target.
2. **Fenced code blocks and frontmatter examples** — code is code.
3. **Quoted speech / flag templates** — when the path is part of the literal language a
   downstream agent says or detects, not a navigation reference. Example: a flag template
   *"extract to `_Claude/references/`"* — the lens teaches the agent what to say, it doesn't
   point the reader at references.

**The test:** "Would a reader of *this document* want to click this to navigate there?" → link.
Pattern, code, or quoted speech? → backticks OK.

Full rationale: [kcd_framework](_Claude/kcd/kcd_framework.md).

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
| plan-routing | [plan-routing](_Claude/kcd/habits/plan-routing.md) | route new plans to `work/`, never canonical `plans/` |

### Contracts
*Universal behavioral agreements active in every session.*

| What | Where | Why |
|---|---|---|
| Plan | [plan](_Claude/kcd/contracts/plan.md) | whenever a plan is created, promoted, or retired |

### Working Space
*Base has no working space of its own — per-lens working space is declared in each lens
(`_Claude/work/{lensname}/`).*
