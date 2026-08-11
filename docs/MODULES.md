# Modules — Sara Ops

Eight operational modules. Each follows the standard structure: `index.html`, `style.css`, `app.js`, `README.md`.

---

## brand-filter

**Purpose:** Single source of brand truth. Shows postulates. Content check tool: paste text, get brand alignment verdict.

**Data:** `brand.json`

**Views:**
- Postulates wall (values, voice principles, vocabulary)
- Content check textarea → validation output with notes per brand dimension

**Logic:** Checks text against vocabulary avoid-list, reframes, tone markers, anti-positioning phrases.

---

## projects

**Purpose:** Overview of all active projects across categories.

**Data:** `projects.json`

**Views:**
- Grid of project cards, filterable by category and status
- Single project detail: description, milestones timeline, team, links

---

## task-map

**Purpose:** All tasks visible, assignable, with bottleneck detection.

**Data:** `tasks.json` + `projects.json`

**Views:**
- Kanban board (todo / in_progress / review / done / blocked)
- Table view with sort by assignee, priority, project, due date
- Per-person filter: "show me everything assigned to Avigail"
- Blocked tasks highlighted prominently

---

## content-plan

**Purpose:** Content calendar. What gets published where and when.

**Data:** `content.json`

**Views:**
- Calendar view (week/month toggle)
- List view sorted by channel or publish date
- Filter by pillar, channel, assignee, status
- "Ready for approval" queue (status = `ready`)

**Status flow:** idea → in_progress → ready → scheduled → published

---

## film-projects

**Purpose:** Track documentary films from shoot to publication.

**Data:** `projects.json` (category = "film") + `tasks.json`

**Views:**
- Pipeline: Shoot → Raw edit → Fine cut → Social cuts → Published
- Per-film page: description, artist subject, publication targets, cut statuses
- Derived content (reels, clips, stills) linked to `content.json`

---

## website-builder

**Purpose:** Plan Sara's public website architecture from modular section cards.

**Data:** `websites.json`

**Views:**
- Card wall: all sections, drag to reorder, color-coded by status
- Per-section detail: purpose, audience, content notes, Figma link
- Dependency map: which sections must exist before others

**Note:** This is the planning layer, not the site itself.

---

## gallery-3d

**Purpose:** Isometric editor for virtual gallery spaces. Draw → render in CSS 3D → export embeddable HTML.

**Data:** `galleries.json`

**Views:**
- Isometric grid editor: place walls, doors, works, lighting
- Preview: CSS 3D primitives (no WebGL for v1)
- Gallery list with thumbnails

**Technical:** Canvas/SVG for isometric grid, CSS `transform: rotateX/rotateZ` for 3D render, self-contained HTML export.

---

## art-projects

**Purpose:** Planning space for standalone art projects (pop-ups, tapestries, digital library, production tech).

**Data:** `projects.json` (category = "art")

**Views:**
- Project cards with image, description, status, next milestone
- Per-project detail with timeline, notes, external links
- "Ideas" section — unstructured captures not yet promoted to projects
