// The card: a frame on the page's paper around a sheet of the target's own
// blocks, laid out at the column's width and scaled, so that every line
// breaks where it breaks on the page.

const GAP = 6;   // px between the link's line and the card
const EDGE = 12; // px kept free at the edges of the window
const MIN_VIEW = 64;
const SVG = 'http://www.w3.org/2000/svg';
const REFS = /^(for|headers|list|aria-(labelledby|describedby|controls|owns|details|flowto|activedescendant))$/;
const observers = new WeakMap();
let serial = 0;

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
const frame = () => new Promise((done) => requestAnimationFrame(() => done()));
const make = (tag, className, text) => {
  const el = document.createElement(tag);
  el.className = className;
  if (text) el.textContent = text;
  return el;
};

export const scale = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--xref-scale')) || 0.75;

// The element that draws a block: an island is `display: contents`.
export function boxOf(el) {
  while (el && getComputedStyle(el).display === 'contents') el = el.firstElementChild;
  return el;
}

export function createCard({ key, level, entry, name }) {
  const card = make('div', 'xref-card');
  Object.assign(card.dataset, { level: String(level), key, kind: entry?.kind ?? 'none', state: 'preparing' });
  card.setAttribute('role', 'group');
  card.setAttribute('aria-label', `Preview of ${name}`);
  card.style.zIndex = String(20 + level);
  if (entry?.wide) card.classList.add('is-wide');
  if (entry?.from) {
    const from = make('p', 'xref-from');
    from.append(entry.from.cloneNode(true));
    card.append(from);
  }
  const view = make('div', 'xref-view');
  const scaler = make('div', 'xref-scaler');
  const sheet = make('div', 'body xref-sheet');
  sheet.append(entry ? instance(entry) : make('p', 'xref-none', 'Preview unavailable'));
  scaler.append(sheet);
  view.append(scaler);
  card.append(view);
  view.addEventListener('scroll', () => more(view), { passive: true });
  return card;
}

