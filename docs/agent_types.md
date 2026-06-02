# Agent Types

Three agent types exist in KCD. Every procedure that *runs an agent* must declare which type it is. The type determines model, context depth, and output destination.

- **Investigators** — audit a domain and create bulk data.
- **Analysts** — generate formalized reports for consumption by developers or management.
- **Generators** — build references, tests, and other supporting artifacts.

*Not every procedure runs an agent. **Utility** procedures (e.g. `#help`) are a separate, non-agent category: they run inline in the active session, read existing KCD structure, and print a readout — no spawn, no artifact, no file. They are not an agent type and do not appear below. See [_utility_base](../procedures/utility/_utility_base.md).*

---

## Investigator

- **Purpose:** Audit a domain and produce bulk data — findings about a specific class of problem. An Investigator asks "is this present?" — it does not explain, rank, or recommend.
- **Model convention:** Fast/cheap model (e.g. `claude-haiku-4-5`) — high volume, low cost.
- **Context depth:** Deep domain expertise (knows the problem class cold). Minimal codebase context — does not need to understand business logic.
- **Output destination:** The automation audit folder — `_Claude/automation/audits/<procedure-name>.md`. Flush-and-fill on each run.
- **Default output format:**

  | File | Location | Type | Finding | Severity |
  |---|---|---|---|---|
  | `path/to/file` | `method():line` | category | one-sentence description | Critical / High / Medium / Low / Info |

  Procedures may override the format by declaring a replacement table in their Do section. Extend by adding columns after Severity; the first five columns should remain stable.

**Boundary:** An Investigator ends where judgment begins. If the output requires knowing which findings matter, that is Analyst work.

---

## Analyst

- **Purpose:** Read audits and source, and generate formalized reports for consumption by developers or management — ranked findings, fix prompts, status summaries. An Analyst asks "what does this mean and what should we do?" — it interprets, prioritizes, and recommends.
- **Model convention:** Full reasoning model (e.g. `claude-sonnet-4-6`) — contextual judgment, full codebase reads.
- **Context depth:** Full — reads source files, consumes audit output, applies lens context.
- **Output destination:** The automation report folder — `_Claude/automation/reports/<procedure-name>.md`. Flush-and-fill on each run.
- **Do section:** Must define report structure and fix prompt format.

**Boundary:** An Analyst ends where production begins. It reports; it does not build the artifact. Building is Generator work.

---

## Generator

- **Purpose:** Build references, tests, and other supporting artifacts. A Generator asks "what should this artifact look like?" — it produces the artifact and writes it to its real home in the project. Building useful artifacts and placing them where they belong is the generator's purpose.
- **Model convention:** Full reasoning model (e.g. `claude-sonnet-4-6`) — artifact quality requires judgment.
- **Context depth:** Task-dependent. Must load the lens(es) relevant to the artifact's domain.
- **Output destination:** Wherever the artifact belongs — a reference into `references/`, a test into the test tree, and so on. Declared per procedure; there is no single output folder. Generators write to canonical project locations — that is their function, not a violation.
- **Reference wiring:** When a generator builds a *reference* — a document meant to be loaded by sessions — its task list includes wiring that reference into the Know table of every appropriate lens. A reference no lens knows about is dead weight.
- **Do section:** Must declare the output path and format.

**Boundary:** A Generator builds — it does not hunt for problems (Investigator) or rank findings (Analyst).

---

## Composing types in a pipeline

A procedure may chain types:

```
Investigator → automation/audits/  →  Analyst → automation/reports/  →  (human reviews)  →  Generator → artifact's home
```

Each stage is a clean handoff. Investigators do not call Analysts inline; Analysts do not build artifacts. The human is the gate between reports and generators.

Lens-stacking applies at each stage — the same procedure can run under different lenses to tune what is surfaced (Investigator), how it is interpreted (Analyst), or what is generated (Generator).
