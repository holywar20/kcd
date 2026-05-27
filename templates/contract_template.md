---
Status: Active
Role: Contract
Scope: universal
---

# {Contract Name} — Contract

> *One-line purpose: the behavior pattern this contract codifies.*

---

## When

The triggers that activate this contract — tag phrases, situations, lens activations, user intents. A session reading the contract should be able to tell when it applies.

---

## Artifact Format

*Omit this section for purely behavioral contracts that produce no artifact.*

The shape of whatever this contract produces (a plan file, a memory entry, a debug log). Includes mandatory frontmatter, body sections (in order), and any naming conventions. Reference a template under `kcd/templates/` when the working scaffold lives there.

---

## Lifecycle

The phases this contract walks through. Each phase carries three labelled lines:
- **Trigger:** what initiates the phase.
- **Together:** what the session and user do collaboratively, and where the work lands.
- **Standard:** what "done well" looks like for this phase.

A contract with a single phase still uses the structure — clarity beats compactness.

### Phase 1 — {Name}

**Trigger:** ...

**Together:** ...

**Standard:** ...

### Phase 2 — {Name}

**Trigger:** ...

**Together:** ...

**Standard:** ...

---

## Standards

The quality bar. What separates a good instance from a poor one. Hard gates (the contract must not advance past these) are called out explicitly.

---

## Edge Cases

*Optional but recommended.*

How to handle ambiguity, surprise, or decision points the standard lifecycle does not cover. One bullet per case; surface to the user when the contract cannot decide alone.

---

## Scope Values

- `universal` — referenced from `_base`; loaded into every session.
- `lens:{lens-name}` — referenced from a single lens's Know block; loaded when that lens activates.
- `persona:{persona-name}` — referenced from a persona-style lens (e.g. `!novice`, `!teaching`); loaded as a behavioral overlay.

The `Scope:` frontmatter field declares one of the above. Contracts are loose — heal-docs does not chain-conform them; the Scope field is self-documenting for human readers.
