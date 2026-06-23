---
type: analyzer
status: disabled
model: claude-sonnet-4-6
lens: lens_crafter
base: _analyzer_base
---

# audit-structure — Analyzer (canonical)

*Generic across any KCD-structured documentation tree. The **mechanical-detection** half of
doc healing: it walks the tree, finds structural drift (broken links, index gaps, frontmatter
cascade gaps, and stale log entries), and **splits every finding** into
a **repair manifest** (unambiguous mechanical fixes a generator executes) and a **decisions
report** (anything a human must resolve). It applies nothing — detection only. The deployed copy
solves the requirements below with project values.*

Base rules: [_analyzer_base](_Claude/kcd/analyzers/_analyzer_base.md) — role, requirement
resolution, output conventions.

*This is the **detect** stage of the `repair-docs` pipeline: `audit-structure → apply-repairs`.
The repair manifest is the generator's input; the decisions report is the pipeline's
human-facing output. The mechanical write is never done here — that is `apply-repairs`.*

**Split by mechanism, not topic.** audit-structure is **purely mechanical detection**. Semantic
and interpretive checks — redundancy, cross-lens conflict, scope drift, the "what reference is
this lens missing" brainstorm — are **not** done here; they belong to
[audit-consistency](_Claude/kcd/analyzers/audit-consistency/audit-consistency.md). The split line
is *is the fix mechanical*, not *what topic does it concern*.

---

## Parameters

Outputs:
- `_Claude/reports/audit-structure.md` — the **decisions report** (human-facing).
- `_Claude/reports/audit-structure-manifest.md` — the **repair manifest** (`apply-repairs` input).

*`name` / `#{name}` derive from the filename; `model`, `lens`, and `base` live in frontmatter.*

---

## Requirements

