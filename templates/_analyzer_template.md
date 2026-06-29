---
type: template
status:   # the authored analyzer gets: active | disabled
---

# {name} — Analyzer (template)

*Scaffold for authoring a canonical analyzer. Copy to `_Claude/kcd/analyzers/{name}/{name}.md`
(an analyzer is a folder: the `.md` trunk plus a `context/` subfolder). Holds all generic
interpretation logic; **declares — never solves — its requirements**, and names no
project-specific path or value. Fill every placeholder and delete these scaffold notes.*

> **Frontmatter for the authored analyzer** (replaces this template's frontmatter):
> - `type: analyzer`
> - `status:` — `active` or `disabled`
> - `model: claude-sonnet-4-6` — judgment is the point; downgrade only with a justifying comment
> - `lens: {lens}` — the lens this analyzer composes with (gives it judgment; lets it run cold)
> - `base: _analyzer_base`

Base rules: [_analyzer_base](_Claude/kcd/analyzers/_analyzer_base.md) — role, composition model,
requirement resolution, output conventions.

---

## Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `{param-name}` | text \| number \| toggle \| select \| url \| path | {default} | {what it tunes} |

Output: `_Claude/reports/{name}.md`  *(primary report; additional reports, if any, also under `reports/`)*

*Each parameter is a **name / type / default** triple — the typed-field vocabulary the app's setting
fields use (see [_analyzer_base](_Claude/kcd/analyzers/_analyzer_base.md) → Parameters). `name` is the
folder/file name, `#{name}` the task tag; `model` and `lens` live in frontmatter. An analyzer's write
authority is **report-only** — it writes reports (typically one; a small number is fine), never
source or canonical paths.*

---

## Know

*An analyzer reads **anywhere** — source, references, and generator output (`audits/`). Declare
the inputs this analyzer reads; audits are one input among many, not a precondition.*

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

*Pre-flight (deployment + requirement resolution) runs first, per `_analyzer_base`.*

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

This analyzer produces no other output.
