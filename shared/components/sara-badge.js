// shared/components/sara-badge.js
// Status and priority badge. Renders a colored pill label.
// Attributes: status (todo|in_progress|review|done|blocked|active|paused|planned),
//             priority (high|medium|low), label (override display text)

import { SaraComponent } from './base-component.js';

// Maps status/priority values to background and text color tokens
const STATUS_COLORS = {
  todo:        { bg: 'var(--color-status-todo)',        color: 'var(--neutral-600)' },
  in_progress: { bg: 'var(--color-status-in-progress)', color: 'var(--lime-900)' },
  review:      { bg: 'var(--color-status-review)',      color: 'var(--lavender-900)' },
  done:        { bg: 'var(--color-status-done)',        color: '#2A5E25' },
  blocked:     { bg: 'var(--color-status-blocked)',     color: 'var(--hotpink-900)' },
  active:      { bg: 'var(--lime-300)',                 color: 'var(--lime-900)' },
  paused:      { bg: 'var(--neutral-200)',              color: 'var(--neutral-600)' },
  planned:     { bg: 'var(--lavender-100)',             color: 'var(--lavender-900)' },
};

const PRIORITY_COLORS = {
  high:   { bg: 'var(--hotpink-100)',   color: 'var(--hotpink-900)' },
  medium: { bg: 'var(--lavender-100)',  color: 'var(--lavender-900)' },
  low:    { bg: 'var(--neutral-100)',   color: 'var(--neutral-600)' },
};

class SaraBadge extends SaraComponent {
  static observedAttributes = ['status', 'priority', 'label'];

  styles() {
    return `
      @import '/shared/styles/tokens.css';

      :host { display: inline-flex; }

      .badge {
        display: inline-flex;
        align-items: center;
        font-size: var(--text-xs);
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        white-space: nowrap;
      }
    `;
  }

  template() {
    const status   = this.getAttribute('status');
    const priority = this.getAttribute('priority');
    const label    = this.getAttribute('label');

    const colors = (status && STATUS_COLORS[status])
      || (priority && PRIORITY_COLORS[priority])
      || { bg: 'var(--neutral-100)', color: 'var(--neutral-600)' };

    const text = label || status || priority || '—';

    return `
      <span class="badge" style="background:${colors.bg};color:${colors.color}">
        ${text.replace('_', ' ')}
      </span>
    `;
  }
}

customElements.define('sara-badge', SaraBadge);
