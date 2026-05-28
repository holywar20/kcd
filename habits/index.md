# Index — kcd/habits

*Last updated: 2026-05-18.*

Atomic single-step operations. Inherited by lenses via their Do block.

| What | Where | Why |
|---|---|---|
| add-todo | [add-todo](add-todo.md) | When a deferred item surfaces |
| append-completed-entry | [append-completed-entry](append-completed-entry.md) | When a task is completed |
| append-session-log | [append-session-log](append-session-log.md) | End of every session |
| plan-routing | [plan-routing](plan-routing.md) | When creating a plan — routes all new plans to work/, never canonical plans/ |
| work-routing | [work-routing](work-routing.md) | Governs where work output is placed (inherited from _base) |
| write-approval | [write-approval](write-approval.md) | Governs all write operations (inherited from _base) |
| run-report | [run-report](run-report.md) | After an auditor or generator procedure's final phase — mandatory close step |
