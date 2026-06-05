---
type: generator
status: disabled
model: claude-sonnet-4-6
base: _generator_base
---

# apply-repairs — Generator (canonical)

*Generic across any KCD-structured documentation tree. The **mechanical-apply** half of doc
healing: it consumes a repair manifest produced by
[audit-structure](_Claude/kcd/analyzers/audit-structure/audit-structure.md) and applies each row
**in-place** — link rewrites, index stubs, frontmatter cascades, log prunes. It decides nothing;
every row is pre-resolved. The deployed copy solves the requirements below with project values.*

Base rules: [_generator_base](_Claude/kcd/generators/_generator_base.md) — composition model,
requirement resolution, fail behavior, output conventions, modifiers.

*This is the **apply** stage of the `repair-docs` pipeline: `audit-structure → apply-repairs`.
Its input is the analyzer's repair manifest; the human-facing decisions report is the analyzer's
output, never touched here. Textbook generator — executes a spec, exercises no judgment.*

**The manifest is the contract.** apply-repairs reads the manifest in the format defined by
audit-structure (`## Repair Manifest Format`): one table, columns `# | action | target |
locator | from | to | note`, six actions. Every row is, by the analyzer's construction, a
deployed-zone fix with an obvious resolution — so applying it requires no choice. Where a row
*cannot* be applied cleanly, apply-repairs **does not guess** — it skips the row and logs it (the
generator invariant: broad write ⇒ low autonomy).

---

## Parameters

Output: `_Claude/audits/apply-repairs.md` — the **run log** (what was applied / skipped),
flush-and-fill. The repairs themselves are **in-place edits** to the files named in the manifest
(declared in Phase 4).

*`name` / `#{name}` derive from the filename; `model` / `base` live in frontmatter.*

---

## Requirements

*Declared generically here; solved in the deployed copy. See `_generator_base` for pre-flight
resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `repair-manifest` | Input | The repair manifest file produced by `audit-structure` (`_Claude/reports/audit-structure-manifest.md`). The spec this generator executes. |
| `doc-root` | Input | Root of the documentation tree. Bounds write authority — apply-repairs never edits a path outside `{doc-root}`, and never under `{doc-root}/kcd/` (canonical is read-only). |

*No `log-max-age` requirement: a `prune-log` row carries its cutoff date in `from` (the analyzer
computed it). The generator removes by the given cutoff — no age judgment of its own.*

---

## Care

apply-repairs applies the manifest **verbatim**. It builds nothing the manifest does not
specify, and it makes no decision a row leaves open. Broad write authority is safe only because
the work is fully specified upstream; the moment a row is ambiguous or unapplicable, the
generator stops at that row, logs it, and moves on — it never improvises a repair.

**Defends:**
- Executes only what a manifest row specifies — never infers an unlisted repair.
- A row it cannot apply cleanly (target/locator/`from` not found) is **skipped and logged**,
  never guessed.
- Never writes outside `{doc-root}`; **never modifies `{doc-root}/kcd/**`** — canonical is
  look-don't-touch, so a manifest row targeting it is a contract violation: skipped and flagged.
- Never touches the `kcd:` frontmatter block — `cascade-field` writes top-level keys only.
- **Idempotent** — a repair already satisfied (the `from` value is absent / the field already
  present) is a no-op skip, not an error. A second run applies nothing.
- The run log is flush-and-fill.

**Will not touch:**
- Any file not named as a manifest `target`.
- Prose, Care content, or argument text — only the precise span a row's `locator` + `from`
  identifies.
- The manifest or the decisions report — read-only inputs.
- Non-markdown files.

**Surfaces (logs to the run report, does not block):**
- A row whose `target`, `locator`, or `from` value cannot be located → skip, log under *Not applied*.
- A row whose `target` resolves under `kcd/**` or outside `{doc-root}` → skip, log as a contract violation.
- A malformed/unparseable manifest row (unknown action, missing required column) → skip, log.

---

## Path Convention

