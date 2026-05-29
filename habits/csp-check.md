# Habit: csp-check

**When:** A change introduces or references an external resource — a new domain in `fetch()` or `XMLHttpRequest`, an `iframe` source, a `<script>` source, a font URL, an image host, or any cross-origin asset. Fires especially when adding a new widget or extending an existing widget to call a new API. **Also fires when an inline `<script>` block in `index.html` or any served HTML is added or edited** — inline content is hashed in `script-src`, and the hash invalidates on the slightest byte change.

**Why:** The app is gated by a strict Content Security Policy. A host the CSP does not allowlist is silently blocked by the browser at runtime — the feature appears broken with the explanation only in the JS console. Catching at write-time costs one minute; catching after deploy costs a debugging session. This habit makes the CSP surface visible at the moment code lands, not when the user clicks the button.

Anything this habit misses surfaces in `server/data/csp-violations.log` instead. The log is the safety net — agents who notice entries there have the data they need to reconcile after the fact.

**Rules:**

- Before considering the change done, enumerate every external host the change introduces or relies on.

- For each host, name the CSP directive it falls under:
  - `script-src` — `<script src>` AND inline `<script>` content (including `<script type="importmap">`). Inline content is whitelisted by `'sha256-…'` hash over the EXACT bytes between the script tag's opening `>` and closing `<`. Any whitespace change in an inline script invalidates the hash.
  - `style-src` — stylesheet links, inline `<style>`
  - `font-src` — `@font-face` URLs
  - `img-src` — `<img>`, `background-image`
  - `connect-src` — `fetch()`, `XMLHttpRequest`, WebSocket, EventSource
  - `frame-src` — `<iframe>` sources
  - `media-src` — `<audio>`, `<video>`

- For third-party embeds (iframe, third-party script, third-party CSS), also look up companion hosts in the table below. **Add the primary AND every documented companion at the same time** — silently allowlisting only the primary is the bug this habit was extended to prevent.

- If a host is already in the CSP, mention it for the record and continue.

- If a host is not yet in the CSP, surface it. Never silently extend the allowlist — every addition is a deliberate decision by Bryan.

- If the CSP file does not yet exist (pre–Phase 4 of `auth-and-api-wiring`), append the host to `_Claude/work/dd/pending-csp.md` so the list seeds the initial CSP allowlist when it's authored. Create the file if missing.

**Companion-host lookup (extend as new services are integrated):**

| Primary host (the one in source) | Companion hosts (loaded at runtime) | Directive(s) for companions |
|---|---|---|
| `www.youtube.com` (iframe embed) | `i.ytimg.com` | `img-src` |
| `www.youtube-nocookie.com` | `i.ytimg.com`, `s.ytimg.com` | `img-src`, `script-src` |
| `fonts.googleapis.com` | `fonts.gstatic.com` | `font-src` |
| `js.stripe.com` | `q.stripe.com`, `m.stripe.com` | `connect-src`, `img-src` |
| `maps.googleapis.com` | `maps.gstatic.com` | `img-src`, `script-src` |

When integrating a service not in this table, check the service's CSP documentation for its load list and add a row if you find one. If the documentation is unclear, ship with just the primary — the violations log will surface anything that was missed.

**Action when a host needs CSP attention:**
> "This change introduces external host `<host>` (directive: `<directive-name>`) for `<feature/widget>`. Not currently on the CSP allowlist. Options: (1) add to CSP, (2) rework to a same-origin alternative, (3) drop the dependency."

**Action when a third-party embed has documented companions:**
> "This change embeds `<primary-host>`. Its documented companion hosts `<companion-list>` will load at runtime even though they don't appear in the source. Allowlisting primary and companions together in `server/csp.js` — `<host>` under `<directive>`, `<companion>` under `<companion-directive>`."

**Action when an inline script is added or edited:**
> "This change touches the inline `<script>` block at `<file:line>`. The hash in `server/csp.js` MUST be recomputed or the script will block in enforcing mode. Recomputing via the one-liner in `server/csp.js`'s `script-src` rationale, then updating the constant."

**Action when only same-origin resources are touched:**
> "Change is same-origin only — no CSP impact."

**Not in scope for this habit:**

- Inline event handlers (`onclick="..."`), `eval()`, `new Function()` — these break under strict CSP regardless of host. Catching those is a code-review concern, not an allowlist concern. (Vue's runtime template compiler uses `new Function()` — already accepted as a trade-off via `'unsafe-eval'`.)
- Subresource Integrity hashes for cross-origin assets — separate concern, separate habit if it becomes one.
