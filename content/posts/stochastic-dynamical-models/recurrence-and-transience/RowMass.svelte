<script>
  // Corollaries 3.7 and 3.8 on the chain of Example 2.5, an instance: the
  // entries p⁽ⁿ⁾ᵢⱼ of row i of Pⁿ, one bar for each state j. The slider sets n
  // and the buttons choose i.
  import Slider from '@toolkit/Slider.svelte';
  import { EX25, powers } from './markov.js';

  const NMAX = 30;
  const Pn = powers(EX25, NMAX);
  const X0 = 90, W = 80, GAP = 10, Y0 = 220, H = 170;
  let i = $state(1);
  let n = $state(4);
  const row = $derived(Pn[n][i - 1]);
</script>

<figure class="anim row-mass">
  <svg viewBox="0 0 640 290" role="img" aria-label="Six bars, the entries of row i of the n-th power of the transition matrix of Example 2.5, one for each state j">
    <line class="axis" x1={X0 - 20} y1={Y0} x2={X0 + 6 * (W + GAP)} y2={Y0} />
    {#each [0, 0.5, 1] as v}
      <line class="guide" x1={X0 - 20} y1={Y0 - v * H} x2={X0 + 6 * (W + GAP)} y2={Y0 - v * H} />
      <text class="num" x={X0 - 42} y={Y0 - v * H}>{v}</text>
    {/each}
    {#each row as v, k}
      <rect class="bar" x={X0 + k * (W + GAP)} y={Y0 - v * H} width={W} height={v * H} />
      <text class="num" x={X0 + k * (W + GAP) + W / 2} y={Y0 - v * H - 14}>{v.toFixed(3)}</text>
      <text class="state" x={X0 + k * (W + GAP) + W / 2} y={Y0 + 22}>j = {k + 1}</text>
    {/each}
    <text class="note" x="330" y="276">row i = {i} of P<tspan dy="-7" font-size="12">{n}</tspan></text>
  </svg>
  <div class="anim-controls">
    {#each [1, 2, 3, 4, 5, 6] as s}
      <button type="button" class="anim-toggle" aria-pressed={s === i} onclick={() => (i = s)}>i = {s}</button>
    {/each}
    <div class="anim-sliders">
      <Slider label="n" min={0} max={NMAX} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .row-mass { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  .bar { fill: var(--anim-accent); fill-opacity: 0.55; stroke: var(--anim-accent); stroke-width: 1; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .state { fill: var(--anim-ink); font-size: 16px; }
  .note { font-style: italic; }
  .anim-toggle[aria-pressed='true'] { color: var(--anim-ink); border-color: var(--anim-accent); }
</style>
