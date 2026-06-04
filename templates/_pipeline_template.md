---
type: template
status:   # the authored pipeline gets: active | disabled
---

# {name} — Pipeline (template)

*Scaffold for authoring a canonical pipeline — a declarative recipe that orchestrates analysts,
generators, and other pipelines, fully automated (no human gate). Copy to
`_Claude/kcd/pipelines/{name}/{name}.md` (a pipeline is a folder: the `.md` plus a `context/`).
Name is verb-first from the vocabulary (`generate`/`audit`/`apply`/`merge`/…). Fill every
placeholder and delete these scaffold notes.*

> **Frontmatter for the authored pipeline** (replaces this template's frontmatter):
> - `type: pipeline`
> - `status:` — `active` or `disabled`
> - `base: _pipeline_base`
> *(No `model:` — a pipeline is wiring, not reasoning; its stages carry their own models.)*

Base rules: [_pipeline_base](_Claude/kcd/pipelines/_pipeline_base.md) — composition model, stage
rules, pre-flight, output & failure, modifiers.

---

## Requirements

*The inputs the stages collectively need that aren't produced by an earlier stage. Declared
generically; solved in the deployed copy.*

| Name | Kind | Description |
|---|---|---|
| `{requirement-name}` | Input | {what it is, generically — no concrete path or value} |

---

## Stages

*Ordered execution. Each stage invokes one analyst, generator, or pipeline. Stage N+1 may consume
stage N's output (name it in `Input`). `Run if` gates a stage on a prior output (default:
always). No human-gate stage — reports a stage emits are outputs, not gates.*

| # | Stage | Invokes | Type | Input | Output | Run if |
|---|---|---|---|---|---|---|
| 1 | {label} | `{name}` | analyst \| generator \| pipeline | {source} | {where it writes} | always |
| 2 | {label} | `{name}` | analyst \| generator \| pipeline | {stage 1 output} | {where it writes} | {condition} |

---

## Modifiers

*Optional. `--`-prefixed, globally unique, registered in the Modifier Registry. Pass through to
stages or gate them. `--test` propagates to every stage that defines it. This slot may be empty.*

| Modifier | Effect |
|---|---|
| `--{modifier}` | {what it changes} |

---

## Output

*A pipeline writes only a run summary (`_Claude/audits/{name}-run.md`); the substantive outputs
are the stages' own. State them here for the reader.*

- Stage outputs: {list each stage's output artifact}
- Run summary: `_Claude/audits/{name}-run.md`
