---
type: contract
status: active
scope: lens:lens_crafter
---

# Deploy Lens — Contract

> The steps required to take a lens from the kcd library and activate it in a project.

> **C6 — deployment is moving to a script.** Full copy + path rewrite, with file pathing 100%
> predictable. This contract is the **spec the deploy script mechanizes**, and the interim
> manual procedure until that script exists. The kcd source is never modified.

---

## When

This contract activates whenever a session:
- Receives `#deploy-lens` or "deploy a lens" / "activate a lens" / "wire up a lens"
- Is asked to make a lens available for use in a project
- Is preparing a new project for KCD-based development

---

## Artifact Format

A deployed lens is a folder `_Claude/lenses/{name}/` containing `{name}.md` plus a `context/`,
sourced from `_Claude/kcd/lenses/{name}/{name}.md`.

**Frontmatter (after deployment):**

```yaml
---
type: lens
status: active
command: "!{name}"
todo_path: _Claude/logs/{name}/todo/todo.md
completed_path: _Claude/logs/{name}/completed/completed.md
---
```

**Rendering conventions:** Per [_lens_base](_Claude/kcd/lenses/_lens_base.md) — paths are links;
backticks-around-paths reserved for pattern paths, fenced code, and quoted speech; blank line
before every table.

---

## Lifecycle

### Phase 0 — Check Base

**Trigger:** Any lens deployment is requested.

**Together:** Check whether `_Claude/lenses/_lens_base.md` exists. If it does, proceed to Phase 1.
If not, deploy `_Claude/kcd/lenses/_lens_base.md` first — copy it to `_Claude/lenses/_lens_base.md`,
set `status: active`. Base has no CLAUDE.md registration and no path rewriting on its own body —
its links stay pointing at `_Claude/kcd/...` because base is the canonical floor and is the one
exception to the deployed-points-at-deployed rule. Base **still deploys its descendant habits and
contracts** per Phase 2.5 (write-approval, work-routing, append-session-log, plan). Once base is
deployed, proceed to Phase 1.

**Standard:** `_Claude/lenses/_lens_base.md` exists and is `status: active` before any other lens
is deployed. Base's descendant habits and contracts exist at their deployed locations. Base is
deployed once and never redeployed unless explicitly requested.

### Phase 1 — Verify Source

**Trigger:** A lens deployment is requested.

**Together:** Confirm the lens exists at `_Claude/kcd/lenses/{name}/{name}.md` and carries
`status: disabled`. Read the lens and check anatomy compliance: Know / Care / Do structure
present, References table uses `What | Where | Why` headers, no paths hardcoded to another
project (portability boundary). Surface any anatomy failures to the user before proceeding.

**Standard:** No deployment proceeds against a lens that is missing, `status: active` (already
deployed), or has anatomy violations. A lens with `status: disabled` and clean anatomy is ready
to deploy.

### Phase 2 — Copy and Activate

**Trigger:** Phase 1 passes.

**Together:** Copy the lens folder `_Claude/kcd/lenses/{name}/` to `_Claude/lenses/{name}/`. Set
`status: active` in the deployed copy. The kcd source retains `status: disabled` — never modify
the kcd original.

Populate `todo_path` and `completed_path` in the deployed frontmatter per the artifact format
(`_Claude/logs/{name}/todo/todo.md` and `_Claude/logs/{name}/completed/completed.md`). Create the
empty directories `_Claude/logs/{name}/todo/` and `_Claude/logs/{name}/completed/` and seed the
two files with frontmatter only (`type: log`, `status: active`). Folder-plus-file is the v1
shape; breakout to many files is a forward path, not a v1 concern.

**Standard:** The deployed folder exists at `_Claude/lenses/{name}/`. The kcd source is unchanged.
The two log files exist and carry valid frontmatter.

### Phase 2.5 — Deploy Descendant Habits & Contracts

**Trigger:** Phase 2 complete.

