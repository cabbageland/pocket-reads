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

function makeClickableCard(node, path) {
  node.classList.add('clickable-card');
  node.tabIndex = 0;
  node.setAttribute('role', 'link');
  const open = () => openDetailByPath(path);
  node.addEventListener('click', (e) => {
    if (e.target.closest('a, button, summary, select, input')) return;
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
  currentDetailPath: '',
  activeCollectionId: 'papers'
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
  detailBackButton: document.getElementById('detailBackButton'),
  collectionTabs: document.getElementById('collectionTabs')
};

const templates = {
  note: document.getElementById('noteCardTemplate')
};

function getCollections() {
  return state.content?.collections || [];
}

function getActiveCollection() {
  return getCollections().find((collection) => collection.id === state.activeCollectionId) || getCollections()[0];
}

function getActiveItems() {
  return getActiveCollection()?.items || [];
}

function noteMeta(item) {
  if (item.collection === 'tools') {
    return [item.category, item.platform, item.pricing].filter(Boolean).join(' · ');
  }
  return [item.authors, item.venue, item.year].filter(Boolean).join(' · ');
}

function itemTags(item) {
  return Array.isArray(item.tags) ? item.tags : [];
}

function firstSentence(text = '') {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  const match = normalized.match(/^(.{0,220}?[.!?])(?:\s|$)/);
  return match ? match[1].trim() : short(normalized, 220);
}

function atAGlanceItems(item) {
  if (!item) return [];
  if (item.collection === 'tools') {
    return [item.whatItIs, item.usedFor, item.notes || item.summary].filter(Boolean).map(firstSentence).slice(0, 3);
  }
  const items = [];
  if (item.verdict) items.push(item.verdict);
  if (item.summary) items.push(firstSentence(item.summary));
  else if (item.whySelected) items.push(firstSentence(item.whySelected));
  if (item.whyItMatters) items.push(firstSentence(item.whyItMatters));
  else if (item.finalDecision) items.push(firstSentence(item.finalDecision));
  return items.filter(Boolean).slice(0, 3);
}

function detailRecord(path) {
  for (const collection of getCollections()) {
    const item = collection.items.find((entry) => entry.path === path);
    if (item) {
      return {
        kind: collection.singular,
        title: item.title,
        meta: [noteMeta(item), formatDate(item.dateRead || item.dateSurfaced)].filter(Boolean).join(' · ')
      };
    }
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

function renderCollectionTabs() {
  els.collectionTabs.innerHTML = getCollections().map((collection) => `
    <button class="tab ${collection.id === state.activeCollectionId ? 'active' : ''}" data-collection-id="${collection.id}" type="button">${escapeHtml(collection.label)}</button>
  `).join('');
  els.collectionTabs.querySelectorAll('[data-collection-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeCollectionId = btn.dataset.collectionId;
      state.verdict = '';
      els.verdictFilter.value = '';
      updateCollectionUi();
    });
  });
}

function renderHero() {
  const collection = getActiveCollection();
  const latest = collection?.items?.[0];
  if (!collection || !latest) {
    els.hero.innerHTML = '';
    return;
  }
  const glanceItems = atAGlanceItems(latest);
  const subtitle = collection.id === 'tools'
    ? (latest.usedFor || latest.summary || 'A fresh tool card ready to browse.')
    : (latest.summary || latest.whySelected || 'A fresh paper note ready to read.');
  const kicker = collection.id === 'tools' ? 'Pocket tools' : 'Pocket notebook';
  const shelfLabel = collection.id === 'tools' ? 'tool shelf' : 'shelf';
  els.hero.innerHTML = `
    <div class="hero-grid">
      <div class="hero-main">
        <div class="kicker">${escapeHtml(kicker)}</div>
        <h2><button class="hero-title-link reset-button" data-open-path="${latest.path}">${escapeHtml(latest.title)}</button></h2>
        <p class="big">${escapeHtml(subtitle)}</p>
        <div class="hero-picks">
          <div class="hero-picks-label">At a glance</div>
          <ol class="hero-picks-list">
            ${glanceItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('') || `<li>Fresh ${escapeHtml(collection.singular.toLowerCase())}.</li>`}
          </ol>
        </div>
        <a class="hero-scroll" href="#view-overview">↓ Scroll down for the ${escapeHtml(shelfLabel)}</a>
      </div>
    </div>
  `;
  els.hero.querySelector('[data-open-path]')?.addEventListener('click', () => openDetailByPath(latest.path));
}

function renderStats() {
  const collections = getCollections();
  const active = getActiveCollection();
  const items = active?.items || [];
  const verdicts = new Set(items.map((item) => item.verdict).filter(Boolean));
  const tagCount = new Set(items.flatMap((item) => itemTags(item))).size;
  const statData = [
    ['Paper notes', collections.find((c) => c.id === 'papers')?.count || 0],
    ['Tool cards', collections.find((c) => c.id === 'tools')?.count || 0],
    ['Tracked tags', tagCount],
    ['Current verdict buckets', verdicts.size]
  ];
  els.stats.innerHTML = statData.map(([label, value]) => `
    <article class="stat">
      <div class="label">${label}</div>
      <div class="value">${value}</div>
    </article>
  `).join('');
}

function renderOverview() {
  const collection = getActiveCollection();
  const latest = collection?.items?.[0];
  if (!collection || !latest) {
    els.latestNote.innerHTML = '<p class="muted">Nothing here yet.</p>';
    els.recentPicks.innerHTML = '';
    els.latestNoteDate.textContent = '';
    return;
  }

  els.latestNoteDate.textContent = formatDate(latest.dateRead || latest.dateSurfaced);

  if (collection.id === 'tools') {
    els.latestNote.innerHTML = `
      <h3><button class="card-title-link reset-button" data-open-path="${latest.path}">${escapeHtml(latest.title)}</button></h3>
      <p class="theme">${escapeHtml(noteMeta(latest) || latest.status || 'Pocket tool card')}</p>
      <p>${escapeHtml(latest.whatItIs || latest.summary || '')}</p>
      <p>${escapeHtml(latest.usedFor || latest.notes || '')}</p>
      <div class="detail-tag-row">
        ${itemTags(latest).map((tag) => `<span class="chip tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
      <p><button class="button ghost reset-button" data-open-path="${latest.path}">read card here</button></p>
    `;
  } else {
    els.latestNote.innerHTML = `
      <h3><button class="card-title-link reset-button" data-open-path="${latest.path}">${escapeHtml(latest.title)}</button></h3>
      <p class="theme">${escapeHtml(noteMeta(latest) || latest.verdict || 'Pocket Reads note')}</p>
      <p>${escapeHtml(latest.summary || latest.whySelected || '')}</p>
      <p>${escapeHtml(latest.whyItMatters || latest.finalDecision || '')}</p>
      <div class="detail-tag-row">
        ${itemTags(latest).map((tag) => `<span class="chip tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
      <p><button class="button ghost reset-button" data-open-path="${latest.path}">read note here</button></p>
    `;
  }

  els.latestNote.querySelectorAll('[data-open-path]').forEach((node) => {
    node.addEventListener('click', () => openDetailByPath(latest.path));
  });
  makeClickableCard(els.latestNote, latest.path);

  const recent = collection.items.slice(0, 5);
  els.recentPicks.innerHTML = recent.map((item) => collection.id === 'tools' ? `
    <article class="mini-pick" data-href="${item.path}">
      <div class="card-meta-row">
        <button class="chip verdict reset-button" data-open-path="${item.path}">${escapeHtml(item.category || item.status || 'Tool')}</button>
        <button class="chip venue reset-button" data-open-path="${item.path}">${escapeHtml(item.platform || item.pricing || 'Tool card')}</button>
      </div>
      <h4><button class="card-title-link reset-button" data-open-path="${item.path}">${escapeHtml(item.title)}</button></h4>
      <p>${escapeHtml(short(item.usedFor || item.whatItIs || item.notes, 180))}</p>
    </article>
  ` : `
    <article class="mini-pick" data-href="${item.path}">
      <div class="card-meta-row">
        <button class="chip verdict reset-button" data-open-path="${item.path}">${escapeHtml(item.verdict || 'Unknown')}</button>
        <button class="chip venue reset-button" data-open-path="${item.path}">${escapeHtml(item.venue || 'Unknown venue')}</button>
      </div>
      <h4><button class="card-title-link reset-button" data-open-path="${item.path}">${escapeHtml(item.title)}</button></h4>
      <p>${escapeHtml(short(item.whySelected || item.summary || item.whyItMatters, 180))}</p>
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

function itemMatches(item) {
  const q = state.query.trim().toLowerCase();
  const verdictOk = !state.verdict || (item.verdict || '').toLowerCase() === state.verdict.toLowerCase();
  const hay = [
    item.title,
    item.searchText,
    ...(itemTags(item))
  ].filter(Boolean).join(' ').toLowerCase();
  return verdictOk && (!q || hay.includes(q));
}

function renderNotes() {
  const collection = getActiveCollection();
  const items = (collection?.items || []).filter(itemMatches);

  els.notesList.innerHTML = '';
  for (const item of items) {
    const node = templates.note.content.firstElementChild.cloneNode(true);
    const verdict = node.querySelector('.verdict');
    verdict.textContent = item.collection === 'tools'
      ? (item.category || item.status || 'Tool')
      : (item.verdict || 'Unknown');
    verdict.href = '#';
    verdict.addEventListener('click', (e) => {
      e.preventDefault();
      openDetailByPath(item.path);
    });

    const venue = node.querySelector('.venue');
    venue.textContent = item.collection === 'tools'
      ? (item.platform || item.pricing || 'Tool card')
      : (item.venue || 'Unknown venue');
    venue.href = '#';
    venue.addEventListener('click', (e) => {
      e.preventDefault();
      openDetailByPath(item.path);
    });

    node.querySelector('.tag-count').textContent = `${itemTags(item).length} tags`;
    node.querySelector('h3').innerHTML = `<button class="card-title-link reset-button" data-open-path="${item.path}">${escapeHtml(item.title)}</button>`;

    if (item.collection === 'tools') {
      node.querySelector('.why').textContent = short(item.whatItIs || item.summary, 220);
      node.querySelector('.overview').textContent = short(item.usedFor || item.notes || item.summary, 420);
      node.querySelector('.why-matters').textContent = item.notes ? short(item.notes, 220) : '';
    } else {
      node.querySelector('.why').textContent = short(item.whySelected || item.summary, 220);
      node.querySelector('.overview').textContent = short(item.summary, 420);
      node.querySelector('.why-matters').textContent = item.whyItMatters ? short(item.whyItMatters, 220) : '';
    }

    const tagRow = node.querySelector('.tag-row');
    tagRow.innerHTML = itemTags(item).slice(0, 6).map((tag) => `<span class="chip tag">${escapeHtml(tag)}</span>`).join('');

    const primaryLink = node.querySelector('.paper-link');
    primaryLink.href = item.collection === 'tools'
      ? (item.toolUrl || githubMarkdownUrl(item.path))
      : (item.paperUrl || githubMarkdownUrl(item.path));
    primaryLink.textContent = collection.itemLinkLabel || (item.collection === 'tools' ? 'tool' : 'paper');

    const mdLink = node.querySelector('.md-link');
    mdLink.href = githubMarkdownUrl(item.path);
    mdLink.textContent = 'open on GitHub';

    node.querySelector('[data-open-path]')?.addEventListener('click', () => openDetailByPath(item.path));
    makeClickableCard(node, item.path);
    els.notesList.appendChild(node);
  }

  if (!items.length) {
    els.notesList.innerHTML = `<article class="panel"><p class="muted">${escapeHtml(collection?.emptyMessage || 'No notes matched the current filters.')}</p></article>`;
  }
}

function renderVerdictOptions() {
  const collection = getActiveCollection();
  const options = Array.from(new Set((collection?.items || []).map((item) => item.verdict).filter(Boolean))).sort();
  const label = collection?.id === 'tools' ? 'All statuses / categories' : 'All verdicts';
  els.verdictFilter.innerHTML = `<option value="">${escapeHtml(label)}</option>` + options.map((value) => `<option>${escapeHtml(value)}</option>`).join('');
}

function updateCollectionUi() {
  const collection = getActiveCollection();
  if (!collection) return;
  renderCollectionTabs();
  renderVerdictOptions();
  els.searchInput.placeholder = collection.searchPlaceholder || 'Search...';
  renderHero();
  renderStats();
  renderOverview();
  renderNotes();
}

function setActiveView(view) {
  state.view = view === 'detail' ? 'detail' : view;
  document.querySelectorAll('.tab[data-view]').forEach((btn) => btn.classList.toggle('active', btn.dataset.view === view));
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
}

function setupTabs() {
  document.querySelectorAll('.tab[data-view]').forEach((btn) => {
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
  if (!getCollections().some((collection) => collection.id === state.activeCollectionId)) {
    state.activeCollectionId = getCollections()[0]?.id || 'papers';
  }
  updateCollectionUi();
}

init().catch((err) => {
  document.body.innerHTML = `<pre style="padding:24px;color:white">Failed to load Pocket Reads.\n\n${escapeHtml(String(err))}</pre>`;
});
