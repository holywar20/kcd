---
type: contract
status: disabled
scope: workflow:easy-test
---

# Easy Test — Contract

> Grade the output of the [easy-test](_Claude/kcd/generators/easy-test/easy-test.md) generator:
> read the SVG it wrote, check the three known shapes, and return a single PASS / FAIL verdict.

> This is a test fixture for the agent / workflow harness. The expected answer is fixed, so the
> grade is deterministic — a useful known-good signal when driving generators from a workflow
> graph. Pairs one-to-one with the `easy-test` generator.

---

## When

This contract activates whenever a session or sub-agent:
- Receives `#easy-test-contract` or "grade the easy-test output" / "test the easy-test SVG"
- Runs as the verify step after the `easy-test` generator in a workflow graph
- Is asked to confirm `_Claude/audits/easy-test/easy-test.svg` is correct

---

## Artifact Format

A grade — printed inline (and written to `_Claude/audits/easy-test/easy-test-grade.md` when run
unattended), flush-and-fill. Shape:

```markdown
# easy-test grade — PASS | FAIL

| Check | Expected | Found | OK |
|---|---|---|---|
| Box | blue rect | ... | ✅ / ❌ |
| Circle | green circle | ... | ✅ / ❌ |
| Triangle | black triangle | ... | ✅ / ❌ |

**Verdict:** PASS | FAIL — {one-line reason}
```

---

## Lifecycle

### Phase 1 — Read

**Trigger:** The contract is invoked.

**Together:** Read `_Claude/audits/easy-test/easy-test.svg`. If the file does not exist or is not
parseable as SVG, that is an immediate **FAIL** — record it and skip to Phase 3.

**Standard:** The file's contents are in hand, or absence is recorded as a hard fail.

### Phase 2 — Check the three shapes

**Trigger:** The SVG was read.

**Together:** Verify each of the three required shapes is present with the right element and the
right color. Judge by intent, not by exact string — accept color synonyms (`blue` /
`#0000ff` / `rgb(0,0,255)`, `green` / `#008000`, `black` / `#000000`) and any valid encoding of
each shape.

| Check | Passes when |
|---|---|
| Box | a `<rect>` (or equivalent box path) with a blue fill exists |
| Circle | a `<circle>` (or `<ellipse>` with equal radii) with a green fill exists |
| Triangle | a closed three-point `<polygon>`/`<path>` with a black fill exists |

Record each check as OK or not, with what was actually found.

**Standard:** All three checks evaluated; each has a concrete found-value, not a guess.

### Phase 3 — Verdict

**Trigger:** All checks evaluated (or a hard fail from Phase 1).

**Together:** Emit the grade in the Artifact Format above. **PASS only if all three checks are
OK.** Any missing, miscolored, or wrong-typed shape → **FAIL**, naming which check(s) failed.

**Standard:** Exactly one verdict — PASS or FAIL — with a one-line reason and the per-check table.

---

## Standards

- **Hard gate — all three or fail.** PASS requires box, circle, and triangle all correct. There
  is no partial pass.
- **Missing file is FAIL, not an error.** A missing or unparseable SVG grades FAIL; the contract
  still returns a verdict.
- **Judge intent, tolerate representation.** Color synonyms and equivalent shape encodings pass;
  wrong color or wrong shape type does not.
- **Deterministic.** The same SVG always yields the same grade — this is what makes it a useful
  harness signal.

---

## Edge Cases

- **Extra shapes present:** Not a failure. Grade only the three required shapes; ignore extras.
- **Right shape, wrong color** (e.g. a red rect): FAIL the relevant check — color is part of the spec.
- **Shapes drawn but malformed SVG** (won't parse): FAIL at Phase 1.

---

## Scope Values

`scope: workflow:easy-test` — this contract is not loaded into every session and is not wired to a
lens. It is invoked on demand by the easy-test workflow (or by tag), paired with the `easy-test`
generator. The `scope` field is self-documenting; contracts are loose and not chain-conformed by
the structural audit.
