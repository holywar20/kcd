---
type: index
status: active
updated: 2026-06-04
---

# Index — kcd/lenses

Know+Care personalities. `_lens_base` is auto-loaded into every session; deployable lenses are
copied into `_Claude/lenses/` and activated via the deploy-lens contract, then invoked by command.

## Base (auto-loaded)

| What | Where | Why |
|---|---|---|
| lens base | [lens base](_Claude/kcd/lenses/_lens_base.md) | Global Know+Care+Do every lens inherits — auto-loaded, carries no command |

## Deployable lenses

| What | Where | Why | Command |
|---|---|---|---|
| lens crafter | [lens_crafter](_Claude/kcd/lenses/lens_crafter/lens_crafter.md) | Authoring and deploying KCD artifacts — the framework's own builder lens | `!lens_crafter` |
