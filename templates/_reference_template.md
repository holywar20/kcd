---
type: template
status:
---

# Reference (template)

A **reference** is a pointer to a living artifact: *where it lives*, *how to use it*, and
*its current state*. Use one when the knowledge is not derivable from code — you need to know
something *exists*, where to find it, and how to invoke or extend it.

> **Frontmatter for the authored reference** (replaces this template's frontmatter):
> - `type: reference`
> - `status: active`
> - `name: kebab-slug`
> - `description: "one line: what it points to and why it matters"`
> - `updated: YYYY-MM-DD` — the at-a-glance staleness signal; set on every create/regenerate

*Every reference — hand-authored or generated — carries this shape. References live in
`_Claude/references/{category}/{name}.md` only; they do not travel.*

---

## When to create a reference

Create one for any artifact that:
- has a **canonical location** (path, URL, or directory),
- has an **interface** (a command, endpoint, or procedure to invoke it),
- has a **status** that changes over time and is worth tracking.

Do not create a reference for conventions, rules, or facts about the codebase — those belong
in `style_guides/`, `patterns/`, or `domain/` category files.

---

## Shape

File goes in `_Claude/references/{category}/{name}.md`.

```markdown
---
type: reference
status: active
name: kebab-case-slug
description: "One line: what it points to and why it matters"
updated: YYYY-MM-DD
---

One sentence: what this artifact is and its purpose.

**Location:** `path/or/url` — brief note on what lives there.
**Interface:** how to invoke or use it — command, endpoint, or procedure.
**Conventions:** *(optional)* non-obvious rules for working with it.
**Status (YYYY-MM-DD):** current state — what is complete, what is pending.
```

---

## Rules

- **Location is always explicit** — vault-root path or URL, never implied.
- **Interface before conventions** — how to use it comes before how it works.
- **Status carries a date** — so staleness is visible at a glance.
- **`updated` is mandatory** — set whenever the reference is created or regenerated. It is the
  at-a-glance staleness signal for agents and humans.
- **Status in the body, not the description** — the description is a stable hook; status changes.
- **Navigational, not behavioral** — no Why / How-to-apply structure (that belongs to feedback
  and project memories).

---

## Example (filled)

```markdown
---
type: reference
status: active
name: postman-collections
description: "Postman collections for the ad-tech-planning API — locations, conventions, and generator"
updated: 2026-05-20
---

Postman collections for the ad-tech-planning API.

**Location:** `_Claude/logs/postman/` — one file per controller, named after the controller class.
**Interface:** `#generate-postman` — invoke with a controller name to generate or regenerate a collection.
**Conventions:** collection-level Bearer `{{AuthToken}}`; one sibling request per meaningfully different input.
**Status (2026-05-20):** `CampaignsController` complete (5 routes, 7 items). Other controllers pending.
```
