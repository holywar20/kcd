# Habit — work-routing

*Inherited by all lenses via _base. Defines where work output goes.*

---

All work output produced during a session goes to `_Claude/work/{lens_name}/`.

| Output type | Drop in |
|---|---|
| AI-generated output | `_Claude/work/{lens_name}/work-ai/` |
| Bryan's working documents | `_Claude/work/{lens_name}/work-human/` |
| Plans and task tracking | `_Claude/work/{lens_name}/plans/` |

Create subfolders within these as needed. Use clear, descriptive filenames — no date prefix unless the content is time-series.

**Hard rules:**
- Never write work output directly to `references/` or `lenses/` — those are read-only.
- Never write to another lens's work folder.
- Promotion from `work/` to a permanent location is always manual. Bryan decides what's canonical; Claude does not promote its own output.
