---
type: index
status: active
updated: 2026-06-04
---

# Index — kcd/contracts

Human-in-the-loop session lifecycles. A contract describes how a human-in-session and Claude
collaborate on a recurring kind of work — plan authoring, lens deployment, and so on. Contracts
differ from pipelines (automated, no human gate) and from habits (atomic single-step reflexes):
a contract is a multi-phase lifecycle *with* a human in the loop.

A contract's `scope:` declares where it is wired: `universal` (referenced from `_lens_base`,
loaded every session) or `lens:{name}` (referenced from a single lens's Know block).

## Universal

| What | Where | Why |
|---|---|---|
| Plan | [plan](_Claude/kcd/contracts/plan.md) | Lifecycle and format for every plan — write, promote, retire |

## Lens-scoped

| What | Where | Why |
|---|---|---|
| Deploy lens | [deploy-lens](_Claude/kcd/contracts/deploy-lens.md) | `lens:lens_crafter` — copy a lens from `kcd/lenses/` into `_Claude/lenses/` and activate it |
