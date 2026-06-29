---
type: analyzer
status: composed
---

# _analyzer_base

*Base for all Analyzer procedures. Every canonical analyzer references this file the way a lens
references [`_lens_base`](_Claude/kcd/lenses/_lens_base.md). It carries the rules shared by all
analyzers so individual procedures never repeat them. Carries `status: composed` — it is live in
place and read directly from `kcd/analyzers/`; it is never deployed and never run standalone (it is
composed into every canonical analyzer).*

---

## The analyzer role

An analyzer is the **judgment** half of the agent model. It **reads anywhere** — source,
references, and generator output (`audits/`) — and writes **report-only**: to `reports/` and
nowhere else (typically one report, a small number when the work splits cleanly). It moves
across the codebase, interprets, ranks, and surfaces opportunities. When it finds work that can
be made mechanical, it does not do that work itself — it **composes a manifest and hands it to
a generator.**

This is the forcing function the two-agent model runs on: being *required* to emit a manifest a
generator can execute **without further judgment** forces the analyzer to resolve every
consequence in advance (see [kcd_framework](_Claude/kcd/kcd_framework.md) and the composing-side
rule in [`_lens_base`](_Claude/kcd/lenses/_lens_base.md)).

**Blast-radius invariant in force.** An analyzer has judgment and a lens, so it gets the
**narrowest** write authority — report-only. It may read the whole tree; it may not modify it.
High autonomy ⇒ narrow write.

| Analyzer does | Analyzer does not |
|---|---|
| Read anywhere — source, references, `audits/` | Modify source or any canonical path |
| Interpret, rank, surface opportunities | Apply fixes — that is a generator's or a human's job |
| Compose self-contained manifests for handoff | Hand off a loose brief — a manifest resolves every consequence |
| Write reports only — to `reports/` | Write to source or any canonical path |

---

## Lens composition

Every analyzer declares a `lens:` in its frontmatter — the lens it composes with. Loading that
lens gives the analyzer its judgment and personality. This is what lets an analyzer run **cold /
unsupervised**: a sub-agent is just a lens run without a human in the loop (see
[kcd_framework](_Claude/kcd/kcd_framework.md)). The declared lens is loaded at invocation; the
analyzer's own logic is its `Do`.

---

## Composition Model

An analyzer is a folder plus this base:

| Layer | Location | Owns |
|---|---|---|
| `_analyzer_base` | `_Claude/kcd/analyzers/_analyzer_base.md` | rules shared by all analyzers (this file) |
| Canonical | `_Claude/kcd/analyzers/{name}/{name}.md` | generic interpretation logic; **declares** requirements |
| Deployed | `_Claude/analyzers/{name}/{name}.md` | full copy; **solves** requirements with project values |
| Context | `_Claude/kcd/analyzers/{name}/context/` | context specific to this analyzer |

The canonical declares requirements generically (no project values); the deployed copy is a
full self-contained copy that solves them. The deployed tree mirrors the canonical family
layout — a deployed analyzer sits at `_Claude/analyzers/{name}/` exactly as its canonical sits at
`_Claude/kcd/analyzers/{name}/`.

---

## Naming

Every analyzer declares a `name` — its single canonical identifier. Lowercase,
hyphen-separated, verb-led (e.g. `analyze-controllers`). Identity derives from it; an agent
never invents a name. Where a string needs the analyzer's identity, it uses `{name}` exactly:

| Reference | Derived value |
|---|---|
| Canonical file | `_Claude/kcd/analyzers/{name}/{name}.md` |
| Deployed file | `_Claude/analyzers/{name}/{name}.md` |
| Task tag | `#{name}` |
| Report output | `_Claude/reports/{name}.md` |
| Test-mode output | `_Claude/audits/{name}.md` |

---

## Parameters

An analyzer declares its **parameters** — the typed, user-set variables that tune a run, distinct
from `Requirements` (which name the inputs it reads). Each parameter is a triple:

- **Name** — a variable name (lowercase, the identifier the run reads).
- **Type** — one of the typed-field kinds: `text` · `number` · `toggle` · `select` · `url` · `path`.
- **Default** — the value used when the user sets nothing.

Declared as a table in the canonical instance (see the template). Prose / Markdown for now; this
migrates to a declarative HTML field set, so a deployed parameter becomes type-checked and
verifiable at author time (the same typed-field vocabulary the app's setting fields use).

Every analyzer carries these **default parameters** (a canonical instance adds its own rows below
them):

| Name | Type | Default | Description |
|---|---|---|---|
| `dry_run` | toggle | false | Plan only — make no writes |
| `max_passes` | number | 3 | Stop after this many passes |
| `output_label` | text |  | Optional label prefix for output |

---

## Requirements

A canonical analyzer declares **requirements** — the inputs it reads (a source directory, a
glob, a config value, an upstream `audits/` file). The canonical names no concrete path or
value; the deployed copy solves every declared requirement.

### Pre-flight

Before Phase 1, in order:

**1 — Deployment check.** Confirm a deployed copy exists at `_Claude/analyzers/{name}/{name}.md`.
If absent, fail immediately:

```
FAILED — not deployed: no deployed copy at _Claude/analyzers/{name}/{name}.md
```

**2 — Requirement resolution.** Resolve every declared requirement against the deployed copy's
solutions. If a *required* input is unsolved or unreachable, fail immediately:

```
FAILED — unmet requirement: {requirement-name} (input) — {what was expected}
```

A *missing optional input* is not a failure — the analyzer notes it in the report and proceeds.
Pre-flight checks that required inputs are declared and resolvable, not that every optional
source currently exists.

---

## Output Conventions

- An analyzer writes **report-only** — typically a single report at `_Claude/reports/{name}.md`,
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

Analyzers are **agent-native**: they run cold and unattended — on a schedule, inside a pipeline,
or dispatched as a sub-agent — and do not require a human in the loop. An analyzer that surfaces
something needing a human decision still emits the manifest; the human reads the report and
acts on it. The analyzer does not block or wait.

---

## Model Convention

Analyzers run on `claude-sonnet-4-6` by default — interpretation, ranking, and manifest
synthesis are quality-sensitive, and judgment is the whole point. Override only with a
justifying comment in the canonical frontmatter.

---

## Habits

Every analyzer invokes `run-report` as its final action — automatic, no per-analyzer declaration
required.

| What | Where | Why |
|---|---|---|
| run-report | [run-report](_Claude/kcd/habits/run-report.md) | mandatory — fires after the analyzer's final phase |
