# <procedure-name> — Procedure

---

## Parameters

Task   : #<tag-name>
Model  : claude-sonnet-4-6
Type   : < Investigator | Analyst | Generator >
Mode   : < Agent-native | Lens-spawned | Interactive >
Output : _Claude/< automation/audits | automation/reports | automation/references | path/to/output >/

*Type reference: [agent_types](../docs/agent_types.md) — Investigator uses haiku, Analyst and Generator use sonnet, override when justified.*
*Mode: Agent-native runs standalone. Lens-spawned inherits a parent lens's context. Interactive requires Bryan in the loop at decision points.*
*Add scope limits, flags, or thresholds here rather than burying them in Do phases.*

---

## Know

*Files this procedure loads before beginning. Keep this list tight — every entry is a token cost paid on every run. Only declare what the procedure genuinely cannot function without.*

| What | Path | Load When |
|---|---|---|
| <label> | `_Claude/<path>` | <Phase N — before this phase begins> |

*Pattern from heal-docs: indexes and structural references load in Phase 1; lens files load in Phase 4 (the lens-review phase). Load lazily — don't front-load everything.*

---

## Care

*What this procedure defends. Constraints on behavior. What it will not touch. What it sends to Decisions rather than auto-resolving.*

*This is not a personality — it is a constraint set. Write it as rules, not preferences. A procedure that cannot describe how it breaks is underspecified.*

**Defends:**
- <invariant the procedure enforces — e.g. "One canonical path per reference — does not create duplicates">
- <invariant>

**Will not touch:**
- <out-of-scope item — e.g. "Prose, arguments, or Care block content inside lens files">
- <out-of-scope item>

**Flags to Decisions (does not auto-repair):**
- <condition that requires human judgment — e.g. "Broken link with zero or multiple candidate matches">
- <condition>

*The Decisions/Repairs split is load-bearing. If the procedure can resolve it unambiguously, it does and logs to Repairs. If resolution requires human judgment, it stops and logs to Decisions. Never silently resolve an ambiguous case.*

---

## Do

*The phase sequence. Each phase should have a single clear output state — either a manifest, a set of repairs, or a report. Phases should be independently inspectable: if Phase 2 fails, you should be able to re-run it without re-running Phase 1.*

*Name phases by what they produce, not what they do: "Inventory" not "Walk the tree." "Link Resolution" not "Check links."*

### Phase 1 — <Name>

*What this phase reads, what it produces. Be specific about the format of the output — a manifest, a list, a set of files.*

<instructions>

### Phase 2 — <Name>

*Describe the decision logic explicitly. If there's a repair/decision fork, write out both branches.*

<instructions>

For each item:
- Condition A → action (log to Repairs)
- Condition B → action (log to Decisions; do not touch the file)

### Phase N — Output Declaration

*Always the last phase. Declares what this procedure produces — files written, files modified, side effects. No surprises.*

*Pattern from heal-docs:*

This procedure produces:
- `_Claude/reports/<ReportName>.md`

Modifies: <list of file types touched in-place>
Does not produce: <console output | logs | side effects outside declared scope>

*If the procedure generates reports, use flush-and-fill: destroy and recreate the report file on each run. Reports represent current state, not history. Past runs are not preserved.*

---

## Notes on heal-docs as reference

*`_Claude/kcd/procedures/heal-docs.md` is the canonical working example of this template. Key patterns to borrow:*

- *Phase names match their output artifact, not their method*
- *Care's Decisions list is exhaustive — every ambiguous case is pre-categorized*
- *Output Declaration is explicit about what is and is not a side effect*
- *Sub-agent spawning (Phase 4) is scoped: each sub-agent gets only what it needs, returns structured output, does not write reports directly*
- *"Flush and fill" for reports: the procedure destroys the prior report and recreates it — no accumulated history, current state only*
