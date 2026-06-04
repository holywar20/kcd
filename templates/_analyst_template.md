---
type: template
status:   # the authored analyst gets: active | disabled
---

# {name} — Analyst (template)

*Scaffold for authoring a canonical analyst. Copy to `_Claude/kcd/analysts/{name}/{name}.md`
(an analyst is a folder: the `.md` trunk plus a `context/` subfolder). Holds all generic
interpretation logic; **declares — never solves — its requirements**, and names no
project-specific path or value. Fill every placeholder and delete these scaffold notes.*

> **Frontmatter for the authored analyst** (replaces this template's frontmatter):
> - `type: analyst`
> - `status:` — `active` or `disabled`
> - `model: claude-sonnet-4-6` — judgment is the point; downgrade only with a justifying comment
> - `lens: {lens}` — the lens this analyst composes with (gives it judgment; lets it run cold)
> - `base: _analyst_base`

Base rules: [_analyst_base](_Claude/kcd/analysts/_analyst_base.md) — role, composition model,
requirement resolution, output conventions, modifiers.

---

## Parameters

Output: `_Claude/reports/{name}.md`  *(primary report; additional reports, if any, also under `reports/`)*

*`name` is the folder/file name, `#{name}` the task tag; `model` and `lens` live in frontmatter.
An analyst's write authority is **report-only** — it writes reports (typically one; a small
number is fine), never source or canonical paths.*

---

## Modifiers

*Optional. Each modifier is `--`-prefixed, globally unique across the document base, and
registered in the Modifier Registry (a block in `CLAUDE.md` — a temporary home). `--test` is
inherited from `_analyst_base` — do not redeclare it. This slot may be empty.*

| Modifier | Effect |
|---|---|
| `--{modifier}` | {what it changes} |

---

## Know

*An analyst reads **anywhere** — source, references, and generator output (`audits/`). Declare
the inputs this analyst reads; audits are one input among many, not a precondition.*

| What | Where | Why |
|---|---|---|
| {input} | [{label}]({path}) | {what it's read for} |

---

## Care

**Defends:**
- Manifests are self-contained and executable without further judgment — every consequence resolved
- Write-one-place: writes only its report; never modifies source or any canonical path

**Will not touch:**
- Source files or canonical paths — reads only

**Surfaces (notes inline, does not block):**
- {ambiguous case, missing optional input} — note it in the report; do not error

---

## Do

*Pre-flight (deployment + requirement resolution) runs first, per `_analyst_base`.*

### Phase 1 — Read

{What to read — source, references, audits — and what to extract from each.}

### Phase 2 — Interpret & rank

{Interpret findings; rank by priority/severity where it applies; identify what could be made
mechanical and handed to a generator.}

### Phase 3 — Manifests

For each opportunity worth acting on, compose a **manifest**: a self-contained, paste-ready
spec a generator (or a human) can execute without further judgment.

### Phase N — Output Declaration

Write `_Claude/reports/{name}.md` — flush-and-fill.

**Recommended shape:**

```markdown
# {Report Title} — {date}

## Summary
{brief — what was reviewed, headline counts / priorities}

## Findings / Opportunities

### {priority} {title}
**Source:** {where it came from}

{one-paragraph description}

#### Manifest
{self-contained, paste-ready spec a generator or human runs without further judgment}
```

This analyst produces no other output.
