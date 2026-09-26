// Checks of the previews of cross-references (src/scripts/xref-preview),
// shared by check_site.mjs and lecture-post's check_post.mjs.
//
// Without a browser, on the HTML of a built page:
//   marksProblems(html)       every data-xref-part and data-xref-lead names an
//                             id of the page.
//   previewScript(html, dist) the module script of the page that holds the
//                             previews (found by its content, "xref-card" in
//                             it or in a chunk it imports, not by its file
//                             name) and its gzipped size together with the
//                             chunks it imports statically.
//
// In a Playwright page of a post, after the page's own checks, screenshots
// and figure captures, with the page's console collector still attached (the
// callers report console errors and [xref-preview] warnings):
//   checkPreviews(page, {...}) the first link of each kind (statement,
//                             equation, figure, another post) opens a card,
//                             which is checked for scale, measure, place,
//                             paper, content, line breaks, ids and live
//                             figures, and captured; with `full`, leaving,
//                             nesting, keyboard and the jump on click.
//   checkReducedMotion(page, {...}) with reduced motion a card opens without
//                             animation and a click still lands on the target.
//   extentReport(page)        one line per statement: the blocks its preview
//                             shows and how it ends.

import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { gzipSync } from 'node:zlib';

export const BUDGET = 7168; // bytes, the preview script gzipped with its static imports

// ---- without a browser ------------------------------------------------------------

export function marksProblems(html) {
  const ids = new Set([...html.matchAll(/\sid="([^"]*)"/g)].map((m) => m[1]));
  const problems = new Set();
  for (const [, kind, id] of html.matchAll(/\sdata-xref-(part|lead)="([^"]*)"/g)) {
    if (!ids.has(id)) problems.add(`data-xref-${kind}="${id}" names no id of the page`);
  }
  return [...problems];
}

