# CLAUDE.md — Sara Ops Framework

> Single entry point for project context. Detailed specs live in `/docs/`.

## What this project is

A multi-module operational dashboard for managing Sara Vinitz's work: content, projects, tasks, website production, film projects, and art projects.

**Primary users:** Greg (strategist/developer), Sara (owner), team (Avigail, Sasha x2, motion designer TBD).

**Architecture:** One monorepo, isolated modules sharing a common data layer, reactive store, and Web Component library. Designed for reuse — swap `data/brand.json` and module configs.

**Tech stack:**
- Vanilla HTML + CSS + JS with Web Components (no framework)
- Vite for dev server and optional production build
- JSON files as the data layer (no database)
- Proxy-based reactive store for state management
- CSS Cascade Layers for style organization
- GitHub Pages for hosting, GitHub Actions for CI/CD

## Repository structure

```
├── CLAUDE.md                  ← this file
├── package.json               ← vite as only dev dependency
├── vite.config.js             ← multi-page config
├── index.html                 ← main dashboard
├── docs/
│   ├── ARCHITECTURE.md        ← system architecture, component patterns
│   ├── DATA_SCHEMAS.md        ← all JSON schemas
│   ├── MODULES.md             ← module specs and requirements
│   └── BRAND.md               ← condensed brand context
├── data/
│   ├── brand.json             ← brand postulates, values, vocabulary
│   ├── projects.json          ← projects with phases and statuses
│   ├── tasks.json             ← tasks with assignees and priorities
│   └── content.json           ← content plan by channel
├── shared/
│   ├── components/            ← Web Components (sara-card, sara-badge, etc.)
│   │   └── base-component.js  ← SaraComponent base class
│   ├── styles/
│   │   ├── tokens.css         ← design tokens (colors, type, spacing)
│   │   └── base.css           ← reset + body defaults + shared components
│   └── utils/
│       ├── store.js           ← reactive Proxy-based store
│       └── data.js            ← loadJSON(), filterBy() (delegates to store)
└── modules/
    ├── brand-filter/          ← brand postulates + content check tool
    ├── projects/              ← project tracker
    ├── task-map/              ← task map with owners
    ├── content-plan/          ← content calendar by channel
    ├── film-projects/         ← documentary film tracker
    ├── website-builder/       ← website section cards
    ├── gallery-3d/            ← isometric 3D gallery editor
    └── art-projects/          ← standalone art project plans
```

## Team

| Person | Role | Handles |
|--------|------|---------|
| Greg | Strategist / developer | Architecture, brand, website build |
| Sara | Owner / creative director | Approvals, content, creative direction |
| Avigail | Team member | Content, briefs — scope TBD |
| Sasha #1 | Director of photography / film editor | Shooting, footage editing, Reels cuts |
| Sasha #2 | Archival director / producer | Archival research, film direction, production |
| Motion designer | TBD | Visual elements, ornament animations |

## Working conventions

- **Read before coding:** Check this file, then relevant `docs/` files and module READMEs
- **Web Components:** All reusable UI is a Web Component extending `SaraComponent`
- **CSS tokens only:** Never hardcode hex values — use custom properties from `tokens.css`
- **CSS layers:** Styles must be in the correct `@layer` (reset/base/components/modules/utilities)
- **Data via store:** Import from `shared/utils/store.js` for reactive updates, or `data.js` for simple reads
- **JSON schema first:** Validate structure matches `docs/DATA_SCHEMAS.md` before writing data
- **No inline styles** except dynamic values set by JS
- **Comment every function** with one line: what it does and what it returns

## Commit conventions

```
feat(module-name): short description
fix(module-name): short description
data: updated projects.json / tasks.json / content.json
style: design token or CSS change
docs: CLAUDE.md or README update
```

## Current status

| Component | Status |
|-----------|--------|
| Shared layer (tokens, base CSS, store, Web Components) | ✓ Built and modernized |
| Dashboard (index.html) | ✓ Uses sara-stat + sara-card components |
| Knowledge layer | ✓ Restructured into docs/ |
| Data (projects, tasks, content) | ✓ Seeded with real data |
| All 8 modules | Not yet built — start with brand-filter |

*Last updated: 2026-03-25*
*Maintained by: Greg*
