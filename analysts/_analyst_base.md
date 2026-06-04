---
type: analyst
status: disabled
---

# _analyst_base

*Base for all Analyst procedures. Every canonical analyst references this file the way a lens
references [`_lens_base`](_Claude/kcd/lenses/_lens_base.md). It carries the rules shared by all
analysts so individual procedures never repeat them. Ships `disabled` here in `kcd/analysts/`;
deployment activates the deployed copy.*

---

## The analyst role

An analyst is the **judgment** half of the agent model. It **reads anywhere** — source,
references, and generator output (`audits/`) — and writes **report-only**: to `reports/` and
nowhere else (typically one report, a small number when the work splits cleanly). It moves
across the codebase, interprets, ranks, and surfaces opportunities. When it finds work that can
be made mechanical, it does not do that work itself — it **composes a manifest and hands it to
a generator.**

This is the forcing function the two-agent model runs on: being *required* to emit a manifest a
generator can execute **without further judgment** forces the analyst to resolve every
consequence in advance (see [kcd_framework](_Claude/kcd/kcd_framework.md) and the composing-side
rule in [`_lens_base`](_Claude/kcd/lenses/_lens_base.md)).

**Blast-radius invariant in force.** An analyst has judgment and a lens, so it gets the
**narrowest** write authority — report-only. It may read the whole tree; it may not modify it.
High autonomy ⇒ narrow write.

| Analyst does | Analyst does not |
|---|---|
| Read anywhere — source, references, `audits/` | Modify source or any canonical path |
| Interpret, rank, surface opportunities | Apply fixes — that is a generator's or a human's job |
| Compose self-contained manifests for handoff | Hand off a loose brief — a manifest resolves every consequence |
| Write reports only — to `reports/` | Write to source or any canonical path |

---

## Lens composition

Every analyst declares a `lens:` in its frontmatter — the lens it composes with. Loading that
lens gives the analyst its judgment and personality. This is what lets an analyst run **cold /
unsupervised**: a sub-agent is just a lens run without a human in the loop (see
[kcd_framework](_Claude/kcd/kcd_framework.md)). The declared lens is loaded at invocation; the
analyst's own logic is its `Do`.

---

## Composition Model

An analyst is a folder plus this base:

| Layer | Location | Owns |
|---|---|---|
| `_analyst_base` | `_Claude/kcd/analysts/_analyst_base.md` | rules shared by all analysts (this file) |
| Canonical | `_Claude/kcd/analysts/{name}/{name}.md` | generic interpretation logic; **declares** requirements |
| Deployed | `_Claude/analysts/{name}/{name}.md` | full copy; **solves** requirements with project values |
| Context | `_Claude/kcd/analysts/{name}/context/` | context specific to this analyst |

The canonical declares requirements generically (no project values); the deployed copy is a
full self-contained copy that solves them. The deployed tree mirrors the canonical family
layout — a deployed analyst sits at `_Claude/analysts/{name}/` exactly as its canonical sits at
`_Claude/kcd/analysts/{name}/`.

---

## Naming

Every analyst declares a `name` — its single canonical identifier. Lowercase,
hyphen-separated, verb-led (e.g. `analyze-controllers`). Identity derives from it; an agent
never invents a name. Where a string needs the analyst's identity, it uses `{name}` exactly:

| Reference | Derived value |
|---|---|
| Canonical file | `_Claude/kcd/analysts/{name}/{name}.md` |
| Deployed file | `_Claude/analysts/{name}/{name}.md` |
| Task tag | `#{name}` |
| Report output | `_Claude/reports/{name}.md` |
| Test-mode output | `_Claude/audits/{name}.md` |

---

## Requirements

A canonical analyst declares **requirements** — the inputs it reads (a source directory, a
glob, a config value, an upstream `audits/` file). The canonical names no concrete path or
value; the deployed copy solves every declared requirement.

### Pre-flight

Before Phase 1, in order:

**1 — Deployment check.** Confirm a deployed copy exists at `_Claude/analysts/{name}/{name}.md`.
If absent, fail immediately:

```
FAILED — not deployed: no deployed copy at _Claude/analysts/{name}/{name}.md
```

**2 — Requirement resolution.** Resolve every declared requirement against the deployed copy's
solutions. If a *required* input is unsolved or unreachable, fail immediately:

```
FAILED — unmet requirement: {requirement-name} (input) — {what was expected}
```

A *missing optional input* is not a failure — the analyst notes it in the report and proceeds.
Pre-flight checks that required inputs are declared and resolvable, not that every optional
source currently exists.

---

## Output Conventions

- An analyst writes **report-only** — typically a single report at `_Claude/reports/{name}.md`,
  a small number under `reports/` when the work splits cleanly. Flush-and-fill — destroyed and
  recreated on each run; reports reflect current state only, no accumulated history.
- The report's actionable core is the **manifest**: for each opportunity worth acting on, a
  self-contained, paste-ready spec a generator (or a human) can execute **without further
  judgment** — every consequence resolved. A manifest that says "see the report above" is
  broken.
- Recommended shape: a brief **Summary**, then **Findings / Opportunities** ordered by
  priority, each carrying its manifest where actionable. Severity ranking applies to
  defect-finding work; it is not mandatory for opportunity-surfacing work.

---

## Trigger Model

Analysts are **agent-native**: they run cold and unattended — on a schedule, inside a pipeline,
or dispatched as a sub-agent — and do not require a human in the loop. An analyst that surfaces
something needing a human decision still emits the manifest; the human reads the report and
acts on it. The analyst does not block or wait.

---

## Model Convention

Analysts run on `claude-sonnet-4-6` by default — interpretation, ranking, and manifest
synthesis are quality-sensitive, and judgment is the whole point. Override only with a
justifying comment in the canonical frontmatter.

---

## Modifiers

A **modifier** is a declarative, `--`-prefixed invocation mode that mutates a run's behavior or
scope. Every modifier is **globally unique** across the entire document base and **registered**
in the **Modifier Registry** (currently a `What | Where | Why` block in `CLAUDE.md` — a
temporary home). A modifier may be omitted; absent any, the analyst runs its default (full)
behavior. An unknown modifier fails the run:

```
FAILED — unknown modifier: {modifier}
```

An analyst declares its own modifiers in its canonical `## Modifiers` slot; each must be
registered. Duplicate or unregistered modifiers are a drift signal, caught on the next
structural audit. Modifiers defined in this base are **inherited** by every analyst and
registered once.

**`--test`** — the universal analyst modifier, defined here and inherited by every analyst. Under
`--test`, output is redirected to `_Claude/audits/{name}.md` — the analyst's normal report is
never touched. Every phase runs identically; only the destination changes. The run creates
`_Claude/audits/` if absent. Flush-and-fill.

---

## Habits

Every analyst invokes `run-report` as its final action — automatic, no per-analyst declaration
required.

| What | Where | Why |
|---|---|---|
| run-report | [run-report](_Claude/kcd/habits/run-report.md) | mandatory — fires after the analyst's final phase |
