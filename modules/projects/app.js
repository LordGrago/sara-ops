// projects/app.js
// Renders a filterable project card grid and a slide-in detail panel.

import { loadJSON } from '../../shared/utils/data.js';

/** Category and status labels for display. */
const CATEGORY_LABELS = {
  film:     'Фильм',
  website:  'Сайт',
  content:  'Контент',
  art:      'Арт',
  strategy: 'Стратегия',
};

const STATUS_LABELS = {
  active:  'Active',
  planned: 'Planned',
  paused:  'Paused',
  done:    'Done',
};

/** Entry point — loads projects, renders filters and grid. */
async function init() {
  try {
    const projects = await loadJSON('projects');
    renderFilters(projects);
    renderGrid(projects, { category: 'all', status: 'all' });
    setupDetail(projects);
  } catch (e) {
    document.getElementById('projects-grid').innerHTML =
      '<div class="empty-state"><p>Не удалось загрузить projects.json.</p></div>';
  }
}

// ── Filters ───────────────────────────────────────────────────────────────────

/** Builds the filter bar from unique categories and statuses in the data. */
function renderFilters(projects) {
  const bar = document.getElementById('filter-bar');
  const categories = ['all', ...new Set(projects.map(p => p.category))];
  const statuses   = ['all', ...new Set(projects.map(p => p.status))];

  let active = { category: 'all', status: 'all' };

  function rebuild() { renderGrid(projects, active); }

  function makeGroup(values, dimension, labelMap) {
    const group = document.createElement('div');
    group.className = 'filter-group';

    values.forEach(val => {
      const btn = document.createElement('button');
      btn.className = 'filter-btn' + (active[dimension] === val ? ' active' : '');
      btn.textContent = val === 'all' ? 'All' : (labelMap[val] || val);
      btn.dataset.val = val;
      btn.addEventListener('click', () => {
        active[dimension] = val;
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // re-activate the sibling in the other group
        bar.querySelectorAll(`[data-dim="${dimension === 'category' ? 'status' : 'category'}"]`).forEach(b => {
          if (b.dataset.val === active[dimension === 'category' ? 'status' : 'category']) b.classList.add('active');
        });
        rebuild();
      });
      btn.dataset.dim = dimension;
      group.appendChild(btn);
    });
    return group;
  }

  bar.innerHTML = '';
  bar.appendChild(makeGroup(categories, 'category', CATEGORY_LABELS));

  const sep = document.createElement('div');
  sep.className = 'filter-separator';
  bar.appendChild(sep);

  bar.appendChild(makeGroup(statuses, 'status', STATUS_LABELS));
}

// ── Grid ──────────────────────────────────────────────────────────────────────

/** Renders filtered project cards into #projects-grid. */
function renderGrid(projects, { category, status }) {
  const grid = document.getElementById('projects-grid');
  const filtered = projects.filter(p =>
    (category === 'all' || p.category === category) &&
    (status   === 'all' || p.status   === status)
  );

  if (!filtered.length) {
    grid.innerHTML = '<div class="empty-state"><p>No projects match.</p></div>';
    return;
  }

  grid.innerHTML = filtered.map(p => cardHTML(p)).join('');

  // Attach click handlers
  grid.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const project = projects.find(p => p.id === id);
      if (project) openDetail(project);
    });
  });
}

/** Returns the HTML string for a single project card. */
function cardHTML(project) {
  const done  = project.milestones.filter(m => m.done).length;
  const total = project.milestones.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  const initials = person => person.split(/\s+/).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const teamDots = project.team
    .slice(0, 4)
    .map(p => `<div class="team-dot" title="${p}">${initials(p)}</div>`)
    .join('');
  const extraCount = project.team.length > 4 ? project.team.length - 4 : 0;
  const extraDot = extraCount > 0
    ? `<div class="team-dot">+${extraCount}</div>`
    : '';

  return `
    <div class="project-card" data-id="${project.id}" data-category="${project.category}">
      <div class="project-card-top">
        <div class="project-card-title">${project.title}</div>
        <div class="project-card-meta">
          <span class="status-badge status-${project.status}">${STATUS_LABELS[project.status] || project.status}</span>
        </div>
      </div>
      <p class="project-card-desc">${project.description}</p>
      ${total > 0 ? `
        <div class="project-progress">
          <div class="progress-bar-track">
            <div class="progress-bar-fill" style="width:${pct}%"></div>
          </div>
          <span class="progress-label">${done}/${total} milestones</span>
        </div>
      ` : ''}
      <div class="project-card-footer">
        <span class="project-card-phase">${project.phase || ''}</span>
        <div class="project-card-team">${teamDots}${extraDot}</div>
      </div>
    </div>
  `;
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

/** Attaches close handlers for the detail panel. Projects array kept in closure for click-through. */
function setupDetail(projects) {
  const overlay = document.getElementById('detail-overlay');
  const panel   = document.getElementById('detail-panel');
  const closeBtn = document.getElementById('detail-close');

  function close() {
    panel.hidden   = true;
    overlay.hidden = true;
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) close();
  });
}

/** Opens the detail panel and renders the given project. */
function openDetail(project) {
  const overlay = document.getElementById('detail-overlay');
  const panel   = document.getElementById('detail-panel');
  const content = document.getElementById('detail-content');

  content.innerHTML = detailHTML(project);
  panel.hidden   = false;
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

/** Returns the full HTML for the detail panel content. */
function detailHTML(project) {
  const today = new Date().toISOString().slice(0, 10);

  const milestonesHTML = project.milestones.length > 0 ? `
    <div class="detail-section">
      <div class="detail-section-label">Milestones</div>
      <div class="milestones-list">
        ${project.milestones.map(m => {
          const overdue = !m.done && m.due && m.due < today;
          return `
            <div class="milestone-item${m.done ? ' done' : ''}">
              <div class="milestone-dot"></div>
              <div class="milestone-body">
                <div class="milestone-title">${m.title}</div>
                ${m.due ? `<div class="milestone-due${overdue ? ' overdue' : ''}">${formatDate(m.due)}${overdue ? ' — overdue' : ''}</div>` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  ` : '';

  const linksHTML = project.links && project.links.length > 0 ? `
    <div class="detail-section">
      <div class="detail-section-label">Links</div>
      ${project.links.map(l => `
        <a href="${l.url}" target="_blank" rel="noopener" class="detail-link">${l.label || l.url}</a>
      `).join('')}
    </div>
  ` : '';

  return `
    <div class="detail-header">
      <div class="detail-category">${CATEGORY_LABELS[project.category] || project.category}</div>
      <h2 class="detail-title">${project.title}</h2>
      <div class="detail-badges">
        <span class="status-badge status-${project.status}">${STATUS_LABELS[project.status] || project.status}</span>
        ${project.phase ? `<span class="status-badge status-paused">${project.phase}</span>` : ''}
      </div>
    </div>

    <div class="detail-section">
      <div class="detail-section-label">Description</div>
      <p class="detail-desc">${project.description}</p>
    </div>

    <div class="detail-section">
      <div class="detail-section-label">Team</div>
      <div class="detail-team">
        ${project.team.map(p => `<span class="detail-team-person">${p}</span>`).join('')}
      </div>
    </div>

    ${milestonesHTML}
    ${linksHTML}
  `;
}

/** Formats an ISO date string (YYYY-MM-DD) into a short human-readable form. */
function formatDate(iso) {
  const [year, month, day] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`;
}

init();
