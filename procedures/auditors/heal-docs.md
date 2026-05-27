---
Status: Active
Role: Auditor
Base: _auditor_base
---

# heal-docs — Procedure (canonical)

*Canonical definition. Generic across any KCD-structured documentation tree.
The deployed copy at `procedures/auditors/heal-docs.md` solves the requirements below
with project-specific values.*

Base rules: [_auditor_base](_auditor_base.md) — composition model, requirement resolution,
fail behavior, output conventions.

---

## Parameters

Name  : heal-docs
Task  : #heal-docs
Model : claude-haiku-4-5-20251001
Type  : Auditor

---

## Requirements

*Declared generically here; solved in the deployed copy. See `_auditor_base` for pre-flight
resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `doc-root` | Input | Root directory of the KCD documentation tree. See Path Convention. |
| `report-dir` | Input | Directory where Decisions, Repairs, and Run reports are written. |
| `work-exclude` | Input | Subtree excluded from all phases — the fluid/scratchpad area. |
| `log-max-age` | Input | Maximum age in days for log entries. Entries older than this are pruned during Log Pruning phase. |

---

## Know

| What | Path | Load When |
|---|---|---|
| Root index | `{doc-root}/index.md` | Phase 1 — before inventory walk |
| Lens index | `{doc-root}/lenses/index.md` | Phase 4 — before lens review begins |
| All lens files | `{doc-root}/lenses/` | Phase 4 — one at a time during lens review |
| Lens anatomy | `{doc-root}/kcd/docs/lens_anatomy.md` | Phase 4 — structural check reference |
| KCD framework | `{doc-root}/kcd/kcd_framework.md` | Phase 4 — semantic check reference |

---

## Care

This procedure repairs the document tree. It does not interpret content, rewrite prose,
or make strategic decisions. It has opinions about structure — not about meaning.

The procedure operates against a **routing chart** (below) that classifies every file in
the tree by path pattern. The chart determines whether a finding is auto-repaired or
flagged. Files do not declare their own classification — the chart does. This is the
CSS-cascade model: identity by location, not by self-description.

**Defends:**
- Ambiguity surfaces to Decisions; never silently resolved
- No file deletion — repairs references *to* files, never removes files
- Flush-and-fill — reports reflect current state only; no accumulated history
- One canonical path per reference — does not create duplicates
- Chart is the single source of routing truth — no per-file frontmatter overrides
- Skip List is the single source of file exemptions — no per-file overrides

**Will not touch:**
- Prose, arguments, or Care block content inside lens files
- New Know or Do entries added speculatively — only repairs what is already declared
- Any file outside `{doc-root}`
- Any file listed in the Skip List
- The `kcd:` frontmatter block in any file — reserved for explicit per-doc deviation
- Non-markdown files — heal-docs operates only on `.md`

**Flags to Decisions (does not auto-repair):**
- Broken link with zero or multiple candidate matches
- Lens missing a standard structural block (Know, Care, or Do)
- Semantic gap: lens scope implies a reference it does not carry *(noisy by design — high false-positive is intentional, treat as brainstorm input)*
- Know entry that appears stale or outside the lens's declared scope *(noisy by design — same)*
- Index.md absent from a folder that should have one
- Any file whose chart row carries `action: flag-for-review` — repairs go to Decisions, not Repairs
- Malformed frontmatter — file skipped for this run, logged for human attention
- Missing chain top-layer file — chain has nothing to cascade from
- Sub-agent failure during Phase 4 — lens review skipped for that file

**Idempotence note:** A second consecutive run will *likely* produce the same Decisions and zero new Repairs, but it is not guaranteed. Sub-agents (Phase 4) may produce slightly different findings across runs — treated as discovery signal, not as a correctness gap.

---

## Path Convention

Every path in this canonical is relative to `{doc-root}` unless it begins with another requirement variable (`{report-dir}`, `{work-exclude}`). This applies uniformly to the Skip List, Routing Chart, Chains section, Know block, and every phase description.

The deployed copy solves `{doc-root}` once in its Requirements block. No section in this canonical repeats that prefix.

---

## Skip List

