// The chain of Example 2.1 on the states 1, 2, 3, a seeded generator and the
// times of this post (first entrance, first exit, successive entrances),
// shared by its figures. States are written 1, 2, 3 everywhere.

export const P = {
  1: { 1: 0, 2: 1, 3: 0 },
  2: { 1: 0, 2: 1 / 2, 3: 1 / 2 },
  3: { 1: 1 / 2, 2: 0, 3: 1 / 2 },
};

/** A seeded generator (mulberry32), so that every reader sees the same first path. */
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

/** A path X₀, …, X_len of the chain of Example 2.1 started at the state x0. */
export function path(seed, x0, len) {
  const u = random(seed);
  const xs = [x0];
  for (let n = 0; n < len; n++) {
    let r = u();
    let k = 1;
    while (k < 3 && r >= P[xs[n]][k]) { r -= P[xs[n]][k]; k++; }
    xs.push(k);
  }
  return xs;
}

/** T_j = inf{n ≥ 1 : X_n = j} on the path, or Infinity. */
export const entrance = (xs, j) => {
  const n = xs.findIndex((x, k) => k >= 1 && x === j);
  return n < 0 ? Infinity : n;
};

/** U_j = min{n ≥ 1 : X_n ≠ j} on the path, or Infinity. */
export const exit = (xs, j) => {
  const n = xs.findIndex((x, k) => k >= 1 && x !== j);
  return n < 0 ? Infinity : n;
};

/** The times n ≥ 1 with X_n = i, in order: T_i^(1), T_i^(2), … on the path. */
export const entrances = (xs, i) => xs.flatMap((x, n) => (n >= 1 && x === i ? [n] : []));
