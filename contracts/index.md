# Contracts — Index

*Behavioral and lifecycle agreements for session work. A contract describes how a human-in-session and Claude collaborate on a recurring kind of work — plan authoring, debug runs, reference writing, and so on.*

Contracts differ from procedures: procedures are agent-run unattended; contracts are session-collaborative. They differ from habits: habits are atomic single-step reflexes; contracts are multi-phase lifecycles.

A contract's `Scope:` frontmatter declares where it is wired:
- `universal` — referenced from `_base`; loaded every session.
- `lens:{name}` — referenced from a single lens's Know block.
- `persona:{name}` — referenced from a persona-style lens as a behavioral overlay.

---

## Universal

| Contract | Covers |
|---|---|
| [plan](plan.md) | Lifecycle and format for every plan in the project — write, promote, retire |

## Lens-Scoped

*None yet.*

## Persona

*None yet.*
