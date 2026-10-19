<script>
  // Example 15 on (2, 12]: f_n(x) = (n² + 1)/(n²(x² − 2) + (n² + 1)x) for the n
  // of the slider, its limit f(x) = 1/((x − 1)(x + 2)), and, dashed, the bound
  // g(x) = 2/(x² + x − 2). The region under the graph of f over (2, R] is
  // shaded; its area is (1/3) log 4 + (1/3) log((R − 1)/(R + 2)). The sliders
  // set n and R.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under } from './plot.js';
  const uid = $props.id();

  const OX = 60, UX = 57, OY = 262, UY = 420;
  const A = 2, B = 12;
  const sx = (x) => OX + (x - A) * UX;
  const sy = (v) => OY - v * UY;
  const f = (x) => 1 / ((x - 1) * (x + 2));
  const g = (x) => 2 / (x * x + x - 2);
  const ticks = Array.from({ length: 11 }, (_, k) => k + 2);
  const fLine = graph(f, A, B, sx, sy, 500);
  const gLine = graph(g, A, B, sx, sy, 500);

  let n = $state(1);
  let R = $state(6);
  const fn = $derived((x) => (n * n + 1) / (n * n * (x * x - 2) + (n * n + 1) * x));
</script>

<figure class="anim rational">
  <svg viewBox="0 0 690 300" role="img" aria-label="On the interval from 2 to 12, the decreasing functions f n, their limit f and, dashed, the bound g, with the region under the graph of f between 2 and R shaded">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <path class="region" d={under(f, A, R, sx, sy, 300)} />
    <line class="guide" x1={sx(R)} y1={OY} x2={sx(R)} y2={sy(f(R)) - 6} />
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(B) + 24} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 12} x2={OX} y2={sy(0.56)} marker-end="url(#{uid}-head)" />
    {#each ticks as k}
      <line class="tick" x1={sx(k)} y1={OY - 3} x2={sx(k)} y2={OY + 3} />
    {/each}
    <polyline class="g" points={gLine} />
    <polyline class="f" points={fLine} />
    <polyline class="fn" points={graph(fn, A, B, sx, sy, 500)} />

    <text class="num" x={OX} y={OY + 22}>2</text>
    <text class="num it" x={sx(R)} y={OY + 22}>R</text>
    <line class="fn" x1="470" y1="56" x2="510" y2="56" />
    <text class="left it" x="522" y="56">f<tspan class="sub" dy="5">n</tspan></text>
    <line class="f" x1="470" y1="88" x2="510" y2="88" />
    <text class="left it" x="522" y="88">f</text>
    <line class="g" x1="470" y1="120" x2="510" y2="120" />
    <text class="left it" x="522" y="120">g</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={8} step={1} bind:value={n} />
      <Slider label="R" min={3} max={12} step={0.5} bind:value={R} format={(v) => v.toFixed(1)} />
    </div>
  </div>
</figure>

<style>
  .rational { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .guide { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 4 4; }
  .region { fill: var(--anim-accent); fill-opacity: 0.16; }
  .g { fill: none; stroke: var(--anim-muted); stroke-width: 2; stroke-dasharray: 7 5; }
  .f { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
