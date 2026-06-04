---
type: index
status: active
updated: 2026-06-04
---

# Index — kcd

The canonical KCD library — the locked factory-reset seed. Everything here ships `disabled` and
deploys by copy; agents reference their deployed copies, never this tree.

## Framework

| What | Where | Why |
|---|---|---|
| KCD framework | [kcd_framework](_Claude/kcd/kcd_framework.md) | The core idea — Know/Care/Do, the agent model, pipelines, principles, conventions |
| Deployed structure | [deployment_schema](_Claude/kcd/docs/deployment_schema.canvas) | **The authoritative structure lock** — the deployed `_Claude/` tree, hand-drawn + machine-checkable |

## Agents & orchestration

| What | Where | Why |
|---|---|---|
| Lenses | [lenses](_Claude/kcd/lenses/index.md) | Know+Care personalities — the base every lens inherits plus deployable seed lenses |
| Analysts | [analysts](_Claude/kcd/analysts/index.md) | Judgment agents — read broadly, interpret, emit manifests + reports |
| Generators | [generators](_Claude/kcd/generators/index.md) | Mechanical agents — execute a manifest with broad write, no judgment |
| Pipelines | [pipelines](_Claude/kcd/pipelines/index.md) | Declarative recipes orchestrating agents, fully automated (no human gate) |
| Utilities | [utilities](_Claude/kcd/utilities/index.md) | The registered tool tier — shared scripts the human runs and agents call; gated `draft/`→`deployed/` (deferred) |

## Building blocks

| What | Where | Why |
|---|---|---|
| Habits | [habits](_Claude/kcd/habits/index.md) | Atomic single-step reflexes inherited by lenses |
| Contracts | [contracts](_Claude/kcd/contracts/index.md) | Human-in-the-loop session lifecycles |
| Docs | [docs](_Claude/kcd/docs/index.md) | Framework reference — lens anatomy, agent types, frontmatter schema, reference categories |
| Templates | [templates](_Claude/kcd/templates/index.md) | Scaffolds for authoring each artifact type |
