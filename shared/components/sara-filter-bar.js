// shared/components/sara-filter-bar.js
// Horizontal filter tag bar. Fires a 'filter-change' custom event on selection.
// Attributes: options (JSON array of {value, label}), active (current value), all-label

import { SaraComponent } from './base-component.js';

class SaraFilterBar extends SaraComponent {
  static observedAttributes = ['options', 'active', 'all-label'];

  styles() {
    return `
      @import '/shared/styles/tokens.css';

      :host { display: block; }

      .bar {
        display: flex;
        gap: var(--space-2);
        flex-wrap: wrap;
      }

      button {
        padding: var(--space-1) var(--space-3);
        border-radius: 20px;
        font-size: var(--text-sm);
        font-family: var(--font-body);
        border: 1px solid var(--color-border);
        background: var(--color-bg);
        cursor: pointer;
        transition: all var(--transition-fast);
        color: var(--color-text-muted);
      }

      button:hover,
      button.active {
        background: var(--neutral-900);
        color: var(--neutral-0);
        border-color: var(--neutral-900);
      }
    `;
  }

  template() {
    const allLabel = this.getAttribute('all-label') ?? 'All';
    const active   = this.getAttribute('active') ?? 'all';

    let options = [];
    try {
      options = JSON.parse(this.getAttribute('options') ?? '[]');
    } catch (_) {}

    const allBtn = `<button data-value="all" class="${active === 'all' ? 'active' : ''}">${allLabel}</button>`;
    const pills  = options.map(o =>
      `<button data-value="${o.value}" class="${active === o.value ? 'active' : ''}">${o.label}</button>`
    ).join('');

    return `<div class="bar">${allBtn}${pills}</div>`;
  }

  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const value = btn.dataset.value;
      this.setAttribute('active', value);
      /** Dispatches 'filter-change' with { value } for parent modules to handle. */
      this.dispatchEvent(new CustomEvent('filter-change', {
        detail: { value },
        bubbles: true,
        composed: true,
      }));
    });
  }
}

customElements.define('sara-filter-bar', SaraFilterBar);
