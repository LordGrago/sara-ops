# Architecture — Sara Ops

## Design system

### Colors (tokens in `shared/styles/tokens.css`)

**Brand accents:**
- `--color-lime: #DAEF5A`
- `--color-lavender: #B98EC4`
- `--color-hotpink: #F0156B`

Each accent has a 7-stop scale (100–900). Neutrals: 10-stop scale (`--neutral-0` white to `--neutral-900` near-black).

### Typography
- **Body:** Vela Sans (woff2, 300/400/500/700) — good Cyrillic
- **Headlines:** PP Writer (otf, Latin only) — display text
- **Fallback:** system-ui, sans-serif

### Visual philosophy (90/10 rule)
90% institutional simplicity (white space, clean grid, muted neutrals). 10% ornamental "incrustation" — pixel ornaments, brand accents, cultural elements from Sara's DNA (Russian folk, Jewish decorative, Azerbaijani textile, LA kitsch/pop).

### Layout
- Max content width: 1200px, centered
- Base unit: 8px grid
- Section padding: 80px vertical desktop, 40px mobile
- Cards: `border-radius: 4px`, subtle `1px` border in `--neutral-200`
- No gradients or box shadows in operational UI

## CSS architecture

Uses Cascade Layers for explicit cascade control:

```css
@layer reset, base, tokens, components, modules, utilities;
```

- **reset:** Box-sizing, margin reset
- **base:** Body, typography, link defaults
- **tokens:** `:root` custom properties (outside layers for global access)
- **components:** Shared component styles (.card, .badge, .btn)
- **modules:** Per-module overrides
- **utilities:** Helper classes

## Component architecture

All reusable UI is built as Web Components extending `SaraComponent`:

```javascript
import { SaraComponent } from './base-component.js';

class SaraCard extends SaraComponent {
  static observedAttributes = ['heading', 'accent'];
  template() { return `<div class="card">...</div>`; }
  styles() { return `@import '/shared/styles/tokens.css'; ...`; }
}
customElements.define('sara-card', SaraCard);
```

Components use Shadow DOM for encapsulation and import `tokens.css` for design token access. Container queries (`container-type: inline-size` on `:host`) handle responsive behavior.

## State management

Proxy-based reactive store (`shared/utils/store.js`):

```javascript
import { store } from '/shared/utils/store.js';

// Load data
await store.load('tasks');

// Subscribe to changes
store.on('tasks', (tasks) => { /* re-render */ });

// Mutate (triggers subscribers)
store.update('tasks', (tasks) => { tasks[0].status = 'done'; });
```

`shared/utils/data.js` wraps the store for backward compatibility: `loadJSON()`, `filterBy()`, `groupBy()`, `sortBy()`, `uniqueValues()`, `findById()`.

## Data mutation model

- All data in JSON files under `/data/`
- In-browser edits use `localStorage` as write buffer
- User copies updated JSON and commits manually (no server writes in v1)
- `brand.json` is never modified through UI — manually edited source of truth

## Module structure (standard)

```
modules/[name]/
├── index.html      ← the page
├── style.css       ← module-specific overrides (@layer modules)
├── app.js          ← module logic
└── README.md       ← purpose, data dependencies
```

## Build tooling

Vite (dev dependency only):
- `npm run dev` — dev server with HMR
- `npm run build` — production build to `dist/`
- Multi-page config handles `index.html` + `modules/*/index.html`
