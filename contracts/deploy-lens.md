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
todo_path: {populated at deploy}
completed_path: {populated at deploy}
---
```

**Rendering conventions (Obsidian):**
- All paths use markdown link format `[label](_Claude/relative/path)` — vault-root-relative, no leading slash, never backtick spans
- A blank line must precede every table
- No leading underscores in link display text

---

## Lifecycle

### Phase 0 — Check Base

**Trigger:** Any lens deployment is requested.

**Together:** Check whether `_Claude/lenses/_lens_base.md` exists. If it does, proceed to Phase 1.
If not, deploy `_Claude/kcd/lenses/_lens_base.md` first — copy it to `_Claude/lenses/_lens_base.md`,
set `status: active`. Base has no CLAUDE.md registration and no path rewriting — it carries no
Know References pointing outside `kcd/`. Once base is deployed, proceed to Phase 1.

**Standard:** `_Claude/lenses/_lens_base.md` exists and is `status: active` before any other lens
is deployed. Base is deployed once and never redeployed unless explicitly requested.

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

**Standard:** The deployed folder exists at `_Claude/lenses/{name}/`. The kcd source is unchanged.

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

**Together:** Add a row to the Lens Index table in `CLAUDE.md`:

| What | Where | Why |
|---|---|---|
| `!{name}` | [{name}](_Claude/lenses/{name}/{name}.md) | {one-line purpose from the lens Purpose section} |

`CLAUDE.md` is approval-gated — this write requires explicit user approval per the
write-approval habit before executing.

**Standard:** The lens appears in the CLAUDE.md index. The one-line purpose is drawn directly
from the lens's Purpose section — not paraphrased.

### Phase 5 — Verify

**Trigger:** Registration complete.

**Together:** Do a final read of the deployed lens. Confirm: `status: active`, all tables have
blank lines before them, no backtick path spans, no unescaped underscores in link display text,
Working Space paths reference `_Claude/work/{name}/`.

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
- **Referenced file doesn't exist** (e.g. `index.md` not yet created): Flag the broken link; deploy the lens anyway with a todo noting the gap.
- **kcd source has hardcoded paths from another project:** Surface during Phase 1 anatomy check; fix paths before proceeding.
