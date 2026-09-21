// Geometry of directed graphs drawn in SVG, shared by the figures of this post.

// An edge between two nodes of radius r: a quadratic curve (straight when
// bend is 0) from border to border, its arrowhead at the middle, and a point
// beside the middle for its label, on the side of the bend or on `side`.
export function edge([x1, y1], [x2, y2], { r = 16, bend = 0, side = 1, gap = 15 } = {}) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
  const cx = (x1 + x2) / 2 + nx * bend, cy = (y1 + y2) / 2 + ny * bend;
  const toward = (x, y) => { const l = Math.hypot(cx - x, cy - y) || 1; return [x + ((cx - x) / l) * r, y + ((cy - y) / l) * r]; };
  const [ax, ay] = toward(x1, y1);
  const [bx, by] = toward(x2, y2);
  const px = 0.25 * ax + 0.5 * cx + 0.25 * bx, py = 0.25 * ay + 0.5 * cy + 0.25 * by;
  const tl = Math.hypot(bx - ax, by - ay) || 1, vx = (bx - ax) / tl, vy = (by - ay) / tl;
  const tip = [px + vx * 7, py + vy * 7], base = [px - vx * 5, py - vy * 5];
  const head = [tip, [base[0] + vy * 5, base[1] - vx * 5], [base[0] - vy * 5, base[1] + vx * 5]];
  const s = bend ? Math.sign(bend) : side;
  return {
    d: `M${ax},${ay} Q${cx},${cy} ${bx},${by}`,
    head: head.map((q) => q.join(',')).join(' '),
    lx: px + nx * gap * s, ly: py + ny * gap * s,
  };
}

// A loop: a circle of radius lr tangent to the outside of the node, in the
// direction angle (degrees), with a point for its label beyond it.
export function loop([x, y], angle, { r = 16, lr = 13, gap = 12 } = {}) {
  const a = (angle * Math.PI) / 180, d = r + lr;
  return { cx: x + Math.cos(a) * d, cy: y + Math.sin(a) * d, r: lr, lx: x + Math.cos(a) * (d + lr + gap), ly: y + Math.sin(a) * (d + lr + gap) };
}

// Probabilities as short labels.
export const frac = (v) => ({ 1: '1', 0.5: '½', 0.25: '¼', [1 / 3]: '⅓' })[v] ?? String(v);

// A small seeded generator, so that every reader sees the same first frame.
export function mulberry32(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
