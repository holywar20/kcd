# Lens Anatomy

Generic framework meta-knowledge. A lens file has three categories of content, and only three: **Know**, **Care**, **Do**. Anything that doesn't fit one of those three is not part of the lens's anatomy.

> **One table format, everywhere.** Every reference/import block in a lens — `Know.References`, `Know.Domains`, `Do.Habits`, `Do.Procedures`, `Do.Contracts`, and folder indexes — uses one header and only one: **`What | Where | Why`**. There are no per-section variants. This is the single most-violated convention in the tree; see [*Import block conventions*](#import-block-conventions) below for column semantics and the one permitted exception.

**Structural invariant:** a lens is exactly one flat markdown file. No containing folder, no collocated subfolders. References live in the categorized `references/` store; working output goes to `work/{name}/`; the completed log lives at `logs/{name}/completed.md`. A lens that needs a folder is a lens carrying something that isn't K/C/D — extract it.

**Lens locations.** Most lenses are **drafted in place** at `_Claude/lenses/{name}.md` — `Status: Active`, project-specific, never round-tripped through `kcd/`. A small set are **deployable**: they live at `_Claude/kcd/lenses/{name}.md` with `Status: Disabled`, must be project-agnostic (no hardcoded paths or domain vocabulary specific to one project), and are copied into `_Claude/lenses/` via the [deploy-lens](../contracts/deploy-lens.md) contract. The schema is identical in both locations — what differs is provenance and portability constraints. If a draft in `kcd/lenses/` carries project-specific content, it does not belong there; move it to `_Claude/lenses/`.

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

**Mandatory, no exceptions.** Every reference/import block — any table whose rows point at an artifact (a file, folder, habit, procedure, contract, or index) — uses one header: **`What | Where | Why`**. This holds across `Know.References`, `Know.Domains`, `Do.Habits`, `Do.Procedures`, `Do.Contracts`, and folder indexes alike. There are no per-section header variants.

Every other header is out of spec and must be normalized on sight: `Trigger | Path | When`, `Trigger | Where | When`, `What | Path | Use When`, `Contract | Covers`, and any other historical variant. (Content tables that do *not* point at artifacts — e.g. a `Layer | Purpose` table explaining the anatomy, or a migration-mapping table — are not import blocks and keep their own descriptive headers.)

A 4th column is permitted when an extra dimension is load-bearing for a specific table — e.g. `What | Where | Why | Lens` for cross-cutting audit tables. The first three columns and their semantics never change; only the trailing column is variable. Use sparingly — if the 4th column isn't carrying real signal, fold it into Why.

- **What** — a short label naming the artifact.
- **Where** — a markdown link to the file or folder. Path is **relative to the lens file** at `_Claude/lenses/{name}.md` — use `../` to reach sibling directories. Backtick spans are invisible to the Obsidian graph; the Where column must use markdown link format `[text](../relative/path)`.
- **Why** — when to load this reference / what role it plays. For procedure routing tables, the trigger tag goes in the Why column ("on `#<tag>`, …") so the table format stays uniform.

```
## Know
*Read-only inputs. What this lens loads from the knowledge store.*

### References
*Specific named files. Load explicitly by path.*

| What | Where | Why |
|---|---|---|
| Framework concepts | [kcd_framework](../kcd/kcd_framework.md) | When designing or reviewing the system |
| Lens anatomy | [lens_anatomy](../kcd/docs/lens_anatomy.md) | When building or auditing a lens |

### Domains
*Topic-area folders. Read-only. Trawlable for inference.*

| What | Where | Why |
|---|---|---|
| Thinkers | [thinkers/](../references/thinkers/) | When routing a philosophical or rhetorical question |

## Care
*Personality. Who this lens is and what it defends.*
(Purpose, Core Mental Model, Philosophy & Prerogatives — written inline)

## Do
*Execution layer. How this lens operates and where its work goes.*

### Habits
*Atomic single-step operations.*

| What | Where | Why |
|---|---|---|
| add-todo | [add-todo](../kcd/habits/add-todo.md) | When a deferred item surfaces |

### Procedures
*Multi-step labor pipelines. The trigger tag goes in the Why column so the table format stays uniform.*

| What | Where | Why |
|---|---|---|
| <procedure-name> | [<procedure-name>](../kcd/procedures/<procedure-name>.md) | On `#<procedure-name>`, when this workflow applies |
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
