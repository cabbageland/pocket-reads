function escapeHtml(s = '') {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function short(text = '', len = 220) {
  return text.length > len ? `${text.slice(0, len).trim()}…` : text;
}

function formatDate(dateStr) {
  if (!dateStr) return 'Unknown date';
  const parsed = new Date(`${dateStr}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function getMarked() {
  if (typeof window.marked === 'undefined') {
    throw new Error('marked failed to load');
  }
  return window.marked;
}

function stripLeadingMarkdownTitle(text = '') {
  return text.replace(/^#\s+.+?(\n+|$)/, '');
}

function resolveRepoRelativeUrl(url = '', notePath = '') {
  if (!url) return url;
  if (/^(https?:|data:|mailto:|tel:|#)/i.test(url)) return url;
  const base = notePath ? new URL(notePath, window.location.origin + '/') : new URL(window.location.href);
  return new URL(url, base).pathname;
}

function renderMarkdown(text = '', notePath = '') {
  const marked = getMarked();
  const renderer = new marked.Renderer();

  renderer.image = (token) => {
    const href = token?.href || token?.url || '';
    const title = token?.title || '';
    const text = token?.text || '';
    const src = resolveRepoRelativeUrl(href, notePath);
    const alt = escapeHtml(text);
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<img src="${src}" alt="${alt}"${titleAttr} loading="lazy" />`;
  };

  renderer.link = (token) => {
    const href = token?.href || token?.url || '';
    const title = token?.title || '';
    const text = token?.text || '';
    const resolved = resolveRepoRelativeUrl(href, notePath);
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    const isExternal = /^(https?:)?\/\//i.test(resolved);
    const rel = isExternal ? ' rel="noreferrer" target="_blank"' : '';
    return `<a href="${resolved}"${titleAttr}${rel}>${text}</a>`;
  };

  marked.setOptions({
    gfm: true,
    breaks: false,
    headerIds: false,
    mangle: false,
    renderer
  });
  return marked.parse(stripLeadingMarkdownTitle(text));
}

function githubMarkdownUrl(path = '') {
  const repo = state.content?.repo || 'cabbageland/pocket-reads';
  return `https://github.com/${repo}/blob/main/${path}`;
}

function matchQuery(parts) {
  const hay = parts.filter(Boolean).join(' ').toLowerCase();
  const q = state.query.trim().toLowerCase();
  return !q || hay.includes(q);
}

function makeClickableCard(node, path) {
  node.classList.add('clickable-card');
  node.tabIndex = 0;
  node.setAttribute('role', 'link');
  const open = () => openDetailByPath(path);
  node.addEventListener('click', (e) => {
    if (e.target.closest('a, button, summary')) return;
    open();
  });
  node.addEventListener('keydown', (e) => {
    if (e.target !== node) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  });
}

const state = {
  content: null,
  view: 'overview',
  query: '',
  verdict: '',
  previousView: 'overview',
  currentDetailPath: ''
};

const els = {
  hero: document.getElementById('hero'),
  stats: document.getElementById('stats'),
  latestNote: document.getElementById('latestNote'),
  latestNoteDate: document.getElementById('latestNoteDate'),
  recentPicks: document.getElementById('recentPicks'),
  notesList: document.getElementById('notesList'),
  searchInput: document.getElementById('searchInput'),
  verdictFilter: document.getElementById('verdictFilter'),
  detailTitle: document.getElementById('detailTitle'),
  detailKicker: document.getElementById('detailKicker'),
  detailMeta: document.getElementById('detailMeta'),
  detailBody: document.getElementById('detailBody'),
  detailSourceLink: document.getElementById('detailSourceLink'),
  detailBackButton: document.getElementById('detailBackButton')
};

const templates = {
  note: document.getElementById('noteCardTemplate')
};

function noteMeta(item) {
  return [item.authors, item.venue, item.year].filter(Boolean).join(' · ');
}

function noteTags(item) {
  return Array.isArray(item.tags) ? item.tags : [];
}

function firstSentence(text = '') {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  const match = normalized.match(/^(.{0,220}?[.!?])(?:\s|$)/);
  return match ? match[1].trim() : short(normalized, 220);
}

function atAGlanceItems(note) {
  const items = [];
  if (note.verdict) items.push(note.verdict);
  if (note.summary) items.push(firstSentence(note.summary));
  else if (note.whySelected) items.push(firstSentence(note.whySelected));
  if (note.whyItMatters) items.push(firstSentence(note.whyItMatters));
  else if (note.finalDecision) items.push(firstSentence(note.finalDecision));
  return items.filter(Boolean).slice(0, 3);
}

function detailRecord(path) {
  const note = state.content.notes.find((item) => item.path === path);
  if (note) {
    return {
      kind: 'Paper note',
      title: note.title,
      meta: [noteMeta(note), formatDate(note.dateRead)].filter(Boolean).join(' · ')
    };
  }
  return { kind: 'Markdown', title: path.split('/').pop() || path, meta: '' };
}

function openDetailByPath(path) {
  if (!state.content?.markdown?.[path]) {
    window.open(githubMarkdownUrl(path), '_blank', 'noreferrer');
    return;
  }
  const record = detailRecord(path);
  state.previousView = state.view === 'detail' ? state.previousView : state.view;
  state.currentDetailPath = path;
  els.detailKicker.textContent = record.kind;
  els.detailTitle.textContent = record.title;
  els.detailMeta.textContent = record.meta || '';
  els.detailBody.innerHTML = renderMarkdown(state.content.markdown[path], path);
  els.detailSourceLink.href = githubMarkdownUrl(path);
  els.detailSourceLink.textContent = 'open on GitHub';
  setActiveView('detail');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderHero() {
  const latest = state.content.notes[0];
  const glanceItems = atAGlanceItems(latest);
  els.hero.innerHTML = `
    <div class="hero-grid">
      <div class="hero-main">
        <div class="kicker">Pocket notebook</div>
        <h2><button class="hero-title-link reset-button" data-open-path="${latest.path}">${escapeHtml(latest.title)}</button></h2>
        <p class="big">${escapeHtml(latest.summary || latest.whySelected || 'A fresh paper note ready to read.')}</p>
        <div class="hero-picks">
          <div class="hero-picks-label">At a glance</div>
          <ol class="hero-picks-list">
            ${glanceItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('') || '<li>Fresh Pocket Reads note.</li>'}
          </ol>
        </div>
        <a class="hero-scroll" href="#view-overview">↓ Scroll down for the shelf</a>
      </div>
    </div>
  `;
  els.hero.querySelector('[data-open-path]')?.addEventListener('click', () => openDetailByPath(latest.path));
}

function renderStats() {
  const verdicts = new Set(state.content.notes.map((note) => note.verdict).filter(Boolean));
  const tagCount = new Set(state.content.notes.flatMap((note) => noteTags(note))).size;
  const statData = [
    ['Paper notes', state.content.notes.length],
    ['Verdict buckets', verdicts.size],
    ['Tracked tags', tagCount]
  ];
  els.stats.innerHTML = statData.map(([label, value]) => `
    <article class="stat">
      <div class="label">${label}</div>
      <div class="value">${value}</div>
    </article>
  `).join('');
}

function renderOverview() {
  const latest = state.content.notes[0];
  els.latestNoteDate.textContent = formatDate(latest.dateRead);
  els.latestNote.innerHTML = `
    <h3><button class="card-title-link reset-button" data-open-path="${latest.path}">${escapeHtml(latest.title)}</button></h3>
    <p class="theme">${escapeHtml(noteMeta(latest) || latest.verdict || 'Pocket Reads note')}</p>
    <p>${escapeHtml(latest.summary || latest.whySelected || '')}</p>
    <p>${escapeHtml(latest.whyItMatters || latest.finalDecision || '')}</p>
    <div class="detail-tag-row">
      ${noteTags(latest).map((tag) => `<span class="chip tag">${escapeHtml(tag)}</span>`).join('')}
    </div>
    <p><button class="button ghost reset-button" data-open-path="${latest.path}">read note here</button></p>
  `;
  els.latestNote.querySelectorAll('[data-open-path]').forEach((node) => {
    node.addEventListener('click', () => openDetailByPath(latest.path));
  });
  makeClickableCard(els.latestNote, latest.path);

  const recent = state.content.notes.slice(0, 5);
  els.recentPicks.innerHTML = recent.map((note) => `
    <article class="mini-pick" data-href="${note.path}">
      <div class="card-meta-row">
        <button class="chip verdict reset-button" data-open-path="${note.path}">${escapeHtml(note.verdict || 'Unknown')}</button>
        <button class="chip venue reset-button" data-open-path="${note.path}">${escapeHtml(note.venue || 'Unknown venue')}</button>
      </div>
      <h4><button class="card-title-link reset-button" data-open-path="${note.path}">${escapeHtml(note.title)}</button></h4>
      <p>${escapeHtml(short(note.whySelected || note.summary || note.whyItMatters, 180))}</p>
    </article>
  `).join('');
  els.recentPicks.querySelectorAll('.mini-pick').forEach((node) => makeClickableCard(node, node.dataset.href));
  els.recentPicks.querySelectorAll('[data-open-path]').forEach((node) => {
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      openDetailByPath(node.dataset.openPath);
    });
  });
}

