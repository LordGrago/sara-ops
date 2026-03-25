# CLAUDE.md — Sara Ops Framework

> Read this file completely before every session. It is the single source of truth for this project.

---

## What this project is

A multi-module operational web system for managing all directions of Sara Vinitz's work: content, projects, tasks, website production, film projects, and art projects.

**Primary users:** Greg (strategist/developer), Sara (owner), team members (Avigail, Sasha ×2, motion designer — TBD).

**Architecture principle:** One monorepo, isolated modules that share a common data layer and component library. Each module does one thing. The framework is designed to be cloned and reused for other projects by swapping `data/brand.json` and module configs.

**Tech stack:**
- Pure HTML + CSS + vanilla JS (no build step, no framework)
- JSON files as the data layer (no database)
- GitHub Pages or Vercel for hosting
- GitHub Actions for CI/CD
- No npm dependencies in core modules — external libs loaded via CDN only when necessary

---

## Repository structure

```
sara-ops/
├── CLAUDE.md                  ← this file
├── index.html                 ← main dashboard with navigation
├── .github/
│   └── workflows/
│       └── deploy.yml         ← auto-deploy to Vercel on push to main
├── data/
│   ├── brand.json             ← brand postulates, values, vocabulary
│   ├── projects.json          ← all projects with phases and statuses
│   ├── tasks.json             ← tasks with assignees and priorities
│   └── content.json           ← content plan by channel
├── shared/
│   ├── components/
│   │   ├── nav.html           ← site navigation fragment
│   │   ├── card.js            ← universal card component
│   │   ├── table.js           ← sortable table component
│   │   ├── kanban.js          ← kanban board component
│   │   └── filter-bar.js      ← tag/status filter bar
│   ├── styles/
│   │   ├── tokens.css         ← design tokens (colors, type, spacing)
│   │   ├── base.css           ← reset + body defaults
│   │   └── components.css     ← shared component styles
│   └── utils/
│       ├── data.js            ← loadJSON(), saveJSON(), filterBy()
│       ├── render.js          ← renderCards(), renderTable(), renderKanban()
│       └── brand-check.js     ← content-against-brand validation logic
├── modules/
│   ├── brand-filter/          ← brand postulates + content check tool
│   ├── projects/              ← project tracker
│   ├── task-map/              ← task map with owners
│   ├── content-plan/          ← content calendar by channel
│   ├── film-projects/         ← documentary film tracker
│   ├── website-builder/       ← website section cards
│   ├── gallery-3d/            ← isometric 3D gallery editor
│   └── art-projects/          ← standalone art project plans
└── skills/
    ├── module-scaffold.md     ← how to create a new module
    ├── data-schema.md         ← how to define JSON schemas
    └── component-patterns.md  ← UI pattern library reference
```

### Module internal structure (standard)

Every module follows this layout:

```
modules/[name]/
├── index.html      ← the page
├── style.css       ← module-specific overrides (minimal)
├── app.js          ← module logic
└── README.md       ← what this module does, data dependencies
```

---

## Design system

### Colors (design tokens in `shared/styles/tokens.css`)

**Brand accents:**
- `--color-lime: #DAEF5A`
- `--color-lavender: #B98EC4`
- `--color-hotpink: #F0156B`

**Neutrals** (10 stops, `--neutral-0` through `--neutral-900`):
Use standard CSS neutral scale. `--neutral-0` = white, `--neutral-900` = near-black.

**Functional palette:** Full 18-color palette (7 stops each for Lime, Lavender, Hot Pink + 10 neutrals) — to be defined in the pixel module generator project. Until then, use the three brand accents + neutral scale.

### Typography
- **Body:** Vela Sans (woff2, weights 300/400/500/700) — good Cyrillic
- **Headlines/Display:** PP Writer (otf, Latin only) — "Sara Vinitz" name treatment and large display text
- **Fallback:** system-ui, sans-serif

### Visual philosophy (90/10 rule)
90% institutional simplicity (white space, clean grid, muted neutrals). 10% ornamental "incrustation" — pixel ornaments, brand accents, cultural elements. The 10% is what makes it memorable. Do not invert this ratio.

### Layout conventions
- Max content width: 1200px, centered
- Base unit: 8px grid
- Section padding: 80px vertical on desktop, 40px on mobile
- Cards: `border-radius: 4px`, subtle `1px` border in `--neutral-200`
- No gradients, no box shadows in the operational UI — save ornamental effects for Sara's public-facing website

---

## Data schemas

### `brand.json`
```json
{
  "essence": "string",
  "tagline": "string",
  "archetype": "string",
  "central_thesis": "string",
  "values": [{ "name": "string", "description": "string" }],
  "utp": [{ "pillar": "string", "description": "string" }],
  "anti_positioning": ["string"],
  "voice": {
    "tone": ["string"],
    "vocabulary_use": ["string"],
    "vocabulary_avoid": ["string"],
    "reframes": [{ "instead": "string", "say": "string" }]
  },
  "content_pillars": [
    { "id": "string", "name": "string", "description": "string", "formats": ["string"] }
  ]
}
```

