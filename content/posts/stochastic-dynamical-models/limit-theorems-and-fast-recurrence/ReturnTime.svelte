<script>
  // Definition 5.5 on the instance of Figure 1: the probabilities
  // f⁽ⁿ⁾_ii = P_i{T_i = n} for n = 1, ..., 40, and their mean E_i[T_i], the
  // vertical line. The sliders set p, q and i.
  import Slider from '@toolkit/Slider.svelte';
  import { firstEntrance, meanReturn } from './ex52.js';

  const NMAX = 40;
  const X0 = 64, X1 = 560, Y0 = 250, Y1 = 30;
  const bw = (X1 - X0) / NMAX;
  const px = (n) => X0 + (n - 0.5) * bw;
  let p = $state(0.3);
  let q = $state(0.5);
  let i = $state(3);
  $effect(() => {
    if (q < p + 0.1) q = Math.round((p + 0.1) * 100) / 100;
    if (q > 0.95 - p) q = Math.round((0.95 - p) * 100) / 100;
  });
  const f = $derived(firstEntrance(i, i, NMAX, p, q));
  const mean = $derived(meanReturn(i, p, q));
  const big = (v) => (v < 1e4 ? v.toFixed(3) : v.toExponential(3));
  const top = $derived(Math.max(0.1, Math.ceil(Math.max(...f) * 10) / 10));
  const py = (v) => Y0 - (v * (Y0 - Y1)) / top;
  const mx = $derived(Math.min(px(mean) , X1));
</script>

<figure class="anim return-time">
  <svg viewBox="0 0 640 318" role="img" aria-label="Bars of the probabilities that the first return to the state i happens at time n, for n from 1 to 40, and a vertical line at their mean">
    <line class="axis" x1={X0} y1={Y0} x2={X1 + 8} y2={Y0} />
    {#each [0, top / 2, top] as v}
      <line class="guide" x1={X0} y1={py(v)} x2={X1} y2={py(v)} />
      <text class="num" x={X0 - 28} y={py(v)}>{v.toFixed(2)}</text>
    {/each}
    {#each Array.from(f).slice(1) as v, k}
      <rect class="bar" x={px(k + 1) - bw / 2 + 1.5} y={py(v)} width={bw - 3} height={Y0 - py(v)} />
    {/each}
    {#each [1, 10, 20, 30, 40] as n}
      <text class="num" x={px(n)} y={Y0 + 20}>{n}</text>
    {/each}
    <line class="mean" x1={mx} y1={Y0 + 6} x2={mx} y2={Y1 - 6} />
    <text class="lab" x={Math.min(mx + 8, X1 - 70)} y={Y1 + 4}>{mean <= NMAX + 0.5 ? 'mean' : 'mean beyond 40'}</text>
    <text class="axis-l" x={X1 + 22} y={Y0 + 20}>n</text>
    <text class="note" x={(X0 + X1) / 2} y="300">i = {i}: E<tspan dy="5" font-size="12">i</tspan><tspan dy="-5">[T</tspan><tspan dy="5" font-size="12">i</tspan><tspan dy="-5">] = {big(mean)}</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="p" min={0.05} max={0.4} step={0.05} bind:value={p} format={(v) => v.toFixed(2)} />
      <Slider label="q" min={0.15} max={0.9} step={0.05} bind:value={q} format={(v) => v.toFixed(2)} />
      <Slider label="i" min={0} max={5} step={1} bind:value={i} />
    </div>
  </div>
</figure>

<style>
  .return-time { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  .bar { fill: var(--anim-accent); fill-opacity: 0.55; stroke: var(--anim-accent); stroke-width: 1; }
  .mean { stroke: var(--anim-ink); stroke-width: 1.6; stroke-dasharray: 7 4; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .lab { text-anchor: start; font-size: 16px; }
  .axis-l { font-style: italic; fill: var(--anim-muted); }
  .note { font-size: 16px; fill: var(--anim-muted); }
  .return-time :global(.anim-slider-label) { font-style: italic; }
</style>