**Together:** Read the deployed lens's `Do > Habits` and `Do > Contracts` tables. For each row
pointing into `_Claude/kcd/habits/` or `_Claude/kcd/contracts/`, copy the source file to its
deployed location (`_Claude/habits/{name}.md`, `_Claude/contracts/{name}.md`). Set `status: active`
in each deployed copy. If a deployed copy already exists, skip with a one-line surface to the
user; never overwrite silently.

**Standard:** Every habit and contract the lens depends on exists at its deployed location with
`status: active`. The kcd sources remain `disabled` and unchanged.

### Phase 3 — Rewrite Paths

**Trigger:** The deployed copy exists.

**Together:** Per C6, a deployed agent references *deployed* copies, not the canonical `kcd/`.
Rewrite every `_Claude/kcd/…` reference in the deployed lens — habits, contracts — to its
deployed location (`_Claude/habits/…`, `_Claude/contracts/…`). References within `lenses/`,
`references/`, etc. are already vault-root-relative and identical across the move. *(This is the
step the deploy script owns; done by hand only in the interim.)*

**Standard:** Every link in the deployed lens resolves to a file that exists. Broken links are
surfaced to the user — do not deploy a lens pointing at missing files without flagging it.

### Phase 4 — Register

**Trigger:** Paths verified.

**Together:** Two writes.

**4a — Lens index.** Append the lens row to `_Claude/lenses/index.md`. If the file does not
exist, create it from [_index_template](_Claude/kcd/templates/_index_template.md) with a
`Deployable lenses` section (mirroring the shape of
[kcd/lenses/index](_Claude/kcd/lenses/index.md)), then append. This write is **not approval-gated**
— the index is a structural projection over the deployed roster.

Row shape:

| What | Where | Why | Command |
|---|---|---|---|
| {name} | [{name}](_Claude/lenses/{name}/{name}.md) | {one-line purpose from the lens Purpose section} | `!{name}` |

**4b — CLAUDE.md.** Append the lens row to the Lens Index table in `CLAUDE.md`:

| What | Where | Why |
|---|---|---|
| `!{name}` | [{name}](_Claude/lenses/{name}/{name}.md) | {one-line purpose from the lens Purpose section} |

If `CLAUDE.md` does not exist, create it with at minimum a one-line project header and the Lens
Index table (header + this one row). `CLAUDE.md` is **approval-gated** — per the
[write-approval](_Claude/kcd/habits/write-approval.md) habit, lens_crafter drafts the change to
`_Claude/work/lens_crafter/plans/` first and presents the draft for explicit approval before
applying.

**Standard:** The lens appears in both indexes. Both one-line purposes are drawn directly from
the lens's Purpose section — not paraphrased.

### Phase 5 — Verify

**Trigger:** Registration complete.

**Together:** Do a final read of the deployed lens. Confirm: `status: active`, link convention
followed per [_lens_base](_Claude/kcd/lenses/_lens_base.md) (paths are links; backticks only for
pattern/code/quoted-speech), all tables have blank lines before them, Working Space paths
reference `_Claude/work/{name}/`.

**Standard:** The lens is ready to load. Announce the command (`!{name}`) and the working space
location to the user.

---

## Standards

- **kcd is the only valid source.** Never copy from another project's `_Claude/lenses/`.
- **kcd source is never modified during deployment.** The kcd copy stays `disabled`.
- **CLAUDE.md is approval-gated.** The index update requires explicit user sign-off.
- **Broken paths block deployment.** A lens pointing at missing files is flagged, not silently deployed.
- **Obsidian rendering conventions are non-negotiable.** Blank lines before tables; markdown links throughout.

---

## Edge Cases

- **Lens already deployed** (`status: active` at `_Claude/lenses/`): Surface to user — confirm whether to overwrite or skip.
- **Referenced file doesn't exist** (e.g. a doc or template the lens points into `kcd/`): Flag the broken link; deploy the lens anyway with a todo noting the gap. Habits and contracts referenced by the lens are co-deployed per Phase 2.5 and should not normally appear in this case.
- **kcd source has hardcoded paths from another project:** Surface during Phase 1 anatomy check; fix paths before proceeding.
