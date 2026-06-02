---
Status: Active
Role: Utility base
---

# _utility_base

*Base document for all Utility procedures. Every utility canonical references this file the way a lens references `_base`. It carries the rules shared by all utilities so individual procedures never repeat them.*

---

## What a Utility Is

A **utility** is a session-facing readout. It reads existing KCD structure (indexes, lens files, references) and **prints a formatted result to the session**. It produces no artifact, writes no file, and modifies nothing.

Utility is a procedure *category*, not a fourth agent type. The three agent types — Investigator, Analyst, Generator (see [agent_types](../../docs/agent_types.md)) — each spawn an agent to produce an artifact. A utility does neither: it runs **inline in the active session** under the active lens, and its only output is text printed back to the user.

| Utility does | Utility does not |
|---|---|
| Read existing KCD structure | Crawl source code |
| Print a formatted readout to the session | Write or modify any file |
| Run inline in the active session | Spawn a sub-agent |
| Report current state from the indexes | Invent entries the indexes don't contain |

---

## Composition Model

A utility is **portable-only by default**:

| Layer | Location | Owns |
|---|---|---|
| `_utility_base` | `kcd/procedures/utility/_utility_base.md` | Rules shared by all utilities (this file) |
| Canonical | `kcd/procedures/utility/{Name}.md` | The full procedure |

Because a utility reads only framework-standard structure (every KCD project has `lenses/_index.md` and `procedures/index.md` at the same relative locations), it has nothing project-specific to solve — so there is **no deployed copy**. The routing index points directly at the canonical.

This is the exception to the usual "index points at the deployed copy" rule. If a utility ever genuinely needs a project-specific value, it deploys like any other procedure (`procedures/utility/{Name}.md` solving the requirement) and the index points at the deployed copy instead.

---

## Naming

Every utility declares a `Name` parameter — its single canonical identifier. Lowercase, hyphen-separated (verb-led where a verb fits). Every reference derives from `Name`:

| Reference | Derived value |
|---|---|
| Canonical file | `kcd/procedures/utility/{Name}.md` |
| Task tag | `#{Name}` |

An agent never invents a name. Where a string needs the procedure's identity, it uses `{Name}` exactly.

---

## What Utilities Skip

Utilities deliberately omit the machinery the artifact-producing types carry, because none of it applies to a read-and-print operation with no file output:

- **No requirements / pre-flight** — nothing project-specific to resolve (unless a deployed copy is introduced).
- **No flush-and-fill** — there is no output file to destroy and recreate.
- **No `--test` mode** — the output *is* the session readout; there is nothing to redirect.
- **No `run-report` habit** — no report is produced.

---

## Trigger Model

Utilities run **inline** in the active session, invoked by their `#tag`. They run under whatever lens is active and inherit the session's model — no spawn, no model override. They are cheap by construction.
