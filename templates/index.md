# Index — kcd/templates

*Last updated: 2026-05-21.*

Starter files for every structured artifact in the framework. Use the most specific template available — typed procedure templates are preferred over the general procedure template.

---

## Procedures

| What | Where | Use When |
|---|---|---|
| Investigator template | `kcd/templates/investigator_template.md` | Writing a new Investigator — output baked to `automation/audits/` |
| Analyst template | `kcd/templates/analyst_template.md` | Writing a new Analyst — output baked to `automation/reports/` |
| Generator template | `kcd/templates/generator_template.md` | Writing a new Generator — canonical scaffold (declares requirements, references `_generator_base`) plus deployed-copy stub |
| Procedure template (general) | `kcd/templates/procedure_template.md` | Writing a solo or other procedure not covered by the typed templates |

## Plans

| What | Where | Use When |
|---|---|---|
| Plan template | `kcd/templates/plan_template.md` | Starting a new plan — naming convention, lifecycle, phase structure |

## Lenses

| What | Where | Use When |
|---|---|---|
| Lens template | `kcd/templates/lens_template.md` | Creating a new lens — K/C/D skeleton with placeholders |

## References

| What | Where | Use When |
|---|---|---|
| Reference template | `kcd/templates/reference_template.md` | Creating a new reference — pointer to a living artifact with location, interface, and status |

## Indexes & Schema

| What | Where | Use When |
|---|---|---|
| Index template | `kcd/templates/index_template.md` | Creating a new `index.md` for any folder — standard What/Where/Why table with frontmatter |
| Frontmatter schema | `kcd/docs/frontmatter_schema.md` | Reference for all valid `session:` and procedure-namespaced frontmatter keys and per-type defaults |
