// Previews of cross-references. Resting the pointer on a cross-reference, or
// focusing it from the keyboard, shows its target in a card: the page's own
// blocks at three quarters of their size. A cross-reference inside a card
// opens another card above it. The rules are in IMPLEMENTATION.md,
// Cross-references.

import { HERE, keyOf, nameOf, entryFor, hashId } from './source.js';
import { createCard, prepare, place, reveal, close, destroy, fitsWindow } from './card.js';
import { washExtent, morph } from './jump.js';

const OPEN = 400;      // ms at rest on a link before its card shows
const WARM = 120;      // the same while a card is open or just after one closed
const WARM_FOR = 800;  // how long "just after" lasts
const PREP = 150;      // the card is built this long before it shows
const PREFETCH = 80;   // rest after which the target is read, and another post fetched
const GRACE = 300;     // a card survives the pointer's absence this long
const MAX = 5;         // cards open at once

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const stack = [];      // open cards by level: { link, key, card, byKey, timer }
let intent = null;     // the card on its way: { link, level, key, pointer, byKey, timers, card, dead, showAt }
let lastClose = -Infinity;
let still = false;     // after a jump, nothing opens until the pointer moves
let pressed = false;   // a button is down: selecting text or dragging a slider
let pressedIn = null;  // the card the button went down in, if any
let refocus = false;   // Escape gives focus back to a link: do not reopen

const linkOf = (n) => (n instanceof Element ? n.closest('a.xref') : null);
const levelOf = (n) => { const c = n instanceof Element ? n.closest('.xref-card') : null; return c ? Number(c.dataset.level) : -1; };
const byPointer = (e) => e.pointerType === 'mouse' || e.pointerType === 'pen';
const log = (err) => console.warn('[xref-preview]', err);

function begin(link, pointer, byKey) {
  cancel();
  const level = levelOf(link) + 1;
  const key = keyOf(link);
  if (level >= MAX || stack[level - 1]?.key === key) return;
  const open = stack[level];
  if (open?.link === link) return hold(open);
  const warm = stack.length > 0 || performance.now() - lastClose < WARM_FOR;
  const delay = warm ? WARM : OPEN;
  const t = { link, level, key, pointer, byKey, timers: [], card: null, dead: false, showAt: performance.now() + delay };
  intent = t;
  t.timers.push(setTimeout(() => entryFor(key).catch(() => {}), warm ? 0 : PREFETCH));
  t.timers.push(setTimeout(() => build(t).catch(log), Math.max(0, delay - PREP)));
}

async function build(t) {
  let entry = null;
  try { entry = await entryFor(t.key); } catch (err) { log(err); }
  if (t.dead) return;
  const card = createCard({ key: t.key, level: t.level, entry, name: nameOf(t.key) });
  t.card = card;
  document.body.append(card);
  if (!fitsWindow(card)) return drop(t);
  try { await prepare(card, entry, t.link, t.pointer); } catch (err) { log(err); }
  const wait = t.showAt - performance.now();
  if (wait > 0) await new Promise((done) => setTimeout(done, wait));
  if (t.dead) return;
  if (t.level > stack.length) return drop(t); // its parent closed meanwhile
  if (intent === t) intent = null;
  closeFrom(t.level, true);
  place(card, t.link, t.pointer);
  stack[t.level] = { link: t.link, key: t.key, card, byKey: t.byKey, timer: 0 };
  t.link.classList.add('is-open');
  reveal(card);
}

// An intent that will not show: its timers stop and its card, if built, goes.
function drop(t) {
  t.dead = true;
  t.timers.forEach(clearTimeout);
  if (t.card) destroy(t.card);
  if (intent === t) intent = null;
}

function cancel() {
  if (intent) drop(intent);
}

function hold(c) { clearTimeout(c.timer); c.timer = 0; }

function closeFrom(level, instant = false) {
  if (intent && intent.level > level) cancel();
  const gone = stack.splice(level);
  for (const c of gone.reverse()) {
    hold(c);
    c.link.classList.remove('is-open');
    close(c.card, instant || reduce.matches);
  }
  if (gone.length && !stack.length) lastClose = performance.now();
}

