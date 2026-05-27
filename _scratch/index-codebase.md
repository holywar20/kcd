# index-codebase — Procedure

**Scope:** `ad-tech-planning/` and/or `nrs-ssp-adtech-ui/src/` — generates navigation indexes for Claude
**Mode:** Agent-native. Does not depend on a spawning lens. Accepts an optional scope argument.

---

## Config

Task  : #index-codebase
Model : claude-sonnet-4-6
Role  : Generator

---

## Know

| What | Path | Load When |
|---|---|---|
| Route map (backend) | `ad-tech-planning/public/index.php` | Phase 3a — backend scope only |
| Controllers dir | `ad-tech-planning/src/controllers/` | Phase 3a — backend scope only |
| Classes dir | `ad-tech-planning/src/classes/` | Phase 3a — data_map only |
| Frontend router | `nrs-ssp-adtech-ui/src/router/` | Phase 3b — frontend scope only |
| Views dir | `nrs-ssp-adtech-ui/src/views/` | Phase 3b — frontend scope only |
| Stores dir | `nrs-ssp-adtech-ui/src/store/` | Phase 3b — frontend scope only |
| API modules dir | `nrs-ssp-adtech-ui/src/api/` | Phase 3b — frontend scope only |
| Components dir | `nrs-ssp-adtech-ui/src/components/` | Phase 3b — frontend scope only |

---

## Care

**Defends:**
- Output files are navigation indexes only — not human documentation, not design commentary
- Each output file is flush-and-fill — destroyed and recreated on each run; no accumulation
- Output dirs are created if missing; no other directories are created

**Will not touch:**
- Any file outside `_Claude/references/codebase/` and the source dirs declared in Know
- Prose, business logic, or commented-out code in source files — reads structure and visible symbols only

**Flags to Decisions (does not auto-repair):**
- A source directory that does not exist — skip that output file and note in the final summary

---

## Do

### Phase 1 — Scope Resolution

Accepted argument values: `backend`, `frontend`, `all` (default if no argument).

Map argument to output targets:
- `backend` → routes.md, controllers.md, data_map.md in `_Claude/references/codebase/backend/`
- `frontend` → routes.md, views.md, stores.md, api.md, components.md in `_Claude/references/codebase/frontend/`
- `all` → both sets

Create output dirs if missing.

### Phase 2 — Source Inventory

Enumerate source files in scope. Do not read content yet — just list paths.

Output: list of source files per category.

### Phase 3a — Backend Index Generation (backend or all scope)

Process one output file at a time. Write each to disk before starting the next.

**routes.md** — flat table sorted by path:

| Method | Path | Controller::method |
|---|---|---|

Source: `public/index.php` — all routes, with full group prefix.

**controllers.md** — one entry per controller file (3–5 lines):
- What it owns
- Tables it touches
- What it does NOT do
- Source: controller file comments and method names

**data_map.md** — table:

| DB table | Read by | Written by |
|---|---|---|

Trace all controllers and `src/classes/` files. Mark externally-owned tables (e.g. NRS imports) with a note.

### Phase 3b — Frontend Index Generation (frontend or all scope)

Process one output file at a time. Write each to disk before starting the next.

**routes.md** — table:

| Path | View Component | Role Guard |
|---|---|---|

Source: router files. Omit "Role Guard" cell if none present.

**views.md** — one entry per view file (2–3 lines per entry), grouped by subdir (`ssp/`, `saturation/`, `sas/`, `shared/`):
- What it displays
- Store modules used
- API modules called

**stores.md** — one entry per Store module:
- State owned
- Key actions
- Key getters

**api.md** — one entry per API module:
- Base path
- Exported method names (list)

**components.md** — grouped by subdirectory; one line per component: filename and purpose. Root-level components listed under `(root)`.

### Phase 4 — Output Declaration

This procedure produces (depending on scope):
- `_Claude/references/codebase/backend/routes.md`
- `_Claude/references/codebase/backend/controllers.md`
- `_Claude/references/codebase/backend/data_map.md`
- `_Claude/references/codebase/frontend/routes.md`
- `_Claude/references/codebase/frontend/views.md`
- `_Claude/references/codebase/frontend/stores.md`
- `_Claude/references/codebase/frontend/api.md`
- `_Claude/references/codebase/frontend/components.md`

After completing all files, print a summary:

```
## index-codebase summary

| File | Items |
|---|---|
| backend/routes.md | N routes |
| backend/controllers.md | N controllers |
| ... | ... |
```

Modifies: all declared output files in-place (flush-and-fill).
Does not modify source files, lens files, or any other `_Claude/` content.
