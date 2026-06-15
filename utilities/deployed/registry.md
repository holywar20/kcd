---
type: registry
status: active
updated: 2026-06-11
---

# Utilities — Registry (canonical)

The allowlist of framework-shipped, approved utilities — packaged with the framework so every
project that deploys kcd inherits them. A tool runs only if it is listed here **and** lives in
[deployed/](_Claude/kcd/utilities/deployed/). Utilities still in development wait in
[draft/](_Claude/kcd/utilities/draft/).

On deploy this registry is copied to the instance (`_Claude/utilities/deployed/registry.md`), where
a project adds its own utilities. Content-addressing (hash + invalidate-on-change + re-approval) is
**deferred** — see *Still evolving → Utility tier* in [kcd_framework](_Claude/kcd/kcd_framework.md).

| Utility | File | What | Approved |
|---|---|---|---|
| auto-repair | [auto-repair](_Claude/kcd/utilities/deployed/auto-repair.js) | Runs the repair-docs pipeline end-to-end — detect structural drift, then apply the mechanical fixes. Currently a reporting stub. | 2026-06-11 |