Every path is relative to `{doc-root}` unless it begins with another requirement variable. The
deployed copy solves `{doc-root}` once in its Requirements block. Manifest `target` paths are
taken as written; apply-repairs verifies each is inside `{doc-root}` and not under `kcd/` before
editing.

---

## Do

*Pre-flight runs first, per `_generator_base` — deployment check, then requirement resolution.*

### Phase 1 — Load & Validate the Manifest

Read `repair-manifest` and parse its repair table. If the file is absent or carries an empty
table, there is nothing to apply: skip to Phase 3 and write an empty run log (an empty manifest
is **not** a failure — the pipeline skips this stage when the analyzer slates no repairs).

For each row, validate before queuing it:
- `action` is one of the six known verbs (`rewrite-link`, `index-add`, `index-remove`,
  `index-create`, `cascade-field`, `prune-log`).
- The columns that action requires are present (per the action table below).
- `target` resolves **inside `{doc-root}`** and **not under `kcd/`**.

A row failing any check is **rejected** (not queued) and recorded for the run log. Validation
never modifies a file.

### Phase 2 — Apply Repairs

Apply each validated row exactly as specified. Per-action mechanics:

| action | mechanic |
|---|---|
| `rewrite-link` | In `target`, find the markdown link whose text is `locator` and whose path is `from`; replace the path with `to`. If the link/path is not present, skip (idempotent / already-fixed). |
| `index-add` | In the `target` index, insert the `to` row into the `What \| Where \| Why` table (skip if an equivalent row already exists). |
| `index-remove` | In the `target` index, delete the table row identified by `locator` matching `from` (skip if already gone). |
| `index-create` | Create `target` (a new `index.md`) with the stub header + the `to` content. Skip if the file already exists. |
| `cascade-field` | In `target`'s frontmatter, add top-level key `locator` with value `to`. **Never** write inside `kcd:`; **never** overwrite an existing value (if the key is already present, skip). |
| `prune-log` | In the `target` log, remove every date-stamped entry (`- [YYYY-MM-DD] …`) older than the cutoff date in `from`. Leave headers, blank lines, and prose untouched. |

A row whose precondition is already satisfied is a **no-op skip** (this is what makes the
generator idempotent). A row that cannot be located at all (target missing, span absent for a
non-idempotent reason) is recorded under *Not applied* — the generator does not search for a
near-match.

### Phase 3 — Write Run Log (flush-and-fill)

Destroy and recreate `_Claude/audits/apply-repairs.md`:

```markdown
# Apply-Repairs Run — {YYYY-MM-DD}

**Manifest**: {repair-manifest}
**Rows**: N total   ·   **Applied**: N   ·   **Skipped (no-op)**: N   ·   **Not applied**: N   ·   **Rejected**: N

## Applied

| action | target | what changed |
|---|---|---|

## Skipped (already satisfied — idempotent no-op)

| action | target | why |
|---|---|---|

## Not applied (could not locate — surfaced, not guessed)

| action | target | why |
|---|---|---|

## Rejected (invalid row — unknown action / missing column / out-of-bounds target)

| action | target | why |
|---|---|---|
```

### Phase 4 — Output Declaration

Writes `_Claude/audits/apply-repairs.md` (the run log, flush-and-fill). **Modifies in-place** the
`.md` files named as manifest `target`s — link rewrites, index stub add/remove/create, frontmatter
field cascades, and log-entry prunes, exactly as the manifest specifies. Modifies nothing under
`{doc-root}/kcd/`, nothing outside `{doc-root}`, and no file not named in the manifest. No console
output, logs, or side effects outside the run log and the listed targets.

After Phase 4, the `run-report` habit fires automatically (declared at `_generator_base`).

---

## Modifiers

apply-repairs inherits `--test` from `_generator_base`, **refined for a mutating generator:**

**`--test`** — **dry-run.** Every phase runs identically and validation/location logic is
exercised in full, but **no in-place edit is made** — Phase 2 records each row as *would-apply*
instead of *applied*. The run log still writes to `_Claude/audits/apply-repairs.md` (already this
generator's normal Output), so the operator sees exactly what a live run would change without
touching the tree. The natural pre-flight for a repair run.
