---
type: index
status: active
updated: 2026-06-04
---

# Index — kcd/analysts

Judgment agents — they read broadly, interpret, and emit manifests + reports; they never write
to source. Each carries a lens and runs cold.

## Base

| What | Where | Why |
|---|---|---|
| analyst base | [analyst base](_Claude/kcd/analysts/_analyst_base.md) | Shared analyst rules — reads anywhere, report-only, manifests-to-generators, carries a lens |

## Analysts

| What | Where | Why |
|---|---|---|
| audit-structure | [audit-structure](_Claude/kcd/analysts/audit-structure/audit-structure.md) | Mechanical drift detection — emits a repair manifest + a decisions report (the `repair-docs` detect stage) |
| audit-consistency | [audit-consistency](_Claude/kcd/analysts/audit-consistency/audit-consistency.md) | Interpretive doc-tree audit — redundancy, cross-lens conflict, stale todos, broken refs, orphans |
