<script>
  // The renewal equation p⁽ⁿ⁾_i0 = Σ_{k=1}^{n} f⁽ᵏ⁾_i0 p⁽ⁿ⁻ᵏ⁾_00 on the instance
  // of Figure 1 with p = 0.3 and q = 0.5: the filled bars are the terms, the
  // outlines the f⁽ᵏ⁾_i0. The sliders set n and i.
  import Slider from '@toolkit/Slider.svelte';
  import { rows, firstEntrance } from './ex52.js';

  const P = 0.3, Q = 0.5, KMAX = 40;
  const X0 = 64, X1 = 560, Y0 = 250, Y1 = 30;
  const bw = (X1 - X0) / KMAX;
  const px = (k) => X0 + (k - 0.5) * bw;
  const back = rows(0, KMAX, P, Q).map((v) => v[0]);
  let n = $state(12);
  let i = $state(3);
  const f = $derived(firstEntrance(i, 0, KMAX, P, Q));
  const terms = $derived(Array.from({ length: KMAX }, (_, t) => (t + 1 <= n ? f[t + 1] * back[n - t - 1] : 0)));
  const sum = $derived(terms.reduce((a, b) => a + b, 0));
  const top = $derived(Math.max(0.1, Math.ceil(Math.max(...Array.from(f)) * 10) / 10));
  const py = (v) => Y0 - (v * (Y0 - Y1)) / top;
</script>

<figure class="anim renewal">
  <svg viewBox="0 0 640 318" role="img" aria-label="For each k up to n, the first entrance probability into state 0 at time k as an outline, and the term of the renewal equation as a filled bar">
    <line class="axis" x1={X0} y1={Y0} x2={X1 + 8} y2={Y0} />
    {#each [0, top / 2, top] as v}
      <line class="guide" x1={X0} y1={py(v)} x2={X1} y2={py(v)} />
      <text class="num" x={X0 - 28} y={py(v)}>{v.toFixed(2)}</text>
    {/each}
    {#each Array.from(f).slice(1) as v, t}
      <rect class="outline" x={px(t + 1) - bw / 2 + 1.5} y={py(v)} width={bw - 3} height={Y0 - py(v)} />
      <rect class="term" x={px(t + 1) - bw / 2 + 1.5} y={py(terms[t])} width={bw - 3} height={Y0 - py(terms[t])} />
    {/each}
    <line class="cut" x1={px(n) + bw / 2} y1={Y0 + 4} x2={px(n) + bw / 2} y2={Y1} />
    {#each [1, 10, 20, 30, 40] as k}
      <text class="num" x={px(k)} y={Y0 + 20}>{k}</text>
    {/each}
    <text class="axis-l" x={X1 + 22} y={Y0 + 20}>k</text>
    <text class="note" x={(X0 + X1) / 2} y="300">i = {i}, n = {n}: the terms sum to p<tspan dy="5" font-size="12">{i}0</tspan><tspan dy="-12" font-size="12">({n})</tspan><tspan dy="7">&nbsp;= {sum.toFixed(4)}</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={KMAX} step={1} bind:value={n} />
      <Slider label="i" min={0} max={8} step={1} bind:value={i} />
    </div>
  </div>
</figure>

<style>
  .renewal { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  .outline { fill: none; stroke: var(--anim-muted); stroke-width: 1; }
  .term { fill: var(--anim-accent); fill-opacity: 0.6; stroke: none; }
  .cut { stroke: var(--anim-ink); stroke-width: 1.2; stroke-dasharray: 4 3; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .axis-l { font-style: italic; fill: var(--anim-muted); }
  .note { font-size: 16px; fill: var(--anim-muted); }
  .renewal :global(.anim-slider-label) { font-style: italic; }
</style>
