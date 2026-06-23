---
type: pipeline
status: composed
---

# _pipeline_base

*Base for all Pipelines. A pipeline references this file the way a generator references
[`_generator_base`](_Claude/kcd/generators/_generator_base.md). It carries the rules shared by
all pipelines so individual recipes never repeat them. Carries `status: composed` — it is live in
place and read directly from `kcd/pipelines/`; it is never deployed and never run standalone (it is
composed into every canonical pipeline).*

---

## What a pipeline is

A pipeline is a **declarative recipe** that orchestrates other agents — analyzers, generators, and
**other pipelines** — into an ordered, **fully automated** run. It is the only primitive that
*composes* other agents.

- **No human gate.** A process that needs a human in the loop is a **contract**, not a pipeline.
  Where a pipeline surfaces something for a human (e.g. a decisions report), it does so as an
  **output** the human reads out-of-band — never as a blocking stage.
- **Wiring, not reasoning.** A pipeline declares stages and how each stage's output feeds the
  next stage's input. It carries **no `model:`** — its stages carry their own. A deterministic
  **runner** executes it. *(The runner is deferred, like the runtime; this defines the recipe
  shape, not its execution engine.)*
- **Pipes include pipes.** A stage may invoke another pipeline. One level of nesting is the norm;
  deep nesting is discouraged — pipelines are big things.

---

## Composition Model

A pipeline is a folder plus this base:

| Layer | Location | Owns |
|---|---|---|
| `_pipeline_base` | `_Claude/kcd/pipelines/_pipeline_base.md` | rules shared by all pipelines (this file) |
| Canonical | `_Claude/kcd/pipelines/{name}/{name}.md` | the generic recipe; **declares** requirements |
| Deployed | `_Claude/pipelines/{name}/{name}.md` | full copy; **solves** requirements with project values |
| Context | `_Claude/kcd/pipelines/{name}/context/` | context specific to this pipeline |

The deployed tree mirrors the canonical family layout. `pipelines/` is **flat** — no
sub-grouping.

---

## Naming

Verb-first, from the canonical vocabulary (`generate` / `audit` / `apply` / `merge` / …). A
pipeline's verb names its overall function (e.g. `repair-docs`). Identity derives from the
folder/file name; where a string needs the pipeline's identity it uses `{name}` exactly, and the
task tag is `#{name}`.

---

## Stages

The body of a pipeline is its **Stages** table — an ordered list. Each stage invokes one agent
(analyzer or generator) or another pipeline, and declares how it wires in:

| # | Stage | Invokes | Type | Input | Output | Run if |
|---|---|---|---|---|---|---|
| 1 | {label} | `{name}` | analyzer \| generator \| pipeline | {source / a prior stage's output} | {where it writes} | {condition — default: always} |

Rules:
- **Order is execution order.** Stage N+1 may consume stage N's output — name it in `Input`.
- **`Run if`** gates a stage on a prior output (e.g. *manifest non-empty*). Default: always.
- **No human-gate stage exists** — see *What a pipeline is*. Decisions/reports a stage emits are
  outputs, not gates.
- A stage that invokes a **pipeline** follows the same rules, recursively.

---

## Requirements

A pipeline declares the requirements its stages collectively need (paths, config values) — the
inputs that aren't produced by an earlier stage. Declared generically here; solved in the
deployed copy.

### Pre-flight

Before stage 1, in order:

**1 — Deployment check.** Confirm a deployed copy exists at `_Claude/pipelines/{name}/{name}.md`.

**2 — Stage resolution.** Every invoked agent or pipeline is deployed and resolvable.

**3 — Requirement resolution.** Every declared requirement is solved and reachable.

```
FAILED — not deployed: {what}
FAILED — unresolved stage: {invoked-name}
FAILED — unmet requirement: {requirement-name} — {what was expected}
```

Any failure stops the run before stage 1.

---

## Output & failure

- A pipeline writes **no artifact of its own** beyond a **run summary** at
  `_Claude/audits/{name}-run.md` — which stages ran, each stage's outcome, and where it stopped
  if it did. The substantive outputs are the stages' own (a manifest, a report, an applied repair).
- **Failure halts the pipeline** at the failing stage. Completed stages' outputs persist; the run
  summary records the stop point. No partial-stage rollback.