// One card's copy of the blocks. Ids outside islands are renamed when the
// copy refers to them (an SVG pattern, a label's `for`) and dropped
// otherwise, so that the page never holds two elements with one id and the
// page's own targets stay unique. Islands are left as the server wrote them:
// they hydrate, and their components make their own ids.
function instance(entry) {
  const root = entry.fragment.cloneNode(true);
  const tag = `xr${++serial}`;
  const islands = [...root.querySelectorAll('astro-island')];
  const free = (el) => !islands.some((i) => i.contains(el));
  const ids = new Map();
  for (const el of root.querySelectorAll('[id]')) if (free(el)) ids.set(el.id, `${el.id}--${tag}`);
  const used = new Set();
  const swap = (id) => (ids.has(id) ? (used.add(id), ids.get(id)) : id);
  for (const el of root.querySelectorAll('*')) {
    if (!free(el)) continue;
    for (const { name, value } of [...el.attributes]) {
      let next = value;
      if (REFS.test(name)) next = value.split(/\s+/).map(swap).join(' ');
      else if ((name === 'href' || name === 'xlink:href') && el.namespaceURI === SVG && value.startsWith('#')) next = `#${swap(value.slice(1))}`;
      else if (value.includes('url(#')) next = value.replace(/url\((['"]?)#([^'")]+)\1\)/g, (m, q, id) => `url(#${swap(id)})`);
      if (next !== value) el.setAttribute(name, next);
    }
  }
  for (const el of root.querySelectorAll('[id]')) {
    if (!free(el)) continue;
    if (used.has(el.id)) el.id = ids.get(el.id);
    else el.removeAttribute('id');
  }
  return root;
}

// Measure, scale, place; then wait for the fonts and for the islands the
// reader will see, so that the card shows finished.
export async function prepare(card, entry, link, pointer) {
  const view = card.querySelector('.xref-view');
  const sheet = card.querySelector('.xref-sheet');
  void card.offsetHeight; // layout, so that the fonts the card needs start loading
  await Promise.race([document.fonts.ready, sleep(300)]);
  fit(card, entry);
  place(card, link, pointer);
  const shown = view.getBoundingClientRect();
  const waiting = [...sheet.querySelectorAll('astro-island[ssr]')]
    .filter((island) => { const r = boxOf(island)?.getBoundingClientRect(); return r && r.top < shown.bottom && r.bottom > shown.top; })
    .map((island) => new Promise((done) => island.addEventListener('astro:hydrate', done, { once: true })));
  if (waiting.length) { await Promise.race([Promise.all(waiting), sleep(400)]); await frame(); }
  fit(card, entry);
  const ro = new ResizeObserver(() => { fit(card, entry); place(card, link, pointer, card.dataset.side); });
  ro.observe(sheet);
  observers.set(card, ro);
}

// The scaler takes the sheet's height times the scale, less the outer
// margins of its first and last blocks; an equation keeps two lines of its
// lead-in.
function fit(card, entry) {
  const view = card.querySelector('.xref-view');
  const scaler = card.querySelector('.xref-scaler');
  const sheet = card.querySelector('.xref-sheet');
  const s = scale();
  const box = sheet.getBoundingClientRect();
  if (!box.height) return;
  const first = boxOf(sheet.firstElementChild);
  const last = boxOf(sheet.lastElementChild);
  let top = first ? (first.getBoundingClientRect().top - box.top) / s : 0;
  const bottom = last ? (box.bottom - last.getBoundingClientRect().bottom) / s : 0;
  let lead = false;
  if (entry?.kind === 'equation' && entry.lead) {
    const p = sheet.firstElementChild;
    const line = parseFloat(getComputedStyle(p).lineHeight);
    const cut = p.offsetHeight - 2 * line;
    if (cut > line / 2) { top = cut; lead = true; }
  }
  sheet.style.setProperty('--xref-trim', String(top));
  scaler.style.height = `${Math.max(0, sheet.offsetHeight - top - bottom) * s}px`;
  view.classList.toggle('has-lead', lead);
  more(view);
}

const more = (view) => view.classList.toggle('has-more', view.scrollHeight - view.scrollTop - view.clientHeight > 2);

export const fitsWindow = (card) => card.offsetWidth + 2 * EDGE <= document.documentElement.clientWidth;

export function place(card, link, pointer, side) {
  const view = card.querySelector('.xref-view');
  const rects = [...link.getClientRects()].filter((r) => r.width);
  if (!rects.length) return;
  const r = (pointer && rects.find((q) => pointer.y >= q.top - 1 && pointer.y <= q.bottom + 1)) || rects[0];
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;
  view.style.removeProperty('--xref-room');
  const natural = card.offsetHeight; // already capped by the view's max-height
  const chrome = natural - view.offsetHeight;
  const below = vh - r.bottom - GAP - EDGE;
  const above = r.top - GAP - EDGE;
  side ??= natural <= below ? 'below' : natural <= above ? 'above' : below >= above ? 'below' : 'above';
  const room = side === 'below' ? below : above;
  if (natural > room) view.style.setProperty('--xref-room', `${Math.max(room - chrome, MIN_VIEW)}px`);
  const cs = getComputedStyle(card);
  const inset = parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth);
  const left = Math.min(Math.max(r.left - inset, EDGE), vw - card.offsetWidth - EDGE);
  const top = side === 'below' ? r.bottom + GAP : r.top - GAP - card.offsetHeight;
  card.style.left = `${Math.round(left + window.scrollX)}px`;
  card.style.top = `${Math.round(top + window.scrollY)}px`;
  card.dataset.side = side;
  more(view);
}

export function reveal(card) {
  card.dataset.state = 'open';
}

export function close(card, instant) {
  if (card.dataset.state === 'closing') return;
  card.dataset.state = 'closing';
  card.inert = true;
  if (instant) destroy(card);
  else setTimeout(() => destroy(card), 140);
}

// Removing a card unmounts its islands: the Svelte renderer listens for
// astro:unmount on each island and runs the components' cleanups.
export function destroy(card) {
  observers.get(card)?.disconnect();
  const islands = [...card.querySelectorAll('astro-island')];
  card.remove();
  for (const island of islands) island.dispatchEvent(new CustomEvent('astro:unmount'));
}
