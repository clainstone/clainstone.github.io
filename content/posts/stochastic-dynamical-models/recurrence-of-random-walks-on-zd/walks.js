// Return probabilities p⁽²ⁿ⁾₀₀ of the random walks of this post, from the
// formulas of the post, computed with logarithms of factorials.

const LOGF = [0];
for (let k = 1; k <= 1000; k++) LOGF.push(LOGF[k - 1] + Math.log(k));
const logBinom = (n, k) => LOGF[n] - LOGF[k] - LOGF[n - k];

/** On ℤ, steps +1 with probability p and −1 with q = 1 − p: C(2n, n)(pq)ⁿ. */
export const returnZ = (n, p) => Math.exp(logBinom(2 * n, n) + n * Math.log(p * (1 - p)));

/** On ℤ², symmetric: (C(2n, n)(1/4)ⁿ)². */
export const returnZ2 = (n) => Math.exp(2 * (logBinom(2 * n, n) - n * Math.log(4)));

/** On ℤ³, symmetric: C(2n, n)(1/6)²ⁿ Σ_{k₁+k₂+k₃=n} (n!/(k₁!k₂!k₃!))². */
export function returnZ3(n) {
  const base = logBinom(2 * n, n) - 2 * n * Math.log(6);
  let s = 0;
  for (let a = 0; a <= n; a++) {
    for (let b = 0; a + b <= n; b++) s += Math.exp(base + 2 * (LOGF[n] - LOGF[a] - LOGF[b] - LOGF[n - a - b]));
  }
  return s;
}

/** The multinomial coefficient n!/(k₁! k₂! k₃!). */
export const multinomial3 = (a, b, c) => Math.exp(LOGF[a + b + c] - LOGF[a] - LOGF[b] - LOGF[c]);
