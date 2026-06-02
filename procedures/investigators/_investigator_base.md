---
Status: Active
Role: Investigator base
---

# _investigator_base

*Base document for all Investigator procedures. Every canonical investigator references this file the way a lens references `_base`. It carries the rules shared by all investigators so individual procedures never repeat them.*

---

## Composition Model

An investigator exists as two files plus this base:

| Layer | Location | Owns |
|---|---|---|
| `_investigator_base` | `kcd/procedures/investigators/_investigator_base.md` | Rules shared by all investigators (this file) |
| Canonical | `kcd/procedures/investigators/{name}.md` | Generic scan logic; **declares** requirements |
| Deployed | `procedures/investigators/{name}.md` | **Solves** requirements with project-specific values |

The deployed copy references its canonical; the canonical references this base. Invoking the deployed procedure loads all three.

The deployed tree mirrors the KCD tree exactly — a deployed file sits at the same relative path under `procedures/` as its canonical does under `kcd/procedures/`.

---

## Role Boundary

An investigator **scans and reports**. It does not interpret, rank, recommend, or repair. Its job is to surface what is clearly evidenced in the source.

| Investigator does | Investigator does not |
|---|---|
| Scan a defined domain | Decide which findings matter most |
| Record findings as structured rows | Generate fix prompts or strategies |
| Note ambiguous cases inline with a `verify` tag | Modify source files |
| Flush and recreate its audit file | Accumulate history across runs |

Ranking, prioritization, and fix recommendations are **Analyst** work. An investigator that interprets is outside its lane.

---

## Naming

Every procedure declares a `Name` parameter in its canonical Parameters block — its single canonical identifier. Lowercase, hyphen-separated, verb-led (e.g. `scan-controllers`).

`Name` is the one source of the procedure's identity. It is never retyped freely — every other reference derives from it:

| Reference | Derived value |
|---|---|
| Canonical file | `kcd/procedures/investigators/{Name}.md` |
| Deployed file | `procedures/investigators/{Name}.md` |
| Task tag | `#{Name}` |
| Audit output | `_Claude/automation/audits/{Name}.md` |
| Test-mode output | `_Claude/automation/tests/procedures/{Name}.md` |

An agent must never invent a name for a procedure or its artifacts. Where a string needs the procedure's identity, it uses `{Name}` exactly.

---

## Requirements

A canonical investigator declares **requirements** — anything it needs that is not generic:

- **Input** — a project path, glob, or configuration value (the source domain to scan).
- **Tooling** *(rare)* — an external executable or parser. Most investigators read markdown or source directly and need no tooling.

The canonical names no concrete path or value. The deployed copy solves every declared requirement.

### Pre-flight

Before Phase 1, in order:

**1 — Deployment check.** Confirm a deployed copy exists at `procedures/investigators/{Name}.md`. If absent, fail immediately:

```
FAILED — not deployed: no deployed copy at procedures/investigators/{Name}.md
```

**2 — Requirement resolution.** Resolve every declared requirement against the deployed copy's solutions. If any requirement is unsolved or its solution is unreachable, fail immediately:

```
FAILED — unmet requirement: {requirement-name} ({tooling|input}) — {what was expected}
```

Either failure stops the run — no scan, no audit, no partial output. An investigator runs only when it is both deployed and fully resolved.

---

## Output Conventions

- An investigator produces a single audit at `_Claude/automation/audits/{Name}.md`.
- Flush-and-fill — destroyed and recreated on each run. Audits reflect current state only; no accumulated history.
- The default output format is a row-per-finding table:

  | File | Location | Type | Finding | Severity |
  |---|---|---|---|---|

  The first five columns are stable across all investigators. A procedure may add columns after Severity if it needs to carry extra signal — never before, and never by reordering.
- Severity values: `Critical`, `High`, `Medium`, `Info`. No other levels.
- An ambiguous finding is recorded with a `verify` tag inline — never silently skipped, never silently included.

---

## Trigger Model

Investigators are **agent-native** — they run unattended on cron or as part of the alignment pipeline. They produce audits that Analysts consume. They do not require Bryan in the loop and do not prompt for decisions.

An investigator that needs a human decision is mis-classified — it should be re-shaped as an Auditor (which produces a Decisions report) or its decision point should be deferred to a downstream Analyst.

---

## Model Convention

Investigators run on `claude-haiku-4-5` by default. The scan/extract pattern is bulk, structured work — haiku is the right cost/quality point. Override only with a justifying comment in the canonical Parameters block.

---

## Flags

Flags modify a run's behavior or scope. Every flag is `--`-prefixed, **globally unique** across the entire document base, and **registered** in the project's master procedure index (its Flag Registry). A flag may be omitted on invocation; absent any flag, the procedure runs its default (full) behavior. An unknown flag fails the run:

```
FAILED — unknown flag: {flag}
```

An investigator declares its own flags in its canonical `## Flags` slot; each must be registered. Duplicate or unregistered flags are caught by `#heal-docs`. Flags defined in this base are **inherited** by every investigator and registered once — a procedure does not redeclare them.

**`--test`** — the universal investigator flag, defined here and inherited by every investigator. Under `--test`, output is redirected to `_Claude/automation/tests/procedures/{Name}.md` — the procedure's normal audit file is never touched. Every phase runs identically; only the destination changes. The procedure creates `automation/tests/procedures/` if absent. Flush-and-fill.

---

## Habits

Every investigator invokes `run-report` as its final action — automatic, no per-procedure
declaration required.

| What | Where | Why |
|---|---|---|
| run-report | [run-report](../../habits/run-report.md) | Mandatory — fires after the procedure's final phase |
