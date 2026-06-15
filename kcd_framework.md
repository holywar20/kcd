---
type: doc
status: active
version: 0.1.0
updated: 2026-06-04
---

# KCD Framework

A meta-cognition layer for organizing AI-assisted work. The framework is **defined by its
file structure** — the canvas is the lock, this doc is the explanation. It is not
auto-loaded; it is pulled into context only when working on the framework itself.

---

## Core idea

Every AI task is supported by some context. KCD breaks context into three conceptual
components, assembled at runtime:

- **Know** — what the AI needs to know to perform the task (facts, vocabulary, system
  knowledge, prior decisions)
- **Care** — what the AI defends (failure modes, architectural vision, push-back style,
  what to flag)
- **Do** — what the agent is going to do this session (the task itself, or a procedure or
  habit slotted in)

A **lens** is a Know + Care pair. Lenses have no actions — they are personalities. A
**session** or **agent** is a lens (or stack) + a Do.

---

## Why it matters

The human bottleneck in AI-assisted work is no longer the capacity to write code or
boilerplate. It is the capacity to fully clarify a set of concepts. KCD is the structural
expression of that thesis: **every artifact is a clarified concept**, and the human's job is
to author and compose those, not write the connecting tissue.

Empirical claim under test: a KCD-equipped codebase lets Claude plan substantive work
without crawling the codebase. Context tightness becomes measurable as the ratio of
lens-tokens to investigation-tokens for a given task quality.

---

## The structure is the framework

The framework used to be a thesis with a loose folder convention attached. It is now the
other way around: **the deployed file structure is the canonical definition**, and this doc
explains why it is shaped the way it is. The authoritative enumeration is the canvas
([deployment_schema.canvas](_Claude/kcd/docs/deployment_schema.canvas)) — drawn by hand,
readable from JSON without Obsidian, machine-checkable. Paths are what drift the most, so
the paths are what we lock.

A deployed project lives under `_Claude/` at the project root (with `CLAUDE.md` at the root
as the entry map). In the canvas, a **rectangle is a folder** and a **parallelogram is a
file** (typically generated or output). The tree falls into **three layers**:

### 1. Agent layer — the things that compose

`lenses/` · `analyzers/` · `generators/` · `habits/` · `pipelines/`, each a **direct child of
`_Claude/`**. There is no `procedures/` wrapper: the family folder is the only level of nesting,
because a wrapper buys nothing and makes the tree more semantically dense than it needs to be.
Reducing primitives is a goal, not an accident. Each family folder holds its base, its template,
and its instances.

**An instance is a folder, not a file.** A lens is `lenses/{lensname}/` containing
`{lensname}.md` (the K/C/D body) and a `context/` subfolder. Same shape for
`analyzers/{analyzername}/` and `generators/{generatorname}/`. This is the on-disk form of the
trunk-and-branches model: the `.md` file is the trunk, `context/` holds the branches.

`context/` is a **local store for context specific to that instance.** It lets the lens body
stay thin while keeping lens-specific material close — e.g. an art lens whose reference
material is only ever relevant to that lens keeps it in its own `context/`, not in the shared
`references/` library.

### 2. Canonical + tool layer — the immutable substrate

- `kcd/` — the canonical framework library. **Shouldn't change ever** in a deployed instance:
  it is the normalization reference the project is checked against, edited only at the
  framework's own home. The canonical bases and templates live here (templates under
  `kcd/templates/`); deployment copies a family's base and template into its deployed family
  folder.
- `utilities/` — the registered tool tier (see *The agent model*). Structurally carries its
  own security gate: `draft/` (agent- or human-proposed, **not yet runnable**), `deployed/`
  (**human-approved, runnable**), and `registry.md` (the allowlist record). The
  author→approve→execute boundary is a folder boundary.

### 3. Data + instance layer — outputs and authored documents

`work/{lensname}/` (per-lens working area: `AI/`, `human/`, `plans/`) · `logs/`
(`session.md` + per-lens `completed/`, `todo/`, `agent-status/`) · `references/` ·
`reports/` (analyzer output) · `audits/` (generator raw output) · `contracts/` · `plans/`.
The retired `automation/` wrapper is gone — `reports/` and `audits/` are top-level.

