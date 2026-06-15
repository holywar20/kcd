---
type: index
status: active
updated: 2026-06-11
---

# Index — kcd/utilities

The registered **tool tier** — executable **code files** (`.js`) the human runs from a terminal, an
agent calls in-session, and (eventually) the interface triggers as a button. Same mental bucket as
MCP tools. Utilities have **no base/template/instance pattern** — the tier is one service that
registers many tools, not a family with a shared base.

Tools are **packaged with the framework** — they ship in canonical so every project that deploys kcd
inherits them. The tier is **folder-gated**, and the convention is identical in canonical and in a
deployed instance (per [deployment_schema](_Claude/kcd/docs/deployment_schema.canvas)):

| What | Where | Why |
|---|---|---|
| draft | `_Claude/kcd/utilities/draft/` | utilities still **in development** — not yet approved to run |
| deployed | `_Claude/kcd/utilities/deployed/` | **approved, runnable** tools (`{name}.js`), shipped with the framework |
| registry | `_Claude/kcd/utilities/deployed/registry.md` | the allowlist — a tool runs only if listed there |

Each tool is a single `.js` file carrying its metadata in **comment-frontmatter**: a `/*--- … ---*/`
block parsed exactly like Markdown frontmatter. On deploy, `deployed/` and its registry are copied
to the instance, where a project adds its own utilities (drop a `.js` in `draft/`, promote when ready).

## Shipped

| What | Where | Why |
|---|---|---|
| auto-repair | [auto-repair](_Claude/kcd/utilities/deployed/auto-repair.js) | Tool #1 — runs the repair-docs pipeline end-to-end. Sets the utility shape (code file + comment-frontmatter). |

**Deferred:** the **signaling model** (how a call is dispatched and its result returned) and the
**security model** (content-address hash + invalidate-on-change + re-approval, per-utility capability
scope) — tracked under *Still evolving → Utility tier* in [kcd_framework](_Claude/kcd/kcd_framework.md).
