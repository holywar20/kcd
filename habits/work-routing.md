---
type: habit
status: disabled
---

# Habit — work-routing

*Inherited by every lens via [`_lens_base`](_Claude/kcd/lenses/_lens_base.md). Defines where
session output goes.*

---

All work output produced during a session goes to `_Claude/work/{lensname}/`:

| Output type | Drop in |
|---|---|
| AI-generated output | `_Claude/work/{lensname}/AI/` |
| The user's working documents | `_Claude/work/{lensname}/human/` |
| Plans and task tracking | `_Claude/work/{lensname}/plans/` |

Create subfolders as needed. Use clear, descriptive filenames — no date prefix unless the
content is time-series.

**Hard rules:**

- Never write work output directly to `references/` or `lenses/` — those are read-only during
  sessions.
- Never write to another lens's work folder.
- Promotion from `work/` to a permanent location is always manual. The user decides what's
  canonical; the agent does not promote its own output.

---

**Customizable once deployed.** The routing above is the *default*. A deployed copy of this
habit is the user's to adjust per project — the targets and the `AI/human/plans` split are
defaults, not locked. The canonical seed in `kcd/` stays the shipped default; the deployed
copy is where per-project customization lives (per the deploy model — `kcd/` is the locked
factory-reset seed, deployed copies are the live, editable layer).
