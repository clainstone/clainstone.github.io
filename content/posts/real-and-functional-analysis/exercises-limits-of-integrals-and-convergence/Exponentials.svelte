<script>
  // Example 9 on [0, 6]: f_n(x) = (e^(−nx) + n² e^(−x)) / (n + n² + (1 + n²) x²)
  // for the n of the slider, its limit f(x) = e^(−x)/(1 + x²) and, dashed, the
  // bound g(x) = (1 + e^(−x))/(1 + x²).
  import Slider from '@toolkit/Slider.svelte';
  import { graph } from './plot.js';
  const uid = $props.id();

  const OX = 70, UX = 95, OY = 262, UY = 108, B = 6;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const f = (x) => Math.exp(-x) / (1 + x * x);
  const g = (x) => (1 + Math.exp(-x)) / (1 + x * x);
  const fLine = graph(f, 0, B, sx, sy, 400);
  const gLine = graph(g, 0, B, sx, sy, 400);

  let n = $state(2);
  const fn = $derived((x) => (Math.exp(-n * x) + n * n * Math.exp(-x)) / (n + n * n + (1 + n * n) * x * x));
</script>

<figure class="anim exponentials">
  <svg viewBox="0 0 690 300" role="img" aria-label="On the interval from 0 to 6, the function f n for the chosen n, its limit f, and the dashed bound g above both, all decreasing towards 0">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <polyline class="g" points={gLine} />
    <polyline class="f" points={fLine} />
    <polyline class="fn" points={graph(fn, 0, B, sx, sy, 400)} />
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(B) + 24} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 12} x2={OX} y2={sy(2.25)} marker-end="url(#{uid}-head)" />
    {#each [1, 2, 3, 4, 5, 6] as k}
      <line class="tick" x1={sx(k)} y1={OY - 4} x2={sx(k)} y2={OY + 4} />
      <text class="num" x={sx(k)} y={OY + 21}>{k}</text>
    {/each}
    {#each [1, 2] as k}
      <line class="tick" x1={OX - 4} y1={sy(k)} x2={OX + 4} y2={sy(k)} />
      <text class="num right" x={OX - 10} y={sy(k)}>{k}</text>
    {/each}
    <text class="num" x={OX - 14} y={OY + 19}>0</text>
    <text class="it" x={sx(B) + 26} y={OY + 21}>x</text>

    <line class="fn" x1="470" y1="56" x2="510" y2="56" />
    <text class="left it" x="522" y="56">f<tspan class="sub" dy="5">n</tspan></text>
    <line class="f" x1="470" y1="88" x2="510" y2="88" />
    <text class="left it" x="522" y="88">f</text>
    <line class="g" x1="470" y1="120" x2="510" y2="120" />
    <text class="left it" x="522" y="120">g</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={20} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .exponentials { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .g { fill: none; stroke: var(--anim-muted); stroke-width: 2; stroke-dasharray: 7 5; }
  .f { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
