---
session:
  edit_mode: section-replace
  owner_lens: lens_crafter
heal-docs:
  ground_truth: intent
  trigger: new procedure types added, key values change
  action: flag-for-review
---

# Frontmatter Schema

Canonical definition of all structured frontmatter blocks used across the `_Claude/` document tree. Every template includes these blocks pre-populated. Every document inherits them from its template.

---

## Two namespaces

### `session:` — universal

Present on every document. Tells any session agent how to work with this document type.

| Key | Valid values | Meaning |
|---|---|---|
| `edit_mode` | `append-only` | Never overwrite existing content — logs, completed entries |
| | `section-replace` | Replace a named section; leave others intact — lenses, KCD docs, indexes |
| | `full-rewrite` | Regenerate the whole document from source — references |
| | `task-checklist` | Check off tasks, update Current State — plans |
| | `phase-sequence` | Add, modify, or reorder phases — procedures |
| `owner_lens` | lens tag | Which lens is responsible for maintaining this document type |

### Procedure-namespaced blocks (e.g., `heal-docs:`)

The key is the exact procedure name. Each procedure reads its own block and ignores all others. A document can carry multiple procedure blocks without collision — they never interfere.

---

## `heal-docs:` block

Tells the heal-docs procedure what this document is checked against and what to do when drift is detected.

| Key | Valid values | Meaning |
|---|---|---|
| `ground_truth` | `codebase` | Verify paths, file existence, referenced artifacts |
| | `intent` | Human-authored Care/vision — healer flags, never rewrites |
| | `plan-lifecycle` | Status field checked against plans index |
| | `none` | Append-only records — healer uses action to decide |
| `trigger` | free text | What changes should prompt a review of this document |
| `action` | `auto-repair` | heal-docs may fix broken paths and links in-place |
| | `flag-for-review` | heal-docs surfaces to Decisions; human repairs |
| | `skip` | heal-docs ignores this document type entirely |

---

## Per-type defaults

| Document type | edit_mode | owner_lens | ground_truth | action |
|---|---|---|---|---|
| lens | `section-replace` | `lens_crafter` | `intent` | `flag-for-review` |
| plan | `task-checklist` | `lens_crafter` | `plan-lifecycle` | `flag-for-review` |
| reference | `full-rewrite` | `lens_crafter` | `codebase` | `flag-for-review` |
| procedure | `phase-sequence` | `automation` | `codebase` | `auto-repair` |
| investigator | `phase-sequence` | `automation` | `codebase` | `auto-repair` |
| analyst | `phase-sequence` | `automation` | `codebase` | `auto-repair` |
| generator | `phase-sequence` | `automation` | `codebase` | `auto-repair` |
| log | `append-only` | *(any)* | `none` | `flag-for-review` |
| index | `section-replace` | `lens_crafter` | `codebase` | `auto-repair` |

---

## Placement rule

`session:` always appears first in the frontmatter block. Procedure-namespaced keys follow. Existing keys (type, status, lens, etc.) are preserved — the new blocks are additions, not replacements.

```yaml
---
type: plan
status: Active
lens: lens_crafter
created: YYYY-MM-DD
updated: YYYY-MM-DD
session:
  edit_mode: task-checklist
  owner_lens: lens_crafter
heal-docs:
  ground_truth: plan-lifecycle
  trigger: phases completed, plan status changes
  action: flag-for-review
---
```

---

## Extensibility

Adding a new procedure namespace requires no changes to existing documents. The procedure declares its own key, reads it where present, and ignores files that lack it. Templates should be updated to include new procedure blocks when a procedure is promoted to regular use.