**Folders exist even when empty.** The structure itself is the contract, so a deploy lays
down the full tree regardless of current contents. **`work/` is a messy draft workbench and
is never canonical** — provenance under it is split `AI/` vs `human/` by who authored the
material.

---

## The agent model — two agents + one tool tier

There is one axis that matters: **judgment vs. mechanical.** Three roles fall out of it,
**not symmetric** — two are AI agents, one is the tool layer beneath them.


- **Generator** *(agent · mechanical · no lens).* Deterministic, **manifest-driven**. Builds
  and modifies artifacts flush-and-fill; broad write authority. Runs on a cheap model or
  shells out to a registered utility (automate the automators). A generator **executes a
  spec, it does not improvise** — broad write is only safe because it is mechanically
  specified.
- **Analyzer** *(agent · insight · carries a lens).* Reads **anywhere**, writes **one place**
  (its report). Moves across the codebase, surfaces opportunities — including *"this could be
  made mechanical"* → hands a manifest to a generator. Full reasoning model.
- **Utility** *(tool tier · not AI).* The project's **shared tool-surface** — a service that
  exposes many deterministic scripts, same mental bucket as MCP tools. Unlike the agent
  families, a utility has **no base/template/instance pattern**: the tier is one service that
  registers many tools, not a family with a shared base. Agent- or human-authored; once
  **registered and approved**, a tool is something a **user can run** (e.g. `help` lists the
  available lenses, commands, and tools) and an **agent can call** in-session — also a natural
  demo/teaching surface, where the agent performs a tool call and educates the user on it.
  Generators invoke utilities as their internal black-box scripts.

**The tiers compose.** Utilities are the deterministic substrate; the two agent types stand
on top and call into them. Analyzers feed generators (insight → mechanizable spec); generators
feed analyzers (raw data → interpretation).

**The blast-radius invariant.** The agent *with* judgment and a lens (Analyzer) has the
*narrowest* write authority — report-only, can't wreck the tree. The agent *with* broad write
authority (Generator) has *no* judgment — it's predictable and spec-driven. **High autonomy ⇒
narrow write; broad write ⇒ low autonomy.** An explicit rule, not an accident.

**Why the split — the constraint is the point.** The Analyzer→Generator handoff is not merely
division of labor; it is a **forcing function.** An Analyzer reasons freely, but it is then
*required* to compose its conclusion as a manifest a Generator can execute **without further
instruction.** That requirement forces it to think every consequence through in advance —
"produce something executable without judgment" pushes the reasoning to completeness. The bet:
**constrained output is more reliable and repeatable than free output** — a painter cannot
paint without constraints. Architecturally this is a **meta-loop wrapped around the agent's
ordinary thinking loop**, and it is potentially iterable (analyzer → generator → analyzer …).
The build strategy follows directly: make the Generators boringly reliable, then tune the
Analyzer hard against the hardest problems.

**Classification default: Generator.** When a unit of work is borderline, narrow its scope
until it's genuinely mechanical rather than promoting it to Analyzer. Analyzer is reserved for
work that genuinely cannot be made mechanical.

**A sub-agent is just a lens, run unsupervised.** Dispatching a sub-agent is not a new
primitive — it is composing a lens around a task and running it without a human in the loop.
A generator is the common case: dispatched by an analyzer or lens-equipped session carrying a
manifest. The composing-side rule ("delegations to a generator are manifests, not briefs")
lives in `_base` so every session inherits it.

---

## Habits

A **habit** is a tiny, composable unit of behavior — a fragment of *how* an agent should act,
not a task it performs. Examples: log a session before it compacts; add a todo in a specific
place. Habits also express **don'ts** — negative constraints like *don't write to this file*
or *don't edit without write approval*. They are normally attached to lenses, but in principle
attach to anything. Like all context, a habit is compressed into the compiled K/C/D block for
a session turn — the on-disk structure is irrelevant to the dispatched output.

---

## Modifiers

A **modifier** is a declarative, `--`-prefixed **invocation mode** that mutates a lens or agent
for one run — `--test` (redirect output), `--debug`, a build-vs-debug mode switch. Modifiers
are globally unique across the document base and registered in the **Modifier Registry**
(currently a block in `CLAUDE.md` — a temporary home); an unknown one fails the run. A modifier
declared on `_base` applies to every lens.

