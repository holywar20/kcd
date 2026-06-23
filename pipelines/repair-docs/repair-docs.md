---
type: pipeline
status: disabled
base: _pipeline_base
---

# repair-docs — Pipeline (canonical)

*Generic across any KCD-structured documentation tree. The automated drift-healing recipe:
[audit-structure](_Claude/kcd/analyzers/audit-structure/audit-structure.md) **detects** drift and
emits a repair manifest + a decisions report, then
[apply-repairs](_Claude/kcd/generators/apply-repairs/apply-repairs.md) **applies** the manifest
in-place. Fully automated — no human gate. The decisions report is the pipeline's human-facing
output, read out-of-band. The deployed copy solves the requirements below with project values.*

Base rules: [_pipeline_base](_Claude/kcd/pipelines/_pipeline_base.md) — composition model, stage
rules, pre-flight, output & failure.

*This is the recombined `heal-docs`: the old monolithic auditor, split along the
judgment/mechanical line (C5) and rewired as a pipeline. The analyzer decides what to fix; the
generator fixes it; this recipe sequences them. Judgment and the mechanical write stay in
separate agents — the forcing function the two-agent model runs on.*

---

## Requirements

*The inputs the stages collectively need that aren't produced by an earlier stage. Declared
generically here; solved in the deployed copy. See `_pipeline_base` for pre-flight resolution.*

| Name | Kind | Description |
|---|---|---|
| `doc-root` | Input | Root of the documentation tree. Shared by both stages (audit-structure reads it; apply-repairs is bounded by it). |
| `work-exclude` | Input | Project scratch subtree excluded from the audit (audit-structure's `excluded` zone member). |
| `log-max-age` | Input | Maximum age in days for a log entry (audit-structure computes the prune cutoff from it). |
*The **repair manifest** is **not** a requirement — it is stage 1's output, wired into stage 2
internally (see Stages). Each stage resolves its own requirements against the deployed copies of
`audit-structure` / `apply-repairs`; this pipeline declares only what neither stage produces.*

---

## Stages

*Ordered execution. Stage 2 consumes stage 1's manifest and runs only when that manifest carries
at least one repair row. No human-gate stage — the decisions report is an output, not a gate.*

| # | Stage | Invokes | Type | Input | Output | Run if |
|---|---|---|---|---|---|---|
| 1 | detect | `audit-structure` | analyzer | the doc tree at `{doc-root}` | `reports/audit-structure.md` (decisions) **+** `reports/audit-structure-manifest.md` (repair manifest) | always |
| 2 | apply | `apply-repairs` | generator | stage 1's manifest (`reports/audit-structure-manifest.md`) | in-place edits to the deployed tree **+** `audits/apply-repairs.md` (run log) | manifest non-empty |

**Wiring notes:**
- **Stage 1 → Stage 2** is the manifest file. `apply-repairs` reads it as its `repair-manifest`
  requirement; the pipeline does not copy or transform it.
- **`Run if` (stage 2): manifest non-empty.** When `audit-structure` slates zero repairs, the
  manifest table is empty and the apply stage is **skipped** — the run summary records it. The
  decisions report (stage 1) still stands as the run's substantive output.
- The decisions report is never an input to stage 2 — it is human-facing only.

---

## Output

*A pipeline writes only its run summary; the substantive outputs are the stages' own.*

- **Decisions report** (human-facing): `_Claude/reports/audit-structure.md` — the items a human
  must resolve (ambiguous links, canonical-zone health, lens gaps, frontmatter decisions).
- **Repair manifest:** `_Claude/reports/audit-structure-manifest.md` — stage 1 → stage 2.
- **Applied repairs:** in-place edits to the deployed tree, logged at `_Claude/audits/apply-repairs.md`.
- **Run summary:** `_Claude/audits/repair-docs-run.md` — which stages ran, each outcome (including
  a skipped apply stage on an empty manifest), and where it stopped if it failed.
