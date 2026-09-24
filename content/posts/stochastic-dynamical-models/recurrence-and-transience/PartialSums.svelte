<script>
  // Theorem 3.5 on the chain of Example 2.5, an instance: the partial sums
  // Σ_{n=0}^{N} p⁽ⁿ⁾ᵢᵢ for N = 0, …, 40. The buttons choose i.
  import { EX25, powers } from './markov.js';

  const NMAX = 40;
  const Pn = powers(EX25, NMAX);
  const X0 = 70, X1 = 600, Y0 = 250, Y1 = 30, YMAX = 22;
  const px = (N) => X0 + (N * (X1 - X0)) / NMAX;
  const py = (v) => Y0 - (Math.min(v, YMAX) * (Y0 - Y1)) / YMAX;
  let i = $state(1);
  const sums = $derived.by(() => {
    let s = 0;
    return Pn.map((M) => (s += M[i - 1][i - 1]));
  });
</script>

<figure class="anim partial-sums">
  <svg viewBox="0 0 640 312" role="img" aria-label="The partial sums of p_ii^(n) against N for the chosen state i of the chain of Example 2.5">
    <line class="axis" x1={X0} y1={Y0} x2={X1 + 12} y2={Y0} />
    <line class="axis" x1={X0} y1={Y0} x2={X0} y2={Y1 - 10} />
    {#each [0, 10, 20, 30, 40] as N}
      <line class="tick" x1={px(N)} y1={Y0} x2={px(N)} y2={Y0 + 5} />
      <text class="num" x={px(N)} y={Y0 + 20}>{N}</text>
    {/each}
    {#each [0, 5, 10, 15, 20] as v}
      <line class="tick" x1={X0 - 5} y1={py(v)} x2={X0} y2={py(v)} />
      <text class="num" x={X0 - 22} y={py(v)}>{v}</text>
    {/each}
    <polyline class="line" points={sums.map((v, N) => `${px(N)},${py(v)}`).join(' ')} />
    {#each sums as v, N}
      <circle class="pt" cx={px(N)} cy={py(v)} r="3" />
    {/each}
    <text class="lab" x={X1 + 18} y={Y0 + 20}>N</text>
    <text class="note" x={(X0 + X1) / 2} y="300">i = {i}: the partial sum at N = {NMAX} is {sums[NMAX].toFixed(3)}</text>
  </svg>
  <div class="anim-controls">
    {#each [1, 2, 3, 4, 5, 6] as s}
      <button type="button" class="anim-toggle" aria-pressed={s === i} onclick={() => (i = s)}>i = {s}</button>
    {/each}
  </div>
</figure>

<style>
  .partial-sums { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.1; }
  .line { fill: none; stroke: var(--anim-accent); stroke-width: 1.6; }
  .pt { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .lab { font-style: italic; fill: var(--anim-muted); }
  .note { font-style: italic; }
  .anim-toggle[aria-pressed='true'] { color: var(--anim-ink); border-color: var(--anim-accent); }
</style>
