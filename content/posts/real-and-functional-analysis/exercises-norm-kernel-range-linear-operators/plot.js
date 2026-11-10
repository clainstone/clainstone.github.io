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

/** Points of an arrowhead with its tip at (x, y), pointing along (dx, dy). */
export function head(x, y, dx, dy, size = 11) {
  const l = Math.hypot(dx, dy) || 1;
  const [ux, uy] = [dx / l, dy / l];
  const [bx, by] = [x - size * ux, y - size * uy];
  const w = size * 0.42;
  return `${x.toFixed(1)},${y.toFixed(1)} ${(bx - w * uy).toFixed(1)},${(by + w * ux).toFixed(1)} ${(bx + w * uy).toFixed(1)},${(by - w * ux).toFixed(1)}`;
}
