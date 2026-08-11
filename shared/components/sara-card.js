// shared/components/sara-card.js
// General-purpose card component. Use for module tiles, project cards, content items.
// Attributes: heading, description, accent (CSS color), href, badge

import { SaraComponent } from './base-component.js';

class SaraCard extends SaraComponent {
  static observedAttributes = ['heading', 'description', 'accent', 'href', 'badge'];

  styles() {
    return `
      @import '/shared/styles/tokens.css';

      :host {
        display: block;
        container-type: inline-size;
      }

      .card {
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        overflow: hidden;
        transition: border-color var(--transition-fast);
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .card:hover { border-color: var(--color-border-dark); }

      .accent-bar {
        height: 3px;
        background: var(--accent, var(--color-lime));
      }

      .body {
        padding: var(--space-5);
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--space-2);
      }

      .heading {
        font-size: var(--text-base);
        font-weight: 500;
        color: var(--color-text);
        margin: 0;
      }

      .description {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
        line-height: var(--leading-normal);
        margin: 0;
        flex: 1;
      }

      .badge {
        display: inline-flex;
        align-self: flex-start;
        font-size: var(--text-xs);
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 20px;
        background: var(--color-bg-muted);
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      a { text-decoration: none; color: inherit; }
      a .card:hover .heading { text-decoration: underline; text-underline-offset: 3px; }

      /* Compact layout at narrow container widths */
      @container (max-width: 200px) {
        .description { display: none; }
      }
    `;
  }

  template() {
    const heading     = this.getAttribute('heading') ?? '';
    const description = this.getAttribute('description') ?? '';
    const accent      = this.getAttribute('accent') ?? 'var(--color-lime)';
    const href        = this.getAttribute('href');
    const badge       = this.getAttribute('badge');

    const inner = `
      <div class="card">
        <div class="accent-bar" style="background:${accent}"></div>
        <div class="body">
          ${badge ? `<span class="badge">${badge}</span>` : ''}
          <p class="heading">${heading}</p>
          ${description ? `<p class="description">${description}</p>` : ''}
        </div>
      </div>
    `;

    return href ? `<a href="${href}">${inner}</a>` : inner;
  }
}

customElements.define('sara-card', SaraCard);
