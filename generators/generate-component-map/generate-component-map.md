---
type: generator
status: active
model: claude-sonnet-4-6
base: _generator_base
---

# generate-component-map — Generator (canonical)

*Traces a component-framework source tree into a **physical containment map** — a reference that
shows what component renders inside what, with a path and a one-line description per node. Generic
across any component framework whose children are reached by static import (Vue SFC, React, Svelte):
the manifest names the source, the entry roots, and the dynamic-mount registries; this procedure
reads only what they point at. Declares — never solves — its requirements; names no project path.*

Base rules: [_generator_base](_Claude/kcd/generators/_generator_base.md) — composition model,
requirement resolution, fail behavior, output conventions, reference wiring.

---

## Parameters

Output: `{the component-map reference's real home — declared as the `output-path` Input requirement}`

*`name` is the folder/file name, `#{name}` the task tag, `model` lives in frontmatter. `Output`
is solved in the deployed copy.*

---

## Modifiers

*Only the inherited `--test` (redirects output to `_Claude/audits/{name}.md`, skips lens wiring).
No generator-specific modifiers — a future `--signals` mode (add a per-node "stores read" column)
would be registered here when built.*

---

## Requirements

*Declared generically; solved in the deployed copy.*

| Name | Kind | Description |
|---|---|---|
| `component-source` | Input | The component-source root + a glob of component files (every SFC / component module under the source root). The set of nodes to map. |
| `entry-roots` | Input | The registry/file that declares the top-level mount points — the screens/pages/roots and which component(s) each one mounts. Defines the roots each containment tree grows from, and the root map. |
| `dynamic-registries` | Input | Zero or more registries that mount children via a dynamic `<component :is>` / glob (not a static import). Each names the host component, the registry file, and how it enumerates entries. **Discover by shape, not by file name** — an exhaustive `Record<…, Component>` table or an `import.meta.glob<Component>`, wherever it lives — since registries follow no naming convention. Their members are shown as `↻` children, never faked as static edges. |
| `barrel-modules` | Input | Zero or more barrel/index modules that **re-export components** under an import alias (e.g. an `@widget` barrel re-exporting icon components). A child imported `from '<barrel-alias>'` resolves through the barrel to the real component — a `*.vue`-only scan misses it. Names the barrel file(s) and the alias each is imported under. |
| `path-prefix` | Input | The common path prefix stripped from every displayed path (all nodes share it). |
| `shared-roots` | Input | The directories holding cross-page primitives (the `△`-shared leaves) — listed once in a Shared section with canonical descriptions. |
| `reference-lenses` | Input | Which lens(es) the produced reference is wired into (a `What \| Where \| Why` Know row). |
| `output-path` | Input | The component-map reference's destination file. Flush-and-fill. |

No external Tooling — static-import tracing is read-and-match over the source, within native
file-search capability.

---

## Care

**Defends:**
- **Containment from source, never from memory.** Every edge is a real static import in the parent's
  module. The tree is a derivation, not a hand-drawing.
- **Dynamic mounts are marked, not faked.** A child reached through a registry is an `↻` row whose
  listed members are that registry's current entries — never promoted to a hard template edge.
- **Description fidelity.** A node's description is lifted from its own leading doc-block / comment,
  condensed to one line — not invented.

**Will not touch:**
- Any source file. The component tree is read-only input; the only write is the `output-path` reference.
- Any node's classification beyond what the source states.

**Surfaces (notes inline, does not block):**
- A component in `component-source` with **no importer and not in any registry** → emit it under a
  `⚠ verify` section with its path and description. Do not drop it and do not invent a parent.
- A component whose doc-block declares it superseded/legacy/deprecated → emit it in a **legacy**
  sub-table under its cluster, marked *legacy*. Do not delete it.
- A description that cannot be derived (no doc-block) → emit the row with an empty description and an
  inline `⚠` note; do not fabricate one.

---

## Do

*Pre-flight requirement resolution runs first, per `_generator_base`. Phases assume all
requirements are solved and reachable.*

### Phase 1 — Source Load

1. Resolve `entry-roots`; read it to enumerate the roots (screens/pages) and, for each, which
   component(s) it mounts (the root→entry mapping).
2. Glob `component-source` to the full node set.
3. Across that set, extract every **static component import edge** — each `import X from '<...component-file>'`
   — building a `parent → [children]` map. Then resolve **barrel re-exports**: for each
   `barrel-modules` entry, map the components it re-exports, and treat an `import … from '<barrel-alias>'`
   of one of those names as an edge to the real component. A `*.vue`-only scan would miss these.
4. Read each `dynamic-registries` entry; record its host component and its enumerated members
   (these become `↻` children of the host). Discover registries by shape per the requirement —
   do not assume a naming convention.
5. For each node, read its leading doc-block / top comment and condense it to a one-line description.
   Note any node whose doc-block declares it superseded/legacy/deprecated.

### Phase 2 — Containment Assembly

Produce the map (format below). For each root from `entry-roots`, walk the static-import map
depth-first into a containment tree; splice each `dynamic-registries` host's members in as `↻`
children. Strip `path-prefix` from every displayed path. A node may appear under many parents —
repetition is intended (this is a location guide). Components in `shared-roots` are shown inline
where imported *and* listed once in a Shared section. Any node never reached from a root and not in a
registry goes to the `⚠ verify` section. Superseded nodes go to a per-cluster *legacy* sub-table.

### Phase 3 — Lens Wiring *(skipped under `--test`)*

For each lens in `reference-lenses`, ensure its `## Know` table has a `What | Where | Why` row
pointing at `output-path` — add if missing, correct if stale.

### Phase N — Output Declaration

Write `output-path` — flush-and-fill — following the reference template
([reference_template](_Claude/kcd/templates/reference_template.md)), `updated` set to the run date.

Body structure:
- **How to read this** — the legend: indentation in the Component column = containment;
  `↻` dynamic-from-registry, `△` shared primitive, `⚠` untraced, *legacy* superseded; the stripped
  path note.
- A **root map table** from `entry-roots` (each root → the component(s) it mounts).
- One **table per root** (`Component | Path | What it does`); nesting shown by leading `&nbsp;`
  groups + `↳` in the Component column; depth-0 rows are the root's entry component(s). Per-cluster
  *legacy* sub-tables follow their root.
- A **Shared primitives** table (the `shared-roots` set) plus any `⚠ verify` rows.
- A **Maintenance** note naming this generator and `#{name}` as the regenerate path.

This generator produces no other output.

---

## Deployed copy

Not hand-authored. The deploy script produces it: a full copy of this canonical with requirements
solved to project values, `status: active`, and a `kcd: { canonical: … }` pointer for provenance
(see [_generator_base](_Claude/kcd/generators/_generator_base.md) → Composition Model).
