// Drawing helpers for the figures of this post. The figures reproduce the
// lecture's hand drawings: their points are read off the drawings and mapped
// to the page.

/** A map from the coordinates of a drawing to the page: scale k, then shift. */
export function place(x0, y0, k, X0, Y0) {
  return ([x, y]) => [X0 + (x - x0) * k, Y0 + (y - y0) * k];
}

/** A smooth SVG path through the points [[x, y], …] (Catmull-Rom as cubic Béziers), closed if asked. */
export function smooth(points, closed = false) {
  const n = points.length;
  const p = (i) => points[closed ? (i + n) % n : Math.max(0, Math.min(n - 1, i))];
  let d = `M ${p(0)[0].toFixed(1)} ${p(0)[1].toFixed(1)}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const [a, b, c, e] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6];
    const c2 = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)}, ${c2[0].toFixed(1)} ${c2[1].toFixed(1)}, ${c[0].toFixed(1)} ${c[1].toFixed(1)}`;
  }
  return closed ? `${d} Z` : d;
}

/** Points of an arrowhead with its tip at (x, y), pointing along (dx, dy). */
export function head(x, y, dx, dy, size = 11) {
  const l = Math.hypot(dx, dy) || 1;
  const [ux, uy] = [dx / l, dy / l];
  const [bx, by] = [x - size * ux, y - size * uy];
  const w = size * 0.42;
  return `${x.toFixed(1)},${y.toFixed(1)} ${(bx - w * uy).toFixed(1)},${(by + w * ux).toFixed(1)} ${(bx + w * uy).toFixed(1)},${(by - w * ux).toFixed(1)}`;
}
