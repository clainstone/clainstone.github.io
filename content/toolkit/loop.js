/**
 * A render loop for a canvas, and the page palette an animation draws with.
 *
 *   const anim = loop(canvas, (ctx, t, { w, h, dt, p, narrow }) => { ... });
 *   anim.play(); anim.pause(); anim.redraw(); anim.destroy();
 *
 * `t` is the animation time in seconds, advancing only while playing. `p` is
 * the palette (see `palette`), read from the page so that the drawing takes
 * the site's colours and type. `narrow` is true under 500 px.
 *
 * The loop handles device pixel ratio, resizing, pausing when the canvas
 * leaves the viewport, and `prefers-reduced-motion` (one frame is drawn and
 * the loop waits for an explicit play).
 */

const DEFAULTS = {
  ink: '#1a1a1a',
  muted: '#7a7a7a',
  rule: '#cfcfcf',
  accent: '#1e5ac8',
  fontFamily: 'system-ui, sans-serif',
};

/**
 * The five animation properties a site sets on `:root` (`--anim-ink`,
 * `--anim-muted`, `--anim-rule`, `--anim-accent`, `--anim-font`), resolved
 * on `el`, plus `font`: a ready `ctx.font` string at 0.9 of the body size,
 * and `size`, the body size in px.
 */
export function palette(el) {
  const cs = getComputedStyle(el);
  const get = (name, fallback) => cs.getPropertyValue(name).trim() || fallback;
  const size = parseFloat(cs.fontSize) || 16;
  const fontFamily = get('--anim-font', DEFAULTS.fontFamily);
  // Labels a little smaller than the text: 17 px and 16 px at the site's 19 px.
  const px = Math.round(size * 0.9);
  return {
    ink: get('--anim-ink', DEFAULTS.ink),
    muted: get('--anim-muted', DEFAULTS.muted),
    rule: get('--anim-rule', DEFAULTS.rule),
    accent: get('--anim-accent', DEFAULTS.accent),
    fontFamily,
    size,
    px,
    font: `${px}px ${fontFamily}`,
    smallFont: `${Math.round(size * 0.84)}px ${fontFamily}`,
  };
}

/** `#rgb`, `#rrggbb` or `rgb(...)` with an alpha applied; other strings pass through. */
export function withAlpha(color, alpha) {
  const hex = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
  }
  const rgb = color.match(/^rgba?\(([^)]+)\)$/);
  if (rgb) {
    const [r, g, b] = rgb[1].split(',').map((s) => s.trim());
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return color;
}

export const NARROW = '(max-width: 500px)';

export function loop(canvas, draw, options = {}) {
  const ctx = canvas.getContext('2d');
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onState = options.onState ?? (() => {});
  let wanted = options.autoplay !== false && !reduced;
  let visible = false;
  let playing = false;
  let raf = 0;
  let t = 0;
  let prev = 0;
  let size = { w: 0, h: 0, dt: 0, p: palette(canvas), narrow: window.matchMedia(NARROW).matches };

  const render = (dt) => {
    size.dt = dt;
    draw(ctx, t, size);
  };
  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0) return;
    size = { w: rect.width, h: rect.height, dt: 0, p: palette(canvas), narrow: window.matchMedia(NARROW).matches };
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render(0);
  };
  const tick = (now) => {
    if (!playing) return;
    const dt = Math.min((now - prev) / 1000, 0.1);
    prev = now;
    t += dt;
    render(dt);
    raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (playing) return;
    playing = true;
    prev = performance.now();
    raf = requestAnimationFrame(tick);
  };
  const stop = () => {
    if (!playing) return;
    playing = false;
    cancelAnimationFrame(raf);
  };
  // The button reflects the reader's intent (`wanted`), not whether the loop
  // happens to be running: a canvas parked off screen still reads "Pause"
  // when it will play as soon as it is scrolled into view.
  const sync = () => { wanted && visible ? start() : stop(); onState(wanted); };

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  // The page switched between light and dark: take the new palette at once.
  const mo = new MutationObserver(() => { size = { ...size, p: palette(canvas) }; render(0); });
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  // A font subset that arrives after the first frame (Greek, say) changes
  // the labels: draw again once it is in.
  const onFonts = () => { size = { ...size, p: palette(canvas) }; render(0); };
  document.fonts?.addEventListener('loadingdone', onFonts);
  const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: 0.05 });
  io.observe(canvas);
  onState(wanted);

  return {
    play() { wanted = true; sync(); },
    pause() { wanted = false; sync(); },
    toggle() { wanted ? this.pause() : this.play(); },
    redraw() { render(0); },
    get playing() { return playing; },
    get wanted() { return wanted; },
    get time() { return t; },
    set time(v) { t = v; render(0); },
    reduced,
    destroy() { stop(); ro.disconnect(); io.disconnect(); mo.disconnect(); document.fonts?.removeEventListener('loadingdone', onFonts); },
  };
}
