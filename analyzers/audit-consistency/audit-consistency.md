---
type: analyzer
status: disabled
model: claude-sonnet-4-6
lens: lens_crafter
base: _analyzer_base
---

# audit-consistency — Analyzer (canonical)

*Generic across any KCD-structured documentation tree. Interpretive — surfaces redundancy,
conflicts, stale todos, broken references, and orphans as a human-decision feed; it does not
auto-repair. The deployed copy solves the requirements below with project-specific values.*

Base rules: [_analyzer_base](_Claude/kcd/analyzers/_analyzer_base.md) — role, requirement
resolution, output conventions, modifiers.

*This is the **judgment half** of doc maintenance. Actionable findings (a broken reference, a
clear redundancy) carry a **manifest** per `_analyzer_base` — a separate repair generator (or a
human) executes them, gated by review. The mechanical repair is never done here.*

---

## Parameters

Output: `_Claude/reports/audit-consistency.md`

*`name` / `#{name}` derive from the filename; `model`, `lens`, and `base` live in frontmatter.*

---

## Requirements

*Declared generically here; solved in the deployed copy. See `_analyzer_base` for pre-flight
resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `doc-root` | Input | Root directory of the documentation tree. In-tree relative paths resolve from here. |
| `global-doc` | Input | Path to the global session-entry document (e.g. `CLAUDE.md`). |
| `memory-source` | Input | Directory of memory files declared as a reference target by lenses. |
| `stale-age` | Input | Maximum age in days for todo items before they are flagged as stale. |

---

## Know

| What | Where | Why |
|---|---|---|
| Global doc | [global-doc]({global-doc}) | Phase 1 |
| Lenses index | [lenses/index]({doc-root}/lenses/index.md) | Phase 1 — to enumerate lens files |
| _lens_base | [_lens_base]({doc-root}/kcd/lenses/_lens_base.md) | Phase 1 — global Know+Care baseline |
| Each lens file | [lenses/{name}]({doc-root}/lenses/{name}/{name}.md) | Phase 1 — one at a time |
| References index | [references/index]({doc-root}/references/index.md) | Phase 1 — reference store catalog |
| KCD framework | [kcd_framework]({doc-root}/kcd/kcd_framework.md) | Phase 3 — structural shape reference for lens checks |
| Lens anatomy | [lens_anatomy]({doc-root}/kcd/docs/lens_anatomy.md) | Phase 3 — structural check reference |
| Memory files | [memory-source]({memory-source}) | Phase 4 — check memory references declared in docs |

---

## Care

**Defends:**
- Findings are specific and actionable — no vague "this could be improved" entries.
- Ambiguous cases surface to the Recommendations section; never silently resolved.
- One report per run; the prior report is destroyed and recreated (flush-and-fill).
- Reads documents only; modifies no file (report-only write authority).

**Will not touch:**
- Source code outside the documentation tree.
- Work-in-progress drafts in `{doc-root}/work/`.
- Log files.

**Surfaces (notes inline, does not block):**
- A cross-lens conflict where both formulations may be intentionally different — flag both, recommend reconciliation.
- A redundancy where it is unclear which location is canonical — flag both, recommend a canonical.
- A broken reference where no candidate match exists — flag the missing target.

---

## Do

*Pre-flight runs first, per `_analyzer_base` — deployment check, then requirement resolution.*

### Phase 1 — Document Load

Load the global doc, lenses index, `_lens_base`, every named lens file, and the references
index. Hold in working context for subsequent phases.

### Phase 2 — Redundancy Findings

Compare the global doc and all lens files for duplicated content:
- Same rule or fact stated in the global doc and one or more lens files.
- Same gotcha or pattern documented in multiple places.
- Different phrasings of identical constraints.

For each finding: identify the concept, list all locations, and name a canonical location
(global doc for global rules; lens file for domain-specific rules; `_lens_base` for project-wide
stances).

Output: `{concept, found_in[], canonical_location, recommendation}` records.

### Phase 3 — Cross-Lens Conflict Detection

Compare all lens files against each other for contradictions:
- A rule in lens A that directly contradicts a rule in lens B.
- Different conventions for the same concept (naming, error handling, etc.).

Suppression entries in Care blocks are not conflicts — they are intentional per-domain
carve-outs.

Output: `{concept, lens_a, lens_b, description}` records.

### Phase 4 — Reference Validation

For every file path declared in:
- Know blocks (all lens files and the global doc),
- Do / Habits tables (all lens files),
- Markdown links in the global doc.

Check whether the file exists at the declared path. Also check declared memory file references
(paths under `{memory-source}`).

Output: `{reference_label, declared_path, status: valid|missing}` records.

### Phase 5 — Todo Staleness

For each lens, read its todo store at its `todo_path` (`{doc-root}/logs/{lensname}/todo/`). For
each unchecked item:
- Parse the `[YYYY-MM-DD]` date prefix.
- Compute age in days from today.
- Flag items older than `{stale-age}` days.

Output: `{text, lens, date, age_days}` records.

### Phase 6 — Orphaned Sections

Identify content blocks in lens files or the global doc that:
- Reference paths or artifacts that no longer exist.
- Describe conventions that no longer match the current implementation.
- Are no longer referenced from any other document.

Best-effort — flag candidates, do not assert definitive staleness.

Output: `{location, section_heading, reason}` records.

### Phase 7 — Report (flush-and-fill)

Destroy and recreate `_Claude/reports/audit-consistency.md`:

```markdown
# Consistency Audit — {YYYY-MM-DD}

**Documents audited**: N
**Issues found**: N

## Summary

[One paragraph: counts by category, any critical conflicts]

## 1. Redundancy

| Concept | Found In | Canonical Location | Recommendation |
|---|---|---|---|

## 2. Cross-Lens Conflicts

| Concept | Lens A | Lens B | Description |
|---|---|---|---|

## 3. Broken References

| Reference | Declared Path | Status |
|---|---|---|

## 4. Stale Todos (> {stale-age} days)

| Todo | Lens | Date | Age (days) |
|---|---|---|---|

## 5. Orphaned Sections (Candidates)

| Location | Section | Reason |
|---|---|---|

## Recommendations / Manifests

[Ranked, most impactful first. Each clearly-actionable item carries a self-contained manifest a
repair generator (or human) can execute without further judgment.]
```

### Phase 8 — Output Declaration

Writes `_Claude/reports/audit-consistency.md` (flush-and-fill). Modifies nothing — all source
files are read-only. No console output, logs, or side effects outside the report path.
