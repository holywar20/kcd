---
type: generator
status: disabled
model: claude-sonnet-4-6
base: _generator_base
---

# generate-postman — Generator (canonical)

*Generic across any Slim-style PHP API project with a central route map. The deployed copy solves
the requirements below with project-specific values.*

Base rules: [_generator_base](_Claude/kcd/generators/_generator_base.md) — composition model,
requirement resolution, fail behavior, output conventions, modifiers.

---

## Parameters

Output: one `{output-dir}/{ControllerClassName}.postman_collection.json` per discovered
controller — flush-and-fill across the full set.

*Under `--test`, the destination is redirected to the generator-output bucket per
`_generator_base` (`_Claude/audits/generate-postman/{ControllerClassName}.postman_collection.json`,
one file per controller). `name` / `#{name}` derive from the filename; `model` / `base` live in
frontmatter.*

---

## Requirements

*Declared generically here; solved in the deployed copy. See `_generator_base` for pre-flight
resolution and the fail rule.*

| Name | Kind | Description |
|---|---|---|
| `route-source` | Input | File registering all HTTP routes — source of method, full path, and controller method name. Used for controller discovery and route extraction. |
| `controller-dir` | Input | Directory containing controller source files. |
| `output-dir` | Input | Directory where collection JSON files are written. |
| `collection-prefix` | Input | Prefix prepended to collection names: `{collection-prefix} - {ShortName}`. |
| `base-url-var` | Input | Postman variable name for the API base URL (used in collection variables and URL encoding). |
| `auth-var` | Input | Postman variable name for the bearer token. |

---

## Care

**Defends:**
- Flush-and-fill across the full output set — every collection is fully regenerated each run.
- `_postman_id` is preserved from any existing collection (enables in-place Postman replace).
- Bearer auth is on every route via collection-level auth — no exceptions, never at request level.
- Only controllers with at least one registered route group in `{route-source}` get a collection.

**Will not touch:**
- Business logic in controller files — read-only.
- Files in `{output-dir}` that do not correspond to a discovered controller.

**Surfaces (notes inline, does not block):**
- A route in `{route-source}` with no matching method in the controller file — note as "unmatched" in the summary.
- A controller file in `{controller-dir}` with no route group in `{route-source}` — silently skipped (not a routing controller).

---

## Do

*Pre-flight runs first, per `_generator_base` — deployment check, then requirement resolution.*

### Phase 1 — Controller Discovery

Read `{route-source}`. Identify every distinct controller class referenced in route group
registrations. These are the controllers that have routes and need collections.

For each discovered controller, derive:
- **Controller file:** `{controller-dir}/{ControllerClassName}.php`
- **Output path:** `{output-dir}/{ControllerClassName}.postman_collection.json`
- **Collection name:** `{collection-prefix} - {ShortName}` where ShortName = ControllerClassName minus "Controller"

If an output file already exists for a controller: read it and extract `info._postman_id` for
reuse. Otherwise generate a new UUID for that controller.

### Phase 2 — Route Extraction (per controller)

For each controller from Phase 1, extract its route group from `{route-source}`:
- HTTP method (GET, POST, PATCH, DELETE, etc.)
- Full path including group prefix
- Controller method name

Output: a list of `{method, path, controller_method}` for each controller.

### Phase 3 — Controller Analysis (per controller)

For each route from Phase 2, read the corresponding method in the controller file and identify:
- **Path params** — variables from `$args`
- **Query params** — keys from `getQueryParams()`
- **Request body** — keys from `getParsedBody()` (POST/PATCH only)
- **Responses** — infer status codes from `withStatus()` calls; infer body shape from response writes and SQL columns
- **Inline comments** — use existing `//` comments to inform request descriptions

### Phase 4 — Collection Assembly (per controller)

Build a Postman Collection v2.1 JSON document for each controller.

**Collection-level variables** — always include `{base-url-var}` and `{auth-var}`; add one
variable per unique path param appearing in this controller's routes.

**Collection-level auth:**
```json
{ "type": "bearer", "bearer": [{ "key": "token", "value": "{{auth-var}}", "type": "string" }] }
```

**Multiple-surface rule** — when a route accepts meaningfully different input states, generate
one named sibling request per variation. Split only on genuinely different call patterns, not
different data values.

**Saved examples** — include at least one saved example per request; one per explicitly-returned
status code for routes with multiple outcomes.

**URL encoding:**
```json
{ "raw": "{{base-url-var}}/path/{{param}}", "host": ["{{base-url-var}}"], "path": ["segment", "{{param}}"] }
```

Write the completed JSON to the output path derived in Phase 1.

### Phase 5 — Output Declaration

After all collections are written, print a summary table:

```
## generate-postman report

| Controller | Collection | Routes | Items |
|---|---|---|---|
| CampaignsController | Planning - Campaigns | N | N |
| ...                 | ...                  | N | N |
```

List any unmatched routes (routes in `{route-source}` with no corresponding method) at the
bottom of the report.