*The term was "flag," retired as overloaded.* Where a habit is a behavior fragment that is
always on, a modifier is an **override toggled at invocation**. Forward-looking: modifiers are
heading toward **slottable mutations on a lens** — mode switches, personality overrides, rule
overrides — not just run-behavior toggles. That richer form is not a v1 concern.

---

## Composition

- **Lens stacking** — multiple lenses applied at once. Command order is declaration order:
  `!render !mcp` means render is **primary** and overrules on conflict; mcp is secondary and
  contributes its Know and Care to the composite. Reserved for human-driven sessions — the
  human is the conflict resolver in real time. A pairwise lens-conflict resolution agent
  (auditing lenses for contradictions, overlap, and loops) is a pending tool; until it exists,
  stacking is a human-supervised operation. A natural example: `!render` as primary for
  domain work that touches the UI — the stacked session holds rendering conventions and
  domain data contract simultaneously rather than context-switching.
- **Lens swapping** — sequential single-lens passes. Default for automated agents. Each pass
  is monomorphic: one lens, one Do, dump, next. Debuggable like a Unix pipe.
- **Pipelines** — orchestrated relays of agents (A then B then C). A first-class primitive —
  see *Pipelines* below.

---

## Pipelines

A **pipeline** is a declarative recipe that orchestrates agents — analyzers, generators, and
**other pipelines** — into an ordered, **fully automated** run. It is the framework's composing
primitive; it lives at `pipelines/{name}/`.

**A pipeline is not a contract.** A contract is a process *with* a human in the loop; a pipeline
is explicitly **automated — no human gate.** Where a pipeline must surface something for a human,
it does so as an **output** (e.g. a decisions report) read out-of-band, never as a blocking
stage. **Pipes include pipes:** a stage may invoke another pipeline.

The canonical case is **decide-then-repair**: an analyzer (`audit-structure`) detects drift and
emits a repair manifest plus a decisions report; a generator (`apply-repairs`) applies the
manifest. Judgment and the mechanical write stay in separate agents; the human reads the
decisions report asynchronously. A pipeline carries **no `model:`** — it is wiring, and a
deterministic runner executes it *(runner deferred, like the runtime)*.

---

## Principles

Named so the rest of the system can refer to them.

- **Code where executable, markdown where authored.** The framework's executable parts
  (parse, validate, deploy, dispatch, flush) live in code; its authored parts (lenses,
  references, plans, docs) live in markdown. Markdown is not the runtime — it is the
  schema-conformant authoring surface that code reads, writes, and round-trips.
- **Shared tool bucket.** The Utility tier is a *single* registered API surface shared by the
  human and the AI: the same script the engineer runs from a terminal is the one an agent
  calls in-session is the one an analyzer hands a generator. Registered once, one
  approve/revoke gate.
- **Compilation strips scaffolding.** On-disk ≠ dispatched. When context is compiled into a
  bundle, frontmatter and section scaffolding are stripped and Know/Care/Do merge into one
  prompt block. Frontmatter is authoring/tooling metadata — its byte cost is paid only when an
  agent reads the raw file, never in the dispatched prompt.
- **Disabled = ignored twice.** A `status: disabled` artifact is skipped behaviorally (lenses
  skip it) *and* mechanically (the compiler excludes it). Defense in depth.
- **Aggressive over passive.** AI generates volume; default to retiring AI-authored artifacts
  rather than accumulating them. Explicit human action is the opt-out.
- **Links are wires.** AI systems and humans are connected through conceptual wires, and in a
  document-driven project those wires are hyperlinks. Links are cheap; routing around them is
  expensive. Leave a breadcrumb wherever it helps a human or a system find its way. Optimal
  document-driven development is massively hyperlinked.

---

## Conventions

- **Frontmatter** — no universal schema; **each type's template is its schema.** Two fields
  are universal: `type` (self-describing + a drift guard — a `type`↔location mismatch is a
  signal) and `status` (`active | disabled`). An optional `kcd:` block is the one shared
  escape hatch for layer-specific keys and deviations. snake_case, lowercase keys. Full model:
  [frontmatter_schema](_Claude/kcd/docs/frontmatter_schema.md).
- **Links** — bare vault-root-relative, no leading slash, no `../`. The same string resolves
  in canonical and deployed copies, so deployment rarely rewrites paths.
