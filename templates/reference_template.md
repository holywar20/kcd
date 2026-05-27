---
type: template
for: reference
Last Update:
---

# Reference Template

A **reference** is a pointer to a living artifact. It answers three questions:
*where does this live*, *how do I use it*, and *what is its current state*.

Use a reference when the knowledge is not derivable from the code — it requires knowing
that something *exists*, where to find it, and how to invoke or extend it.

**This template is the standard for every reference in the project — hand-authored or
generated. All references carry this front matter, including `Last Update`. Any procedure
that builds a reference produces it in this shape.**

---

## When to create a reference

Create a reference for any artifact that:
- Has a **canonical location** (path, URL, or directory)
- Has an **interface** (a skill name, command, endpoint, or procedure to invoke it)
- Has a **status** that changes over time and is worth tracking

Do not create a reference for conventions, rules, or facts about the codebase — those
belong in `style_guides/`, `patterns/`, or `domain/` category files.

---

## Template

Copy the block below. File goes in `references/{category}/{name}.md`. For memory
references, file goes in the project memory directory as `reference_{name}.md`.

```markdown
---
name: kebab-case-slug
description: "One line: what it points to and why it matters"
Last Update: YYYY-MM-DD
metadata:
  type: reference
---

One sentence: what this artifact is and its purpose.

**Location:** `path/or/url` — brief note on what lives there.

**Interface:** How to invoke or use it — skill name, command, endpoint, or procedure.

**Conventions:** *(optional)* Non-obvious rules for working with it.

**Status (YYYY-MM-DD):** Current state — what is complete, what is pending.
```

---

## Rules

- **Location is always explicit** — absolute path from project root or URL, never implied.
- **Interface before conventions** — how to use it comes before how it works.
- **Status carries a date** — so staleness is visible at a glance.
- **`Last Update` is mandatory** — every reference carries it in front matter, set whenever the reference is created or regenerated. It is the at-a-glance staleness signal for agents and humans.
- **Status in the body, not the description** — the description is a stable hook; status changes.
- **No Why/How-to-apply structure** — that belongs to `feedback` and `project` memories.
  References are navigational, not behavioral.

---

## Example (filled)

```markdown
---
name: postman-collections
description: "Postman collection files for the ad-tech-planning API — locations, conventions, and generator skill"
Last Update: 2026-05-20
metadata:
  type: reference
---

Postman collections for the ad-tech-planning API.

**Location:** `_Claude/logs/postman/` — one file per controller, named after the controller class.

**Interface:** `#postman-generator` — invoke with a controller name to generate or regenerate a collection.

**Conventions:** Collection-level Bearer `{{AuthToken}}`; one sibling request per meaningfully different input variation.

**Status (2026-05-20):** `CampaignsController` complete (5 routes, 7 items). All other controllers pending.
```