function renderNotes() {
  const items = state.content.notes.filter((item) => {
    const verdictOk = !state.verdict || (item.verdict || '').toLowerCase() === state.verdict.toLowerCase();
    return verdictOk && matchQuery([
      item.title,
      item.authors,
      item.venue,
      item.verdict,
      item.whySelected,
      item.summary,
      item.whyItMatters,
      item.finalDecision,
      ...(noteTags(item))
    ]);
  });

  els.notesList.innerHTML = '';
  for (const item of items) {
    const node = templates.note.content.firstElementChild.cloneNode(true);
    const verdict = node.querySelector('.verdict');
    verdict.textContent = item.verdict || 'Unknown';
    verdict.href = '#';
    verdict.addEventListener('click', (e) => {
      e.preventDefault();
      openDetailByPath(item.path);
    });

    const venue = node.querySelector('.venue');
    venue.textContent = item.venue || 'Unknown venue';
    venue.href = '#';
    venue.addEventListener('click', (e) => {
      e.preventDefault();
      openDetailByPath(item.path);
    });

    node.querySelector('.tag-count').textContent = `${noteTags(item).length} tags`;
    node.querySelector('h3').innerHTML = `<button class="card-title-link reset-button" data-open-path="${item.path}">${escapeHtml(item.title)}</button>`;
    node.querySelector('.why').textContent = short(item.whySelected || item.summary, 220);
    node.querySelector('.overview').textContent = short(item.summary, 420);
    node.querySelector('.why-matters').textContent = item.whyItMatters ? short(item.whyItMatters, 220) : '';

    const tagRow = node.querySelector('.tag-row');
    tagRow.innerHTML = noteTags(item).slice(0, 6).map((tag) => `<span class="chip tag">${escapeHtml(tag)}</span>`).join('');

    const paperLink = node.querySelector('.paper-link');
    paperLink.href = item.paperUrl || githubMarkdownUrl(item.path);
    const mdLink = node.querySelector('.md-link');
    mdLink.href = githubMarkdownUrl(item.path);
    mdLink.textContent = 'open on GitHub';

    node.querySelector('[data-open-path]')?.addEventListener('click', () => openDetailByPath(item.path));
    makeClickableCard(node, item.path);
    els.notesList.appendChild(node);
  }

  if (!items.length) {
    els.notesList.innerHTML = '<article class="panel"><p class="muted">No notes matched the current filters.</p></article>';
  }
}

