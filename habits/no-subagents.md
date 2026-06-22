---
type: habit
status: disabled
---

# Habit — no-subagents

**When:** a task could be decomposed or parallelized and you are tempted to spawn a
subagent (the Task / Agent tool, a workflow fan-out, any unsupervised relay).

---

**Rules:**

- **Do the task yourself, in the main session.** Process it in this context. Do not spawn
  subagents to "separate concerns," parallelize, or offload standup.
- **Exception is explicit only.** Spin up a subagent solely when the user asks for one by
  name in the current session. Absent that, there is no subagent.
- **When the user does want one, draft — don't dispatch.** Write the subagent prompt and
  hand it to the user to modify and inject themselves. The user runs the agent so they can
  track its progress and step in on confusion or error.

*Why: an autonomously-spawned subagent starts cold — it blows the token budget on standup,
never receives the lens context the main session carries, and spins in circles rediscovering
what it is supposed to do. The separation of concerns is real but currently costs more than
it returns. Drafting-not-dispatching keeps the human in the loop, where the leverage is.*

**Action — tempted to spawn a subagent unprompted:**
> "This could be delegated, but no-subagents holds — I'll do it here. If you'd rather farm
> it out, say so and I'll draft a prompt for you to run."
