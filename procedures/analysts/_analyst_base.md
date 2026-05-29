---
Status: Active
Role: Analyst base
---

# _analyst_base

*Base document for all Analyst procedures. Every canonical analyst references this file the way a lens references `_base`. It carries the rules shared by all analysts so individual procedures never repeat them.*

---

## Composition Model

An analyst exists as two files plus this base:

| Layer | Location | Owns |
|---|---|---|
| `_analyst_base` | `kcd/procedures/analysts/_analyst_base.md` | Rules shared by all analysts (this file) |
| Canonical | `kcd/procedures/analysts/{name}.md` | Generic interpretation logic; **declares** requirements |
| Deployed | `procedures/analysts/{name}.md` | **Solves** requirements with project-specific values |

The deployed copy references its canonical; the canonical references this base. Invoking the deployed procedure loads all three.

The deployed tree mirrors the KCD tree exactly — a deployed file sits at the same relative path under `procedures/` as its canonical does under `kcd/procedures/`.

---

## Role Boundary

An analyst **interprets and ranks**. It reads audits produced by investigators, contextualizes them with source where needed, and produces a ranked report with fix prompts. It does not scan, modify source, or write to canonical project paths.

| Analyst does | Analyst does not |
|---|---|
| Read audits as primary input | Re-investigate or duplicate scan work |
| Rank findings severity-descending | Modify source files |
| Produce self-contained fix prompts | Apply fixes — that is Generator or human work |
| Read source files for *context only* | Treat source as the primary input |

If the upstream audit is missing, the analyst notes it in the Summary table as skipped — it does not error and does not scan source as a fallback. An analyst without its audit is a no-op for that bucket.

---

## Naming

Every procedure declares a `Name` parameter in its canonical Parameters block — its single canonical identifier. Lowercase, hyphen-separated, verb-led (e.g. `analyze-controllers`).

`Name` is the one source of the procedure's identity. It is never retyped freely — every other reference derives from it:

| Reference | Derived value |
|---|---|
| Canonical file | `kcd/procedures/analysts/{Name}.md` |
| Deployed file | `procedures/analysts/{Name}.md` |
| Task tag | `#{Name}` |
| Report output | `_Claude/automation/reports/{Name}.md` |
| Test-mode output | `_Claude/automation/tests/procedures/{Name}.md` |

An agent must never invent a name for a procedure or its artifacts. Where a string needs the procedure's identity, it uses `{Name}` exactly.

---

## Requirements

A canonical analyst declares **requirements** — anything it needs that is not generic:

- **Input** — source audit path(s) (the primary feed), and optionally source paths used for context.

The canonical names no concrete path or value. The deployed copy solves every declared requirement.

### Pre-flight

Before Phase 1, in order:

**1 — Deployment check.** Confirm a deployed copy exists at `procedures/analysts/{Name}.md`. If absent, fail immediately:

```
FAILED — not deployed: no deployed copy at procedures/analysts/{Name}.md
```

**2 — Requirement resolution.** Resolve every declared requirement against the deployed copy's solutions. If any requirement is unsolved or its solution is unreachable, fail immediately:

```
FAILED — unmet requirement: {requirement-name} (input) — {what was expected}
```

**Missing audits are not a pre-flight failure** — they are tolerated and noted in the report's Summary table. Pre-flight checks the requirement is *declared* and *resolvable*, not that every audit currently exists. An audit yet to be produced is a normal state.

Either failure stops the run — no read, no report, no partial output.

---

## Output Conventions

- An analyst produces a single report at `_Claude/automation/reports/{Name}.md`.
- Flush-and-fill — destroyed and recreated on each run. Reports reflect current state only; no accumulated history.
- The default output structure is:

  ```markdown
  # <Report Title> — {date}

  ## Summary
  | Bucket | Last Run | Critical | High | Medium | Info | Status |
  |---|---|---|---|---|---|---|

  ## Findings

  ### [SEVERITY] <Title>
  **Source:** `<audit-file>`
  **Location:** `<file>:<method or line>`

  <One-paragraph description.>

  #### Fix Prompt
  [Self-contained, paste-ready into a new session.]
  ```

- The Summary table is mandatory. Findings are ordered severity-descending.
- Fix prompts are **self-contained** — they must include all context a downstream session needs to act without reading the report itself. A fix prompt that says "see the report above" is broken.

---

## Trigger Model

Analysts are **agent-native** — they run unattended on cron or as part of the alignment pipeline, typically immediately downstream of one or more investigators. They do not require Bryan in the loop.

An analyst that surfaces an item requiring a human decision still emits a fix prompt; the human reads the report and acts on the prompt. The analyst does not block or wait.

---

## Model Convention

Analysts run on `claude-sonnet-4-6` by default. Interpretation, ranking, and prompt synthesis are quality-sensitive — sonnet is the right cost/quality point. Override only with a justifying comment in the canonical Parameters block.

---

## Source-Reading Discipline

An analyst may read source files **only for context** — to sharpen interpretation of a finding the audit already surfaced. It must not:

- Re-scan source for findings the audit missed
- Synthesize findings that have no audit support
- Treat source as the primary input

If a class of finding is consistently missing from the audit, the fix is to extend the upstream investigator — not to expand the analyst's reading.

---

## Test Mode

Every analyst supports the `--test` flag.

Under `--test`, output is redirected to `_Claude/automation/tests/procedures/{Name}.md` — the procedure's normal report file is never touched. Every phase runs identically; only the destination changes. The procedure creates `automation/tests/procedures/` if absent. Flush-and-fill.

`--test` exists to exercise a procedure unattended and inspect its interpretation without producing real product.

---

## Habits

Every analyst invokes `run-report` as its final action — automatic, no per-procedure
declaration required.

| What | Where | Why |
|---|---|---|
| run-report | [run-report](../../habits/run-report.md) | Mandatory — fires after the procedure's final phase |
