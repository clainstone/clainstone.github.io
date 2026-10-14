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

/** Path data of the region between the graphs of top and bottom on [a, b]. */
export function between(top, bottom, a, b, sx, sy, n = 240) {
  const up = [];
  const down = [];
  for (let j = 0; j <= n; j++) {
    const t = a + ((b - a) * j) / n;
    up.push(`${sx(t).toFixed(1)},${sy(top(t)).toFixed(1)}`);
    down.push(`${sx(t).toFixed(1)},${sy(bottom(t)).toFixed(1)}`);
  }
  return `M${up.join(' L')} L${down.reverse().join(' L')} Z`;
}

/** Path data of the region between the graph of fn and the axis on [a, b]. */
export function under(fn, a, b, sx, sy, n = 240) {
  return between(fn, () => 0, a, b, sx, sy, n);
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
