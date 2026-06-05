---
type: doc
status: active
---

# Agent Types

The operational registry for the KCD agent model — model, context depth, output, and boundary
per type. The conceptual treatment (why the split exists, the forcing function) lives in
[kcd_framework](_Claude/kcd/kcd_framework.md) → *The agent model*; this doc is the practical
"what each type is."

There is **one axis: judgment vs. mechanical.** It yields **two AI agents** — Generator and
Analyzer — standing on **one tool tier**, Utility. The tiers compose; they are not symmetric.

---

## Generator *(agent · mechanical · no lens)*

- **Purpose:** Build and modify artifacts to a spec. A generator asks *"apply this manifest"* —
  it does not decide *whether* or *what*; it executes. Mechanical, **manifest-driven**.
- **The invariant:** a generator **executes a spec; it does not improvise.** Broad write
  authority is only safe because the work is mechanically specified. Where a choice is genuinely
  open it does not decide — it flags and stops, or notes inline.
- **Model:** default `claude-sonnet-4-6`; **downgrade to `claude-haiku-4-5` only for genuinely
  trivial, fully-mechanical work** (e.g. extract-and-count).
- **Context depth:** task-dependent — loads exactly what its declared requirements name. **No
  lens.**
- **Output:** the artifact's real home — a reference into `references/`, a test into the test
  tree, etc. Declared per generator; no single folder. Raw/diagnostic/staging output and
  `--test` runs go to `_Claude/audits/`. Flush-and-fill.
- **Write authority:** broad — but spec-bound. **Boundary:** a generator builds; it does not
  exercise judgment about what to build. That is an analyzer's job.

---

## Analyzer *(agent · judgment · carries a lens)*

- **Purpose:** Read broadly, interpret, rank, and surface opportunities. An analyzer asks *"what
  does this mean and what should we do?"* When it finds work that can be made mechanical, it
  **composes a manifest and hands it to a generator** — it does not do the mechanical work
  itself.
- **Model:** `claude-sonnet-4-6` — judgment is the point.
- **Lens:** every analyzer declares a `lens:` it composes with. The lens gives it judgment and
  personality, and is what lets it run **cold / unsupervised** (a sub-agent is just a lens run
  without a human in the loop).
- **Context depth:** full — reads **anywhere** (source, references, generator `audits/`).
- **Output:** **report-only** — to `_Claude/reports/` and nowhere else (typically one report, a
  small number when the work splits cleanly). Flush-and-fill. The report's actionable core is
  the **manifest**: a self-contained spec a generator (or human) can execute without further
  judgment.
- **Write authority:** narrow — report-only; cannot modify source or any canonical path.
  **Boundary:** an analyzer decides and specifies; it does not build. Building is generator work.

---

## Utility *(tool tier · not AI)*

The project's **shared tool-surface** — a service that registers many deterministic scripts,
runnable by both a user and an in-session agent (e.g. `help`). Unlike the agent families, a
utility has **no base/template/instance pattern** — it is one service, not a family.

**Deferred** pending Starmind architecture (signaling + security model still open). See
[kcd_framework](_Claude/kcd/kcd_framework.md) → *The agent model* / *Still evolving*. Utilities
are not an agent type and carry no model/lens.

---

## Not an agent type: the Pipeline

A **pipeline** *orchestrates* agents (analyzers, generators, other pipelines) into an automated
run — it is not itself an agent and carries no model or lens. It is a separate primitive; see
[kcd_framework](_Claude/kcd/kcd_framework.md) → *Pipelines*. Listed here only to mark the
boundary: agents do the work, a pipeline sequences them.

---

## The blast-radius invariant

The agent **with** judgment and a lens (Analyzer) has the **narrowest** write authority —
report-only, can't wreck the tree. The agent **with** broad write authority (Generator) has
**no** judgment — predictable, spec-driven. **High autonomy ⇒ narrow write; broad write ⇒ low
autonomy.** An explicit rule, not an accident.

## Why the split — the constraint is the point

The Analyzer→Generator handoff is a **forcing function**, not just division of labor. Requiring
an analyzer to emit a manifest a generator can execute **without further judgment** forces it to
resolve every consequence in advance. The bet: constrained output is more reliable and
repeatable than free output. Build strategy: make generators boringly reliable, then tune the
analyzer hard against the hardest problems.

---

## Pipelines

Types chain through clean handoffs, with a human gate where judgment commits to action:

```
Analyzer  →  reports/ (manifest)  →  (human gate)  →  Generator  →  artifact's home
```

The canonical case is **decide-then-repair**: an analyzer surfaces a repair manifest, a human
approves, a generator applies it. Judgment and the mechanical write stay in separate agents.
Generators feed analyzers too (raw data in `audits/` → interpretation); the two tiers cycle.
Lens-stacking applies at each stage — the same step can run under different lenses to tune what
is surfaced or how it is interpreted.
