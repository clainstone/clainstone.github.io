// The Cantor function v of the previous post and the open intervals removed
// in the construction of the Cantor set, for the figures of Theorem 13.

/** v(x) from v₀(x) = x and the recursion of the previous post, `depth` steps deep. */
export function v(x, depth = 30) {
  if (depth === 0) return x;
  if (x <= 1 / 3) return 0.5 * v(3 * x, depth - 1);
  if (x < 2 / 3) return 0.5;
  return 0.5 + 0.5 * v(3 * x - 2, depth - 1);
}

/** f(x) = x + v(x), from [0, 1] onto [0, 2]. */
export const f = (x) => x + v(x);

/** The open middle thirds removed at the steps 1, …, k, as [a, b, step]. */
export function removed(k) {
  const out = [];
  let closed = [[0, 1]];
  for (let step = 1; step <= k; step++) {
    const next = [];
    for (const [a, b] of closed) {
      const t = (b - a) / 3;
      out.push([a + t, b - t, step]);
      next.push([a, a + t], [b - t, b]);
    }
    closed = next;
  }
  return out;
}
