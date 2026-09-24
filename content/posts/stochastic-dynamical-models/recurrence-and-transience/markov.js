// The chains of Examples 2.1 and 2.5, and the quantities
// of this post computed from them: the powers of P and sample paths.

// States 1, 2, 3 at indices 0, 1, 2.
export const EX21 = [
  [0, 1, 0],
  [0, 1 / 2, 1 / 2],
  [1 / 2, 0, 1 / 2],
];

// States 1, …, 6 at indices 0, …, 5.
export const EX25 = [
  [1 / 2, 1 / 2, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0],
  [1 / 3, 0, 0, 1 / 3, 1 / 3, 0],
  [0, 0, 0, 1 / 2, 1 / 2, 0],
  [0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 1, 0],
];

const multiply = (A, B) => A.map((row) => B[0].map((_, j) => row.reduce((s, a, k) => s + a * B[k][j], 0)));
const identity = (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));

/** P⁰, P¹, …, P^nmax. */
export function powers(P, nmax) {
  const out = [identity(P.length)];
  for (let n = 1; n <= nmax; n++) out.push(multiply(out[n - 1], P));
  return out;
}

/** A seeded generator (mulberry32), so every reader sees the same first path. */
export function random(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A path X₀, …, X_len of the chain P started at the index start. */
export function path(P, start, len, rand) {
  const xs = [start];
  for (let n = 0; n < len; n++) {
    const row = P[xs[n]];
    let u = rand();
    let k = 0;
    while (k < row.length - 1 && u >= row[k]) { u -= row[k]; k++; }
    xs.push(k);
  }
  return xs;
}
