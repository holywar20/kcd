---
type: template
status:   # the authored lens gets: active | disabled
---

# {name} — Lens (template)

*Scaffold for authoring a lens. Copy to `_Claude/kcd/lenses/{name}/{name}.md` — a lens is a
folder: the `.md` trunk plus a `context/` subfolder for lens-specific Knows. Fill every
placeholder and delete these scaffold notes. `_base` is inherited automatically — declare only
what this lens adds.*

> **Frontmatter for the authored lens** (replaces this template's frontmatter):
> - `type: lens`
> - `status:` — `active` or `disabled`
> - `command: "!{name}"` — the invocation tag
> - `todo_path:` / `completed_path:` — leave blank; populated at deploy

---

## Know
*Read-only inputs. What this lens loads from the knowledge store. Lens-specific material that
travels only with this lens lives in its own `context/`, not the shared `references/` library.*

### References
*Specific named files. Load explicitly by path.*

| What | Where | Why |
|---|---|---|
| {label} | [{label}]({path}) | {when to load} |

### Domains
*Topic-area folders. Read-only. Trawlable for inference.*

| What | Where | Why |
|---|---|---|
| {label} | [{label}](_Claude/references/{category}/) | {when to trawl} |

---

## Care
*Personality. Who this lens is and what it defends.*

### Purpose

{One short paragraph: what this lens activates, what kind of thinking it summons.}

### Core Mental Model

{How this collaborator frames problems in its domain. Vocabulary in use. Stance.}

### Philosophy & Prerogatives

**Design philosophy:** {one-sentence stance}

**Push-back style:** {how this lens delivers flags — tone, level of softening}

**Prerogatives — what this lens defends:**
- {invariant}

**Flags — direct language to use:**
- "{example phrasing}"

**What this lens does not do:**
- {out-of-scope item}

---

## Do
*Execution layer. How this lens operates and where its work goes.*

### Habits
*`_lens_base` already supplies the universal habits (write-approval, work-routing,
append-session-log). List only the habits this lens adds.*

| What | Where | Why |
|---|---|---|
| {habit} | [{habit}](_Claude/kcd/habits/{habit}.md) | {when it fires} |

### Contracts
*Optional. Behavioral agreements this lens follows. Omit if none beyond the universal `plan`
contract (inherited via `_lens_base`).*

| What | Where | Why |
|---|---|---|
| {contract} | [{contract}](_Claude/kcd/contracts/{contract}.md) | {when it applies} |

### Working Space
*Output goes here, per the work-routing habit:*

`_Claude/work/{name}/AI/` — AI-generated output
`_Claude/work/{name}/human/` — the user's working documents
`_Claude/work/{name}/plans/` — plans and task tracking

---

*TODO and Completed are not kept in the lens body. They live at `todo_path` and
`completed_path` (declared in frontmatter; populated at deploy time — typically
`_Claude/logs/{name}/todo/` and `_Claude/logs/{name}/completed/`). Agents know where they are
but do not read them unless asked.*
