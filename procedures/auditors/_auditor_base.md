---
Status: Active
Role: Auditor base
---

# _auditor_base

*Base document for all Auditor procedures. Every canonical auditor references this file.
It carries the rules shared by all auditors so individual procedures never repeat them.*

---

## Composition Model

An auditor exists as two files plus this base:

| Layer | Location | Owns |
|---|---|---|
| `_auditor_base` | `kcd/procedures/auditors/_auditor_base.md` | Rules shared by all auditors (this file) |
| Canonical | `kcd/procedures/auditors/{name}.md` | Generic logic; **declares** requirements |
| Deployed | `procedures/auditors/{name}.md` | **Solves** requirements with project-specific values |

The deployed copy references its canonical; the canonical references this base. Invoking
the deployed procedure loads all three.

The deployed tree mirrors the KCD tree exactly — a deployed file sits at the same relative
path under `procedures/` as its canonical does under `kcd/procedures/`.

---

## Naming

Every procedure declares a `Name` parameter in its canonical Parameters block — its single
canonical identifier. Lowercase, hyphen-separated (e.g. `heal-docs`).

| Reference | Derived value |
|---|---|
| Canonical file | `kcd/procedures/auditors/{Name}.md` |
| Deployed file | `procedures/auditors/{Name}.md` |
| Task tag | `#{Name}` |

---

## Requirements

A canonical auditor declares **requirements** — anything it needs that is not generic:

- **Input** — a project path, directory, or configuration value.

The canonical names no concrete path or value. The deployed copy solves every declared
requirement.

### Pre-flight

Before Phase 1, in order:

**1 — Deployment check.** Confirm a deployed copy exists at `procedures/auditors/{Name}.md`.
If absent, fail immediately:

```
FAILED — not deployed: no deployed copy at procedures/auditors/{Name}.md
```

**2 — Requirement resolution.** Resolve every declared requirement against the deployed
copy's solutions. If any requirement is unsolved or its solution is unreachable, fail
immediately:

```
FAILED — unmet requirement: {requirement-name} (input) — {what was expected}
```

Either failure stops the run. An auditor runs only when it is both deployed and fully
resolved.

---

## Output Conventions

- An auditor produces two reports: **Decisions** (items requiring human judgment) and
  **Repairs** (changes auto-applied to the tree).
- Both reports are **flush-and-fill** — destroyed and recreated on each run. Reports reflect
  current state only; no accumulated history.
- The `report-dir` requirement supplies the destination directory. The canonical declares
  report filenames; the deployed copy names the directory.
- Auto-repairs are applied in-place before the report is written — the Repairs report
  reflects what was already done.

---

## Trigger Model

Auditors are **Bryan-triggered** — they require judgment on findings. They do not run on a
cron schedule and are not invoked by the alignment runner. A Decisions entry is a prompt
for a human decision, not an automated fix.

---

## Habits

Every auditor invokes `run-report` as its final action — automatic, no per-procedure
declaration required.

| What | Where | Why |
|---|---|---|
| run-report | [run-report](../../habits/run-report.md) | Mandatory — fires after the procedure's final phase |