function renderVerdictOptions() {
  const options = Array.from(new Set(state.content.notes.map((note) => note.verdict).filter(Boolean))).sort();
  els.verdictFilter.innerHTML = '<option value="">All verdicts</option>' + options.map((value) => `<option>${escapeHtml(value)}</option>`).join('');
}

function renderAll() {
  renderVerdictOptions();
  renderHero();
  renderStats();
  renderOverview();
  renderNotes();
}

function setActiveView(view) {
  state.view = view === 'detail' ? 'detail' : view;
  document.querySelectorAll('.tab').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
}

function setupTabs() {
  document.querySelectorAll('.tab').forEach((btn) => {
    btn.addEventListener('click', () => setActiveView(btn.dataset.view));
  });
}

async function init() {
  setupTabs();
  els.detailBackButton.addEventListener('click', () => {
    setActiveView(state.previousView || 'overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  els.searchInput.addEventListener('input', (e) => {
    state.query = e.target.value;
    if (state.query.trim()) setActiveView('notes');
    renderNotes();
  });
  els.verdictFilter.addEventListener('change', (e) => {
    state.verdict = e.target.value;
    if (state.verdict) setActiveView('notes');
    renderNotes();
  });

  const res = await fetch('./data/content.json');
  state.content = await res.json();
  renderAll();
}

init().catch((err) => {
  document.body.innerHTML = `<pre style="padding:24px;color:white">Failed to load Pocket Reads.\n\n${escapeHtml(String(err))}</pre>`;
});
