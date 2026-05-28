# KCD Framework

A meta-cognition layer for organizing AI-assisted work. Not a TR5 system.
Not auto-loaded. Pulled into context only when noodling on the framework itself.

---

## Core idea

Every AI task is supported by some context. KCD breaks context into three
conceptual components, assembled at runtime:

- **Know** — what the AI needs to know to perform the task (facts, vocabulary,
  system knowledge, prior decisions)
- **Care** — what the AI defends (failure modes, architectural vision,
  push-back style, what to flag)
- **Do** — what the agent is going to do this session (the task itself, or a
  procedure or habit slotted in)

A **lens** is a Know + Care pair. Lenses have no actions. They are personalities.
A **session** or **agent** is a lens (or stack) + a Do.

---

## Why it matters

The human bottleneck in AI-assisted work is no longer the capacity to write
code or boilerplate. It is the capacity to fully clarify a set of concepts.
KCD is the structural expression of that thesis: every artifact is a clarified
concept, and the human's job is to author and compose those, not write the
connecting tissue.

Empirical claim under test: a KCD-equipped codebase lets Claude plan
substantive work without crawling the codebase. Context tightness becomes
measurable as the ratio of lens-tokens to investigation-tokens for a given
task quality.

---

## Portability boundary

`kcd/` is the portable, project-agnostic layer. It contains framework meta-docs, templates,
habits, and procedures that apply to any KCD-equipped project without modification.

Project-specific artifacts belong outside `kcd/`. The canonical project-level location for
project-specific procedures is `{project_root}/procedures/` (IDT: `_Claude/procedures/`).

**Rule:** if writing or editing a `kcd/` file requires knowing anything about a specific
project — its file paths, domain vocabulary, toolchain, or conventions — that artifact does
not belong in `kcd/`.

Corollary: portable procedures in `kcd/procedures/` must reference only framework-relative
paths and generic placeholders. Any procedure that hardcodes a project path is a project
procedure, not a framework procedure.

**Lenses are a two-tier exception.** Most lenses are drafted in place at `_Claude/lenses/`
and never enter `kcd/` — they are project-specific by design. A small minority are
*deployable templates*: project-agnostic lenses (e.g. `_base`, `lens_crafter`) that live
at `_Claude/kcd/lenses/{name}.md` with `Status: Disabled` and are copied into
`_Claude/lenses/` via the deploy-lens contract. The schema is the same; the portability
constraint is what gates entry to `kcd/lenses/`. A draft with hardcoded project paths or
domain vocabulary does not belong there. See [lens_anatomy](docs/lens_anatomy.md).

---

## Composition rules

- **Lens stacking** — multiple lenses applied at once. Reserved for
  human-driven sessions where the human resolves conflicts in real time.
  Best practice, not enforced.
- **Lens swapping** — sequential single-lens passes. Default for automated
  agents. Each pass is monomorphic: one lens, one Do, dump, next. Debuggable
  like a Unix pipe.

The relay model resolves the conflict problem by routing around it.

---

## Reference categories

Lenses point at a project-level store of truth. KCD requires that store to be
categorized, not flat. The category scheme, the standard categories, and the
"references vs. kcd/" boundary are specified in
[reference_categories.md](docs/reference_categories.md). Not every session needs
it — it is the lookup for *where a given fact lives*.

---

## Deployable framework (in progress)

KCD can be deployed onto an arbitrary codebase via a deployment procedure. Components:

- **Lens registry** — document store (git-backed) of shareable lenses.
  Slot into any KCD-contract codebase.
- **Lens-crafter procedure** — AI-prompts-human flow to author a new lens.
  Probes for Cares by showing deliberately-wrong examples and asking "what
  bothers you?" — surfacing defended invariants by violation rather than
  introspection.
- **Alignment-check procedure** — runs at publish time, not just deploy time.
  Catches lenses that contradict framework Cares or commonly-stacked lenses
  before they enter the registry.
- **Self-healing test suite** — analyzer agents generate tests under lens
  context. Empirical check that the lens is actually shaping behavior.
- **Deployment scaffolding** — predefined folders, document linking, procedure
  slots. Mechanizable. The easy half.

---

## Open questions

- **Pipelines / recipes as a third primitive.** Lens-swapping relays need
  orchestration: A then B then C, or A then C then B? That orchestration
  is itself a clarified concept and probably wants its own artifact
  alongside lenses and procedures. Pre-naming it so it doesn't sneak in as
  ad-hoc prompt scaffolding.
- **Conflict resolution at registry scale.** Hand-authored lens sets are
  manageable. Multi-author registries need declared precedence, namespaced
  Cares, or curated compatibility.
- **Procedures as opaque Do-blocks vs. lens-declaring Do-blocks.** A procedure
  carries its own internal Care ("how to do X well") invisible to the lens
  stack. Decide: procedures declare their lenses, or procedures are trusted
  black boxes that the caller lenses before invoking.
- **Value attribution.** How much of the observed lift is KCD-specific vs.
  "any structured context vs. none"? Measure before productizing.

---

## Customer

An engineer who already has taste and wants to deploy that judgment more
efficiently. Not a tool that makes non-engineers into engineers. Lowers
the threshold; does not remove it.

---

## Status

Conceptual. The framework is in active use informally on at least one codebase —
current contexts there predate the KCD vocabulary but mostly conform. Productization
(the deployable procedure kit) is a separate workstream from any specific codebase migration.
