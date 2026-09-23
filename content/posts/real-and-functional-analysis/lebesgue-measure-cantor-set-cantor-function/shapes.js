// Closed curves for the figures of this post, as SVG path data.

/**
 * A distorted ellipse centred at (cx, cy) with semi-axes rx, ry, scaled by s.
 * `wobble` lists [amplitude, frequency, phase] terms that bend the radius.
 */
export function blob(cx, cy, rx, ry, wobble = [], s = 1, n = 160) {
  const pts = [];
  for (let k = 0; k < n; k++) {
    const t = (2 * Math.PI * k) / n;
    let r = 1;
    for (const [a, f, p] of wobble) r += a * Math.sin(f * t + p);
    pts.push(`${(cx + s * rx * r * Math.cos(t)).toFixed(1)},${(cy + s * ry * r * Math.sin(t)).toFixed(1)}`);
  }
  return `M${pts.join('L')}Z`;
}

/** A point on the same curve at angle t, for placing labels. */
export function blobPoint(cx, cy, rx, ry, wobble = [], s = 1, t = 0) {
  let r = 1;
  for (const [a, f, p] of wobble) r += a * Math.sin(f * t + p);
  return [cx + s * rx * r * Math.cos(t), cy + s * ry * r * Math.sin(t)];
}
