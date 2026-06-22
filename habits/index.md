---
type: index
status: active
updated: 2026-06-04
---

# Index — kcd/habits

Atomic single-step reflexes, inherited by lenses through their Do block (or `_lens_base`).

| What | Where | Why |
|---|---|---|
| add-todo | [add-todo](_Claude/kcd/habits/add-todo.md) | When a deferred item surfaces — capture it to the todo store |
| append-completed-entry | [append-completed-entry](_Claude/kcd/habits/append-completed-entry.md) | When a task is completed — log it to the completed store |
| append-session-log | [append-session-log](_Claude/kcd/habits/append-session-log.md) | End of every session — record the session-log line |
| index-format | [index-format](_Claude/kcd/habits/index-format.md) | When writing or modifying any navigational index — enforce the What/Where/Why shape |
| no-subagents | [no-subagents](_Claude/kcd/habits/no-subagents.md) | When tempted to delegate — process the task yourself; spawn a subagent only on explicit request, and draft its prompt for the user to run |
| plan-routing | [plan-routing](_Claude/kcd/habits/plan-routing.md) | When creating a plan — route new plans to `work/`, never canonical `plans/` |
| run-report | [run-report](_Claude/kcd/habits/run-report.md) | After an analyzer's or generator's final phase — mandatory close step |
| work-routing | [work-routing](_Claude/kcd/habits/work-routing.md) | Governs where work output is placed (inherited from `_lens_base`) |
| write-approval | [write-approval](_Claude/kcd/habits/write-approval.md) | Governs all write operations (inherited from `_lens_base`) |
