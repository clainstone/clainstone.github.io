// Sampling helpers for the figures of this post. A value that leaves the
// drawing (a function that blows up at an end of its interval) is held at a
// finite height on the page, and the figure's clip path cuts it.

const held = (v) => (Number.isFinite(v) ? Math.max(-600, Math.min(1600, v)) : v > 0 ? 1600 : -600);

/** Abscissae of n + 1 points of [a, b]; with p > 1 they gather near a. */
export function samples(a, b, n = 240, p = 1) {
  return Array.from({ length: n + 1 }, (_, j) => a + (b - a) * (j / n) ** p);
}

/** Points "x,y x,y …" of the graph of fn on [a, b], mapped to the page by sx and sy. */
export function graph(fn, a, b, sx, sy, n = 240, p = 1) {
  return samples(a, b, n, p)
    .map((t) => `${sx(t).toFixed(1)},${held(sy(fn(t))).toFixed(1)}`)
    .join(' ');
}

/** Path data of the region between the graphs of top and bottom on [a, b]. */
export function between(top, bottom, a, b, sx, sy, n = 240, p = 1) {
  const xs = samples(a, b, n, p);
  const up = xs.map((t) => `${sx(t).toFixed(1)},${held(sy(top(t))).toFixed(1)}`);
  const down = xs.map((t) => `${sx(t).toFixed(1)},${held(sy(bottom(t))).toFixed(1)}`).reverse();
  return `M${up.join(' L')} L${down.join(' L')} Z`;
}

/** Path data of the region between the graph of fn and the axis on [a, b]. */
export function under(fn, a, b, sx, sy, n = 240, p = 1) {
  return between(fn, () => 0, a, b, sx, sy, n, p);
}
