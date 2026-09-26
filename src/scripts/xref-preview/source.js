// Where a preview's content comes from. A target on this page is read from
// the page; a target in another post from that post's HTML, fetched once and
// parsed, which also leaves the page in the browser's cache for the click
// that may follow. A figure whose island has hydrated here is read from a
// pristine copy of this page: hydration rewrites the server's markup, and a
// second island must start from that markup.

const SKIP = new Set(['SCRIPT', 'STYLE', 'LINK', 'TEMPLATE', 'NOSCRIPT']);
const MAX_DOCS = 4;
const RETRY = 30000;

export const norm = (path) => path.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
export const HERE = norm(location.pathname);
export const bodyOf = (doc) => doc.querySelector('article.post .body');

// A hash as an id; a malformed escape ("#50%") is kept as written.
const decode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };
export const hashId = () => decode(location.hash.slice(1));

export function keyOf(link) {
  const url = new URL(link.href, location.href);
  return `${norm(url.pathname)}#${decode(url.hash.slice(1))}`;
}

// A target's name from the id cross-refs.mjs gave it: theorem-3-5 is
// Theorem 3.5, figure-2 is Figure 2, eq-1-1 is (1.1).
export function nameOf(key) {
  const id = key.slice(key.indexOf('#') + 1);
  if (id.startsWith('eq-')) return `(${id.slice(3).replace(/-/g, '.')})`;
  const [kind, ...num] = id.split('-');
  return `${kind[0].toUpperCase()}${kind.slice(1)} ${num.join('.')}`;
}

// The blocks of a target, from the build's marks.
export function blocksOf(body, id) {
  const el = body?.querySelector(`#${CSS.escape(id)}`);
  if (!el) return null;
  if (el.classList.contains('xref-anchor')) {
    const blocks = [];
    for (let n = el.nextElementSibling; n && blocks.length < 6; n = n.nextElementSibling) {
      if (SKIP.has(n.tagName)) continue;
      blocks.push(n);
      if (n.getAttribute('data-xref-part') === id) return { kind: 'figure', blocks };
    }
    return null;
  }
  if (el.classList.contains('katex-display')) {
    const lead = body.querySelector(`[data-xref-lead="${id}"]`);
    return { kind: 'equation', blocks: lead ? [lead, el] : [el], lead: Boolean(lead) };
  }
  if (el.tagName !== 'P') return null;
  return { kind: 'statement', blocks: [el, ...body.querySelectorAll(`[data-xref-part="${id}"]`)] };
}

const docs = new Map();
export function loadDoc(path) {
  let doc = docs.get(path);
  if (doc) { docs.delete(path); docs.set(path, doc); return doc; }
  doc = fetch(path, { cache: path === HERE ? 'force-cache' : 'default' })
    .then((r) => { if (!r.ok) throw new Error(`${r.status} for ${path}`); return r.text(); })
    .then((html) => new DOMParser().parseFromString(html, 'text/html'));
  doc.catch(() => setTimeout(() => { if (docs.get(path) === doc) docs.delete(path); }, RETRY));
  docs.set(path, doc);
  if (docs.size > MAX_DOCS) docs.delete(docs.keys().next().value);
  return doc;
}

const entries = new Map();
export function entryFor(key) {
  let entry = entries.get(key);
  if (!entry) {
    entry = build(key);
    entries.set(key, entry);
    entry.catch(() => entries.delete(key));
  }
  return entry;
}

const isIsland = (el) => el.localName === 'astro-island';
const hydrated = (block) => [block, ...block.querySelectorAll('astro-island')].some((i) => isIsland(i) && !i.hasAttribute('ssr'));