// Keep the cards the pointer is in and the card whose link it is on; the
// others close after GRACE, with the cards above them.
function sweep(node) {
  const at = node ? levelOf(node) : -2;
  const on = linkOf(node);
  stack.forEach((c, k) => {
    if (c.byKey || k <= at || (k === at + 1 && c.link === on)) return hold(c);
    if (c.timer) return;
    const expire = () => {
      if (pressed) { c.timer = setTimeout(expire, GRACE); return; }
      const index = stack.indexOf(c);
      if (index >= 0) closeFrom(index);
    };
    c.timer = setTimeout(expire, GRACE);
  });
}

function install() {
  addEventListener('pointerover', (e) => {
    if (!byPointer(e)) return;
    const link = linkOf(e.target);
    if (link && !still && link !== intent?.link) begin(link, { x: e.clientX, y: e.clientY }, false);
    sweep(e.target);
  }, { passive: true });
  addEventListener('pointerout', (e) => {
    if (!byPointer(e)) return;
    const from = linkOf(e.target);
    if (from && from === intent?.link && linkOf(e.relatedTarget) !== from) cancel();
    if (!e.relatedTarget) sweep(null); // the pointer left the window
  }, { passive: true });
  addEventListener('pointermove', (e) => {
    if (still && Math.abs(e.movementX) + Math.abs(e.movementY) > 2) still = false;
  }, { passive: true });
  addEventListener('pointerdown', (e) => {
    pressed = true;
    pressedIn = e.target instanceof Element ? e.target.closest('.xref-card') : null;
    if (!(e.target instanceof Element && e.target.closest('.xref-card, a.xref'))) { cancel(); closeFrom(0, true); }
  }, { capture: true, passive: true });
  // A native drag or a pan ends with pointercancel or dragend, not pointerup.
  const release = () => { pressed = false; };
  addEventListener('pointerup', release, { capture: true, passive: true });
  addEventListener('pointercancel', release, { capture: true, passive: true });
  addEventListener('dragend', release, { capture: true, passive: true });
  addEventListener('blur', release);
  addEventListener('focusin', (e) => {
    const link = linkOf(e.target);
    if (link && !refocus && link.matches(':focus-visible')) begin(link, null, true);
  });
  addEventListener('focusout', (e) => {
    const link = linkOf(e.target);
    if (!link) return;
    if (intent?.link === link) cancel();
    const k = stack.findIndex((c) => c.link === link);
    // A click inside the card (on text, a canvas) moves focus to the body: keep it.
    const inCard = k >= 0 && (stack[k].card.contains(e.relatedTarget) || (pressed && pressedIn === stack[k].card));
    if (k >= 0 && !inCard) closeFrom(k);
  });
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    cancel();
    const top = stack.at(-1);
    if (!top) return;
    const inside = top.card.contains(document.activeElement);
    closeFrom(stack.length - 1);
    if (inside) { refocus = true; top.link.focus({ preventScroll: true }); refocus = false; }
  });
  addEventListener('click', (e) => {
    const link = linkOf(e.target);
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const [path, id] = keyOf(link).split('#');
    const open = stack.find((c) => c.link === link)?.card ?? null;
    cancel();
    if (path !== HERE) { closeFrom(0, true); return; } // another post: the browser navigates
    still = true;
    if (open && !reduce.matches && morph(id, open, () => closeFrom(0, true))) { e.preventDefault(); return; }
    closeFrom(0, true);
    if (hashId() === id) requestAnimationFrame(() => washExtent(id)); // no hashchange follows
  });
  addEventListener('resize', () => { cancel(); closeFrom(0, true); });
  addEventListener('pagehide', () => { cancel(); closeFrom(0, true); });
}

if (document.querySelector('article.post .body a.xref')) install();
addEventListener('hashchange', () => {
  still = true;
  cancel();
  closeFrom(0, true);
  washExtent(hashId());
});
if (location.hash) washExtent(hashId());
