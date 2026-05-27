---
Status: Active
Role: Contract
Scope: lens:lens_crafter
---

# Deploy Lens — Contract

> The steps required to take a lens from the kcd library and activate it in a project.

---

## When

This contract activates whenever a session:
- Receives `#deploy-lens` or "deploy a lens" / "activate a lens" / "wire up a lens"
- Is asked to make a lens available for use in a project
- Is preparing a new project for KCD-based development

---

## Artifact Format

The deployed lens is a single markdown file at `_Claude/lenses/{lens_name}.md`, sourced
from `_Claude/kcd/lenses/{lens_name}.md`.

**Frontmatter (mandatory after deployment):**

```yaml
---
Command: "!{lens_name}"
Status: Active
Depends on: {lens_name | "Nothing"}
---
```

**Rendering conventions (Obsidian):**
- All paths use markdown link format: `[label](../relative/path)` — never backtick spans
- A blank line must precede every table
- No leading underscores in link display text

---

## Lifecycle

### Phase 0 — Check Base

**Trigger:** Any lens deployment is requested.

**Together:** Check whether `_Claude/lenses/_base.md` exists. If it does, proceed to Phase 1. If it does not, deploy `_Claude/kcd/lenses/_base.md` first — copy it to `_Claude/lenses/_base.md`, set `Status: Active`. Base has no CLAUDE.md registration and no path rewriting — it carries no Know References pointing outside `kcd/`. Once base is deployed, proceed to Phase 1.

**Standard:** `_Claude/lenses/_base.md` exists and is `Status: Active` before any other lens is deployed. Base is deployed once and never redeployed unless explicitly requested.

### Phase 1 — Verify Source

**Trigger:** A lens deployment is requested.

**Together:** Confirm the lens exists at `_Claude/kcd/lenses/{name}.md` and carries `Status: Disabled`. Read the lens and check anatomy compliance: Know / Care / Do structure present, References table uses `What | Where | Why` headers, paths are relative to `_Claude/lenses/` (not hardcoded to another project). Surface any anatomy failures to the user before proceeding.

**Standard:** No deployment proceeds against a lens that is missing, `Status: Active` (already deployed), or has anatomy violations. A lens with `Status: Disabled` and clean anatomy is ready to deploy.

### Phase 2 — Copy and Activate

**Trigger:** Phase 1 passes.

**Together:** Copy `_Claude/kcd/lenses/{name}.md` to `_Claude/lenses/{name}.md`. Set `Status: Active` in the deployed copy. The kcd source retains `Status: Disabled` — never modify the kcd original.

**Standard:** The deployed file exists at `_Claude/lenses/{name}.md`. The kcd source is unchanged.

### Phase 3 — Rewrite Paths

**Trigger:** The deployed copy exists.

**Together:** Audit every path in the deployed lens's Know → References table. Paths must be relative to `_Claude/lenses/{name}.md`. Framework files resolve via `../kcd/`. Domain files resolve via `../references/`. The lens index resolves as `./_index.md` (sibling). Rewrite any path that does not resolve correctly from the deployed location.

**Standard:** Every link in the References table resolves to a file that exists. Broken links are surfaced to the user — do not deploy a lens pointing at missing files without flagging it.

### Phase 4 — Register

**Trigger:** Paths verified.

**Together:** Add a row to the Lens Index table in `CLAUDE.md`:

| Lens | File | Purpose |
|---|---|---|
| `!{lens_name}` | [{lens_name}](_Claude/lenses/{lens_name}.md) | {one-line purpose from lens Purpose section} |

`CLAUDE.md` is outside `_Claude/` — this write requires explicit user approval per the write-approval habit before executing.

**Standard:** The lens appears in the CLAUDE.md index. The one-line purpose is drawn directly from the lens's Purpose section — not paraphrased.

### Phase 5 — Verify

**Trigger:** Registration complete.

**Together:** Do a final read of the deployed lens. Confirm: Status is Active, all tables have blank lines before them, no backtick path spans, no unescaped underscores in link display text, Working Space paths reference `_Claude/work/{lens_name}/`.

**Standard:** The lens is ready to load. Announce the command (`!{lens_name}`) and the working space location to the user.

---

## Standards

- **kcd is the only valid source.** Never copy from another project's `_Claude/lenses/`.
- **kcd source is never modified during deployment.** The kcd copy stays `Disabled`.
- **CLAUDE.md is approval-gated.** The index update requires explicit user sign-off.
- **Broken paths block deployment.** A lens pointing at missing files is flagged, not silently deployed.
- **Obsidian rendering conventions are non-negotiable.** Blank lines before tables; markdown links throughout.

---

## Edge Cases

- **Lens already deployed** (`Status: Active` at `_Claude/lenses/`): Surface to user — confirm whether to overwrite or skip.
- **Referenced file doesn't exist** (e.g. `_index.md` not yet created): Flag the broken link; deploy the lens anyway with a TODO noting the gap.
- **kcd source has hardcoded paths from another project:** Surface during Phase 1 anatomy check; fix paths before proceeding.
- **Depends on another lens not yet deployed:** Name the dependency and ask the user whether to deploy it first.
