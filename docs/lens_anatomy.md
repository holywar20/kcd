# Lens Anatomy

Generic framework meta-knowledge. A lens file has three categories of content, and only three: **Know**, **Care**, **Do**. Anything that doesn't fit one of those three is not part of the lens's anatomy.

**Structural invariant:** a lens is exactly one flat file at `_Claude/lenses/{name}.md`. No containing folder, no collocated subfolders. References live in the categorized `references/` store; working output goes to `work/{name}/`; the completed log lives at `logs/{name}/completed.md`. A lens that needs a folder is a lens carrying something that isn't K/C/D — extract it.

---

## Know
*Read-only inputs. What this lens loads from the knowledge store.*

Two layers. Both are input-only — never write to these locations from inside a session.

| Layer | Purpose |
|---|---|
| **References** | Specific named files the lens loads explicitly. Precise and intentional — you know exactly what you're getting. |
| **Domains** | Topic-area folders the lens can trawl for inference. Read-only. Promoted or demoted by explicit command only — never written to during normal session work. |

---

## Care
*Personality. Who this lens is and what it defends.*

**Verbose form** (new lenses, lenses where the Care is still being discovered):

| Layer | Purpose |
|---|---|
| **Purpose** | What this lens activates — the kind of thinking it summons. |
| **Core Mental Model** | How this collaborator frames problems in its domain. |
| **Philosophy & Prerogatives** | What it defends. Push-back style. What it flags. What it does not do. |

**Compact form — Surface/Suppress** (mature lenses, stable well-understood domains):

Two flat lists. Use when the Care is settled enough that prose would just be padding.

```
**Suppress** — looks wrong but is intentional:
- {item}: {why it is intentional}

**Surface** — flag when touched:
- {item}: {why it warrants attention}
```

Surface/Suppress is not a degraded form — it is the correct form once a domain is understood. Verbose form is for exploration; compact form is for execution. A lens may carry both: verbose Purpose/Core Mental Model for orientation, compact Surface/Suppress for flagging behavior.

---

## Do
*Execution layer. How this lens operates and where its work goes.*

Three layers.

| Layer | Purpose |
|---|---|
| **Habits** | Atomic single-step operations. Referenced from `_Claude/kcd/habits/`. |
| **Procedures** | Multi-step labor pipelines for this lens's domain. Referenced from `_Claude/kcd/procedures/`. |
| **Working Space** | Where this lens drops output. Inherited from `work-routing` habit in `_base`. All work goes to `_Claude/work/{lens_name}/`. Never promoted without Bryan's explicit direction. |

The `work-routing` habit is inherited from `_base` and applies to every lens automatically. Individual lenses do not need to redeclare it unless they need a domain-specific override.

---

## Core principle

A lens is a personality brief, not a reference document. The reader should be able to load it and feel oriented in seconds. If a Care section grows past the point where it can be read at a glance, extract its facts into a domain document and reference them from the Know block instead. If procedural guidance accumulates in Care, factor it into a habit and inherit it from Do.

**Optimize for: tightness, clarity, usefulness.**
Prune first, then add.

**File routing is load-bearing.** Misplaced files break references across sessions. Know is read-only. Work output goes to `work/{lens_name}/`. Promotion to permanent locations is always manual. When in doubt, drop it in `work-ai/` and flag it.

---

## Import block conventions

All Know references are listed in 3-column markdown tables: `What | Path | Use When ...`.

- **References table** — "Use When..." means: load this file when this condition applies.
- **Domains table** — "Use When..." means: trawl or reference this folder when this scope is relevant.

Paths are **relative to the lens file** at `_Claude/lenses/{name}.md` — use `../` to reach sibling directories. Path column must use markdown link format `[text](../relative/path)`, not backtick spans. Backtick spans are invisible to the Obsidian graph.

```
## Know
*Read-only inputs. What this lens loads from the knowledge store.*

### References
*Specific named files. Load explicitly by path.*
| What | Path | Use When ... |
|---|---|---|
| Framework concepts | [kcd_framework](../kcd/kcd_framework.md) | When designing or reviewing the system |
| Lens anatomy | [lens_anatomy](../kcd/docs/lens_anatomy.md) | When building or auditing a lens |

### Domains
*Topic-area folders. Read-only. Trawlable for inference.*
| What | Path | Use When ... |
|---|---|---|
| Thinkers | [thinkers/](../references/thinkers/) | When routing a philosophical or rhetorical question |

## Care
*Personality. Who this lens is and what it defends.*
(Purpose, Core Mental Model, Philosophy & Prerogatives — written inline)

## Do
*Execution layer. How this lens operates and where its work goes.*

### Habits
*Atomic single-step operations.*
| What | Path | Use When ... |
|---|---|---|
| add-todo | [add-todo](../kcd/habits/add-todo.md) | When a deferred item surfaces |

### Procedures
*Multi-step labor pipelines. Use routing-table format — Trigger column holds the #tag.*
| Trigger | Path | When |
|---|---|---|
| `#<procedure-name>` | [<procedure-name>](../kcd/procedures/<procedure-name>.md) | When this workflow applies |
```

Working space is inherited from `_base` via `work-routing`. Output goes to `_Claude/work/{lens_name}/`. No table needed in individual lenses unless overriding the default.

---

## Stacking

When multiple lenses are active simultaneously, treat them as a single conceptual personality. References merge into one Know graph. Care sections fold together. Habits combine. The reader doesn't experience N lenses — they experience one composite.

A **global lens** at `_Claude/lenses/_base.md` is stacked on every session without explicit invocation. It carries Care (project-wide stance) and the two standing Do habits (`write-approval`, `work-routing`). Specific lenses extend it; they do not replace it.

---

## Operational appendages (not part of K/C/D)

Every lens carries two operational artifacts that aren't classified as content:

- **TODO** — date-stamped open items, deferred at the foot of the lens.
- **Completed** — one-line link to `_Claude/logs/<lens_name>/completed.md`.

These exist for record-keeping. They're structural, not anatomical.
