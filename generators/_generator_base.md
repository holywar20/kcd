---
type: generator
status: disabled
---

# _generator_base

*Base for all Generator procedures. Every canonical generator references this file the way a
lens references [`_lens_base`](_Claude/kcd/lenses/_lens_base.md). It carries the rules shared
by all generators so individual procedures never repeat them. Ships `disabled` here in
`kcd/generators/`; deployment activates the deployed copy.*

---

## The generator invariant

A **generator executes a spec; it does not improvise.** Broad write authority is only safe
because the work is mechanically specified. The generator is the **executing end** of the
composing-side rule in [`_lens_base`](_Claude/kcd/lenses/_lens_base.md) — *"delegation is by
manifest, not brief."* It receives a manifest with every consequence resolved in advance and
applies it flush-and-fill.

A generator carries **no lens and no judgment.** Where a choice is genuinely open it does not
decide — it flags (per its `Care` block) or stops. This is the blast-radius invariant in
force: **broad write ⇒ low autonomy.** An agent that needs to reason about consequences is an
analyst's job, not a generator's.

*Model convention: generators default to `claude-sonnet-4-6` (declared per instance in
`model:`) — the reliable workhorse. Downgrade to haiku only for genuinely trivial, fully
mechanical work.*

---

## Composition Model

A generator is a folder plus this base:

| Layer | Location | Owns |
|---|---|---|
| `_generator_base` | `_Claude/kcd/generators/_generator_base.md` | rules shared by all generators (this file) |
| Canonical | `_Claude/kcd/generators/{name}/{name}.md` | generic logic; **declares** requirements |
| Deployed | `_Claude/generators/{name}/{name}.md` | full copy; **solves** requirements with project values |
| Context | `_Claude/kcd/generators/{name}/context/` | context specific to this generator |

The canonical declares requirements generically (no project values); the deployed copy is a
full self-contained copy that solves them. The deployed tree mirrors the canonical family
layout — a deployed generator sits at `_Claude/generators/{name}/` exactly as its canonical
sits at `_Claude/kcd/generators/{name}/`.

---

## Naming

Every generator declares a `name` — its single canonical identifier. Lowercase,
hyphen-separated, verb-led (e.g. `generate-swagger`). Identity derives from it; an agent never
invents a name. Where a string needs the generator's identity, it uses `{name}` exactly:

| Reference | Derived value |
|---|---|
| Canonical file | `_Claude/kcd/generators/{name}/{name}.md` |
| Deployed file | `_Claude/generators/{name}/{name}.md` |
| Task tag | `#{name}` |
| Test-mode output | `_Claude/audits/{name}.md` |

---

## Requirements

A canonical generator declares **requirements** — anything it needs that is not generic:

- **Tooling** — an external executable or library (a compiler, a linter, an SDK).
- **Input** — a project file path, glob, or configuration value (a source directory, a schema
  version).

The canonical copy declares each requirement by name and description; it never names a
concrete path or value. The deployed copy solves every declared requirement.

### Pre-flight

Before Phase 1, in order:

**1 — Deployment check.** Confirm a deployed copy exists at `_Claude/generators/{name}/{name}.md`.
If absent, fail immediately:

```
FAILED — not deployed: no deployed copy at _Claude/generators/{name}/{name}.md
```

**2 — Requirement resolution.** Resolve every declared requirement against the deployed copy's
solutions. If any requirement is unsolved, or its solution is unreachable (missing file,
missing executable), fail immediately:

```
FAILED — unmet requirement: {requirement-name} ({tooling|input}) — {what was expected}
```

Either failure stops the run — no output, no partial work. A generator runs only when it is
both deployed and fully resolved.

---

## Output Conventions

- A generator builds an artifact and writes it to the artifact's real home — a reference into
  `references/`, a test into the test tree, and so on. Placing artifacts where they belong is
  the generator's purpose; writing to canonical project locations is expected, not a
  violation. There is no single default output folder — the `Output` parameter declares the
  destination.
- Output is **flush-and-fill** — destroy and recreate on each run. The generator is durable;
  its output is not.

---

## Reference Wiring

When a generator's artifact is a **reference** — a document meant to be loaded by sessions —
two rules apply:

- The reference follows the reference template
  ([`reference_template`](_Claude/kcd/templates/reference_template.md)) — frontmatter included,
  with `updated` set to the run date.
- The generator's task list includes wiring it into the Know table of every appropriate lens:
  a `What | Where | Why` row pointing to the reference, added if missing or corrected if
  stale. A reference no lens knows about is dead weight. The deployed copy names which lenses
  are appropriate (an Input requirement); the canonical declares the wiring step generically.

---

## Modifiers

A **modifier** is a declarative, `--`-prefixed invocation mode that mutates a run's behavior or
scope. Every modifier is **globally unique** across the entire document base and **registered**
in the **Modifier Registry** (currently a `What | Where | Why` block in `CLAUDE.md` — a
temporary home). A modifier may be omitted; absent any, the generator runs its default (full)
behavior. An unknown modifier fails the run:

```
FAILED — unknown modifier: {modifier}
```

A generator declares its own modifiers in its canonical `## Modifiers` slot; each must be
registered. Duplicate or unregistered modifiers are a drift signal, caught on the next
structural audit. Modifiers defined in this base are **inherited** by every generator and
registered once — a generator does not redeclare them.

**`--test`** — the universal generator modifier, defined here and inherited by every generator.
Under `--test`, output is redirected to `_Claude/audits/{name}.md` — the generator's normal
`Output` file is never touched. Every phase runs identically; only the destination changes.
The run creates `_Claude/audits/` if absent. Flush-and-fill. Reference wiring is also skipped
under `--test` — a test run produces only the test artifact.

---

## Habits

Every generator invokes `run-report` as its final action — automatic, no per-generator
declaration required.

| What | Where | Why |
|---|---|---|
| run-report | [run-report](_Claude/kcd/habits/run-report.md) | mandatory — fires after the generator's final phase |
