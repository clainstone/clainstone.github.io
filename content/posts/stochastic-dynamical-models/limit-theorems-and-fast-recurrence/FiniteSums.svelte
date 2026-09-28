<script>
  // The sums over F = {0, ..., m} on the instance of Figure 1 with p = 0.3 and
  // q = 0.5, against m: the invariant density of Example 5.2 summed over F
  // (solid) and p⁽ⁿ⁾_ij summed over F (dots), with the level 1 dashed. The sliders
  // set n and i.
  import Slider from '@toolkit/Slider.svelte';
  import { rows, density } from './ex52.js';

  const P = 0.3, Q = 0.5, MMAX = 20, NMAX = 60;
  const X0 = 64, X1 = 560, Y0 = 250, Y1 = 34;
  const px = (m) => X0 + (m * (X1 - X0)) / MMAX;
  const py = (v) => Y0 - v * (Y0 - Y1);
  const piSums = (() => { let s = 0; return Array.from({ length: MMAX + 1 }, (_, m) => (s += density(m, P, Q))); })();
  let n = $state(5);
  let i = $state(4);
  const row = $derived(rows(i, NMAX, P, Q)[n]);
  const pSums = $derived.by(() => { let s = 0; return Array.from({ length: MMAX + 1 }, (_, m) => (s += row[m])); });
</script>

<figure class="anim finite-sums">
  <svg viewBox="0 0 640 318" role="img" aria-label="Against m, the sum of the invariant density over the states 0 to m, a line, and the sum of the n-step transition probabilities from i over the same states, dots, with the level 1 dashed">
    <line class="axis" x1={X0} y1={Y0} x2={X1 + 8} y2={Y0} />
    <line class="axis" x1={X0} y1={Y0} x2={X0} y2={Y1 - 12} />
    <line class="one" x1={X0} y1={py(1)} x2={X1} y2={py(1)} />
    {#each [0, 0.5, 1] as v}
      <text class="num" x={X0 - 24} y={py(v)}>{v}</text>
    {/each}
    {#each [0, 5, 10, 15, 20] as m}
      <line class="tick" x1={px(m)} y1={Y0} x2={px(m)} y2={Y0 + 5} />
      <text class="num" x={px(m)} y={Y0 + 20}>{m}</text>
    {/each}
    <polyline class="pi" points={piSums.map((v, m) => `${px(m)},${py(v)}`).join(' ')} />
    {#each pSums as v, m}
      <circle class="pt" cx={px(m)} cy={py(v)} r="4" />
    {/each}
    <text class="axis-l" x={X1 + 22} y={Y0 + 20}>m</text>
    <text class="note" x={(X0 + X1) / 2} y="300">i = {i}, n = {n}: at m = {MMAX} the two sums are {piSums[MMAX].toFixed(4)} and {pSums[MMAX].toFixed(4)}</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={NMAX} step={1} bind:value={n} />
      <Slider label="i" min={0} max={8} step={1} bind:value={i} />
    </div>
  </div>
</figure>

<style>
  .finite-sums { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.1; }
  .one { stroke: var(--anim-ink); stroke-width: 1.3; stroke-dasharray: 7 4; }
  .pi { fill: none; stroke: var(--anim-ink); stroke-width: 2; }
  .pt { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .axis-l { font-style: italic; fill: var(--anim-muted); }
  .note { font-size: 16px; fill: var(--anim-muted); }
  .finite-sums :global(.anim-slider-label) { font-style: italic; }
</style>
