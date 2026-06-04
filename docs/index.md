---
type: index
status: active
updated: 2026-06-04
---

# Index — kcd/docs

Framework reference documentation. Load when building or reviewing agents, lenses, or the
structure itself.

| What | Where | Why |
|---|---|---|
| Deployed structure (canvas) | [deployment_schema](_Claude/kcd/docs/deployment_schema.canvas) | **The authoritative structure lock** — every folder/file in a deployed `_Claude/` tree; hand-drawn, readable from JSON, machine-checkable (rectangle = folder, parallelogram = file) |
| Lens anatomy | [lens_anatomy](_Claude/kcd/docs/lens_anatomy.md) | Structural reference for the lens file format — Know/Care/Do blocks, Care forms, stacking rules |
| Agent types | [agent_types](_Claude/kcd/docs/agent_types.md) | The two AI agents (Generator, Analyst) + the Utility tool-tier — model, context depth, output, boundaries |
| Frontmatter schema | [frontmatter_schema](_Claude/kcd/docs/frontmatter_schema.md) | Per-type frontmatter shapes (template-is-schema) plus the universal `type`/`status` fields and the `kcd:` escape hatch |
| Reference categories | [reference_categories](_Claude/kcd/docs/reference_categories.md) | The `references/` category scheme and the references-vs-`kcd/` boundary — where a fact lives |