*Declared generically here; solved in the deployed copy. See `_analyzer_base` for pre-flight
resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `doc-root` | Input | Root directory of the KCD documentation tree. In-tree paths resolve from here (see *Path Convention*). |
| `work-exclude` | Input | Project scratch subtree excluded from every phase (the `excluded` zone's project-specific member; `reports/` and `audits/` are excluded by the chart). |
| `log-max-age` | Input | Maximum age in days for a log entry. Older entries are slated for pruning (the manifest carries the cutoff; `apply-repairs` removes them). |
---

## Know

| What | Where | Why |
|---|---|---|
| Routing chart | [routing-chart](_Claude/kcd/analyzers/audit-structure/context/routing-chart.md) | The classification policy — zones + finding-resolution. Loaded first; governs every routing call below. |
| Frontmatter schema | [frontmatter_schema](_Claude/kcd/docs/frontmatter_schema.md) | Phase 5 — template-is-schema; defines the cascade check and the `kcd:` exemption. |
| Root index | [index]({doc-root}/index.md) | Phase 1 — entry point for the inventory walk. |
| Lens index | [lenses/index]({doc-root}/lenses/index.md) | Phase 4 — enumerate lens files. |
| Lens anatomy | [lens_anatomy](_Claude/kcd/docs/lens_anatomy.md) | Phase 4 — the structural blocks a lens must carry. |
---

## Care

audit-structure repairs nothing and decides nothing about meaning. It detects structural drift
and routes each finding; the routing is **not its own judgment** — it is read from the
**routing-chart** reference. The chart is the single source of routing truth: a file's **zone**
(by location) decides whether a fix may be applied at all, and the **finding** decides whether
the fix is obvious enough to apply. Files never declare their own classification — location does
(the CSS-cascade model).

**Defends:**
- Every finding routes per the routing-chart — never by per-file frontmatter or ad-hoc judgment.
- The repair manifest is **self-contained and mechanical**: every row a generator can execute
  without further judgment. A row that needs a human is a decision, not a manifest entry.
- Ambiguity surfaces to the decisions report; never silently resolved into a repair.
- Canonical (`kcd/**`) is **health-check only** — every finding there is a decision; nothing in
  `kcd/` is ever slated for repair.
- Flush-and-fill — both outputs reflect current state only; no accumulated history.
- Detection only — reads the whole tree, modifies nothing (report-only write authority).

**Will not touch:**
- Any file (it is report-only) — it produces a manifest *describing* repairs; `apply-repairs`
  makes them.
- The `excluded` zone (`{work-exclude}`, `reports/`, `audits/`) — skipped in every phase.
- Prose, arguments, or Care content — link repair fixes a *path*, never content; semantic review
  is `audit-consistency`'s job.
- The `kcd:` frontmatter block — opaque to cascade (see frontmatter_schema).
- Non-markdown files — operates only on `.md`.

**Surfaces to decisions (does not slate for repair):**
- Broken link with **zero or multiple** candidate targets — not obvious where it should point.
- Any finding in the **canonical** zone — health report, never a repair.
- A lens missing a standard block (Know, Care, or Do) — no mechanical synthesis exists.
- A frontmatter field present on an instance but **absent from its type's template** — promote
  to the template or move to `kcd:` (a human call).
- Malformed frontmatter — file skipped for the cascade phase, logged for human attention.
- A log file with no parseable entries — pruning skipped, format flagged.

---

## Path Convention

Every path is relative to `{doc-root}` unless it begins with another requirement variable
(`{work-exclude}`). The deployed copy solves `{doc-root}` once in its
Requirements block; no section repeats that prefix.

---

## Repair Manifest Format

The analyzer↔generator contract. `apply-repairs` reads `_Claude/reports/audit-structure-manifest.md`
and executes each row **without judgment** — so every row must be complete and unambiguous. One
uniform table; the six **actions** interpret the columns slightly differently.

```markdown
# Repair Manifest — audit-structure — {YYYY-MM-DD}

**Repairs slated**: N

| # | action | target | locator | from | to | note |
|---|---|---|---|---|---|---|
```

| Column | Meaning |
|---|---|
| `action` | One of the six verbs below. |
| `target` | The deployed `.md` file `apply-repairs` modifies (or creates). |
| `locator` | Where in the target the edit applies — disambiguates when the same value appears twice. |
| `from` | The current value to replace/remove (blank for pure additions). |
| `to` | The replacement/added value (blank for pure removals). |
| `note` | Provenance — why this is safe/mechanical (the matched candidate, the cascade source). |

**Actions** (per-action column semantics):

| action | target | locator | from | to | note |
|---|---|---|---|---|---|
| `rewrite-link` | file containing the link | link text | broken path | corrected path | `single stem match: {candidate}` |
| `index-add` | the `index.md` | folder | — | a `What \| Where \| Why` stub row | `present, unlisted: {file}` |
| `index-remove` | the `index.md` | entry name | the stale row | — | `listed, file absent` |
| `index-create` | the new `index.md` path | folder | — | stub header + empty `What \| Where \| Why` table | `folder missing index` |
| `cascade-field` | the instance file | field key | — | the field value | `cascaded from {template path}` |
| `prune-log` | the log file | — | cutoff date | — | `remove entries older than {log-max-age}d` |

Every manifest row is, by construction, in the **deployed** zone with an **obvious** fix —
those are the only findings that reach the manifest. Everything else is a decision.

---

## Do

*Pre-flight runs first, per `_analyzer_base` — deployment check, then requirement resolution.
Load the routing-chart before Phase 1; it governs every routing call.*

### Phase 1 — Inventory & Zone Classification

Walk `{doc-root}`. Build:
- **File manifest** — every `.md` file, each tagged with its **zone** (`excluded` / `canonical`
  / `deployed`) per the routing-chart. `excluded` files are dropped from the manifest entirely.
- **Reference manifest** — every path string in a markdown link `[text](path)` or a table cell
  that resolves to a file path, collected across the file manifest, each tagged with its source
  file's zone.

**Path normalization** (before comparison; per the project link convention in `_lens_base` →
*Link paths*): a **bare** path is vault-root-relative (resolve from the project root, the parent
of `{doc-root}`) — the standard form. A leading-`/` path is a legacy/erroneous root form —
resolve from the project root for verification, but slate the leading slash for stripping. A
`./` or `../` path is a legacy relative form — resolve against the source file for verification,
then slate it for rewrite to the vault-root form. Root-relative links may resolve **outside**
`{doc-root}` (a sibling code tree) — verified against the real filesystem, never stem-matched.

### Phase 2 — Link Resolution

For each reference, resolve it, then route by the source file's **zone** + the **routing-chart**
resolution rules:
- **deployed**, resolves cleanly → no finding.
- **deployed**, broken, **exactly one** candidate by filename stem → **manifest** (`rewrite-link`).
- **deployed**, broken, **zero or multiple** candidates → **decisions** (ambiguous target).
- **deployed**, legacy form but resolvable → **manifest** (`rewrite-link` to the vault-root form).
- **canonical**, broken (any cause) → **decisions** (health report; never repaired).

Stem comparison is case-insensitive; stem = filename minus extension. Link repair is type-agnostic
— it fixes a path, never content — so a resolvable broken link in a lens's Know table is a manifest
row exactly like one anywhere else. The only gate is *is the target obvious*.

### Phase 3 — Index Validation

Scope: every `index.md` in the file manifest.
- Entry listed, file does not exist → `index-remove`.
- File present in the folder, not listed → `index-add` (stub conforming to `What | Where | Why`).
- Folder that should carry an index has none → `index-create` (stub header + empty table).

Index repairs are pure table-row mechanics — in the **deployed** zone they always go to the
manifest. In the **canonical** zone they go to **decisions** like any other finding.

### Phase 4 — Lens Structural Check

For each lens in `{doc-root}/lenses/`, confirm the standard blocks (Know, Care, Do — see
lens_anatomy) are **present**. A missing block → **decisions** (no mechanical synthesis exists; a
human authors it). Path findings inside a lens's Know/Do tables are already covered by Phase 2
(lens files are in the reference manifest) — this phase adds only block-presence.

*Semantic lens review — stale-Know detection and the missing-reference brainstorm — is **not**
done here. It routes to `audit-consistency`.*

### Phase 5 — Frontmatter Cascade Conformance

Per frontmatter_schema (**the type's template is its schema**). For each instance, compare its
frontmatter against its type's template:
- A template-set field **missing** on the instance → **manifest** (`cascade-field`, value from
  the template).
- A field present on the instance but **absent from the template** (and not `kcd:`) →
  **decisions** (promote to the template or move to `kcd:` — a human call).
- Differing values at a shared field → no action (intentional override).
- The `kcd:` block is **exempt** — never read into or out of cascade.
- Malformed/unparseable frontmatter → **decisions** (`frontmatter unparseable: {path}`); skip the
  file for this phase.

Canonical-zone cascade gaps go to **decisions**, not the manifest.

### Phase 6 — Log Age Check

Scope: every log file under `{doc-root}/logs/` in the file manifest.
- Parse single-line date-stamped entries (`- [YYYY-MM-DD] ...`); compute each entry's age.
- If any entry exceeds `{log-max-age}` days → one **manifest** row (`prune-log`, `from` = the
  cutoff date). `apply-repairs` removes every entry older than the cutoff, leaving headers, blank
  lines, and prose untouched.
- A non-empty log with **zero parseable entries** → **decisions** (`log format unsupported,
  pruning skipped: {file}`). Session-log format (`YYYY-MM-DD : !lens : ...`) is unsupported until
  format consolidation lands.
- An empty log, or one with no over-age entries → no finding.

### Phase 7 — Emit Outputs (flush and fill)

Destroy and recreate both files.

**`_Claude/reports/audit-structure-manifest.md`** — the repair manifest, per *Repair Manifest
Format* above. Header: run date · repairs slated. If there are zero manifest rows, write the
header and an empty table (an empty manifest is valid — the pipeline's `apply-repairs` stage is
skipped when the manifest is empty).

**`_Claude/reports/audit-structure.md`** — the decisions report:

```markdown
# Structure Audit — Decisions — {YYYY-MM-DD}

**Files scanned**: N   ·   **Decisions**: N   ·   **Repairs slated**: N (see manifest)

## Summary

[One paragraph: counts by category; any canonical-zone health flags.]

## 1. Ambiguous Links (zero / multiple candidates)

| Reference | In file | Candidates | Why flagged |
|---|---|---|---|

## 2. Canonical Health (kcd/** — flag only, never repaired)

| Finding | Where | Why |
|---|---|---|

## 3. Lens Structural Gaps

| Lens | Missing block | Why |
|---|---|---|

## 4. Frontmatter Decisions (template-absent fields · malformed)

| File | Field / issue | Recommendation |
|---|---|---|

## 5. Log Format

| File | Issue |
|---|---|

## Referred to audit-consistency

[Semantic findings noticed in passing — redundancy, scope drift, cross-lens conflict — that this
analyzer does not own. Pointer only; audit-consistency is the authority.]
```

### Phase 8 — Output Declaration

Produces `_Claude/reports/audit-structure.md` and `_Claude/reports/audit-structure-manifest.md`
(both flush-and-fill). **Modifies nothing** — every source file is read-only; repairs are
described in the manifest, never made. Excludes `{work-exclude}`, `reports/`, and `audits/` from
all phases. No console output, logs, or side effects outside the two report paths.

After Phase 8, the `run-report` habit fires automatically (declared at `_analyzer_base`).
