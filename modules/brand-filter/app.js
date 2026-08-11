// brand-filter/app.js
// Renders Sara's brand postulates wall and provides a content alignment check tool.

import { loadJSON } from '../../shared/utils/data.js';

const ACCENT_COLORS = {
  essence:   'var(--neutral-900)',
  values:    'var(--color-lime)',
  utp:       'var(--color-lavender)',
  voice:     'var(--color-hotpink)',
  vocab:     'var(--lime-700)',
  pillars:   'var(--color-lavender)',
  anti:      'var(--color-hotpink)',
};

/** Entry point — loads brand data and initialises both panels. */
async function init() {
  try {
    const brand = await loadJSON('brand');
    renderPostulates(brand);
    setupCheckTool(brand);
  } catch (e) {
    document.getElementById('postulates').innerHTML =
      '<div class="empty-state"><p>Не удалось загрузить brand.json.</p></div>';
  }
}

// ── Postulates Wall ─────────────────────────────────────────────────────────

/** Renders all brand postulate sections into #postulates. */
function renderPostulates(brand) {
  const wall = document.getElementById('postulates');
  wall.innerHTML = [
    renderEssence(brand),
    renderValues(brand.values),
    renderUTP(brand.utp),
    renderVoiceTone(brand.voice),
    renderVocabulary(brand.voice),
    renderPillars(brand.content_pillars),
    renderAntiPositioning(brand.anti_positioning),
  ].join('');
}

/** Renders the key quote and brand essence card. Returns HTML string. */
function renderEssence(brand) {
  return section('Суть', ACCENT_COLORS.essence, `
    <div class="quote-card">
      <blockquote>«${brand.key_quote}»</blockquote>
      <cite>${brand.archetype.split('.')[0]}</cite>
    </div>
    <p style="font-size:var(--text-sm);color:var(--color-text-muted);max-width:640px;line-height:var(--leading-loose);">
      ${brand.central_thesis}
    </p>
  `);
}

/** Renders 5 value cards in a grid. Returns HTML string. */
function renderValues(values) {
  const cards = values.map(v => `
    <div class="value-card">
      <div class="value-card-name">${v.name}</div>
      <div class="value-card-desc">${v.description}</div>
    </div>
  `).join('');
  return section('Ценности', ACCENT_COLORS.values, `<div class="values-grid">${cards}</div>`);
}

/** Renders 3 UTP pillar cards. Returns HTML string. */
function renderUTP(utp) {
  const cards = utp.map(p => `
    <div class="utp-card">
      <div class="utp-card-name">${p.pillar}</div>
      <div class="utp-card-desc">${p.description}</div>
    </div>
  `).join('');
  return section('Три столпа', ACCENT_COLORS.utp, `<div class="utp-grid">${cards}</div>`);
}

/** Renders voice tone principles as a scannable list. Returns HTML string. */
function renderVoiceTone(voice) {
  const items = voice.tone.map(t => {
    const [keyword, ...rest] = t.split(' but ');
    return `
      <div class="tone-item">
        <span class="tone-keyword">${keyword.trim()}</span>
        <span>but ${rest.join(' but ')}</span>
      </div>
    `;
  }).join('');
  return section('Голос', ACCENT_COLORS.voice, `<div class="tone-list">${items}</div>`);
}

/** Renders vocabulary use/avoid in two columns. Returns HTML string. */
function renderVocabulary(voice) {
  const useItems  = voice.vocabulary_use.map(w => `<li>${w}</li>`).join('');
  const avoidItems = voice.vocabulary_avoid.map(w => `<li>${w}</li>`).join('');

  return section('Словарь', ACCENT_COLORS.vocab, `
    <div class="vocab-grid">
      <div class="vocab-use">
        <div class="vocab-col-label">Использовать</div>
        <ul class="vocab-list">${useItems}</ul>
      </div>
      <div class="vocab-avoid">
        <div class="vocab-col-label">Избегать</div>
        <ul class="vocab-list">${avoidItems}</ul>
      </div>
    </div>
  `);
}

