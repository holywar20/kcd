---
Status: Active
Role: Analyst
Base: _analyst_base
---

# <procedure-name> — Analyst

**Scope:** <what audits this reads / what domain it interprets>
**Mode:** Non-interactive. Produces a single report file.

---

## Parameters

Task  : #<tag-name>
Model : claude-sonnet-4-6
Type  : Analyst
Output: `_Claude/automation/reports/<procedure-name>.md`

---

## Know

*Load source audits first. Load source files only as needed for context — audits are the primary input.*

| What | Path | Load When |
|---|---|---|
| Source audit(s) | `_Claude/automation/audits/<audit-name>.md` | Phase 1 |
| <relevant source file(s)> | `<path>` | Phase 2 — for context only |

---

## Care

**Defends:**
- Fix prompts are self-contained and paste-ready — no implicit context required
- Boundary: does not write to source or canonical paths — that is Generator or human work

**Will not touch:**
- Source files directly — reads only; never modifies

**Flags to output (does not block execution):**
- Missing audit file — note as "audit unavailable — skipped" in the Summary table; do not error

---

## Do

### Phase 1 — Audit Load

Read all declared audit files. For each missing audit, note it in the Summary table as skipped — do not block execution.

### Phase 2 — Source Context

Read relevant source files to contextualize findings from the audit. Do not re-investigate — use this context only to sharpen interpretation and fix prompts.

### Phase 3 — Ranked Findings

Rank all findings severity-descending. For each, produce a fix prompt (self-contained, paste-ready into a new session).

### Phase N — Output Declaration

Write `_Claude/automation/reports/<procedure-name>.md` — flush-and-fill.

**Output format:**

```markdown
# <Report Title> — {date}

## Summary
| Bucket | Last Run | Critical | High | Medium | Info | Status |
|---|---|---|---|---|---|---|
| <audit-name> | {date} | N | N | N | N | OK / WARN / CRITICAL |

## Findings

### [SEVERITY] <Finding Title>
**Source:** `<audit-file>`
**Location:** `<file>:<method or line>`

<One-paragraph description of the problem and its significance.>

#### Fix Prompt
**Source:** <procedure-name>
**Location:** <file:line or method>
**Severity:** Critical | High | Medium

[Self-contained description: problem, relevant code context, observed values,
what a fix session should address. Paste directly into a new session.]
```

This procedure produces no other output.
