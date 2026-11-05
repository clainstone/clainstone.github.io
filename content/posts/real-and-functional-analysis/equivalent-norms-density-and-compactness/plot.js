// Drawing helpers for the figures of this post.

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

/** A polyline through the page points pts, with its corners cut `rounds` times (Chaikin). */
export function smooth(pts, rounds = 3) {
  let p = pts;
  for (let k = 0; k < rounds; k++) {
    const q = [p[0]];
    for (let j = 0; j < p.length - 1; j++) {
      const [a, b] = [p[j], p[j + 1]];
      q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]]);
    }
    q.push(p[p.length - 1]);
    p = q;
  }
  return p.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
}

/** Points of an arrowhead with its tip at (x, y), pointing along (dx, dy). */
export function head(x, y, dx, dy, size = 11) {
  const l = Math.hypot(dx, dy) || 1;
  const [ux, uy] = [dx / l, dy / l];
  const [bx, by] = [x - size * ux, y - size * uy];
  const w = size * 0.42;
  return `${x.toFixed(1)},${y.toFixed(1)} ${(bx - w * uy).toFixed(1)},${(by + w * ux).toFixed(1)} ${(bx + w * uy).toFixed(1)},${(by - w * ux).toFixed(1)}`;
}
