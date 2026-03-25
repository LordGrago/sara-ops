# brand-filter

Brand postulates wall + content alignment check tool.

## Purpose
Single source of brand truth for the team. Shows Sara's values, UTP pillars, voice principles, vocabulary, and content pillars in one scannable view. Provides a paste-and-check tool for any text.

## Data
Reads `data/brand.json` only. No writes.

## Check Logic
Flags text that contains:
- Words from `voice.vocabulary_avoid`
- Phrases from `voice.reframes[].instead`

**Verdict levels:**
- `Aligned` — no issues found
- `Review needed` — 1–2 issues
- `Off-brand` — 3+ issues

## Layout
Two-panel: postulates wall (left, scrollable) + check tool (right, sticky).