### `projects.json`
```json
[{
  "id": "string",
  "title": "string",
  "category": "website | film | art | content | strategy",
  "status": "active | paused | planned | done",
  "phase": "string",
  "owner": "string",
  "team": ["string"],
  "description": "string",
  "milestones": [{ "title": "string", "due": "YYYY-MM-DD", "done": false }],
  "links": [{ "label": "string", "url": "string" }],
  "updated": "ISO date"
}]
```

### `tasks.json`
```json
[{
  "id": "string",
  "project_id": "string",
  "title": "string",
  "description": "string",
  "status": "todo | in_progress | review | done | blocked",
  "priority": "high | medium | low",
  "assignee": "string",
  "due": "YYYY-MM-DD | null",
  "tags": ["string"],
  "created": "ISO date",
  "updated": "ISO date"
}]
```

### `content.json`
```json
[{
  "id": "string",
  "title": "string",
  "channel": "telegram | instagram | reels | youtube | website",
  "pillar": "decoding | inner_world | provocation | collection_stories",
  "status": "idea | in_progress | ready | scheduled | published",
  "publish_date": "YYYY-MM-DD | null",
  "assignee": "string",
  "format": "string",
  "notes": "string",
  "tags": ["string"]
}]
```

---

## Modules reference

### `brand-filter`
**Purpose:** Single source of brand truth. Shows Sara's postulates. Provides a content check tool: paste any text → get a verdict on brand alignment.

**Data:** reads `brand.json`

**Key views:**
- Postulates wall (values, voice principles, vocabulary)
- Content check textarea → validation output with specific notes per brand dimension

**Logic:** `brand-check.js` — checks text against: vocabulary avoid-list, reframes, tone markers, anti-positioning phrases.

---

### `projects`
**Purpose:** Overview of all active projects across all categories.

**Data:** reads `projects.json`

**Key views:**
- Grid of project cards, filterable by category and status
- Single project detail: description, milestones timeline, team, links
- Status is manually updated in JSON (no backend)

---

### `task-map`
**Purpose:** All tasks visible in one place, assignable, with bottleneck detection.

**Data:** reads `tasks.json` + `projects.json`

**Key views:**
- Kanban board (columns: todo / in_progress / review / done / blocked)
- Table view with sort by assignee, priority, project, due date
- Per-person view: "show me everything assigned to Avigail"
- Blocked tasks highlighted prominently

---

### `content-plan`
**Purpose:** Content calendar. Tracks what gets published where and when. Team can see their assignments, Sara can approve.

**Data:** reads/writes `content.json`

**Key views:**
- Calendar view (week/month toggle)
- List view sorted by channel or publish date
- Filter by pillar, channel, assignee, status
- "Ready for approval" queue — items in `ready` status, awaiting Sara's sign-off

**Status flow:** idea → in_progress → ready → scheduled → published

---

### `film-projects`
**Purpose:** Track documentary interview films from shoot to publication.

**Data:** subset of `projects.json` (category = "film") + dedicated film tasks in `tasks.json`

**Key views:**
- Pipeline: Shoot → Raw edit → Fine cut → Social cuts → Published
- Per-film page: description, artist subject, publication targets, status of each cut
- Content derived from film (reels, clips, stills) linked to `content.json`

---

### `website-builder`
**Purpose:** Design and plan Sara's public website. Section cards system — build the site architecture from modular cards before implementing.

**Data:** `data/website.json` (create when building this module)

```json
// website.json schema
[{
  "id": "string",
  "section_name": "string",
  "purpose": "string",
  "audience": "entrepreneurs | families | corporate | all",
  "content_type": "hero | about | services | proof | contact | special",
  "status": "idea | sketched | designed | built | live",
  "figma_node": "string | null",
  "notes": "string"
}]
```

**Key views:**
- Card wall: all section cards, drag to reorder, color-coded by status
- Per-section detail: purpose, audience, content notes, Figma link
- Section dependency map: which sections must exist before others

**Context:** The public website is a separate static site (currently in progress, Steps 1–3 complete). This module is the planning and tracking layer for it, not the site itself.

---

### `gallery-3d`
**Purpose:** Isometric editor for 3D gallery spaces. Draw gallery floor plans in isometric view → render as explorable 3D space. Output embeds into special project pages on Sara's website.

**Data:** `data/galleries.json` (create when building this module)

**Key views:**
- Isometric grid editor: place walls, doors, works, lighting
- Preview: renders the drawn space in CSS 3D primitives (no WebGL for v1)
- Gallery list: all created gallery spaces with thumbnails

**Technical approach for v1:**
- Isometric grid: 60° tilted cells, drawn on `<canvas>` or SVG
- 3D render: CSS `transform: rotateX(45deg) rotateZ(45deg)` on DOM elements
- No Three.js in v1 — pure CSS perspective is sufficient for primitive rooms
- Export: generates a self-contained HTML file for embedding