Files listed here are excluded from every phase. heal-docs's own canonical and deployed copies are pre-populated so the procedure never edits itself.

Paths follow the Path Convention above — bare entries resolve from `{doc-root}`.

```
- kcd/procedures/auditors/heal-docs.md
- procedures/auditors/heal-docs.md
```

To add an exception, edit this section. The list is data — heal-docs reads it on every run.

---

## Routing Chart

First match wins. Patterns are glob-style, evaluated top-to-bottom against the file's
path relative to `{doc-root}`. `**` matches any depth; `*` matches within one segment.

Skip List entries are checked *before* the chart — a file in the Skip List bypasses all chart logic.

| # | Pattern | ground_truth | action |
|---|---|---|---|
| 1 | `{work-exclude}/**` | — | excluded (skip all phases) |
| 2 | `{report-dir}/**` | — | excluded (skip all phases) |
| 3 | `kcd/procedures/*/_*_base.md` | intent | flag-for-review |
| 4 | `kcd/procedures/**/*.md` | codebase | auto-repair |
| 5 | `procedures/**/*.md` | codebase | auto-repair |
| 6 | `**/index.md` | codebase | auto-repair |
| 7 | `kcd/templates/*.md` | intent | flag-for-review |
| 8 | `kcd/**/*.md` | intent | flag-for-review |
| 9 | `lenses/*.md` | intent | flag-for-review |
| 10 | `plans/**/*.md` | plan-lifecycle | flag-for-review |
| 11 | `plans_complete/**/*.md` | plan-lifecycle | flag-for-review |
| 12 | `references/**/*.md` | codebase | flag-for-review |
| 13 | `logs/**/*.md` | none | log-prune-only |
| 14 | `**/*.md` | codebase | flag-for-review (catch-all) |

**ground_truth values:**
- `codebase` — paths and references are verified against real files
- `intent` — content is human-authored contract; structure checked, content untouched
- `plan-lifecycle` — status field cross-checked against the plans index
- `none` — content is append-only record; handled exclusively by Log Pruning

**action values:**
- `auto-repair` — broken paths with a single candidate match are fixed in-place
- `flag-for-review` — same finding routes to Decisions; file is not modified
- `excluded` — file is exempt from this procedure entirely
- `log-prune-only` — file is processed only by Log Pruning phase

---

## Chains

Chain Conformance operates **only on files matching a chain pattern below.** Files outside every chain are not subject to cascade or shape checks — they may still be touched by other phases (link resolution, index validation, log pruning) according to their Routing Chart row, but Phase 5 ignores them. No "out-of-chain" flag exists.

A new file type joins chain conformance by adding a row here. Until added, it is invisible to Phase 5.

| Type | Chain (top → bottom) |
|---|---|
| Procedure | `kcd/templates/{role}_template.md` → `kcd/procedures/{family}/_{family}_base.md` → `kcd/procedures/{family}/{Name}.md` → `procedures/{family}/{Name}.md` |
| Lens | `kcd/templates/lens_template.md` → `lenses/{name}.md` |
| Plan | `kcd/templates/plan_template.md` → `plans/{name}.md` (or `plans_complete/{name}.md`) |
| Reference | `kcd/templates/reference_template.md` → `references/**/{name}.md` (excludes `**/index.md`) |
| Index | `kcd/templates/index_template.md` → `**/index.md` |

Rules:
- **The template's frontmatter field set is the chain's expected shape.** Cascade only propagates fields that exist at the template — never invents new ones.
- A template with no frontmatter declares an empty expected shape — instances may carry whatever they like; cascade is a no-op.
- The `kcd:` block is exempt — neither inherited into nor out of it.
- A field present at a lower layer but absent from the template is flagged to Decisions — either the field belongs in the template (intentional addition that needs to be promoted) or it should move to the lower file's `kcd:` block (intentional deviation).
- Differing values at the same field across layers are intentional override — no action.
- Repair is in-place; logged to Repairs with the source layer noted.
- A file with malformed frontmatter is logged to Decisions and skipped for this phase. No cascade is attempted.
- A chain whose top-layer file does not exist is logged to Decisions (`missing template: {expected path}`) and that chain is skipped for the run.

