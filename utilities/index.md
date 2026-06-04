---
type: index
status: active
updated: 2026-06-04
---

# Index — kcd/utilities

The registered **tool tier** — a single shared API surface (same mental bucket as MCP tools)
the human runs from a terminal, an agent calls in-session, and an analyst hands a generator.
Unlike the agent families, utilities have **no base/template/instance pattern**: the tier is one
service that registers many tools, not a family with a shared base.

In a deployed tree the tier is gated by a folder boundary (see the
[deployment_schema](_Claude/kcd/docs/deployment_schema.canvas)):

| What | Where | Why |
|---|---|---|
| draft | `_Claude/utilities/draft/` | Agent- or human-proposed tools — **not yet runnable** |
| deployed | `_Claude/utilities/deployed/` | **Human-approved, runnable** tools |
| registry | `_Claude/utilities/deployed/registry.md` | The allowlist record — content-addressed (design pending) |

**Status: deferred pending architecture.** No tools ship in the canonical library yet; the tier
builds once Starmind can host it. Open pieces — signaling (how a call is dispatched and its
result returned) and the security model (hash + invalidate-on-change + re-approval, per-utility
capability scope) — are tracked under *Still evolving → Utility tier* in
[kcd_framework](_Claude/kcd/kcd_framework.md).
