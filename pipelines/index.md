---
type: index
status: active
updated: 2026-06-04
---

# Index — kcd/pipelines

Declarative recipes that orchestrate agents (analysts, generators, and other pipelines) into
fully automated runs. No human gate — a process needing a human is a contract. Flat folder.

## Base

| What | Where | Why |
|---|---|---|
| pipeline base | [pipeline base](_Claude/kcd/pipelines/_pipeline_base.md) | Shared pipeline rules — declarative recipe, stage wiring, no human gate, no model, pipes nest |

## Pipelines

| What | Where | Why |
|---|---|---|
| repair-docs | [repair-docs](_Claude/kcd/pipelines/repair-docs/repair-docs.md) | Heal documentation drift — `audit-structure` (detect) → `apply-repairs` (apply); decisions report is the human-facing output |
