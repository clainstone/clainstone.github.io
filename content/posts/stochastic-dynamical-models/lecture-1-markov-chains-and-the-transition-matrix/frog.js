// The frog chain of Example 1.1, its drawing, and the helpers the figures share.

// Transition matrix, states 1..7 stored at indices 0..6.
export const P = [
  [0, 1, 0, 0, 0, 0, 0],
  [0, 0.5, 0.5, 0, 0, 0, 0],
  [0.5, 0, 0.5, 0, 0, 0, 0],
  [0, 0, 0.25, 0.5, 0.25, 0, 0],
  [0, 0, 0, 0, 0, 0.5, 0.5],
  [0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1],
];

// Positions of the pads in a 620 by 420 box, as in the diagram of the example.
export const W = 620;
export const H = 420;
export const R = 16;
export const NODES = [
  [180, 80], [90, 240], [270, 240], [400, 240], [530, 240], [465, 360], [465, 80],
];
// Side of each jump on which its probability is written, +1 for the left of
// the direction of travel and -1 for the right, always outside the triangles.
const SIDE = { '0-1': -1, '1-2': -1, '2-0': -1, '3-2': 1, '3-4': 1, '4-5': 1, '5-3': 1, '4-6': -1 };
// Direction of the loop drawn at a state that can stay where it is.
export const LOOP_ANGLE = { 1: 200, 2: 90, 3: -90, 6: -150 };

export const fraction = (v) => ({ 1: '1', 0.5: '½', 0.25: '¼' })[v] ?? v.toFixed(2);

// Jumps between different states with positive probability.
export const EDGES = [];
P.forEach((row, i) => row.forEach((v, j) => { if (v > 0 && i !== j) EDGES.push({ i, j, v }); }));
export const LOOPS = Object.entries(LOOP_ANGLE).map(([i, a]) => ({ i: Number(i), a: (a * Math.PI) / 180, v: P[i][i] }));

// Geometry of a jump: the segment between the two pad borders, the midpoint
// with its direction, and a point beside the midpoint for the label.
export function edgeGeometry({ i, j }, r = R) {
  const side = SIDE[`${i}-${j}`] ?? 1;
  const [x1, y1] = NODES[i];
  const [x2, y2] = NODES[j];
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return { ax: x1 + ux * r, ay: y1 + uy * r, bx: x2 - ux * r, by: y2 - uy * r, mx, my, ux, uy, lx: mx + side * uy * 17, ly: my - side * ux * 17 };
}

// A loop is a circle of radius LR tangent to the outside of the pad.
export const LR = 17;
export function loopGeometry({ i, a }, r = R) {
  const [x, y] = NODES[i];
  const d = r + LR;
  return { cx: x + Math.cos(a) * d, cy: y + Math.sin(a) * d, lx: x + Math.cos(a) * (d + LR + 12), ly: y + Math.sin(a) * (d + LR + 12) };
}

// Row vector times matrix and matrix powers, in floating point.
export function multiply(A, B) {
  return A.map((row) => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
}
export function powers(M, nmax) {
  const out = [M.map((row, i) => row.map((_, j) => (i === j ? 1 : 0)))];
  for (let n = 1; n <= nmax; n++) out.push(multiply(out[n - 1], M));
  return out;
}

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

// The rule of the simulation: the state J with U in the j-th interval of row i.
export function nextState(i, u) {
  let s = 0;
  for (let j = 0; j < P[i].length; j++) {
    s += P[i][j];
    if (u < s) return j;
  }
  return 0; // U = 1 has probability zero; it is sent to state 1.
}

const SUB = '₀₁₂₃₄₅₆₇₈₉';
export const subscript = (n) => String(n).split('').map((d) => SUB[Number(d)]).join('');
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
export const superscript = (n) => String(n).split('').map((d) => SUP[Number(d)]).join('');
