<script>
  // Theorem 5.6 on the instance of Figure 1 with p = 0.3 and q = 0.5: the bars
  // are the row i of Pⁿ, p⁽ⁿ⁾_ij for j = 0, ..., 15, the marks the invariant
  // density π_j of Example 5.2. The sliders set n and i.
  import Slider from '@toolkit/Slider.svelte';
  import { rows, density } from './ex52.js';

  const P = 0.3, Q = 0.5, J = 16, NMAX = 80;
  const X0 = 64, X1 = 576, Y0 = 250, Y1 = 30;
  const bw = (X1 - X0) / J;
  const pi = Array.from({ length: J }, (_, j) => density(j, P, Q));
  let n = $state(3);
  let i = $state(6);
  const all = $derived(rows(i, NMAX, P, Q));
  const row = $derived(all[n]);
  const py = (v) => Y0 - v * (Y0 - Y1);
</script>

<figure class="anim row-limit">
  <svg viewBox="0 0 640 318" role="img" aria-label="Bars of the n-step transition probabilities from the state i to the states 0 to 15, with marks at the invariant density">
    <line class="axis" x1={X0} y1={Y0} x2={X1 + 8} y2={Y0} />
    {#each [0, 0.5, 1] as v}
      <line class="guide" x1={X0} y1={py(v)} x2={X1} y2={py(v)} />
      <text class="num" x={X0 - 24} y={py(v)}>{v}</text>
    {/each}
    {#each Array.from({ length: J }, (_, j) => j) as j}
      <rect class="bar" class:start={j === i} x={X0 + j * bw + 3} y={py(row[j])} width={bw - 6} height={Y0 - py(row[j])} />
      <line class="mark" x1={X0 + j * bw + 1} y1={py(pi[j])} x2={X0 + (j + 1) * bw - 1} y2={py(pi[j])} />
      {#if j % 5 === 0 || j === J - 1}
        <text class="num" x={X0 + j * bw + bw / 2} y={Y0 + 20}>{j}</text>
      {/if}
    {/each}
    <text class="axis-l" x={X1 + 22} y={Y0 + 20}>j</text>
    <text class="note" x={(X0 + X1) / 2} y="300">row i = {i} of P<tspan dy="-7" font-size="12">{n}</tspan><tspan dy="7">; the marks are π</tspan><tspan dy="5" font-size="12">j</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={0} max={NMAX} step={1} bind:value={n} />
      <Slider label="i" min={0} max={10} step={1} bind:value={i} />
    </div>
  </div>
</figure>

<style>
  .row-limit { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  .bar { fill: var(--anim-accent); fill-opacity: 0.5; stroke: var(--anim-accent); stroke-width: 1; }
  .bar.start { fill-opacity: 0.75; }
  .mark { stroke: var(--anim-ink); stroke-width: 2.4; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .axis-l { font-style: italic; fill: var(--anim-muted); }
  .note { font-size: 16px; fill: var(--anim-muted); }
  .row-limit :global(.anim-slider-label) { font-style: italic; }
</style>
