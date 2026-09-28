<script>
  // Theorem 5.4 on an instance, the chain of Example 5.2 with p_m = p and
  // q_m = q: the dots are p⁽ⁿ⁾_ii for n = 0, ..., 80, the dashed level is
  // 1/E_i[T_i], with E_i[T_i] computed by meanReturn in ex52.js. The sliders
  // set p, q and i.
  import Slider from '@toolkit/Slider.svelte';
  import { rows, meanReturn } from './ex52.js';

  const NMAX = 80;
  const X0 = 64, X1 = 560, Y0 = 250, Y1 = 30;
  const px = (n) => X0 + (n * (X1 - X0)) / NMAX;
  const py = (v) => Y0 - v * (Y0 - Y1);
  let p = $state(0.3);
  let q = $state(0.5);
  let i = $state(0);
  // q ≥ p + 0.1 and r = 1 − p − q ≥ 0.05.
  $effect(() => {
    if (q < p + 0.1) q = Math.round((p + 0.1) * 100) / 100;
    if (q > 0.95 - p) q = Math.round((0.95 - p) * 100) / 100;
  });
  const back = $derived(rows(i, NMAX, p, q).map((v) => v[i]));
  const mean = $derived(meanReturn(i, p, q));
  const fmt = (v) => (v >= 1e-3 ? v.toFixed(3) : v.toExponential(2));
  const big = (v) => (v < 1e4 ? v.toFixed(3) : v.toExponential(3));
</script>

<figure class="anim return-limit">
  <svg viewBox="0 0 640 318" role="img" aria-label="The probabilities of being back at the state i after n steps, for n from 0 to 80, and the level one over the mean return time">
    <line class="axis" x1={X0} y1={Y0} x2={X1 + 8} y2={Y0} />
    <line class="axis" x1={X0} y1={Y0} x2={X0} y2={Y1 - 10} />
    {#each [0, 0.5, 1] as v}
      <line class="guide" x1={X0} y1={py(v)} x2={X1} y2={py(v)} />
      <text class="num" x={X0 - 24} y={py(v)}>{v}</text>
    {/each}
    {#each [0, 20, 40, 60, 80] as n}
      <line class="tick" x1={px(n)} y1={Y0} x2={px(n)} y2={Y0 + 5} />
      <text class="num" x={px(n)} y={Y0 + 20}>{n}</text>
    {/each}
    <line class="level" x1={X0} y1={py(1 / mean)} x2={X1} y2={py(1 / mean)} />
    {#each back as v, n}
      <circle class="pt" cx={px(n)} cy={py(v)} r="3" />
    {/each}
    <text class="axis-l" x={X1 + 22} y={Y0 + 20}>n</text>
    <text class="note" x={(X0 + X1) / 2} y="300">i = {i}: E<tspan dy="5" font-size="12">i</tspan><tspan dy="-5">[T</tspan><tspan dy="5" font-size="12">i</tspan><tspan dy="-5">] = {big(mean)}, its inverse {fmt(1 / mean)}, and p</tspan><tspan dy="5" font-size="12">ii</tspan><tspan dy="-5">&nbsp;at n = {NMAX} is {fmt(back[NMAX])}</tspan></text>
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
  .return-limit { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.1; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  .level { stroke: var(--anim-ink); stroke-width: 1.5; stroke-dasharray: 7 4; }
  .pt { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .axis-l { font-style: italic; fill: var(--anim-muted); }
  .note { font-size: 16px; fill: var(--anim-muted); }
  .return-limit :global(.anim-slider-label) { font-style: italic; }
</style>
