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

/** The integral of fn on [a, b] by the midpoint rule with n points. */
export function integral(fn, a, b, n = 2000) {
  let s = 0;
  for (let j = 0; j < n; j++) s += fn(a + ((b - a) * (j + 0.5)) / n);
  return (s * (b - a)) / n;
}

/** The maximum of fn on [a, b] on a grid of n steps, and where it is reached. */
export function maximum(fn, a, b, n = 1000) {
  let best = -Infinity;
  let at = a;
  for (let j = 0; j <= n; j++) {
    const t = a + ((b - a) * j) / n;
    const v = fn(t);
    if (v > best) { best = v; at = t; }
  }
  return { value: best, at };
}
