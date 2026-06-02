---
Command: "!<lens_name>"
Status: <Skeleton DRAFT | Analysis DRAFT | Spec DRAFT | Spec | Implemented | Active>
Depends on: <list other lenses this one builds on, or "Nothing" for a standalone>
---

# <Lens Name> — Lens

## Know
*Read-only inputs. What this lens loads from the knowledge store.*

### References
*Specific named files. Load explicitly by path.*

| What | Where | Why |
|---|---|---|
| <label> | [<label>](../kcd/<path>) | <when to load> |

### Domains
*Topic-area folders. Read-only. Trawlable for inference.*

| What | Where | Why |
|---|---|---|
| <label> | [<label>](../references/<category>/) | <when to trawl> |

---

## Care
*Personality. Who this lens is and what it defends.*

### Purpose

<One short paragraph: what this lens activates, what kind of thinking it summons.>

### Core Mental Model

<How this collaborator frames problems in its domain. Vocabulary in use. Stance.>

### Philosophy & Prerogatives

**Design philosophy:** <one-sentence stance>

**Push-back style:** <how this lens delivers flags — tone, level of softening>

**Prerogatives — what this lens defends:**
- <invariant>

**Flags — direct language to use:**
- "<example phrasing>"

**What this lens does not do:**
- <out-of-scope item>

---

## Flags
*Optional. Flags modify how the lens behaves when invoked. Each flag is `--`-prefixed, globally unique across the entire document base, and registered in the master procedure index (Flag Registry). A lens flag is a declarative invocation mode (e.g. `!<lens_name> --debug`) that unlocks or alters behavior. Flags declared in `_base` apply to every lens. This slot may be empty.*

| Flag | Effect |
|---|---|
| `--<flag>` | <what it changes> |

---

## Do
*Execution layer. How this lens operates and where its work goes.*

### Habits
*Atomic single-step operations.*

| What | Where | Why |
|---|---|---|
| write-approval | [write-approval](../kcd/habits/write-approval.md) | Before any write operation |
| append-session-log | [append-session-log](../kcd/habits/append-session-log.md) | End of every session |
| add-todo | [add-todo](../kcd/habits/add-todo.md) | When a deferred item surfaces |
| append-completed-entry | [append-completed-entry](../kcd/habits/append-completed-entry.md) | When a task is completed |

### Procedures
*Multi-step labor pipelines for this lens's domain.*

| What | Where | Why |
|---|---|---|
| (none deployed) | — | — |

### Working Space
*Output goes here. Inherited from work-routing habit in _base.*

`_Claude/work/<lens_name>/work-ai/` — AI-generated output  
`_Claude/work/<lens_name>/work-human/` — user's working documents  
`_Claude/work/<lens_name>/plans/` — plans and task tracking  

---

## TODO

- [ ] [YYYY-MM-DD] <open item>

## Completed

→ See [../logs/<lens_name>/completed.md](../logs/<lens_name>/completed.md)
