---
Status: Active
Role: Generator base
---

# _generator_base

*Base document for all Generator procedures. Every canonical generator references this file the way a lens references `_base`. It carries the rules shared by all generators so individual procedures never repeat them.*

---

## Composition Model

A generator exists as two files plus this base:

| Layer | Location | Owns |
|---|---|---|
| `_generator_base` | `kcd/procedures/generators/_generator_base.md` | Rules shared by all generators (this file) |
| Canonical | `kcd/procedures/generators/{name}.md` | Generic logic; **declares** requirements |
| Deployed | `procedures/generators/{name}.md` | **Solves** requirements with project-specific values |

The deployed copy references its canonical; the canonical references this base. Invoking the deployed procedure loads all three.

The deployed tree mirrors the KCD tree exactly — a deployed file sits at the same relative path under `procedures/` as its canonical does under `kcd/procedures/`.

---

## Naming

Every procedure declares a `Name` parameter in its canonical Parameters block — its single canonical identifier. Lowercase, hyphen-separated, verb-led (e.g. `generate-swagger`).

`Name` is the one source of the procedure's identity. It is never retyped freely — every other reference derives from it:

| Reference | Derived value |
|---|---|
| Canonical file | `kcd/procedures/generators/{Name}.md` |
| Deployed file | `procedures/generators/{Name}.md` |
| Task tag | `#{Name}` |
| Test-mode output | `_Claude/automation/tests/procedures/{Name}.md` |

An agent must never invent a name for a procedure or its artifacts. Where a string needs the procedure's identity, it uses `{Name}` exactly.

---

## Requirements

A canonical generator declares **requirements** — anything it needs that is not generic. Two kinds:

- **Tooling** — an external executable or library (a compiler, a linter, an SDK).
- **Input** — a project file path, glob, or configuration value (a source directory, a schema version).

The canonical copy declares each requirement by name and description. It never names a concrete path or value. The deployed copy solves every declared requirement.

### Pre-flight

Before Phase 1, in order:

**1 — Deployment check.** Confirm a deployed copy exists at the mirrored path `procedures/generators/{Name}.md`. If it is absent, the procedure fails immediately:

```
FAILED — not deployed: no deployed copy at procedures/generators/{Name}.md
```

**2 — Requirement resolution.** Resolve every declared requirement against the deployed copy's solutions. If any requirement is unsolved, or its solution is unreachable (missing file, missing executable), the procedure fails immediately:

```
FAILED — unmet requirement: {requirement-name} ({tooling|input}) — {what was expected}
```

Either failure stops the run — no audit, no report, no partial output. A pipeline procedure runs only when it is both deployed and fully resolved.

---

## Output Conventions

- A generator builds an artifact and writes it to the artifact's real home — a reference into `references/`, a test into the test tree, and so on. Placing artifacts where they belong is the generator's purpose; writing to canonical project locations is expected, not a violation. There is no single default output folder — the `Output` parameter declares the destination.
- Output is flush-and-fill — destroy and recreate on each run. The procedure is durable; its output is not.

## Reference Wiring

When a generator's artifact is a **reference** — a document meant to be loaded by sessions — two rules apply:

- The reference follows the reference template ([`kcd/templates/reference_template.md`](../../templates/reference_template.md)) — front matter included, with `Last Update` set to the run date.
- The procedure's task list includes wiring it into the Know table of every appropriate lens: a `What | Where | Why` row pointing to the reference, added if missing or corrected if stale. A reference no lens knows about is dead weight. The deployed copy names which lenses are appropriate (an Input requirement); the canonical declares the wiring step generically.

---

## Flags

Flags modify a run's behavior or scope. Every flag is `--`-prefixed, **globally unique** across the entire document base, and **registered** in the project's master procedure index (its Flag Registry). A flag may be omitted on invocation; absent any flag, the procedure runs its default (full) behavior. An unknown flag fails the run:

```
FAILED — unknown flag: {flag}
```

A generator declares its own flags in its canonical `## Flags` slot; each must be registered. Duplicate or unregistered flags are caught by `#heal-docs`. Flags defined in this base are **inherited** by every generator and registered once — a procedure does not redeclare them.

**`--test`** — the universal generator flag, defined here and inherited by every generator. Under `--test`, output is redirected to `_Claude/automation/tests/procedures/{Name}.md` — the procedure's normal `Output` file is never touched. Every phase runs identically; only the destination changes. The procedure creates `automation/tests/procedures/` if absent. Flush-and-fill. Reference wiring is also skipped under `--test` — a test run produces only the test artifact.

---

## Habits

Every generator invokes `run-report` as its final action — automatic, no per-procedure
declaration required.

| What | Where | Why |
|---|---|---|
| run-report | [run-report](../../habits/run-report.md) | Mandatory — fires after the procedure's final phase |
