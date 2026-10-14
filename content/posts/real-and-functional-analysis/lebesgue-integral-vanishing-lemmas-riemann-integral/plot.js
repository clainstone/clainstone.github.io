// Sampling helpers for the figures of this post.

/** Points "x,y x,y …" of the graph of fn on [a, b], mapped to the page by sx and sy. */
export function graph(fn, a, b, sx, sy, n = 240) {
  const pts = [];
  for (let j = 0; j <= n; j++) {
    const t = a + ((b - a) * j) / n;
    pts.push(`${sx(t).toFixed(1)},${sy(fn(t)).toFixed(1)}`);
  }
  return pts.join(' ');
}

/** Path data of the region between the graph of fn and the axis on [a, b]. */
export function under(fn, a, b, sx, sy, n = 240) {
  const top = graph(fn, a, b, sx, sy, n).split(' ').join(' L');
  return `M${sx(a).toFixed(1)},${sy(0).toFixed(1)} L${top} L${sx(b).toFixed(1)},${sy(0).toFixed(1)} Z`;
}

/** The maximal intervals of [a, b] where pred holds, found on a grid of n steps. */
export function intervals(pred, a, b, n = 2000) {
  const out = [];
  let start = null;
  for (let j = 0; j <= n; j++) {
    const t = a + ((b - a) * j) / n;
    if (pred(t)) {
      if (start === null) start = t;
    } else if (start !== null) {
      out.push([start, a + ((b - a) * (j - 1)) / n]);
      start = null;
    }
  }
  if (start !== null) out.push([start, b]);
  return out;
}

// The simple function of Figures 1 and 2, as in the drawing of the lecture:
// three adjacent sets D₁, D₂, D₃ on a line, the values on them (heights in
// page units), and a set E that ends inside D₁ and D₃.
export const STEPS = { cuts: [45, 140, 230, 325], heights: [70, 125, 38], E: [112, 262] };

/** The height of the simple function of STEPS at x, and of s·χ_E when onlyE. */
export function stepAt(x, onlyE = false) {
  const { cuts, heights, E } = STEPS;
  if (onlyE && (x < E[0] || x > E[1])) return 0;
  for (let i = 0; i < 3; i++) if (x >= cuts[i] && x <= cuts[i + 1]) return heights[i];
  return 0;
}