---

### `art-projects`
**Purpose:** Planning space for Sara's standalone art projects (pop-up galleries, tapestries, carpets, open digital library, production tech).

**Data:** subset of `projects.json` (category = "art")

**Key views:**
- Project cards with image, description, status, next milestone
- Per-project detail with timeline, notes, external links
- "Ideas" section — unstructured captures that haven't become projects yet

---

## Team and people

| Person | Role | Handles |
|--------|------|---------|
| Greg | Strategist / developer | Architecture, brand, website build |
| Sara | Owner / creative director | Approvals, content, creative direction |
| Avigail | Team member | Content, briefs — exact scope TBD |
| Sasha №1 | Team member | Content plan — exact scope TBD |
| Sasha №2 | Team member | Content plan — exact scope TBD |
| Motion designer | TBD | Visual elements, ornament animations |

---

## Working conventions for Claude Code

### Before starting any task
1. Read this file completely
2. Check the relevant module's `README.md` if it exists
3. Check `data/` for the JSON schema before creating or modifying data structures

### File creation rules
- Never create files outside the defined structure without noting it in a comment
- When creating a new module, copy the standard module structure exactly
- JSON files: always validate structure matches schema before writing
- Never hardcode data that belongs in a JSON file

### Code style
- Vanilla JS only — no frameworks, no npm installs
- ES modules (`import`/`export`) for shared utilities
- CSS custom properties for all colors and spacing — never hardcode hex values
- No inline styles except for dynamic values set by JS
- Comment every function with one line: what it does and what it returns

### Data mutation
- All data lives in JSON files in `/data/`
- In-browser edits: use `localStorage` as a write buffer, sync instructions displayed to user
- For v1: no server-side writes. User copies updated JSON and commits manually.
- Never modify `brand.json` through the UI — it is a source-of-truth document edited manually

### When adding a new module
1. Read `skills/module-scaffold.md`
2. Create the folder under `modules/[name]/`
3. Create `index.html`, `style.css`, `app.js`, `README.md`
4. Add the module to the nav in `index.html`
5. Add the data schema to this file (`CLAUDE.md`) under "Data schemas"
6. If new JSON data needed, create the schema and empty file in `/data/`

### Commit conventions
```
feat(module-name): short description
fix(module-name): short description
data: updated projects.json / tasks.json / content.json
style: design token or CSS change
docs: CLAUDE.md or README update
```

---

## Brand context (condensed for Claude)

**Sara Vinitz** is a культуролог (cultural scholar) and art guide. Not an art consultant in the commercial sense — a worldview transmitter.

**Core thesis:** Art consulting as tension relief leading to transformation. Client moves from *"I don't understand this world"* to *"I move freely in it."*

**Three client archetypes:**
1. Entrepreneurs making first art purchases (fear of mistakes, need for guidance)
2. Families building legacy collections (meaning, heritage, generational thinking)
3. Corporate clients using art as a strategic tool (not decoration — consciousness)

**Three UTP pillars:**
1. **Access** — top tier of art world is 1–2 calls away (Hermitage, Pushkin, Garage, GES-2, international)
2. **Independence** — zero financial ties to galleries or artists. Can say "I don't believe in X"
3. **Navigation without snobbism** — code decryption in human language, dignity for the non-expert

**Voice:** Confident but not arrogant. Warm but not soft. Direct but not blunt. Cultured but not elitist. Speaks like a brilliant friend over wine, not a professor in a lecture.

**Visual system (90/10 rule):** 90% institutional white-space clarity + 10% ornamental "incrustation" from Sara's cultural DNA (Russian folk, Jewish decorative tradition, Azerbaijani textile, LA kitsch/pop). The ornament is the differentiator. Brand colors: Lime `#DAEF5A`, Lavender `#B98EC4`, Hot Pink `#F0156B`.

**Content pillars:** Decoding (навигация) / Inner World (глубина) / Provocation (честность) / Collection Stories (трансформация)

**Vocabulary to avoid in any generated content:** элитарный, эксклюзивный (as gatekeeping), инвестиция (as primary frame), обучение, должны, тренд, модный.

**Key Sara quote (primary source, verbatim):** *"Красота — это форма сознания."* (Beauty is a form of consciousness.)

---

## Current status

| Component | Status |
|-----------|--------|
| Brand MD files (01–08) | Complete — in `/data/brand/` after migration |
| Website (public-facing) | Steps 1–3 done. Step 4 next. |
| Figma design file | Sections 01–07 complete. 08–09 in progress. |
| sara-ops repo | Not yet initialized — this CLAUDE.md is the starting point |
| All modules | Not yet built |

**First session task:** Initialize repo structure, create data JSON files with correct schemas and placeholder content, build `shared/` layer and dashboard `index.html`.

---

*Last updated: 2026-03-25*
*Maintained by: Greg*