async function build(key) {
  const [path, id] = key.split('#');
  const other = path !== HERE;
  let doc = other ? await loadDoc(path) : document;
  let found = blocksOf(bodyOf(doc), id);
  let still = null;
  if (!other && found?.blocks.some(hydrated)) {
    try { doc = await loadDoc(HERE); found = blocksOf(bodyOf(doc), id); }
    catch { still = found.blocks; }
  }
  if (!found) throw new Error(`no target ${key}`);
  if (doc !== document) await adopt(doc);
  const fragment = document.createDocumentFragment();
  for (const block of found.blocks) fragment.append(document.importNode(block, true));
  if (still) freeze(fragment, still);
  // The build's marks and what the page added at run time do not travel.
  for (const el of fragment.querySelectorAll('[data-xref-part], [data-xref-lead], .is-open, .xref-wash')) {
    el.removeAttribute('data-xref-part');
    el.removeAttribute('data-xref-lead');
    el.classList.remove('is-open', 'xref-wash');
  }
  const islands = [...fragment.querySelectorAll('astro-island')];
  const inIsland = (el) => islands.some((i) => i.contains(el));
  // In another post's text, "#x" meant that post's x.
  if (other) for (const a of fragment.querySelectorAll('a[href^="#"]')) if (!inIsland(a)) a.setAttribute('href', path + a.getAttribute('href'));
  for (const island of islands) { island.removeAttribute('client-render-time'); preload(island); }
  let from = null;
  const title = other && doc.querySelector('article.post h1');
  if (title) {
    from = document.createDocumentFragment();
    for (const n of title.childNodes) from.append(document.importNode(n, true));
  }
  return { kind: found.kind, lead: Boolean(found.lead), wide: found.blocks.some((b) => b.matches('.wide')), fragment, from };
}

// Offline with no copy of this page: the figure as it stands, inert.
function freeze(fragment, live) {
  const canvases = live.flatMap((b) => [...b.querySelectorAll('canvas')]);
  fragment.querySelectorAll('canvas').forEach((canvas, k) => {
    const img = document.createElement('img');
    try { img.src = canvases[k].toDataURL(); } catch { /* a tainted canvas stays empty */ }
    img.style.width = '100%';
    canvas.replaceWith(img);
  });
  for (const island of fragment.querySelectorAll('astro-island')) island.replaceWith(...island.childNodes);
  for (const control of fragment.querySelectorAll('button, input, select')) control.disabled = true;
}

const preloaded = new Set();
function preload(island) {
  for (const name of ['component-url', 'renderer-url']) {
    const href = island.getAttribute(name);
    if (!href || preloaded.has(href)) continue;
    preloaded.add(href);
    document.head.append(Object.assign(document.createElement('link'), { rel: 'modulepreload', href }));
  }
}

// Another post's figures need that post's component styles and, on a page
// without islands, Astro's island runtime and directive: both come from its
// HTML, once.
const DIRECTIVE = /\(\s*self\.Astro\s*\|\|\s*\(\s*self\.Astro\s*=\s*\{\s*\}\s*\)\s*\)\.(\w+)\s*=/;
const RUNTIME = /customElements\.define\(\s*["']astro-island["']/;
let known = null;
async function adopt(doc) {
  known ??= {
    styles: new Set([...document.querySelectorAll('style')].map((s) => s.textContent)),
    sheets: new Set([...document.querySelectorAll('link[rel~="stylesheet"]')].map((l) => l.href)),
  };
  const loads = [];
  for (const style of doc.querySelectorAll('style')) {
    if (known.styles.has(style.textContent)) continue;
    known.styles.add(style.textContent);
    document.head.append(document.importNode(style, true));
  }
  for (const link of doc.querySelectorAll('link[rel~="stylesheet"]')) {
    const href = new URL(link.getAttribute('href'), location.href).href;
    if (known.sheets.has(href)) continue;
    known.sheets.add(href);
    const sheet = Object.assign(document.createElement('link'), { rel: 'stylesheet', href });
    loads.push(new Promise((done) => { sheet.onload = sheet.onerror = done; }));
    document.head.append(sheet);
  }
  for (const script of doc.body.querySelectorAll('script:not([src])')) {
    const code = script.textContent;
    const directive = code.match(DIRECTIVE)?.[1];
    if ((directive && !self.Astro?.[directive]) || (RUNTIME.test(code) && !customElements.get('astro-island'))) {
      document.head.append(Object.assign(document.createElement('script'), { textContent: code }));
    }
  }
  await Promise.race([Promise.all(loads), new Promise((done) => setTimeout(done, 1500))]);
}
