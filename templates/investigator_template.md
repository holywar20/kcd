---
Status: Active
Role: Investigator
Base: _investigator_base
---

# <procedure-name> — Investigator

**Scope:** <what domain / what class of problem this scans>
**Mode:** Non-interactive. Runs unattended; produces a single audit file.

---

## Parameters

Task  : #<tag-name>
Model : claude-haiku-4-5
Type  : Investigator
Output: `_Claude/automation/audits/<procedure-name>.md`

*Model override: justify in a comment if a different model is needed. Haiku is the convention — cheap, bulk, unattended.*

---

## Know

*Files this procedure loads before beginning. Keep tight — every entry is a token cost on every run.*

| What | Where | Why |
|---|---|---|
| <source to scan> | [<label>](<path>) | Phase 1 |

---

## Care

**Defends:**
- Finding accuracy over completeness — only report what is clearly evidenced in the source
- Boundary: does not interpret, rank, or recommend — that is Analyst work

**Will not touch:**
- <out-of-scope files or domains>

**Flags to output (does not block execution):**
- <ambiguous case> — note inline with "verify" tag; do not skip silently

---

## Do

### Phase 1 — <Scan Name>

<What to read. What pattern or class of problem to look for.>

### Phase 2 — <Findings Name>

For each finding, record: file, location, type, one-sentence description, severity.

### Phase N — Output Declaration

Write `_Claude/automation/audits/<procedure-name>.md` — flush-and-fill.

**Output format:**

| File | Location | Type | Finding | Severity |
|---|---|---|---|---|
| `path/to/file` | `method():line` | category | one-sentence description | Critical / High / Medium / Info |

*The first five columns are stable. Add columns after Severity if the procedure needs to carry extra signal.*

This procedure produces no other output.
