---
type: reference
status: disabled
name: routing-chart
description: "Structural classification policy — zones + finding-resolution — that audit-structure uses to split findings into the repair manifest vs the decisions report."
updated: 2026-06-03
---

# Routing Chart

The policy `audit-structure` loads as a Know. It is deliberately **simple**: the *zone* a file
sits in decides whether fixes may be applied; the *finding* decides whether a fix is obvious
enough to apply. Aggressively auto-healing the deployed tree (especially link-drift) is the whole
point — that drift is the dominant pain during documentation composition.

---

## Zones (by location — first match wins)

| Zone | Pattern | Policy |
|---|---|---|
| **Excluded** | `{work-exclude}/**`, `reports/**`, `audits/**` | Skip entirely — fluid workbench and generated output. |
| **Canonical** | `kcd/**` | **Health-check only.** Run every check, but **every finding → decisions report**; *nothing in `kcd/` is ever repaired.* (How canonical is defended is deferred; for now, look-don't-touch.) |
| **Deployed** | everything else | **Auto-heal.** Apply the resolution below — fixes go to the repair manifest. |

`kcd/` being canonical is the one location rule that matters. Identity is by location (the
CSS-cascade model) — a file does not declare its own classification.

---

## Resolution (per finding)

In the **deployed** zone, each finding resolves to **manifest** (auto-repair) or **decisions**
(flag) by whether the fix is unambiguous:

| Finding | Resolves to |
|---|---|
| Broken link, **single obvious target** (one stem match) | **manifest** — rewrite it |
| Broken link, **ambiguous** (zero or multiple candidates — not obvious where it should point) | **decisions** — flag for a human |
| Index drift (row for a missing file, file with no row, folder missing its `index.md`) | **manifest** — mechanical index repair |
| Log entry older than `{log-max-age}` | **manifest** — prune |
| Frontmatter cascade gap (a template field missing on an instance) | **manifest** — copy from the type's template (`kcd:` exempt; see schema) |
| Semantic / judgment (redundancy, scope drift, missing-reference brainstorm) | **not audit-structure** → `audit-consistency` |

In the **canonical** zone, the *same checks run* but every finding routes to **decisions** — it's
a health report, never a repair.

**Link repair is always safe** regardless of file type: it fixes a path, never prose or Care
content. So a resolvable broken link in a lens's Know table auto-repairs just like one anywhere
else — the only gate is *is the target obvious*, not *what kind of file is this*.

---

## Frontmatter cascade is checked against the schema, not a chart

The old heal-docs "Chains" fold into the frontmatter schema. Cascade conformance = *check an
instance's frontmatter against its type's template* per
[frontmatter_schema](_Claude/kcd/docs/frontmatter_schema.md) (the template is the type's schema;
the `kcd:` block is exempt). There is no standalone chains artifact.
