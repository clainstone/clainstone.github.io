// Sampling helpers for the figures of this post, and the Cantor function.

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

/** The integral of fn over [a, b], by the trapezoid rule with n steps. */
export function integral(fn, a, b, n = 400) {
  if (b <= a) return 0;
  const h = (b - a) / n;
  let sum = (fn(a) + fn(b)) / 2;
  for (let j = 1; j < n; j++) sum += fn(a + j * h);
  return sum * h;
}

/** A smooth bump of height h, centre c and width w. */
export const bump = (h, c, w) => (t) => h * Math.exp(-(((t - c) / w) ** 2));

/**
 * The Cantor function of Example 8 of the third post, through v_m with
 * v_0(x) = x and v_m(x) = v_{m−1}(3x)/2 on [0, 1/3], 1/2 on [1/3, 2/3],
 * 1/2 + v_{m−1}(3x − 2)/2 on [2/3, 1]. At m = 12 it differs from v by less
 * than 2^(−12), well below a pixel.
 */
export function cantor(x, m = 12) {
  if (m === 0) return x;
  if (x <= 1 / 3) return 0.5 * cantor(3 * x, m - 1);
  if (x < 2 / 3) return 0.5;
  return 0.5 + 0.5 * cantor(3 * x - 2, m - 1);
}

/** A number with k decimals, with a true minus sign. */
export const fmt = (v, k = 3) => v.toFixed(k).replace('-', '−');
