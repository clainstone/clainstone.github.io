// The chains of this post and the quantities its figures draw.

/** The gambler's ruin chain on {0, 1, ..., N}: up with probability p, down with 1 - p, 0 and N absorbing. */
export function gambler(N, p) {
  const P = Array.from({ length: N + 1 }, () => new Array(N + 1).fill(0));
  P[0][0] = 1;
  P[N][N] = 1;
  for (let i = 1; i < N; i++) {
    P[i][i + 1] = p;
    P[i][i - 1] = 1 - p;
  }
  return P;
}

/** The row vector v times the matrix P. */
export function step(v, P) {
  const out = new Array(P[0].length).fill(0);
  v.forEach((a, i) => { if (a) P[i].forEach((b, j) => { out[j] += a * b; }); });
  return out;
}

/** The rows δ_i P^k for k = 0, ..., kmax. */
export function rowsFrom(P, i, kmax) {
  const v = new Array(P.length).fill(0);
  v[i] = 1;
  const rows = [v];
  for (let k = 1; k <= kmax; k++) rows.push(step(rows[k - 1], P));
  return rows;
}

/** The averages μ⁽ⁿ⁾ = (1/n) Σ_{k=1}^{n} δ_i P^k for n = 1, ..., nmax (index n - 1). */
export function averages(P, i, nmax) {
  const rows = rowsFrom(P, i, nmax);
  const sum = new Array(P.length).fill(0);
  const out = [];
  for (let n = 1; n <= nmax; n++) {
    rows[n].forEach((a, j) => { sum[j] += a; });
    out.push(sum.map((s) => s / n));
  }
  return out;
}

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

/** A path X_0, ..., X_len of the chain P started at the state start. */
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

/**
 * The solution of q(π_{i+1} - π_i) = p(π_i - π_{i-1}) with the given π_0 and π_1,
 * for i = -m, ..., m (index i + m).
 */
export function walkSolution(p, pi0, pi1, m) {
  const q = 1 - p;
  const out = new Array(2 * m + 1);
  out[m] = pi0;
  out[m + 1] = pi1;
  for (let i = 1; i < m; i++) out[m + i + 1] = out[m + i] + (p / q) * (out[m + i] - out[m + i - 1]);
  for (let i = 0; i > -m; i--) out[m + i - 1] = out[m + i] - (q / p) * (out[m + i + 1] - out[m + i]);
  return out;
}
