// Where the reader lands. The whole passage a card showed is washed, not
// only its first paragraph; and a click on a link whose card is open sends
// the card's blocks to their places on the page.

import { blocksOf, bodyOf, hashId } from './source.js';
import { boxOf } from './card.js';

export function washExtent(id) {
  if (!id) return;
  const found = blocksOf(bodyOf(document), id);
  if (!found) return;
  const blocks = found.kind === 'equation' ? found.blocks.slice(-1) : found.blocks;
  for (const block of blocks) {
    const el = boxOf(block);
    if (!el) continue;
    el.classList.add('xref-wash');
    // Restart every wash of the passage together, the :target one included.
    for (const a of el.getAnimations()) if (a.animationName === 'xref-wash') { a.cancel(); a.play(); }
    el.addEventListener('animationend', () => el.classList.remove('xref-wash'), { once: true });
  }
}

export function morph(id, card, closeCards) {
  if (!document.startViewTransition) return false;
  const found = blocksOf(bodyOf(document), id);
  const clones = [...card.querySelector('.xref-sheet').children];
  if (!found || found.blocks.length !== clones.length) return false;
  const shown = card.querySelector('.xref-view').getBoundingClientRect();
  const pairs = [];
  found.blocks.forEach((block, i) => {
    if (found.kind === 'equation' && i < clones.length - 1) return; // the display alone
    const from = boxOf(clones[i]);
    const to = boxOf(block);
    const r = from?.getBoundingClientRect();
    if (to && r && r.top >= shown.top - 1 && r.bottom <= shown.bottom + 1) pairs.push([from, to]);
  });
  if (!pairs.length) return false;
  const name = (el, i) => {
    el.style.viewTransitionName = i < 0 ? '' : `xref-${i}`;
    el.style.setProperty('view-transition-class', i < 0 ? '' : 'xref');
  };
  pairs.forEach(([from], i) => name(from, i));
  const vt = document.startViewTransition(() => {
    closeCards();
    pairs.forEach(([, to], i) => name(to, i));
    if (hashId() === id) { document.getElementById(id)?.scrollIntoView(); washExtent(id); }
    else location.hash = id; // scrolls, sets :target; hashchange washes
  });
  vt.ready.catch(() => {});
  vt.finished.catch(() => {}).finally(() => pairs.forEach(([, to]) => name(to, -1)));
  return true;
}
