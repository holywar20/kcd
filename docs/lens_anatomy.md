---
type: doc
status: active
---

# Lens Anatomy

Generic framework meta-knowledge. A lens file has three categories of content, and only three:
**Know**, **Care**, **Do**. Anything that doesn't fit one of those three is not part of the
lens's anatomy.

> **One table format, everywhere.** Every reference/import block in a lens —
> `Know.References`, `Know.Domains`, `Do.Habits`, `Do.Contracts`, and folder indexes — uses one
> header and only one: **`What | Where | Why`**. There are no per-section variants. See
> [*Import block conventions*](#import-block-conventions) below for column semantics and the one
> permitted exception.

**Structural invariant: a lens is a folder.** `_Claude/lenses/{name}/` contains `{name}.md` (the
K/C/D body — the trunk) and a `context/` subfolder for lens-specific Knows (material that travels
only with this lens). On-disk this is the trunk-and-branches model: the `.md` is the trunk,
`context/` holds the branches. Shared, cross-lens references live in the categorized
`references/` store; working output goes to `work/{name}/`; the completed log lives under
`logs/{name}/completed/`.

**Lens locations.** Most lenses are **drafted in place** at `_Claude/lenses/{name}/{name}.md` —
`status: active`, project-specific, never round-tripped through `kcd/`. A small set are
**deployable**: they live at `_Claude/kcd/lenses/{name}/{name}.md` with `status: disabled`, must
be project-agnostic (no hardcoded paths or domain vocabulary specific to one project), and are
copied into `_Claude/lenses/` via the [deploy-lens](_Claude/kcd/contracts/deploy-lens.md)
contract. The schema is identical in both locations — what differs is provenance and portability
constraints. If a draft in `kcd/lenses/` carries project-specific content, it does not belong
there; move it to `_Claude/lenses/`.

---

## Know
*Read-only inputs. What this lens loads from the knowledge store.*

Two layers. Both are input-only — never write to these locations from inside a session.

| Layer | Purpose |
|---|---|
| **References** | Specific named files the lens loads explicitly. Precise and intentional — you know exactly what you're getting. Lens-specific references live in the lens's own `context/`; shared ones in `references/`. |
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

Surface/Suppress is not a degraded form — it is the correct form once a domain is understood.
Verbose form is for exploration; compact form is for execution. A lens may carry both: verbose
Purpose/Core Mental Model for orientation, compact Surface/Suppress for flagging behavior.

---

## Do
*Execution layer. How this lens operates and where its work goes.*

Three layers.

| Layer | Purpose |
|---|---|
| **Habits** | Atomic single-step behaviors. Referenced from `_Claude/kcd/habits/`. `_lens_base` supplies the universal ones (write-approval, work-routing, append-session-log); a lens lists only what it adds. |
| **Contracts** | Behavioral agreements this lens follows. Referenced from `_Claude/kcd/contracts/`. |
| **Working Space** | Where this lens drops output. Inherited from the `work-routing` habit in `_lens_base`. All work goes to `_Claude/work/{name}/` (`AI/`, `human/`, `plans/`). Never promoted without the user's explicit direction. |

A lens does **not** carry a list of generators or analysts — those are invoked by their `#tag`
and registered centrally, not enumerated per lens. The `work-routing` habit is inherited from
`_lens_base` and applies automatically; lenses do not redeclare it unless they need a
domain-specific override.

---

## Core principle

A lens is a personality brief, not a reference document. The reader should be able to load it and
feel oriented in seconds. If a Care section grows past the point where it can be read at a
glance, extract its facts into a domain document (the lens's `context/` or the shared
`references/`) and reference them from the Know block instead. If procedural guidance accumulates
in Care, factor it into a habit and inherit it from Do.

**Optimize for: tightness, clarity, usefulness.**
Prune first, then add.

**File routing is load-bearing.** Misplaced files break references across sessions. Know is
read-only. Work output goes to `work/{name}/`. Promotion to permanent locations is always manual.
When in doubt, drop it in `work/{name}/AI/` and flag it.

---

## Import block conventions

**Mandatory, no exceptions.** Every reference/import block — any table whose rows point at an
artifact (a file, folder, habit, contract, or index) — uses one header: **`What | Where | Why`**.
This holds across `Know.References`, `Know.Domains`, `Do.Habits`, `Do.Contracts`, and folder
indexes alike. There are no per-section header variants.

Every other header is out of spec and must be normalized on sight: `Trigger | Path | When`,
`What | Path | Use When`, `Contract | Covers`, and any other historical variant. (Content tables
that do *not* point at artifacts — e.g. a `Layer | Purpose` table explaining the anatomy — are
not import blocks and keep their own descriptive headers.)

A 4th column is permitted when an extra dimension is load-bearing for a specific table — e.g.
`What | Where | Why | Command` for the lens roster, or `What | Where | Why | Lens` for
cross-cutting audit tables. The first three columns and their semantics never change; only the
trailing column is variable. Use sparingly — if the 4th column isn't carrying real signal, fold
it into Why.

- **What** — a short label naming the artifact.
- **Where** — a markdown link to the file or folder. Path is **vault-root-relative** — written
  from the project root with no leading slash (e.g. `_Claude/kcd/...`), not relative to the lens
  file. Backtick spans are invisible to the Obsidian graph; the Where column must use markdown
  link format `[text](_Claude/relative/path)`.
- **Why** — when to load this reference / what role it plays.

```
## Know
*Read-only inputs. What this lens loads from the knowledge store.*

### References
*Specific named files. Load explicitly by path.*

| What | Where | Why |
|---|---|---|
| Framework concepts | [kcd_framework](_Claude/kcd/kcd_framework.md) | When designing or reviewing the system |
| Lens anatomy | [lens_anatomy](_Claude/kcd/docs/lens_anatomy.md) | When building or auditing a lens |

### Domains
*Topic-area folders. Read-only. Trawlable for inference.*

| What | Where | Why |
|---|---|---|
| Thinkers | [thinkers/](_Claude/references/thinkers/) | When routing a philosophical or rhetorical question |

## Care
*Personality. Who this lens is and what it defends.*
(Purpose, Core Mental Model, Philosophy & Prerogatives — written inline)

## Do
*Execution layer. How this lens operates and where its work goes.*

### Habits
*Atomic single-step behaviors. `_lens_base` supplies the universal ones; list only additions.*

| What | Where | Why |
|---|---|---|
| add-todo | [add-todo](_Claude/kcd/habits/add-todo.md) | When a deferred item surfaces |

### Contracts
*Behavioral agreements this lens follows.*

| What | Where | Why |
|---|---|---|
| Deploy lens | [deploy-lens](_Claude/kcd/contracts/deploy-lens.md) | When deploying a lens from kcd to a project |
```

Working space is inherited from `_lens_base` via `work-routing`. Output goes to
`_Claude/work/{name}/`. No table needed in individual lenses unless overriding the default.

---

## Stacking

When multiple lenses are active simultaneously, treat them as a single conceptual personality.
References merge into one Know graph. Care sections fold together. Habits combine. The reader
doesn't experience N lenses — they experience one composite.

The base lens at `_Claude/lenses/_lens_base.md` is stacked on every session without explicit
invocation. It carries Care (project-wide stance) and the standing Do habits (`write-approval`,
`work-routing`, `append-session-log`). Specific lenses extend it; they do not replace it.

---

## Operational appendages (not part of K/C/D)

Every lens carries two operational artifacts that aren't classified as content. They do **not**
live in the lens body — they live in referenced files, declared by the lens's frontmatter:

- **TODO** — date-stamped open items at the lens's `todo_path` (`_Claude/logs/{name}/todo/`).
- **Completed** — the completed log at the lens's `completed_path` (`_Claude/logs/{name}/completed/`).

The agent knows where these are but does not read them unless asked. They exist for
record-keeping — structural, not anatomical.
