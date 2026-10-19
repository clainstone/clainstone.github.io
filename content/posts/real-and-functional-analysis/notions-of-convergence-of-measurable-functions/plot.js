// Sampling helpers for the figures of this post, and the typewriter sequence.

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

/** The widest of a list of intervals [a, b], or null. */
export function widest(list) {
  return list.reduce((w, iv) => (!w || iv[1] - iv[0] > w[1] - w[0] ? iv : w), null);
}

/**
 * The typewriter sequence of Example 4: f_n is the characteristic function of
 * [j/2^k, (j + 1)/2^k], where the k-th group (k ≥ 1) holds the terms with
 * 2^k − 1 ≤ n ≤ 2^(k+1) − 2 and j = n − (2^k − 1).
 */
export function typewriter(n) {
  let k = 1;
  while (n > 2 ** (k + 1) - 2) k++;
  const j = n - (2 ** k - 1);
  return { k, j, a: j / 2 ** k, b: (j + 1) / 2 ** k };
}

/** The value f_n(x) of the typewriter sequence, 0 or 1. */
export function typewriterValue(n, x) {
  const { a, b } = typewriter(n);
  return x >= a && x <= b ? 1 : 0;
}
