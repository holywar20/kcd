---
type: generator
status: disabled
model: remote.gemma31
base: _generator_base
---

# generate-vocabulary-dataset — Generator (canonical)

> ⚠️ **Idiom-agnostic.** This generator produces vocabulary/idiom fine-tuning data for *any*
> domain language — **KCD is only the first target.** To use it for your own domain, deploy a
> copy that solves the `idiom-source` requirement with **your** corpus of idiom-bearing
> documents and **your** idiomatic schema (the terms and artifact shapes you want a model to
> learn). The procedure below names no KCD concept; the deployed copy supplies the domain. If
> you are reading this in the interface and want to fine-tune on your own idioms, **start by
> defining your own idiomatic schema** in a deployed `idiom-source` manifest.

> **Execution model — three models touch one training pass:**
> 1. **Frontier** (authoring) — designed this procedure and the example shapes. Never emits
>    training data (provider ToS + token limits).
> 2. **Teacher** (executing) — runs *this* procedure with the idiom corpus injected as context,
>    and emits the dataset. Declared in `model:` (a teacher-tier registry key, e.g.
>    `remote.gemma31`) — **not** the Claude tier other generators run on.
> 3. **Student** (consuming) — later fine-tuned on the emitted dataset.
>
> This artifact is what the **Teacher** executes — injected via the Starmind UI. It bends two
> `_generator_base` conventions on purpose: a non-Claude executor, and a *generative* spec (the
> teacher composes examples grounded in the corpus) rather than a purely mechanical one. It is
> still a spec the executor follows — just a richer one.

Base rules: [_generator_base](_Claude/kcd/generators/_generator_base.md) — composition model,
requirement resolution, fail behavior, output conventions, modifiers.

---

## Parameters

Name  : generate-vocabulary-dataset
Task  : `#generate-vocabulary-dataset`
Model : `remote.gemma31` — the **teacher** executes this; see the Execution note above
Output: the JSONL dataset + `.meta.json` sidecar at the deployed `output-path`

---

## Modifiers

*Per `_generator_base`: `--`-prefixed, globally unique, registered. `--test` is inherited.*

| Modifier | Effect |
|---|---|
| `--shape={shape}` | Generate only the named example family (`qa` \| `rewrite` \| `author` \| `critique`). Default: all four, to the counts in `idiom-source`. |

Under inherited `--test`, emit a small sample (a few lines per shape) to `_Claude/audits/generate-vocabulary-dataset.jsonl` and skip the real `output-path` — a cheap dry run to eyeball quality before a full batch. Unknown modifier fails per `_generator_base`.

---

## Requirements

*Declared generically; solved in the deployed copy.*

| Name | Kind | Description |
|---|---|---|
| `idiom-source` | Input | Path to the deployed idiom-source manifest. Lists the corpus of idiom-bearing documents to ground on, the idiomatic schema (terms + artifact shapes to teach), and the per-shape example counts. **This is where the domain lives** — the canonical names no concrete corpus. |
| `teacher-model` | Tooling | The registered model key that executes this procedure and emits the data (the `model:` value). Must have context capacity to hold the loaded corpus. |
| `output-path` | Input | Destination for the JSONL dataset (+ `.meta.json` sidecar). |

---

## Output Format

One training example per line — JSONL, chat-pair shape (`{"messages":[…]}`), the format
Unsloth/axolotl ingest directly and the shape the student runs in. The `assistant` content is
the teaching target; it must be **grounded in the loaded corpus**, never invented.

```jsonl
{"messages":[{"role":"user","content":"{a question / instruction in the domain}"},{"role":"assistant","content":"{a correct, idiom-fluent answer grounded in the corpus}"}]}
```

Alongside it, a `.meta.json` sidecar stamps provenance so a dataset is traceable to what it was
built from:

```json
{ "idiom_source_rev": "{corpus revision/hash}", "schema_hash": "{idiomatic-schema hash}", "shapes": { "qa": 0, "rewrite": 0, "author": 0, "critique": 0 }, "teacher": "{model key}", "generated": "{date}" }
```

**The four shapes** (each grounded in the corpus, never fabricated):

| Shape | The example teaches… |
|---|---|
| `qa` | direct vocabulary/definition recall — "what is X in this framework?" |
| `rewrite` | translating plain phrasing *into* the idiom — "say this the domain's way" |
| `author` | producing a well-formed artifact of the domain from a thin brief |
| `critique` | judging an artifact against the domain's anatomy/conventions |

---

## Care

**Defends:**
- Every `assistant` target is grounded in the loaded `idiom-source` corpus — no invented terms,
  facts, or artifact shapes. A claim the corpus does not support does not enter the dataset.
- Every emitted line is valid JSONL and a well-formed `{messages:[…]}` chat pair.
- The dataset is stamped (`.meta.json`) with the corpus revision and schema hash it was built
  from — an unstamped dataset is not done.

**Will not touch:**
- The `idiom-source` corpus and manifest — read-only, always.
- Anything outside `output-path` (and `_Claude/audits/` under `--test`).

**Surfaces (notes inline, does not block):**
- A requested shape with no corpus material to ground it — note in the run-report; emit nothing
  for it rather than fabricating.
- A term in the idiomatic schema with no corpus coverage — note it; the schema and corpus have
  drifted.

---

## Do

*Pre-flight runs first per `_generator_base`: deployment check, requirement resolution, modifier
parse.*

### Phase 1 — Corpus Load

Read the `idiom-source` manifest. Load every corpus document it lists and the idiomatic schema
(the terms and artifact shapes to teach, with per-shape counts). This loaded corpus is the
**only** ground truth for generation — the teacher does not draw on its own prior knowledge of
the domain (it has none worth trusting; that is the entire reason for grounding).

### Phase 2 — Generation *(the teacher's work)*

For each shape in scope (all four, or the one named by `--shape`), compose examples to the
declared count, each grounded strictly in the loaded corpus. One example per JSONL line in the
Output Format shape. Vary surface form (phrasing, difficulty, which corpus region a pair draws
from) so the set is not repetitive. Where the corpus cannot ground a requested example, stop
short of the count and surface the gap rather than inventing.

### Phase 3 — Output Declaration

Write the JSONL to `output-path` (flush-and-fill) and the `.meta.json` sidecar beside it with
the corpus revision, schema hash, per-shape counts, teacher key, and date. This generator
produces no other output.

---

## Deployed copy

Not hand-authored. The deploy script produces it: a full copy of this canonical with
requirements solved to project values, `status: active`, and a `kcd: { canonical: … }` pointer.
For the **KCD-first** deployment, `idiom-source` resolves to a manifest listing the KCD corpus
(`kcd_framework.md`, `lens_anatomy.md`, a representative lens and habit) plus the KCD idiomatic
schema; `teacher-model` resolves to `remote.gemma31`; `output-path` to `_Claude/teacher/`.
Project-specific quirks go in a `## Project Notes` section there.
