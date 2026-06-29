---
type: generator
status: disabled
model: claude-haiku-4-5
base: _generator_base
---

# easy-test — Generator (canonical)

*A deterministic test fixture. It draws three known shapes into one SVG at a hardcoded path so a
downstream grader (see [easy-test-contract](_Claude/kcd/contracts/easy-test-contract.md)) can
verify the run with a fixed, machine-checkable answer. The point is exercising the agent /
workflow harness, not the artwork — the output is fully specified, so there is nothing to
improvise.*

Base rules: [_generator_base](_Claude/kcd/generators/_generator_base.md) — composition model,
requirement resolution, fail behavior, output conventions.

---

## Parameters

Output: `_Claude/audits/easy-test/easy-test.svg` — flush-and-fill, single file, hardcoded.

*No project-specific parameters. `name` / `#{name}` derive from the filename; `model` / `base`
live in frontmatter. `model: claude-haiku-4-5` is justified — the work is fully mechanical with a
fixed answer, exactly the trivial case `_generator_base` permits a downgrade for.*

---

## Requirements

*None. The output path and the full shape spec are hardcoded below — this generator is
self-contained by design and takes no project inputs. Pre-flight is the deployment check only
(per `_generator_base`); there are no requirements to resolve.*

---

## Care

**Defends:**
- Flush-and-fill — the output file is destroyed and recreated whole on each run.
- Exact spec fidelity — the three shapes, their types, their colors, and their coordinates match
  the spec below byte-for-intent. A grader must be able to pass the file deterministically.

**Will not touch:**
- Anything outside `_Claude/audits/easy-test/` — this generator writes one file and only that file.

**Surfaces (notes inline, does not block):**
- If the output directory cannot be created or written, fail loudly — do not emit partial output.

---

## Do

*Pre-flight runs first, per `_generator_base` — deployment check only (no requirements).*

### Phase 1 — Write the SVG

Write exactly the following document to `_Claude/audits/easy-test/easy-test.svg`, flush-and-fill
(overwrite if it exists):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="300" height="100">
  <rect x="20" y="25" width="50" height="50" fill="blue" />
  <circle cx="150" cy="50" r="25" fill="green" />
  <polygon points="250,25 225,75 275,75" fill="black" />
</svg>
```

The three shapes are fixed:

| Shape | Element | Color | Position |
|---|---|---|---|
| Box | `<rect>` 50×50 | blue | left third |
| Circle | `<circle>` r=25 | green | center |
| Triangle | `<polygon>` 3 points | black | right third |

### Phase 2 — Output Declaration

After the write, print a one-line summary:

```
## easy-test report

Wrote _Claude/audits/easy-test/easy-test.svg — blue rect, green circle, black triangle.
```

This generator produces no other output.