// Static imports of a module: import x from "./a.js", import "./a.js",
// export { x } from "./a.js". A dynamic import("./a.js") loads later and is
// not counted.
const IMPORT = /(?<![\w$.])(?:import|export)\s*(?:[^'"`;()]*?\bfrom\s*)?["']([^"']+\.m?js)["']/g;

export function previewScript(html, dist) {
  const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : null);
  // A module and the modules it imports statically, transitively.
  const closure = (code, file) => {
    const seen = new Map([[file, code]]);
    const queue = [[code, file]];
    while (queue.length) {
      const [text, at] = queue.shift();
      for (const [, spec] of text.matchAll(IMPORT)) {
        const next = spec.startsWith('/') ? join(dist, spec) : join(dirname(at), spec);
        if (seen.has(next)) continue;
        const body = read(next);
        if (body == null) continue;
        seen.set(next, body);
        queue.push([body, next]);
      }
    }
    return seen;
  };
  for (const [, attrs, inline] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (!/\btype="module"/.test(attrs)) continue;
    const src = attrs.match(/\bsrc="([^"]+)"/)?.[1];
    const name = src ?? 'an inline module script';
    // Astro writes the imports of an inline module root-relative.
    const file = src ? join(dist, decodeURIComponent(src.split(/[?#]/)[0])) : join(dist, 'inline.js');
    const code = src ? read(file) : inline;
    if (code == null) continue;
    const modules = closure(code, file);
    if (![...modules.values()].some((m) => m.includes('xref-card'))) continue;
    const bytes = [...modules.values()].reduce((sum, m) => sum + gzipSync(m).length, 0);
    return { name, bytes, modules: modules.size };
  }
  return null;
}

// ---- in the page --------------------------------------------------------------------

// Installed in the page once (page.evaluate(probe)); everything the checks
// read in the browser. Blocks are extracted here by the rules of the
// specification, independently of source.js, so that a bug there shows.
function probe() {
  if (self.__xrefCheck) return;
  const SKIP = new Set(['SCRIPT', 'STYLE', 'LINK', 'TEMPLATE', 'NOSCRIPT']);
  const norm = (p) => p.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  const keyOf = (a) => { const u = new URL(a.href); return `${norm(u.pathname)}#${decodeURIComponent(u.hash.slice(1))}`; };
  const pageLinks = () => [...document.querySelectorAll('article.post .body a.xref')];
  const card = (level) => document.querySelector(`.xref-card[data-level="${level}"][data-state="open"]`);
  const boxOf = (el) => { while (el && getComputedStyle(el).display === 'contents') el = el.firstElementChild; return el; };
  const sleep = (ms) => new Promise((done) => setTimeout(done, ms));
  const text = (el) => {
    const copy = el.cloneNode(true);
    for (const n of copy.querySelectorAll('.katex-mathml, script, style')) n.remove();
    return copy.textContent.replace(/\s+/g, ' ').trim();
  };
  // Text with each formula as its TeX, for the report.
  const prose = (el) => {
    const copy = el.cloneNode(true);
    for (const n of copy.querySelectorAll('script, style')) n.remove();
    for (const k of copy.querySelectorAll('.katex')) k.replaceWith(`$${(k.querySelector('annotation')?.textContent ?? '').trim()}$`);
    return copy.textContent.replace(/\s+/g, ' ').trim();
  };
  // Where two texts part, with a little context on each side.
  const apart = (a, b) => {
    let k = 0;
    while (k < a.length && a[k] === b[k]) k += 1;
    const at = Math.max(0, k - 20);
    return `the card has "${a.slice(at, k + 40)}", the page "${b.slice(at, k + 40)}"`;
  };

  // The blocks a preview of #id shows, in a document (this page, or another
  // post parsed with DOMParser).
  function blocksOf(doc, id) {
    const body = doc.querySelector('article.post .body');
    const el = doc.getElementById(id);
    if (!body || !el || !body.contains(el)) return null;
    if (el.classList.contains('xref-anchor')) {
      const blocks = [];
      for (let n = el.nextElementSibling; n; n = n.nextElementSibling) {
        if (SKIP.has(n.tagName)) continue;
        blocks.push(n);
        if (n.getAttribute('data-xref-part') === id) return { kind: 'figure', blocks };
      }
      return { kind: 'figure', blocks: [], unmarked: true };
    }
    if (el.classList.contains('katex-display')) {
      const lead = body.querySelector(`[data-xref-lead="${CSS.escape(id)}"]`);
      return { kind: 'equation', blocks: lead ? [lead, el] : [el] };
    }
    return { kind: 'statement', blocks: [el, ...body.querySelectorAll(`[data-xref-part="${CSS.escape(id)}"]`)] };
  }

  // Lines of a paragraph, counted from its plain text (outside KaTeX), in
  // whatever scale it is drawn at. A line of mathematics alone is invisible
  // to the count, in the card and on the page alike.
  function lines(el) {
    const s = el.getBoundingClientRect().height / el.offsetHeight || 1;
    const cs = getComputedStyle(el);
    const lh = (parseFloat(cs.lineHeight) || 1.2 * parseFloat(cs.fontSize)) * s;
    const tops = [];
    const range = document.createRange();
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      if (!n.data.trim() || n.parentElement.closest('.katex')) continue;
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) if (r.width > 0) tops.push(r.top);
    }
    tops.sort((a, b) => a - b);
    let count = 0;
    let start = -Infinity;
    for (const t of tops) if (t - start > lh / 2) { count += 1; start = t; }
    return count;
  }

  // The first link of each kind in the post's text.
  function pick() {
    const picks = new Map();
    pageLinks().forEach((a, index) => {
      const url = new URL(a.href);
      const here = norm(url.pathname) === norm(location.pathname);
      const id = decodeURIComponent(url.hash.slice(1));
      const target = here && document.getElementById(id);
      const kind = !here ? 'other' : target?.classList.contains('xref-anchor') ? 'figure' : target?.classList.contains('katex-display') ? 'equation' : 'statement';
      if (!picks.has(kind)) picks.set(kind, { kind, index, id, label: a.textContent.replace(/\s+/g, ' ').trim(), href: a.href });
    });
    return [...picks.values()];
  }

  // The middle of the first line box of a link of the page, scrolled to the
  // centre of the window.
  function aim(index) {
    const a = pageLinks()[index];
    if (!a) return null;
    a.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = [...a.getClientRects()].find((q) => q.width > 0);
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null;
  }

  // Everything that can be read from the open card of level 0 at once.
  async function inspect(index) {
    const problems = [];
    const c = card(0);
    const link = pageLinks()[index];
    if (!c || !link) return { problems: ['the card closed before it could be inspected'], counts: [], links: {} };
    const sheet = c.querySelector('.xref-sheet');
    const view = c.querySelector('.xref-view');
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
    // 1. Scale and measure.
    const scale = sheet.getBoundingClientRect().width / sheet.offsetWidth;
    if (Math.abs(scale - 0.75) > 0.005) problems.push(`the miniature is drawn at ${scale.toFixed(3)} of its size, not 0.75`);
    const measure = (c.classList.contains('is-wide') ? 48 : 40) * rem;
    if (Math.abs(sheet.offsetWidth - measure) > 1) problems.push(`the miniature is laid out ${sheet.offsetWidth} px wide, not ${measure} px`);
    // 2. Place.
    const r = c.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;
    if (r.left < -0.5 || r.top < -0.5 || r.right > vw + 0.5 || r.bottom > vh + 0.5) {
      problems.push(`the card is not inside the window: left ${Math.round(r.left)}, top ${Math.round(r.top)}, right ${Math.round(r.right)}, bottom ${Math.round(r.bottom)} in ${vw} x ${vh}`);
    }
    if ([...link.getClientRects()].some((q) => q.width > 0 && q.left < r.right && r.left < q.right && q.top < r.bottom && r.top < q.bottom)) problems.push('the card covers its link');
    const cap = Math.min(26 * rem, 0.6 * vh);
    const tall = view.getBoundingClientRect().height;
    if (tall > cap + 1) problems.push(`its view is ${Math.round(tall)} px tall, more than min(26rem, 60vh) = ${Math.round(cap)} px`);
    // 3. Tie.
    if (!link.classList.contains('is-open')) problems.push('the link does not carry is-open while its card is open');
    // 4. Paper.
    const paper = getComputedStyle(c).backgroundColor;
    const page = getComputedStyle(document.body).backgroundColor;
    if (paper !== page) problems.push(`the card's background ${paper} is not the page's ${page}`);
    // 5. Content, and 6. line breaks.
    const url = new URL(link.href);
    const path = norm(url.pathname);
    const id = decodeURIComponent(url.hash.slice(1));
    const other = path !== norm(location.pathname);
    let doc = document;
    if (other) {
      try {
        const res = await fetch(url.pathname);
        if (!res.ok) throw new Error(`${res.status}`);
        doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      } catch (err) { problems.push(`${path} could not be fetched to compare: ${err}`); doc = null; }
    }
    const want = doc && blocksOf(doc, id);
    const shown = [...sheet.children];
    const counts = [];
    if (doc && !want) problems.push(`#${id} is not in the text of ${other ? path : 'the page'}`);
    if (want?.unmarked) problems.push(`no caption after the anchor of #${id} is marked data-xref-part="${id}"`);
    else if (want && sheet.querySelector(':scope > .xref-none')) problems.push('the card says "Preview unavailable"');
    else if (want && shown.length !== want.blocks.length) problems.push(`the card shows ${shown.length} block(s), the ${want.kind} has ${want.blocks.length}`);
    else if (want) {
      want.blocks.forEach((block, i) => {
        const a = text(shown[i]);
        const b = text(block);
        if (a !== b) problems.push(`block ${i + 1} of ${shown.length} differs: ${apart(a, b)}`);
        if (block.tagName !== 'P' || shown[i].tagName !== 'P') return;
        const inCard = lines(shown[i]);
        // Another post's page is measured by the caller, in a page of its own.
        if (other) { counts.push(inCard); return; }
        const onPage = lines(block);
        if (inCard !== onPage) problems.push(`block ${i + 1}, a paragraph, breaks into ${inCard} line(s) in the card and ${onPage} on the page`);
      });
    }
    // 7. Ids: no id twice, islands inside cards aside (their components make their own).
    const seen = new Map();
    for (const el of document.querySelectorAll('[id]')) if (!el.matches('.xref-card astro-island *')) seen.set(el.id, (seen.get(el.id) ?? 0) + 1);
    const twice = [...seen].filter(([, n]) => n > 1).map(([name]) => name);
    if (twice.length) problems.push(`${twice.length} id(s) occur twice while the card is open: ${twice.slice(0, 6).join(', ')}`);
    // 8. Figures alive: the islands the reader sees have hydrated, their
    // canvases have a size and a 2D canvas has drawn something.
    if (sheet.querySelector('astro-island')) {
      const visible = (el) => {
        const b = boxOf(el)?.getBoundingClientRect();
        const v = view.getBoundingClientRect();
        return b && b.height > 0 && b.top < v.bottom && b.bottom > v.top;
      };
      const drawn = (cv) => {
        if (!cv.width || !cv.height || !cv.offsetWidth || !cv.offsetHeight) return false;
        const ctx = cv.getContext('2d');
        if (!ctx) return true; // a WebGL canvas: its size is all that is checked
        const d = ctx.getImageData(0, 0, cv.width, cv.height).data;
        for (let k = 4; k < d.length; k += 4) if (d[k] !== d[0] || d[k + 1] !== d[1] || d[k + 2] !== d[2] || d[k + 3] !== d[3]) return true;
        return false;
      };
      const end = performance.now() + 3000;
      let late = [];
      let blank = [];
      for (;;) {
        late = [...sheet.querySelectorAll('astro-island[ssr]')].filter(visible);
        blank = [...sheet.querySelectorAll('canvas')].filter((cv) => visible(cv) && !cv.closest('astro-island[ssr]') && !drawn(cv));
        if ((!late.length && !blank.length) || performance.now() > end) break;
        await sleep(100);
      }
      if (late.length) problems.push(`${late.length} component(s) in the visible part of the card did not hydrate within 3 s`);
      if (blank.length) problems.push(`${blank.length} canvas(es) in the card have no size or drew nothing within 3 s`);
    }
    // Links inside the card, for the nesting check.
    const inner = [...c.querySelectorAll('a.xref')].filter((a) => keyOf(a) !== c.dataset.key);
    return {
      problems, counts, path, id, other,
      links: { any: inner.length > 0, figure: inner.some((a) => /#figure-/.test(a.getAttribute('href'))) },
    };
  }

  // Line counts of the paragraphs of #id on this page (another post, opened
  // on its own), to compare with the card's.
  async function lineCounts(id) {
    await document.fonts.ready;
    const found = blocksOf(document, id);
    return found ? found.blocks.filter((b) => b.tagName === 'P').map(lines) : null;
  }

  // A link inside the card of `level` that opens a card above it: not the
  // card's own target, shown in the card's view (scrolled to it if needed),
  // a figure preferred. The middle of its first line box.
  function aimInside(level) {
    const c = card(level);
    if (!c) return null;
    const view = c.querySelector('.xref-view');
    const links = [...c.querySelectorAll('a.xref')].filter((a) => keyOf(a) !== c.dataset.key);
    links.sort((a, b) => /#figure-/.test(b.getAttribute('href')) - /#figure-/.test(a.getAttribute('href')));
    for (const a of links) {
      let r = [...a.getClientRects()].find((q) => q.width > 0);
      if (!r) continue;
      let v = view.getBoundingClientRect();
      if (r.top < v.top + 4 || r.bottom > v.bottom - 4) {
        view.scrollTop += r.top - v.top - v.height / 2;
        r = [...a.getClientRects()].find((q) => q.width > 0);
        v = view.getBoundingClientRect();
      }
      const x = r.left + r.width / 2;
      const y = r.top + r.height / 2;
      if (y > v.top && y < v.bottom && document.elementFromPoint(x, y)?.closest('a.xref') === a) {
        return { x, y, label: a.textContent.replace(/\s+/g, ' ').trim() };
      }
    }
    return null;
  }

  // A point inside the card of `level`, out of the card above it and of any
  // link: one of its four inner corners.
  function corner(level) {
    const c = card(level);
    if (!c) return null;
    const above = document.querySelector(`.xref-card[data-level="${level + 1}"]`);
    const r = c.getBoundingClientRect();
    const k = 6;
    for (const [x, y] of [[r.left + k, r.top + k], [r.right - k, r.top + k], [r.left + k, r.bottom - k], [r.right - k, r.bottom - k]]) {
      const el = document.elementFromPoint(x, y);
      if (el && c.contains(el) && !above?.contains(el) && !el.closest('a.xref')) return { x, y };
    }
    return null;
  }

  // When none of the cards opened so far holds a link: the first link of the
  // post whose target, on this page, holds a link to something else, one to
  // a figure preferred.
  function host() {
    const found = [];
    pageLinks().forEach((a, index) => {
      const url = new URL(a.href);
      if (norm(url.pathname) !== norm(location.pathname)) return;
      const blocks = blocksOf(document, decodeURIComponent(url.hash.slice(1)))?.blocks ?? [];
      const inner = blocks.flatMap((b) => [...b.querySelectorAll('a.xref')]).filter((x) => keyOf(x) !== keyOf(a));
      if (!inner.length) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      const kind = target.classList.contains('xref-anchor') ? 'figure' : target.classList.contains('katex-display') ? 'equation' : 'statement';
      found.push({ kind, index, label: a.textContent.replace(/\s+/g, ' ').trim(), figure: inner.some((x) => /#figure-/.test(x.getAttribute('href'))) });
    });
    return found.find((h) => h.figure) ?? found[0] ?? null;
  }

  // The focused element, as an index among the post's links (-1 otherwise).
  const focused = () => pageLinks().indexOf(document.activeElement);

  // After a click on a link to #id: no card, the address, the target at the
  // top of the window, and (with `wash`) the whole passage washed.
  function landed(id, wash) {
    const problems = [];
    if (document.querySelector('.xref-card')) problems.push('a card is still in the page');
    if (decodeURIComponent(location.hash.slice(1)) !== id) problems.push(`the address ends in "${location.hash}", not "#${id}"`);
    const el = document.getElementById(id);
    if (!el) return [...problems, `#${id} is not in the page`];
    const top = el.getBoundingClientRect().top;
    const end = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
    if (!(top >= 0 && top <= 80) && !(end && top >= 0 && top < window.innerHeight)) problems.push(`the target's top is ${Math.round(top)} px from the window's top, not within 0 to 80`);
    if (wash) {
      const found = blocksOf(document, id);
      const blocks = found ? (found.kind === 'equation' ? found.blocks.slice(-1) : found.blocks) : [];
      const washed = (block) => {
        const box = boxOf(block);
        return box && (box.classList.contains('xref-wash') || box.getAnimations().some((a) => a.animationName === 'xref-wash' && a.playState === 'running'));
      };
      const dry = blocks.filter((b) => !washed(b)).length;
      if (dry) problems.push(`${dry} of the ${blocks.length} block(s) of the passage are not washed`);
    }
    return problems;
  }

  // One line per statement of the post: its preview's blocks and its end.
  function extents() {
    return [...document.querySelectorAll('article.post .body > p[id]')].map((p) => {
      const blocks = blocksOf(document, p.id)?.blocks ?? [p];
      const last = blocks.at(-1);
      const end = last.classList.contains('katex-display')
        ? `ends with display "${(last.querySelector('annotation')?.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 50)}"`
        : `ends "${prose(last).slice(-60)}"`;
      return { id: p.id, blocks: blocks.length, line: `preview ${p.id}: ${blocks.length} block(s), ${end}` };
    });
  }

  self.__xrefCheck = { pick, aim, inspect, lineCounts, aimInside, corner, host, focused, landed, extents };
}

const OPEN = '.xref-card[data-level="0"][data-state="open"]';
const call = (page, name, ...args) => page.evaluate(([n, a]) => self.__xrefCheck[n](...a), [name, args]);
const until = (page, fn, arg, timeout) => page.waitForFunction(fn, arg, { timeout }).then(() => true, () => false);
const noCard = () => !document.querySelector('.xref-card');

// The pointer to the window's corner, and every card gone.
async function park(page, timeout = 2000) {
  await page.mouse.move(2, 2);
  return until(page, noCard, null, timeout);
}

// Rest on a link of the post until its card is open.
async function openCard(page, index) {
  await park(page);
  const point = await call(page, 'aim', index);
  if (!point) return false;
  await page.mouse.move(point.x, point.y, { steps: 4 });
  return until(page, (s) => !!document.querySelector(s), OPEN, 5000);
}

// The open card of level 0 and a margin for its shadow, as the window shows it.
async function capture(page, path) {
  const clip = await page.evaluate((s) => {
    const r = document.querySelector(s).getBoundingClientRect();
    const x = Math.max(0, r.left - 12);
    const y = Math.max(0, r.top - 12);
    return { x, y, width: Math.min(document.documentElement.clientWidth, r.right + 12) - x, height: Math.min(window.innerHeight, r.bottom + 12) - y };
  }, OPEN);
  await page.screenshot({ path, clip });
}

export async function checkPreviews(page, { context, base, where, full, shot, error, warn }) {
  await page.evaluate(probe);
  const picks = (await call(page, 'pick')).filter((p) => full || p.kind === 'statement' || p.kind === 'figure');
  const hosts = []; // picks whose card holds a link that opens another card
  const failed = new Set();
  const rest = async (pick) => {
    if (await openCard(page, pick.index)) return true;
    const m = `${where}: resting on the ${pick.kind} link "${pick.label}" opened no preview`;
    if (!failed.has(m)) error(m);
    failed.add(m);
    await park(page);
    return false;
  };
  for (const pick of picks) {
    const say = (m) => error(`${where}: the ${pick.kind} preview of "${pick.label}": ${m}`);
    if (!(await rest(pick))) continue;
    await page.waitForTimeout(pick.kind === 'figure' || pick.kind === 'other' ? 1500 : 300);
    const seen = await call(page, 'inspect', pick.index);
    seen.problems.forEach(say);
    if (seen.links?.any) hosts.push({ pick, figure: seen.links.figure });
    if (shot) {
      try { await capture(page, shot(`xref-${pick.kind}`)); } catch (e) { say(`the capture failed: ${String(e).split('\n')[0]}`); }
    }
    if (!(await park(page))) say('the card stayed open 2 s after the pointer left it');
    // Another post: its paragraphs break into as many lines in the card as on its page.
    if (seen.other && seen.counts.length) {
      const second = await context.newPage();
      try {
        await second.goto(`${base}${seen.path}`, { waitUntil: 'networkidle' });
        await second.evaluate(probe);
        const onPage = await call(second, 'lineCounts', seen.id);
        if (!onPage || onPage.length !== seen.counts.length) say(`its paragraphs could not be matched with those of ${seen.path}`);
        else onPage.forEach((n, i) => { if (n !== seen.counts[i]) say(`paragraph ${i + 1} breaks into ${seen.counts[i]} line(s) in the card and ${n} on its page`); });
      } finally {
        await second.close();
        await page.bringToFront();
      }
    }
  }
  if (!full || !picks.length) return;
  const first = picks.find((p) => p.kind === 'statement') ?? picks[0];

  // Leave: out of the link and of the card, the card closes after the grace.
  if (await rest(first)) {
    await page.mouse.move(2, 2);
    const gone = await until(page, () => !document.querySelector('.xref-card') && !document.querySelector('a.xref.is-open'), null, 800);
    if (!gone) error(`${where}: leaving the ${first.kind} link "${first.label}" left its card or its link's wash after 800 ms`);
  }

  // Nesting: a link inside a card opens a card above it; back in the first
  // card, the second closes; out of both, both close.
  let host = hosts.find((h) => h.figure) ?? hosts[0];
  if (!host) {
    const other = await call(page, 'host');
    if (other) host = { pick: other, figure: other.figure };
  }
  if (!host) warn(`${where}: no preview holds a cross-reference, nesting was not checked`);
  else if (await rest(host.pick)) {
    const say = (m) => error(`${where}: nesting in the ${host.pick.kind} preview of "${host.pick.label}": ${m}`);
    await page.waitForTimeout(300); // the unroll clips the card, and hit testing with it
    const inner = await call(page, 'aimInside', 0);
    if (!inner) warn(`${where}: no cross-reference inside the ${host.pick.kind} preview of "${host.pick.label}" could be reached, nesting was not checked`);
    else {
      await page.mouse.move(inner.x, inner.y, { steps: 4 });
      if (!(await until(page, () => !!document.querySelector('.xref-card[data-level="1"][data-state="open"]'), null, 5000))) say(`resting on "${inner.label}" inside the card opened no second card`);
      else {
        await page.waitForTimeout(300);
        const spot = await call(page, 'corner', 0);
        if (!spot) warn(`${where}: no corner of the ${host.pick.kind} preview is free of the card above it, closing back to it was not checked`);
        else {
          await page.mouse.move(spot.x, spot.y);
          const back = await until(page, () => !document.querySelector('.xref-card[data-level="1"]') && !!document.querySelector('.xref-card[data-level="0"][data-state="open"]'), null, 800);
          if (!back) say(`back in the first card, the card of "${inner.label}" did not close within 800 ms, or the first card closed too`);
        }
        await page.mouse.move(2, 2);
        if (!(await until(page, noCard, null, 800))) say('out of both cards, a card was still open after 800 ms');
      }
    }
  }
  await park(page);

  // Keyboard: Tab to the first cross-reference opens its card; Escape closes
  // it and the link keeps focus.
  await page.evaluate(() => { document.activeElement?.blur?.(); window.scrollTo(0, 0); });
  let reached = -1;
  for (let i = 0; i < 400 && reached < 0; i++) {
    await page.keyboard.press('Tab');
    reached = await call(page, 'focused');
  }
  if (reached < 0) warn(`${where}: 400 presses of Tab reached no cross-reference, the keyboard was not checked`);
  else if (!(await until(page, (s) => !!document.querySelector(s), OPEN, 1000))) error(`${where}: focusing a cross-reference with Tab opened no card within 1 s`);
  else {
    await page.keyboard.press('Escape');
    if (!(await until(page, noCard, null, 300))) error(`${where}: Escape left the card of the focused cross-reference open after 300 ms`);
    else if ((await call(page, 'focused')) !== reached) error(`${where}: after Escape the focused cross-reference lost focus`);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  await park(page);

  // Jump: a click with the card open lands on the target and washes the
  // passage. A link to another post would leave the page: a link to this one.
  const jump = first.kind === 'other' ? picks.find((p) => p.kind !== 'other') : first;
  if (!jump) warn(`${where}: no cross-reference to this page, the jump on click was not checked`);
  else if (await rest(jump)) {
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(900);
    for (const m of await call(page, 'landed', jump.id, true)) error(`${where}: clicking "${jump.label}" with its card open: ${m}`);
  }
  await park(page);
}

// With reduced motion (a context made with reducedMotion: 'reduce') a card
// opens without animation and a click still lands on the target.
export async function checkReducedMotion(page, { where, error, warn }) {
  await page.evaluate(probe);
  const statement = (await call(page, 'pick')).find((p) => p.kind === 'statement');
  if (!statement) { warn(`${where}: no link to a statement, reduced motion was not checked`); return; }
  if (!(await openCard(page, statement.index))) { error(`${where}: resting on "${statement.label}" opened no preview`); return; }
  const moving = await page.evaluate((s) => document.querySelector(s).getAnimations().map((a) => a.animationName ?? a.transitionProperty ?? 'an animation'), OPEN);
  if (moving.length) error(`${where}: the card of "${statement.label}" runs ${moving.join(', ')}`);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForTimeout(600);
  for (const m of await call(page, 'landed', statement.id, false)) error(`${where}: clicking "${statement.label}" with its card open: ${m}`);
  await park(page);
}

export async function extentReport(page) {
  await page.evaluate(probe);
  return call(page, 'extents');
}
