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
| What | Path | Use When ... |
|---|---|---|
| <label> | `_Claude/<root-relative-path>` | |

### Domains
*Topic-area folders. Read-only. Trawlable for inference.*
| What | Path | Use When ... |
|---|---|---|
| <label> | `_Claude/references/<category>/` | |

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

## Do
*Execution layer. How this lens operates and where its work goes.*

### Habits
*Atomic single-step operations.*
| What | Path | Use When ... |
|---|---|---|
| append-session-log | `_Claude/kcd/habits/append-session-log.md` | End of every session |
| add-todo | `_Claude/kcd/habits/add-todo.md` | When a deferred item surfaces |
| append-completed-entry | `_Claude/kcd/habits/append-completed-entry.md` | When a task is completed |

### Procedures
*Multi-step labor pipelines for this lens's domain.*
| What | Path | Use When ... |
|---|---|---|
| <procedure-name> | `_Claude/kcd/procedures/<procedure-name>.md` | |

### Working Space
*Output goes here. Inherited from work-routing habit in _base.*

`_Claude/work/<lens_name>/work-ai/` — AI-generated output
`_Claude/work/<lens_name>/work-human/` — Bryan's working documents
`_Claude/work/<lens_name>/plans/` — Plans and task tracking

---

## TODO

- [ ] [YYYY-MM-DD] <open item>

## Completed

→ See [../logs/<lens_name>/completed.md](../logs/<lens_name>/completed.md)