- **Indexes — store once, index many ways.** Duplicate indexes are *by design*, not drift:
  `CLAUDE.md`'s `!command` index and a family's file-roster index are both legitimate
  projections over one store (the artifact files). Robust indexes are a feature.
- **Naming** — kebab/lowercase for instance and report filenames; `_`-prefixed bases and
  templates (`_lens_base.md`, `_lens_template.md`).
- **Verb-first names from a fixed vocabulary.** Every agent and pipeline name **leads with a
  verb** drawn from a small canonical set, so names sort by broad function rather than by topic.
  The starter vocabulary (extend deliberately, not ad-hoc):

  | Verb | Means | Examples |
  |---|---|---|
  | `generate-` | build a new artifact | `generate-swagger`, `generate-postman`, `generate-css-docs` |
  | `audit-` | inspect & surface (detect, never repair) | `audit-structure`, `audit-consistency` |
  | `apply-` | execute a manifest in-place | `apply-repairs` |
  | `merge-` | aggregate existing data | `merge-todos` |
  | `repair-` | a pipeline's composite heal (detect → apply) | `repair-docs` |

  A pipeline's verb names its overall function — `repair-` is the first such composite verb
  (`repair-docs` = `audit-structure` → `apply-repairs`). Adding a verb is a deliberate vocabulary
  change — prefer reusing an existing one. A name that does not lead with a registered
  verb is a drift signal, caught on the next structural audit.

---

## Portability boundary

`kcd/` is the portable, project-agnostic layer: framework meta-docs, templates, bases,
habits, and the generator/analyzer definitions that apply to any KCD-equipped project without
modification.

**Rule:** if writing or editing a `kcd/` file requires knowing anything about a specific
project — its paths, domain vocabulary, toolchain, or conventions — that artifact does not
belong in `kcd/`. Project-specific agents belong outside it.

**Lenses are a two-tier exception.** Most lenses are drafted in place and are project-specific
by design. A small minority are *deployable templates* (e.g. `_base`, `lens_crafter`) that
live in `kcd/lenses/` with `status: disabled` and are copied into the deployed `lenses/` via
the deploy contract. Same schema; the portability constraint is what gates entry to `kcd/`.

---

## Reference categories

Lenses point at a project-level store of truth, kept categorized, not flat. The category
scheme and the references-vs-`kcd/` boundary are specified in
[reference_categories](_Claude/kcd/docs/reference_categories.md). References live in
`references/` only — it's a library; findability is the point.

---

## Still evolving

Locked enough to build on, not yet finalized:

- **Pipeline runner + UI.** The pipeline *shape* is settled (a primitive at `pipelines/`; see
  *Pipelines*). What's deferred: the deterministic **runner** that executes a recipe, and the
  Starmind UI metaphor for composing one.
- **The map primitive.** `CLAUDE.md`, the family indexes, and the master registry are looking
  like *one* conceptual primitive — a "map" — currently a singleton, nestable in theory.
  Whether to formalize it (schema, nesting rule) is deferred until nesting earns its keep.
- **Utility tier — deferred pending architecture.** It is a shared tool-surface *service*
  (above), not a base-having family, so it builds once Starmind has architecture to host it.
  Two open pieces: **signaling** (how a tool invocation is dispatched and its result returned,
  for both a user and an in-session agent), and the **security model** — the `draft/`→`deployed/`
  gate + `registry.md` is the structural half; the content-addressed allowlist (hash,
  invalidate-on-change, re-approval) and per-utility capability scope are still being designed.
- **Procedure as a named primitive — downregulated.** A generator or analyzer is conceptually a
  "slim skill" (a Do plus task-specific Know). But with only two agent types, a separate
  "procedure" primitive adds little and risks distracting from the generator–analyzer model.
  Low priority; may be dropped from the final product entirely.
- **Value attribution.** How much of the observed lift is KCD-specific vs. "any structured
  context vs. none"? Measure before productizing.

---

## Customer

An engineer who already has taste and wants to deploy that judgment more efficiently. Not a
tool that makes non-engineers into engineers. Lowers the threshold; does not remove it.

---

## Status

The framework is in active use and is the substrate for Starmind (the visual control surface
being built on it). The deployed structure is locked in the canvas; this doc and the
base/template layer are being brought into sync with it. Productization (a deployable
framework kit) is a separate workstream from any specific codebase.
