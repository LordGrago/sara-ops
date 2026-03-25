// shared/components/sara-stat.js
// Dashboard stat box. Displays a large number with a label and optional accent.
// Attributes: value, label, accent (CSS color)

import { SaraComponent } from './base-component.js';

class SaraStat extends SaraComponent {
  static observedAttributes = ['value', 'label', 'accent'];

  styles() {
    return `
      @import '/shared/styles/tokens.css';

      :host {
        display: block;
        container-type: inline-size;
      }

      .stat {
        background: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--space-5) var(--space-6);
        display: flex;
        flex-direction: column;
        gap: var(--space-1);
        position: relative;
        overflow: hidden;
      }

      .accent-dot {
        position: absolute;
        top: var(--space-5);
        right: var(--space-5);
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--accent-color, var(--color-lime));
      }

      .value {
        font-size: var(--text-2xl);
        font-weight: 400;
        letter-spacing: -0.03em;
        color: var(--color-text);
        line-height: 1;
      }

      .label {
        font-size: var(--text-sm);
        color: var(--color-text-muted);
      }
    `;
  }

  template() {
    const value  = this.getAttribute('value') ?? '—';
    const label  = this.getAttribute('label') ?? '';
    const accent = this.getAttribute('accent') ?? 'var(--color-lime)';

    return `
      <div class="stat">
        <div class="accent-dot" style="background:${accent}"></div>
        <span class="value">${value}</span>
        <span class="label">${label}</span>
      </div>
    `;
  }
}

customElements.define('sara-stat', SaraStat);
