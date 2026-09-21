// The three-state chain behind the walker: the matrix, its stationary
// distribution, one multiplication, one sample, and the geometry of the graph
// (node centres, curved edges, loops). The rows are visibly unequal on purpose.

export const P = [
  [0.6, 0.3, 0.1],
  [0.2, 0.5, 0.3],
  [0.1, 0.2, 0.7],
];

// The row vector mu times the matrix M.
export function multiply(mu, M) {
  return M[0].map((_, j) => mu.reduce((s, m, i) => s + m * M[i][j], 0));
}

// The stationary distribution by repeated multiplication from the uniform row.
export function stationary(M, rounds = 400) {
  let mu = M.map(() => 1 / M.length);
  for (let k = 0; k < rounds; k++) mu = multiply(mu, M);
  return mu;
}

// One draw from a row of probabilities.
export function sample(row) {
  let u = Math.random();
  for (let j = 0; j < row.length; j++) {
    u -= row[j];
    if (u < 0) return j;
  }
  return row.length - 1;
}

// Three node centres on a circle, the first at the top.
export function nodePositions(cx, cy, r) {
  return [0, 1, 2].map((i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

// The point at distance R from a toward b.
function toward(a, b, R) {
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: a.x + ((b.x - a.x) / d) * R, y: a.y + ((b.y - a.y) / d) * R };
}

// The path of the transition from node a to node b, both of radius R. A
// transition to another node bends to its right, so the two directions
// between a pair are distinct; a transition to itself is a loop leaving the
// node away from the centre of the graph.
export function edgePath(a, b, R, centre) {
  if (a === b) {
    const ox = a.x - centre.x;
    const oy = a.y - centre.y;
    const m = Math.hypot(ox, oy) || 1;
    const nx = ox / m, ny = oy / m, px = -ny, py = nx;
    const s = { x: a.x + (nx * 0.64 - px * 0.77) * R, y: a.y + (ny * 0.64 - py * 0.77) * R };
    const e = { x: a.x + (nx * 0.64 + px * 0.77) * R, y: a.y + (ny * 0.64 + py * 0.77) * R };
    const c1 = { x: a.x + (nx * 2.9 - px * 1.6) * R, y: a.y + (ny * 2.9 - py * 1.6) * R };
    const c2 = { x: a.x + (nx * 2.9 + px * 1.6) * R, y: a.y + (ny * 2.9 + py * 1.6) * R };
    return `M${s.x},${s.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${e.x},${e.y}`;
  }
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const ctrl = { x: (a.x + b.x) / 2 - dy * 0.22, y: (a.y + b.y) / 2 + dx * 0.22 };
  const s = toward(a, ctrl, R + 2);
  const e = toward(b, ctrl, R + 2);
  return `M${s.x},${s.y} Q${ctrl.x},${ctrl.y} ${e.x},${e.y}`;
}
