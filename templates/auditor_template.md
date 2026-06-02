---
Status: Active
Role: Auditor
Base: _auditor_base
---

# <name> — Procedure (canonical)

*Canonical auditor definition. Holds all generic logic; declares — never solves — its requirements. Names no project-specific path or value.*

*Scaffold use: copy to `kcd/procedures/auditors/<name>.md`, fill in, then create the thin deployed copy at `procedures/auditors/<name>.md` using the Deployed Copy stub at the end.*

Base rules: [_auditor_base](../procedures/auditors/_auditor_base.md) — composition model, requirement resolution, fail behavior, output conventions.

---

## Parameters

Name  : <name>
Task  : #<name>
Model : claude-haiku-4-5-20251001
Type  : Auditor

*Auditors default to haiku — they do bulk structural work, not interpretive reasoning. Override only with a justifying comment.*

---

## Flags

*Optional. Flags modify a run's behavior or scope. Each flag is `--`-prefixed, globally unique across the entire document base, and registered in the master procedure index (Flag Registry). A flag may be omitted; no flag = default (full) behavior. An unknown flag fails the run. This slot may be empty. Auditors have no universal inherited flag — declare your own here.*

| Flag | Effect |
|---|---|
| `--<flag>` | <what it changes — a scoped subset of the run, a mode, or a concern it raises> |

---

## Requirements

*Declared generically; solved in the deployed copy. See `_auditor_base` for pre-flight resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `<requirement-name>` | Input | <what it is, generically — no concrete path or value> |

*Auditors typically need a `doc-root` or scope-defining input, and a `report-dir` for output. Add scope-limit inputs (`work-exclude`, age thresholds, etc.) as needed.*

---

## Know

*Files this procedure loads before beginning. Keep tight — every entry is a token cost on every run.*

| What | Where | Why |
|---|---|---|
| <label> | [<label>]({doc-root}/<path>) | <Phase N — before this phase begins> |

*Load lazily where possible — indexes and small references early; large per-item files inside the phase that needs them.*

---

## Care

*What this auditor defends. Constraints on behavior. Write as rules, not preferences.*

**Defends:**
- <invariant the procedure enforces>
- Ambiguity surfaces to Decisions; never silently resolved
- No file deletion — repairs references *to* files, never removes files
- Flush-and-fill — reports reflect current state only; no accumulated history

**Will not touch:**
- <out-of-scope content type>
- Any file outside the auditor's declared scope
- Files listed in any project-level Skip List the auditor declares

**Flags to Decisions (does not auto-repair):**
- <condition that requires human judgment>
- <condition>

*The Decisions/Repairs split is load-bearing. If the auditor can resolve a finding unambiguously, it does and logs to Repairs. If resolution requires human judgment, it stops and logs to Decisions. Never silently resolve an ambiguous case.*

---

## Do

*Pre-flight requirement resolution runs first, per `_auditor_base`. Phases below assume all requirements are solved and reachable.*

*Each phase should have a single clear output state — a manifest, a set of repairs, or a report. Phases should be independently inspectable: if Phase 2 fails, you should be able to re-run it without re-running Phase 1.*

### Phase 1 — <Inventory or Scan Name>

*What this phase reads. What it produces. Be specific about the output format.*

<instructions>

### Phase 2 — <Decision Logic Name>

*Describe the decision logic explicitly. If there's a repair/decision fork, write out both branches.*

For each item:
- Condition A → action (log to Repairs)
- Condition B → action (log to Decisions; do not touch the file)

### Phase N-1 — Report Generation (flush and fill)

Destroy and recreate both report files.

**`{report-dir}/<Decisions Filename>.md`**
Header: run timestamp · items requiring human input

| What | Where | Why | <extra column if needed> |
|---|---|---|---|

**`{report-dir}/<Repairs Filename>.md`**
Header: run timestamp · files scanned · total repairs made

| What | Where | Why | <extra column if needed> |
|---|---|---|---|

### Phase N — Output Declaration

*Always the last phase. Declares what this procedure produces — files written, files modified, side effects. No surprises.*

This procedure produces:
- `{report-dir}/<Decisions Filename>.md`
- `{report-dir}/<Repairs Filename>.md`

Modifies: <list of file types touched in-place>
Excludes: <list of excluded paths>
Does not produce: <console output | logs | side effects outside declared scope>

After the final phase, the `run-report` habit fires automatically (declared at `_auditor_base`).

---

## Deployed Copy

*The deployed copy is thin. Create it at `procedures/auditors/<name>.md` — same relative path as the canonical. It references this canonical and solves every declared requirement. Layer-specific fields (`canonical:` pointer back, project quirks) live in a `kcd:` block.*

````markdown
---
Status: Active
kcd:
  canonical: kcd/procedures/auditors/<name>.md
---

# <name> — Procedure (deployed)

*Deployed copy. All logic lives in the canonical: [<name> (canonical)](../../kcd/procedures/auditors/<name>.md). This file solves the canonical's requirements for <project>.*

---

## Requirements — solved

| Name | Kind | Solution |
|---|---|---|
| `<requirement-name>` | Input | `<concrete project path or value>` |

---

## Notes

- <project-specific quirk, if any>
````
