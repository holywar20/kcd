---
type: index
status: active
updated: 2026-06-04
---

# Index — kcd/analyzers

Judgment agents — they read broadly, interpret, and emit manifests + reports; they never write
to source. Each carries a lens and runs cold.

## Base

| What | Where | Why |
|---|---|---|
| analyzer base | [analyzer base](_Claude/kcd/analyzers/_analyzer_base.md) | Shared analyzer rules — reads anywhere, report-only, manifests-to-generators, carries a lens |

## Analyzers

| What | Where | Why |
|---|---|---|
| audit-structure | [audit-structure](_Claude/kcd/analyzers/audit-structure/audit-structure.md) | Mechanical drift detection — emits a repair manifest + a decisions report (the `repair-docs` detect stage) |
| audit-consistency | [audit-consistency](_Claude/kcd/analyzers/audit-consistency/audit-consistency.md) | Interpretive doc-tree audit — redundancy, cross-lens conflict, stale todos, broken refs, orphans |
