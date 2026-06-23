---
type: generator
status: disabled
model: claude-sonnet-4-6
base: _generator_base
---

# apply-canonical-sync — Generator (canonical)

*Generic across any KCD-structured project. Applies a canonical sync manifest — a table of
section-level text replacements — to one or more deployed artifacts whose canonical parent
changed. The deployed copy is the target; the manifest is the input; the generator decides
nothing. Ships `disabled` here in `kcd/generators/`; deployment activates the deployed copy.*

Base rules: [_generator_base](_Claude/kcd/generators/_generator_base.md) — composition model,
requirement resolution, fail behavior, output conventions.

---

## Parameters

Output: in-place edits to the deployed artifacts named in the manifest + a run log at
`_Claude/audits/apply-canonical-sync.md`.

*`name` / `#{name}` derive from the filename; `model` and `base` live in frontmatter.*

---

## Requirements

| Name | Kind | Description |
|---|---|---|
| `sync-manifest` | Input | Path to the canonical sync manifest file produced by a human or analyzer session. |
| `doc-root` | Input | Root of the deployed documentation tree. Deployed artifact paths in the manifest resolve from here. |

---

## Manifest Format

The manifest is a markdown file with one table. The generator reads it verbatim — it makes no
judgments about which rows to apply or skip. Every row must be complete and unambiguous before
it reaches the generator; the session or analyzer that authored the manifest owns completeness.

```markdown
# Canonical Sync Manifest — {YYYY-MM-DD}

**Rows**: N

| # | target | section | from | to | note |
|---|---|---|---|---|---|
```

| Column | Meaning |
|---|---|
| `#` | Row counter — sequential, for log cross-reference. |
| `target` | Path to the deployed `.md` file to edit, relative to `{doc-root}`. |
| `section` | Heading (e.g. `## Composition Model`) or `frontmatter` — scopes the replacement to prevent false matches when the same substring appears elsewhere. |
| `from` | Exact text to find within that section. Must match the file verbatim (whitespace included). |
| `to` | Replacement text. May be empty (pure deletion). |
| `note` | Provenance — why this is safe/mechanical (e.g. `canonical: _Claude/kcd/analyzers/_analyzer_base.md`). |

---

## Care

**Defends:**
- Every edit is manifest-driven — the generator applies rows, it does not compose them.
- A row that cannot be executed (section not found, `from` not found within section) is a
  **failure**, not a skip — the run stops and logs the failure. A partial apply is worse than no
  apply.
- The deployment-specific sections below are **never touched**, even if a manifest row targets
  them. The generator refuses the row and logs it as a violation.

**Preservation invariant — these sections are never modified:**
- `## Requirements — solved` (or `## Requirements — Solved`)
- `## Project Notes`
- The `kcd:` frontmatter block
- The `status:` frontmatter field
- Any file under `{doc-root}/work/` or `{doc-root}/scratch/`

**Will not touch:**
- Files outside `{doc-root}` — no manifest row may target a path outside the doc root.
- The sync manifest itself.
- The `kcd/` canonical tree — deployed artifacts only.

**Surfaces (logs, does not block):**
- A `target` that does not exist — logged as a warning; row skipped. (The manifest may refer to
  an artifact not yet deployed; that is a pre-flight concern, not a hard stop, when the manifest
  explicitly marks a row as `optional`.)

---

## Do

*Pre-flight runs first, per `_generator_base` — deployment check, then requirement resolution.*

### Phase 1 — Manifest Load

Read the sync manifest at `{sync-manifest}`. Parse the table. Validate:
- All required columns present (`#`, `target`, `section`, `from`, `to`, `note`).
- No row targets a file outside `{doc-root}`.
- No row targets a preservation-invariant section — fail the run immediately if found (the
  manifest is malformed; the author must fix it before re-running).

If the table is empty (zero rows), write a run log noting "manifest empty — nothing to apply"
and exit cleanly (not a failure).

### Phase 2 — Apply Rows

For each row in order:

1. Resolve `target` against `{doc-root}`. If the file does not exist, log a warning and skip.
2. Locate the `section` in the file. If not found, **fail** (the manifest is stale or wrong).
3. Within the section, locate `from` verbatim. If not found, **fail**.
4. Replace `from` with `to` in-place (preserving surrounding content).
5. Log the row as applied.

Under `--test`: compute every step (validate, locate, diff) but write nothing. Log the row as
`[DRY RUN] would apply`.

**One file, multiple rows.** When several rows target the same file, apply them in manifest
order. Each row's `from` is matched against the post-previous-edit content of the file (later
rows see the result of earlier edits). This is the expected behavior — manifest authors must
account for it.

### Phase 3 — Run Log

Write (flush-and-fill) `_Claude/audits/apply-canonical-sync.md`:

```markdown
# apply-canonical-sync — Run Log — {YYYY-MM-DD}

**Manifest**: {sync-manifest}
**Rows in manifest**: N   ·   **Applied**: N   ·   **Skipped**: N   ·   **Failed**: N

## Applied

| # | target | section | note |
|---|---|---|---|

## Skipped (target not found)

| # | target | reason |
|---|---|---|

## Failed (section or from not found)

| # | target | section | reason |
|---|---|---|
```

Under `--test`, all rows appear under `## Would Apply (dry run)` instead of `## Applied`.

### Phase 4 — Output Declaration

Writes in-place edits to the deployed files named in the manifest. Writes the run log to
`_Claude/audits/apply-canonical-sync.md` (flush-and-fill). Modifies no other file.

---

## Deployed copy

Not hand-authored. The deploy contract produces it: a full copy of this canonical with
requirements solved to project values, `status: active`, and a `kcd: { canonical: … }` pointer
for provenance. Project-specific quirks, if any, go in a `## Project Notes` section there.
