# help — Procedure

*Base: [_utility_base](_utility_base.md). Portable-only — no deployed copy; the routing index points at this canonical.*

---

## Parameters

Name   : help
Task   : #help
Type   : Utility
Mode   : In-session (inline) — runs in the active session, spawns nothing, inherits the session model
Output : Session readout (printed) — one fixed-schema table, no file

*A utility prints to the session. It writes no file and modifies nothing. See [_utility_base](_utility_base.md).*

---

## Know

*The two structural indexes this procedure reads. Both are framework-standard locations present in every KCD project.*

| What | Where | Why |
|---|---|---|
| Lenses index | [lenses index](../../../lenses/_index.md) | Phase 1 — the roster of available lenses and their routing tags |
| Procedures index | [procedures index](../../../procedures/index.md) | Phase 1 — every ready `#`-tagged procedure and contract tag |

*Reads the indexes only. Does not open individual lens or procedure files — the index rows carry everything the readout needs.*

---

## Care

**Defends:**
- **Index fidelity** — the readout reflects exactly what the indexes contain. Every printed lens and procedure traces to a row in `lenses/_index.md` or `procedures/index.md`.
- **Output contract** — the column schema (`kind`, `tag`, `name`, `covers`) is stable and the table is the *entire* output. Downstream tooling parses it; do not reorder columns, rename them, or wrap the table in prose, headings, or a footer.
- **Read-only** — prints to the session; writes nothing, modifies nothing.

**Will not touch:**
- Source code, lens file bodies, reference files. The indexes are the sole input.

**Flags to the user (does not fabricate):**
- A missing or unreadable index → say so plainly in the readout; do not reconstruct it from the filesystem.
- A malformed index row → print what is there and note the row looks malformed; do not guess the intended value.

---

## Do

### Phase 1 — Read the indexes

Read [`lenses/_index.md`](../../../lenses/_index.md) and [`procedures/index.md`](../../../procedures/index.md). If either is missing or unreadable, note it and continue with whichever is available.

### Phase 2 — Print the readout

Emit **one table** — the roster — with a fixed column schema, one row per invocable artifact (every lens, procedure, and contract tag). A single uniform record shape so the output parses cleanly downstream. No sub-tables, no per-section headings.

| kind | tag | name | covers |
|---|---|---|---|

Columns:
- **`kind`** — one of, in this order: `lens` `generator` `investigator` `analyst` `auditor` `utility` `contract`
- **`tag`** — the invocation token: `!name` for lenses, `#name` for procedures and contract tags, `auto` for an auto-loaded lens
- **`name`** — the artifact's canonical name
- **`covers`** — the one-line description from the source index, collapsed to a single line. Strip any newline; replace any `|` with `/` so it never breaks the table cell.

Rules:
- Order rows by `kind` in the sequence above, then by `name` within a kind.
- The table is the **entire** output — no title, no "how to invoke" footer, no surrounding prose. (For piping, anything outside the table is noise.)
- Sources: `lens` rows from the lenses index; all others from the procedures index, mapping each index heading to its `kind`.

### Phase 3 — Output Declaration

This procedure produces: **a session readout only.**

Modifies: nothing.
Writes: no file.
Spawns: no sub-agent.