---

## kcd: block — definition

The `kcd:` block is a top-level YAML key in document frontmatter whose value is a map. Example:

```yaml
---
Status: Active
Role: Deployed
kcd:
  canonical: kcd/procedures/auditors/heal-docs.md
  any-other-special-key: value
---
```

heal-docs treats the `kcd:` block as opaque:
- Phase 5 cascade walks every top-level key *except* `kcd:`
- Nothing is cascaded into `kcd:` from upstream
- Nothing is cascaded from `kcd:` to downstream layers
- Field-set comparison ignores `kcd:` entirely

Use `kcd:` for fields that are layer-specific (e.g., a deployed copy's pointer back to its canonical) or for one-off behaviors that intentionally deviate from the chain's normal shape.

---

## Do

*Pre-flight runs first, per `_auditor_base` — deployment check, then requirement resolution.
Phases below assume the procedure is deployed and all requirements are solved.*

### Phase 1 — Inventory

Load: `{doc-root}/index.md`

Build two manifests:
- **File manifest:** every .md file in `{doc-root}`, with canonical path. Files matching the Skip List or any chart `excluded` row are omitted from the manifest.
- **Reference manifest:** every path string in markdown links `[text](path)` or in table cells that resolve to a file path — collected across all files in the file manifest.

Normalize all paths against their source file location before comparison.

### Phase 2 — Link Resolution

For each entry in the reference manifest, match the **source file** (the file
*containing* the link) against the Routing Chart to determine its `action`.

- Source action `auto-repair`:
  - Link resolves cleanly → no action
  - Broken, exactly one candidate match by filename stem → fix in-place; log to Repairs
  - Broken, zero or multiple candidates → log to Decisions
- Source action `flag-for-review`:
  - Link resolves cleanly → no action
  - Broken (any cause) → log to Decisions; never auto-fix

Stem comparison is case-insensitive. Stem = filename minus extension.

### Phase 3 — Index Validation

Scope: all `index.md` files in the file manifest.

For each index file:
- Entry listed, file does not exist → remove the entry; log to Repairs
- File exists in folder, not listed in index → add a stub entry conforming to
  `What | Where | Why` column format; log to Repairs
- Index.md absent from a folder that should have one → create it with a stub
  header and empty `What | Where | Why` table; log to Repairs

Index repairs are mechanical (table-row manipulation only) and always auto-repair, overriding chart action. No Decisions are raised for index repairs.

### Phase 4 — Lens Sequential Review

For each lens file found in `{doc-root}/lenses/`, spawn a sub-agent with a fresh
context window. Pass to each sub-agent:
- The target lens file (full content)
- `{doc-root}/kcd/docs/lens_anatomy.md`
- `{doc-root}/kcd/kcd_framework.md`
- The instructions below

Each sub-agent returns a structured list of findings. The parent aggregates findings and **rewrites `type: repair` to `type: decision` for every finding sourced from a file whose chart row carries `action: flag-for-review`**. Lenses match Chart row 9, so all lens-sourced path findings end up in Decisions. Sub-agents do not need to know the chart.

Sub-agent failure (model error, timeout, malformed response) → parent logs one Decision entry `lens review failed: {filename}` and continues with the next lens. The phase does not abort.

**Sub-agent instructions (per lens):**

Identify the lens name from the filename. Then perform each check and return findings
as a list of rows: `{ type, what, where, why, lens }` where `lens` is the filename
stem of the lens under review.

1. **Structural check** — confirm Know, Care, and Do blocks are present.
   Missing block → type: decision.
2. **Know path resolution** — apply Phase 2 logic to every path in the Know table.
   Broken, one candidate → type: repair. Broken, zero or multiple → type: decision.
3. **Do path resolution** — apply Phase 2 logic to every path in habits and
   procedures tables. Same repair/decision logic.
4. **Stale reference check** *(noisy by design)* — flag any Know entry that appears outside the lens's declared scope or no longer relevant → type: decision, flag for removal consideration.
5. **Semantic gap check** *(noisy by design)* — based on the lens's declared scope and role, identify references it should carry but does not. Return as type: decision with a specific recommendation. Do not add entries.

The "noisy by design" checks are intended as brainstorm signal — false positives are acceptable, even desirable. The Decisions report functions as a list of things to consider, not a list of confirmed problems.

### Phase 5 — Chain Conformance & Cascade Repair

Scope: files matching a chain pattern in the Chains section above. Files outside every chain pattern are skipped — Phase 5 does not enumerate them, flag them, or otherwise notice them.

For each chain:

1. **Identify layers present.** For each declared layer, locate the file at the expected path. If the top-layer file does not exist, log to Decisions (`missing template: {expected path}`) and skip the chain. Missing intermediate or terminal layers are recorded but do not abort the chain.
2. **Filter Skip List members.** Layers whose file is in the Skip List are removed from this chain's walk for the run. Cascade does not enter them; cascade does not pull from them.
3. **Establish the expected shape.** The template (top of chain) defines the field set. Only fields present at the template are subject to cascade.
4. **Cascade missing fields.** Walk top-down. For each layer pair (N, N+1):
   - For every template-set field that exists at layer N's frontmatter but is missing at layer N+1's frontmatter, copy the value from N to N+1 in-place. Log to Repairs with note `cascaded from {N path}`.
   - The `kcd:` block is exempt — not read, not written.
5. **Flag template-absent fields.** For each layer, any top-level field present in frontmatter that is *not* in the template's field set (and is not `kcd:`) is logged to Decisions: ``field `{name}` at `{layer path}` is not in template; promote to template or move to kcd:``.
6. **Preserve differing values.** Same field, different values across layers → no action (intentional override).
7. **Malformed frontmatter.** A file with unparseable YAML frontmatter → log to Decisions (`frontmatter unparseable: {path}`), skip the file for this phase. Do not attempt repair.

### Phase 6 — Log Pruning

Scope: every file matching chart row 13 (`logs/**/*.md`).

For each log file:
- Parse single-line date-stamped entries in completed-log format: `- [YYYY-MM-DD] ...`.
- Compute age of each entry relative to today.
- Remove every entry where age > `{log-max-age}` days.
- Leave non-entry lines (headers, blank lines, section markers, prose) untouched.
- Log to Repairs: `pruned N entries from {file}, oldest retained: {date}`.

If a log file is non-empty but has zero parseable entries → log to Decisions: `log format unsupported, pruning skipped: {file}`. Session-log format (`YYYY-MM-DD : !lens : ...`) is not currently supported — those files surface as Decisions until format consolidation lands.

If a log file is empty or has zero pruneable entries, skip silently.

### Phase 7 — Report Generation (flush and fill)

Destroy and recreate both report files.

**`{report-dir}/KCD Framework Decisions.md`**
Header: run timestamp · items requiring human input

| What | Where | Why | Lens |
|---|---|---|---|

**`{report-dir}/KCD Framework Repairs.md`**
Header: run timestamp · files scanned · total repairs made

| What | Where | Why | Lens |
|---|---|---|---|

### Phase 8 — Output Declaration

This procedure produces:
- `{report-dir}/KCD Framework Decisions.md`
- `{report-dir}/KCD Framework Repairs.md`

Modifies: .md files in `{doc-root}` in-place — broken link repairs (Phase 2), index stub additions (Phase 3), frontmatter field cascades (Phase 5), pruned log entries (Phase 6).

Excludes: `{work-exclude}`, `{report-dir}`, and every entry in the Skip List from all phases.

Does not produce console output, logs, or side effects outside `{doc-root}`.
Report tables carry four columns: What | Where | Why | Lens.
Lens convention: findings from Phases 1–3, 5, 6 (mechanical tree repair) set Lens to `null`.
Findings from Phase 4 sub-agents set Lens to the lens filename stem (e.g. `session_manager`).
`null` means the issue is structural — no lens raised it. A lens name means a specific
lens's scope or integrity is implicated.

After Phase 8, the `run-report` habit fires automatically (declared at `_auditor_base`).
Downstream consumers read the report files. This procedure does not communicate
results any other way.
