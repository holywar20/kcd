---
type: doc
status: active
---

# Frontmatter Schema

Canonical definition of the frontmatter every artifact in the `_Claude/` tree carries.

## Core principles

1. **No universal schema — the type's template is its schema.** A lens looks nothing like a
   plan; that is correct, not drift. Each type's template defines its field set.
2. **Two fields are universal:** `type` (self-describing, and a drift guard — a `type`↔location
   mismatch is a signal) and `status`. Plus the optional `kcd:` escape hatch.
3. **`kcd:` — the one shared escape hatch.** Optional, on any file, opaque to cascade. Holds
   layer-specific keys (a deployed copy's `canonical:` pointer) and one-off deviations. Because
   anything unusual goes here, the per-type schemas stay tight.
4. **snake_case, lowercase keys.** Everywhere.
5. **On-disk ≠ dispatched.** When context is *compiled* into a bundle, frontmatter and section
   scaffolding are **stripped** and Know/Care/Do are **merged into one prompt block**.
   Frontmatter is authoring/tooling metadata — its byte cost is paid only when an agent reads
   the raw file, never in the dispatched prompt.

**Retired:** the `session:` block and the per-file `heal-docs:` block — unimplemented; the
deployed-structure chart encodes their intent by location.

---

## Universal fields

```yaml
type: <lens|contract|plan|reference|generator|analyzer|utility|pipeline|index|doc|habit|template>
status: active        # active | disabled
```

### Status conventions

- **`disabled` in canonical `kcd/` = a deployable seed** — inert until deployed; the deploy
  script flips the deployed copy to `active`. Applies to deployable lenses (including `_lens_base`),
  habits, and canonical generators/analyzers — the artifacts that are **copied** into the deployed
  tree. The type-bases are **not** in this list (they are never copied — see `composed` below).
  (`disabled` ⇒ lenses skip it **and** the compiler excludes it.)
- **`active` = a live artifact in place** — framework meta-docs and indexes read directly from
  `kcd/` (never deployed-and-flipped), and any deployed copy.
- **`composed` = a live-in-place artifact that is never run standalone** — the type-bases
  (`_generator_base`, `_analyzer_base`, `_pipeline_base`). They are **not** deployable seeds: they
  are never copied, they are referenced in place by deployed generators/analyzers/pipelines as
  base-rule authorities. `composed` says both things the two existing values could not say at once:
  *live* (so following a link to it is correct — it is **not** `disabled`/ignore), yet *not a
  standalone agent* (so the compiler excludes it from loading, exactly as it excludes `disabled`).
  The split exists because `disabled` was overloaded — a link-follower read it as "ignore," while
  the compiler needed it as "don't load." `composed` carries the second meaning without the first.
- **`template` leaves `status` blank** — a scaffold is never composed (see *Template* below).

> **Compiler note (forward-looking):** no compiler reads `status` yet; artifact loading is still
> human/agent-driven over markdown. When the compiler is built, it excludes **both** `disabled` and
> `composed` from standalone loading; the distinction between them is for the human/agent reader
> following a link, where `composed` means "live, read me" and `disabled` means "use the deployed twin."

---

## Per-type shapes

### Lens — `_Claude/lenses/{name}/{name}.md`
```yaml
type: lens
status: active            # active | disabled (no authoring-stage enum)
command: "!{name}"
todo_path:                # populated at deploy
completed_path:           # populated at deploy
```
- No `depends_on` — stacking is a runtime human choice.
- TODO/Completed live at the referenced paths, not in the body.
- `_lens_base` is special: `type: lens`, **no `command`** (auto-loaded); its Know points at the
  project session log so every lens inherits where session history lives.

### Contract — `kcd/contracts/{name}.md`
```yaml
type: contract
status: active
scope: universal          # universal | lens:{name}
```

### Plan — `plans/{name}.md` (and `work/{lens}/plans/…`)
```yaml
type: plan
status: draft             # draft | active | paused | complete | retired
lens: {name|cross}
created: YYYY-MM-DD
updated: YYYY-MM-DD
```

### Reference — `references/{category}/{name}.md` *(only here — no travel)*
```yaml
type: reference
status: active
name: kebab-slug
description: "one line: what it points to and why it matters"
updated: YYYY-MM-DD
```

### Generator — canonical `kcd/generators/{name}/{name}.md`
```yaml
type: generator
status: active
model: claude-sonnet-4-6  # default; downgrade to haiku only for genuinely trivial mechanical work
base: _generator_base
```
Deployed copy:
```yaml
type: generator
status: active
model: claude-sonnet-4-6
kcd:
  canonical: _Claude/kcd/generators/{name}/{name}.md
```

### Analyzer — canonical `kcd/analyzers/{name}/{name}.md`
```yaml
type: analyzer
status: active
model: claude-sonnet-4-6
lens: {name}              # the lens it composes with — lets it run cold
base: _analyzer_base
```

### Pipeline — canonical `kcd/pipelines/{name}/{name}.md`
```yaml
type: pipeline
status: active
base: _pipeline_base
```
- **No `model:`** — a pipeline is declarative wiring (it orchestrates analyzers/generators/other
  pipelines); the stages carry their own models. Verb-first name from the vocabulary. Deployed
  copy adds a `kcd:` canonical pointer.

### Type-base — `kcd/{generators,analyzers,pipelines}/_{type}_base.md`
```yaml
type: generator           # or: analyzer | pipeline — matches the family it bases
status: composed          # live in place, composed into siblings, never run standalone
```
- A type-base is **never deployed** — canonical generators/analyzers/pipelines reference it in place
  the way a lens references `_lens_base`. It is the one artifact family that carries `composed`.
- Distinct from `_lens_base`, which **is** deployed (a deployable seed: `disabled` in `kcd/`, flipped
  to `active` in the deployed copy).

### Utility — registered tool *(service; deferred)*
```yaml
type: utility
status: active            # doubles as the security enable / revoke
# remaining shape TBD with the utility service + security design
```

### Index — `**/index.md`
```yaml
type: index
status: active
updated: YYYY-MM-DD
```

### Doc / Habit — `kcd/docs/*`, `kcd/habits/*`
```yaml
type: doc                 # or: habit
status: active            # docs are active in place; habits ship disabled (deployable seed)
```

### Template — `kcd/templates/_{type}_template.md`
```yaml
type: template
status:                   # blank — a scaffold is never composed
```
- A template is copy-pasta, blown away once an artifact is authored from it — `type` is loosened
  to a name convention (the file is a *template of a lens*, not a lens). Its body shows the
  target artifact's frontmatter as a fill-in instruction; the authoring agent writes the real
  `type`/`status` onto the artifact it creates. This is why a `type: template` file legitimately
  lives in `templates/` (the type↔location guard is satisfied).

---

## Cross-cutting rules

- **Model convention:** default `claude-sonnet-4-6` (the reliable workhorse); downgrade to
  `claude-haiku-4-5` only for genuinely trivial, fully-mechanical work. Declared per procedure
  in `model:`.
- **Disabled = ignored twice:** behavioral (lenses skip) + mechanical (the compiler excludes).
- **Aggressive over passive:** AI generates volume; default to retiring AI-authored artifacts.
  `paused` / explicit human action is the opt-out.
- **`base:` kept** on generator/analyzer frontmatter as an explicit chain link.
