---
Status: Active
Role: Contract
Scope: universal
---

# Plan — Contract

> Lifecycle and format agreement for every plan in the project. Plans are durable design artifacts; this contract is how a session knows what a plan is, where it lives, and how it changes state.

---

## When

This contract activates whenever a session:
- Creates a new plan (`#write-plan`, "draft a plan", "let's plan this")
- Promotes a plan from draft to canonical (`#promote-plan`)
- Closes out a completed plan (`#retire-plan`)
- References or invokes an existing plan in any state

If a session is about to start non-trivial implementation work without an active plan, surface that and consult Phase 1 below.

---

## Artifact Format

A plan is a single markdown file. Working scaffold: [plan_template](../templates/plan_template.md).

**Frontmatter (mandatory):**

```yaml
---
type: plan
status: Draft | Active | Paused | Complete | Superseded
lens: {lens-name | "cross"}
created: YYYY-MM-DD
updated: YYYY-MM-DD
---
```

**Body sections** (in order; optional sections may be omitted entirely):
- **Title + one-line purpose** — blockquote under the H1
- **Goal** — one paragraph
- **Approach** — high-level strategy, why this sequence
- **Phases** — each numbered, with Purpose, End state, and number-letter checkboxes
- **What | Where | Why table** — the plan's spine; every deliverable a row
- **Files Affected** — optional; which files or domains will change
- **Open Questions** — optional; unknowns blocking specific phases
- **Notes** — optional; intermediate thinking, prior decisions
- **Current State** — one sentence (Active) or a completion record (Complete)

**Naming:**
- In `work/`: `_Claude/work/{lens}/plans/YYYY-MM-DD_{description}.md` — dated, kebab-case description.
- In `plans/`: `_Claude/plans/{lens}_{description}.md` — no date, same description. Date is stripped at promotion.

---

## Lifecycle

### Phase 1 — Write

**Trigger:** A new plan is being authored — from scratch or from a design discussion.

**Together:** The session and the user shape the plan into the Artifact Format above. The session does the writing; the user resolves design questions as they surface. The plan goes to `_Claude/work/{lens}/plans/YYYY-MM-DD_{description}.md` — never directly to `_Claude/plans/`. A plan in `work/` is a thinking tool, not authorization to act.

**Standard:** Every row of the What/Where/Why table is answered (no `TBD` cells remaining as the plan stabilizes). The goal fits in one sentence. Action items carry number-letter IDs (`1.a`, `1.b`) with checkboxes. Phases sequence such that each unlocks the next. Phase names describe outputs, not methods ("Inventory", not "Walk the tree"). Micro-decisions defer to the session that does the work — no method names, SQL fragments, or exact component props in the plan.

### Phase 2 — Promote

**Trigger:** User explicitly directs that a `work/` plan is ready to become canonical. Sessions do not self-promote.

**Together:** The session runs the quality gate (see Standards below). If the gate passes, move the file from `work/{lens}/plans/YYYY-MM-DD_{description}.md` to `plans/{lens}_{description}.md` (strip date prefix), set `status: Active`, register the plan under the correct lens section of `plans/index.md`, heal all relative path references (the move changes depth), and delete the original `work/` file. Plans are living documents — once promoted, the canonical `plans/` file is authoritative and the `work/` draft has no further role.

**Standard:** The quality gate is hard. A plan that fails any check goes back to the user for revision — not forward to `plans/`. After promotion, the canonical file is authoritative. Strip all `work/`-framing language ("this is a draft", "exploratory", "TBD once we decide X") — replace with neutral present-tense statements of scope.

### Phase 3 — Retire

**Trigger:** A plan in `plans/` has been delivered.

**Together:** The session audits the plan against reality — unchecked tasks, stale forward-looking language, divergences between plan and outcome, debug artifacts in touched files. Each is a hard gate (see Standards). Once cleared: set `status: Complete`, rewrite Current State as a completion record, sync logging hygiene (lens TODOs, completed log, session log), update references in the plans index and lens, move file to `plans_complete/{filename}`.

**Standard:** The retired plan is a historical record — accuracy over kindness. Do not invent outcomes or smooth over divergences. Per-phase bullets in Current State describe what each phase *actually* delivered, not what it planned to deliver. Active deferrals (items carried forward) name their landing spot — lens TODO, future plan, deferred decision.

---

## Standards

**A plan is:**
- Readable cold — a reader can grasp scope and sequence with no prior context.
- Spined by the What/Where/Why table. An unanswered row is an open design question, not a placeholder.
- Bounded — more than 5 top-level phases suggests two plans hiding in one.

**A plan is not:**
- A commit to every implementation detail (method names, SQL, exact props belong in implementation sessions).
- A task list to execute from `work/` — only `plans/` authorizes action.
- Self-promoting — promotion is always explicit and always by the user.

**Promotion quality gate** (all must pass):
1. Frontmatter present and complete (`type`, `status`, `lens`, `created`).
2. One-sentence goal present.
3. What/Where/Why table fully answered — no `TBD` cells.
4. Every action item has a number-letter ID and a checkbox.
5. Phases logically sequenced — each phase's output is the input for the next.

**Retirement gates:**

1. **Unchecked checkboxes** — *hard, blocks archive.* Confirm per item: resolved, deferred, or out of scope.
2. **Debug artifacts in files touched this session** — *advisory; surface and narrate, do not block on quantity.* Grep the session's diff (not the full "Files Affected" list — that history may span many sessions and is not the retire session's responsibility) for: `dd(`, `dump(`, `var_dump(`, `print_r(`, bare `die(`/`exit(`, `console.log(`, `console.error(`, `console.warn(`, `debugger`, commented-out blocks of >2 lines, `TODO`/`FIXME`/`HACK` inline comments. Use judgment: **operational logging** (boot banners, structured `console.warn`/`error` in handlers, labeled error reporting) is not a debug artifact and is not a finding. Only genuine leftovers — ad-hoc prints, forgotten `debugger`, stale `TODO` comments — get surfaced in the retirement narrative.
3. **Stale lens TODOs** — *hard, blocks archive.* Tasks completed during the plan but never checked off — sweep into Completed before archive.

---

## Edge Cases

- **Multi-lens plan:** `lens: cross` in frontmatter. Surfaces in every relevant lens's Active Plans, registered once in `plans/index.md`.
- **Abandoned `work/` plan:** No promotion path; delete the file or leave with `status: Superseded` and a Notes entry explaining why.
- **Scope creep mid-execution:** Stop, surface to user. Either revise the plan in place (update What/Where/Why and re-confirm) or split off a new plan. Do not silently extend.
- **Plan superseded by another:** Old plan gets `status: Superseded`, new plan's Notes references the predecessor. Both archive to `plans_complete/` at retirement.
- **Pre-convention dated names** in `plans/` — retain original filename; retroactive renaming is a manual cleanup task, not a contract requirement.
- **Plan in `work/` invoked as authorization to act:** Hard stop. Surface the rule: the plan must be promoted first. Do not execute.

---

## Scope Values

- `universal` — referenced from `_base`; loaded into every session.
- `lens:{lens-name}` — referenced from a single lens's Know block; loaded when that lens activates.
- `persona:{persona-name}` — referenced from a persona-style lens (e.g. `!novice`, `!teaching`); loaded as a behavioral overlay.

The `Scope:` frontmatter field declares one of the above. Contracts are loose — heal-docs does not chain-conform them; the Scope field is self-documenting for human readers.