/** Renders 4 content pillar cards. Returns HTML string. */
function renderPillars(pillars) {
  const cards = pillars.map(p => `
    <div class="pillar-card">
      <div class="pillar-card-name">${p.name}</div>
      <div class="pillar-card-desc">${p.description}</div>
      <div class="pillar-formats">
        ${p.formats.map(f => `<span class="pillar-format-tag">${f}</span>`).join('')}
      </div>
    </div>
  `).join('');
  return section('Контент-столпы', ACCENT_COLORS.pillars, `<div class="pillars-grid">${cards}</div>`);
}

/** Renders anti-positioning as crossed-out tags. Returns HTML string. */
function renderAntiPositioning(items) {
  const tags = items.map(i => `<span class="anti-tag">${i}</span>`).join('');
  return section('Сара — не это', ACCENT_COLORS.anti, `<div class="anti-tags">${tags}</div>`);
}

/**
 * Wraps content in a labelled postulate section.
 * Returns an HTML string with header + content.
 */
function section(label, accentColor, content) {
  return `
    <div class="postulate-section">
      <div class="postulate-section-header">
        <div class="postulate-section-accent" style="background:${accentColor}"></div>
        <span class="postulate-section-label">${label}</span>
      </div>
      ${content}
    </div>
  `;
}

// ── Content Check Tool ───────────────────────────────────────────────────────

/** Attaches the check tool button listener. */
function setupCheckTool(brand) {
  const btn    = document.getElementById('check-btn');
  const input  = document.getElementById('check-input');
  const output = document.getElementById('check-results');

  btn.addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }
    const results = checkContent(text, brand);
    renderResults(results, output);
    output.hidden = false;
  });

  // Re-check on Ctrl/Cmd + Enter
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) btn.click();
  });
}

/**
 * Checks text against brand vocabulary, reframes, and anti-positioning.
 * Returns { issues, reframes, verdict: 'aligned' | 'review' | 'offbrand' }.
 */
function checkContent(text, brand) {
  const lower = text.toLowerCase();
  const issues   = [];
  const reframes = [];

  // Check vocabulary to avoid (match on the Russian word before the first space or paren)
  brand.voice.vocabulary_avoid.forEach(entry => {
    const word = entry.split(/[\s(]/)[0].toLowerCase();
    if (lower.includes(word)) {
      issues.push({ word: entry.split(/[\s(]/)[0], note: entry });
    }
  });

  // Check reframes (match on "instead" phrase)
  brand.voice.reframes.forEach(r => {
    if (lower.includes(r.instead.toLowerCase())) {
      reframes.push(r);
    }
  });

  const total = issues.length + reframes.length;
  const verdict = total === 0 ? 'aligned' : total <= 2 ? 'review' : 'offbrand';

  return { issues, reframes, verdict };
}

/**
 * Renders check results (verdict badge, issues, reframe suggestions) into a container.
 * Shows/updates the container contents.
 */
function renderResults(results, container) {
  const { issues, reframes, verdict } = results;
  const total = issues.length + reframes.length;

  const verdictLabels = {
    aligned:  'Aligned',
    review:   'Review needed',
    offbrand: 'Off-brand',
  };

  const verdictHTML = `
    <div class="verdict-row">
      <span class="verdict-badge verdict-${verdict}">${verdictLabels[verdict]}</span>
      ${total > 0 ? `<span class="verdict-count">${total} issue${total > 1 ? 's' : ''} found</span>` : ''}
    </div>
  `;

  const issuesHTML = issues.length > 0 ? `
    <div>
      <div class="result-section-title">Проблемные слова</div>
      ${issues.map(i => `
        <div class="issue-item">
          <span class="issue-word">${i.word}</span>
          <span class="issue-note">${i.note}</span>
        </div>
      `).join('')}
    </div>
  ` : '';

  const reframesHTML = reframes.length > 0 ? `
    <div>
      <div class="result-section-title">Переформулировать</div>
      ${reframes.map(r => `
        <div class="reframe-item">
          <strong>Вместо:</strong> «${r.instead}»<br>
          <strong>Лучше:</strong> «${r.say}»
        </div>
      `).join('')}
    </div>
  ` : '';

  const cleanHTML = total === 0 ? `
    <div class="result-clean">Текст соответствует бренд-платформе.</div>
  ` : '';

  container.innerHTML = verdictHTML + issuesHTML + reframesHTML + cleanHTML;
}

init();
