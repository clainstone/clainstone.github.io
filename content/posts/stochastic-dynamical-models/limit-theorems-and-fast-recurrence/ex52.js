// The instance of this post's figures: the chain of Example 5.2 of the
// previous post with p_m = p and q_m = q for every m, so that r_0 = 1 − p and
// r_m = 1 − p − q for m ≥ 1. The vectors below have M entries: the figures
// follow at most 80 steps from states at most 10, so they never reach the
// state M − 1 and every number they draw is that of the chain on N.

export const M = 320;

/** The row vector v times the transition matrix, cut at M states. */
export function step(v, p, q) {
  const w = new Float64Array(M);
  for (let m = 0; m < M; m++) {
    const a = v[m];
    if (!a) continue;
    if (m === 0) { w[0] += a * (1 - p); w[1] += a * p; continue; }
    w[m - 1] += a * q;
    w[m] += a * (1 - p - q);
    if (m + 1 < M) w[m + 1] += a * p;
  }
  return w;
}

const unit = (i) => { const v = new Float64Array(M); v[i] = 1; return v; };

/** The rows δ_i Pⁿ for n = 0, ..., nmax. */
export function rows(i, nmax, p, q) {
  const out = [unit(i)];
  for (let n = 1; n <= nmax; n++) out.push(step(out[n - 1], p, q));
  return out;
}

/** f⁽ⁿ⁾_ij = P_i{T_j = n} for n = 0, ..., nmax (f⁽⁰⁾ = 0): the mass that enters j for the first time at n. */
export function firstEntrance(i, j, nmax, p, q) {
  const f = new Float64Array(nmax + 1);
  let v = unit(i);
  for (let n = 1; n <= nmax; n++) {
    v = step(v, p, q);
    f[n] = v[j];
    v[j] = 0;
  }
  return f;
}

/**
 * E_i[T_i] for the chain on N, with no cut. With h_k the expected time to
 * reach i from k, first-step analysis gives E_i[T_i] = 1 + p h_{i+1} + q h_{i-1}.
 * Above i the chain moves by +1, -1 or 0 with probabilities p, q, r, so the
 * expected time to go down one level is h_{i+1} = 1/(q - p) (Wald's identity).
 * Below i it cannot pass i without hitting it, so h_0, ..., h_{i-1} solve the
 * finite system h_k = 1 + Σ_l p_kl h_l with h_i = 0 (Thomas algorithm).
 */
export function meanReturn(i, p, q) {
  if (i === 0) return 1 + p / (q - p);
  // (1 - stay_k) h_k - down_k h_{k-1} - p h_{k+1} = 1 for k = 0, ..., i - 1.
  const c = new Float64Array(i), d = new Float64Array(i);
  for (let k = 0; k < i; k++) {
    const lo = k > 0 ? -q : 0, hi = k < i - 1 ? -p : 0, mid = k === 0 ? p : p + q;
    const den = mid - lo * (k > 0 ? c[k - 1] : 0);
    c[k] = hi / den;
    d[k] = (1 - lo * (k > 0 ? d[k - 1] : 0)) / den;
  }
  const h = new Float64Array(i);
  h[i - 1] = d[i - 1];
  for (let k = i - 2; k >= 0; k--) h[k] = d[k] - c[k] * h[k + 1];
  return 1 + p / (q - p) + q * h[i - 1];
}

/** The invariant density of Example 5.2 for this instance: π_n = (p/q)ⁿ π_0 with π_0 = 1 − p/q. */
export const density = (n, p, q) => (1 - p / q) * (p / q) ** n;
