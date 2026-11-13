// The index of a thread of lectures (src/components/LectureIndex.astro). The
// button in the margin opens the panel; X, Escape, a click beside the panel
// or a click on an entry closes it. The list is fetched once, on the first
// approach to the button. While the panel is open the rest of the page is
// inert, so that focus stays in the panel and the page does not scroll. Its
// entries are cross-references (a.xref): the previews' script shows their
// targets in cards above the panel.

const norm = (path) => path.replace(/\.html$/, '').replace(/\/+$/, '') || '/';

const button = document.querySelector('.index-button');
const overlay = document.getElementById('lecture-index');

if (button && overlay) {
  // A direct child of the body, so that the rest of the page can be made inert around it.
  document.body.append(overlay);
  const body = overlay.querySelector('.index-body');
  const closer = overlay.querySelector('.index-close');
  let loading = null;
  let shut = [];

  const load = () => (loading ??= fetch(button.dataset.src)
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(({ html }) => {
      body.innerHTML = html;
      body.querySelector(`[data-path="${CSS.escape(norm(location.pathname))}"]`)?.classList.add('is-current');
    })
    .catch((err) => {
      loading = null;
      body.textContent = 'The index could not be loaded.';
      console.warn('[lecture-index]', err);
    }));

  function open() {
    if (!overlay.hidden) return;
    overlay.hidden = false;
    document.documentElement.classList.add('index-open');
    // Preview cards (they carry data-level) stay live: an entry's card shows above the panel.
    shut = [...document.body.children].filter((el) => el !== overlay && !el.hasAttribute('data-level') && !el.inert);
    for (const el of shut) el.inert = true;
    button.setAttribute('aria-expanded', 'true');
    body.focus({ preventScroll: true });
    load().then(() => {
      if (overlay.hidden) return;
      // The lecture being read opens the list, its heading at the top, and
      // holds the focus, so that Tab goes on from its first entry.
      const here = body.querySelector('.is-current');
      body.scrollTop = here ? here.offsetTop : 0;
      here?.querySelector('.index-title')?.focus({ preventScroll: true });
    });
  }

  function close(refocus = true) {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.documentElement.classList.remove('index-open');
    for (const el of shut) el.inert = false;
    shut = [];
    button.setAttribute('aria-expanded', 'false');
    if (refocus) button.focus({ preventScroll: true });
  }

  button.addEventListener('pointerenter', () => load(), { once: true });
  button.addEventListener('focus', () => load(), { once: true });
  button.addEventListener('click', open);
  closer.addEventListener('click', () => close());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  // A plain click on a link of the panel, or of a preview card opened over
  // it, closes the panel before the page moves: in the capture phase, so
  // before the previews' script handles the click. The title of the lecture
  // being read only goes back to its top, without loading it again.
  addEventListener('click', (e) => {
    if (overlay.hidden) return;
    const a = e.target instanceof Element ? e.target.closest('a[href]') : null;
    if (!a || !(overlay.contains(a) || a.closest('[data-level]'))) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    close(false);
    const to = new URL(a.href, location.href);
    if (to.pathname.replace(/\/+$/, '') === location.pathname.replace(/\/+$/, '') && !to.hash) {
      e.preventDefault();
      scrollTo(0, 0);
    }
  }, { capture: true });
  // Escape closes an open preview first, then the panel. In the capture
  // phase, so before the previews' script closes its card.
  addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || overlay.hidden) return;
    if (document.querySelector('[data-level][data-state="open"]')) return;
    close();
  }, { capture: true });
  addEventListener('pagehide', () => close(false));

  // An address saved before the thread had one numbering, "#theorem-19",
  // goes to the statement's new id, "#theorem-13-19".
  const renumber = () => {
    const old = location.hash.match(/^#([a-z]+)-(\d+)$/);
    const lecture = button.dataset.lecture;
    if (!old || !lecture || document.getElementById(location.hash.slice(1))) return;
    const id = `${old[1]}-${lecture}-${old[2]}`;
    if (document.getElementById(id)) location.replace(`#${id}`);
  };
  renumber();
  addEventListener('hashchange', renumber);
}
