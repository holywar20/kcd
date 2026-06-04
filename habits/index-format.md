---
type: habit
status: disabled
---

# Habit — index-format

*Inherited by all lenses via `_lens_base`. Defines the canonical shape of any navigational
index in the project.*

---

**When:** writing, modifying, or auditing any index file.

An "index" is any file whose primary purpose is navigation — pointing readers at other files.
Examples: `plans/index.md`, `kcd/habits/index.md`, the `## Know` and `## Do` reference tables in
every lens, a catalogue under `references/domain/`. If a file's job is to answer "where do I
find X?" it's an index.

---

**Action:** structure each navigable section as a 3-column markdown table with the header:

```markdown
| What | Where | Why |
|---|---|---|
```

- **What** — the destination's name in plain language. Not the filename. ("Per-Widget API
  Surface", not "per-widget-api-surface".)
- **Where** — a markdown link whose link text is the file stem (or a meaningful short slug). The
  href is the vault-root path.
- **Why** — one phrase capturing what the reader gets by clicking through. Bias toward purpose
  ("decompose persistence into per-widget endpoints") over content summary ("contains 6 phases
  and a table"). One sentence max.

Each row is exactly one navigable destination.

A **4th column** is permitted only when an extra dimension is load-bearing for a specific index —
e.g. `What | Where | Why | Command` for the lens roster, where the routing tag is itself
navigational. The first three columns and their semantics never change; only a trailing column
may be added. Use sparingly (mirrors the same exception in `kcd/docs/lens_anatomy.md`).

Multi-section indexes use a `## Heading` between tables. The heading names the group; the table
holds the rows. Group by audience or status (e.g. `## Cross-lens` / `## Complete` /
`## Retired`), not by alphabet.

**Format:**
- Blank line before every table (Obsidian rendering requirement).
- No leading/trailing whitespace inside cells.
- Link display text never starts with an underscore (Obsidian renders as italic).

---

**Counter-examples (do not use):**
- Bullet list of links — drops the *why*, forces the reader to open each to learn purpose.
- 2-column `What | Where` — same problem.
- Prose paragraph — not scannable, not atomically amendable.
- Long `Why` text spilling to a second line — compress or move detail to the destination.

---

**Why this format:** the *why* column is the load-bearing one. Without it, an index is just a
directory listing — the reader has to open files to find what they need. With it, the reader can
scan, decide, and click once. This is the difference between "I have a folder of plans" and
"I have a navigable plan library." It compounds as the index grows.
