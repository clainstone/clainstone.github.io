<script>
  // Example 2: on (0, 2], f_n(x) = tanh(nx) / (√(sin x) (2 + n x³)) for the n of
  // the slider, with the region under its graph shaded, and, dashed, the bound
  // g(x) = 1/(2√(sin x)). Heights above 4.2 are cut.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under } from './plot.js';
  const uid = $props.id();

  const OX = 70, UX = 290, OY = 262, UY = 56, TOP = 4.2, E = 1e-6;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const g = (x) => 1 / (2 * Math.sqrt(Math.sin(x)));
  const gLine = graph(g, E, 2, sx, sy, 400, 3);
  const yTicks = [1, 2, 3, 4];

  let n = $state(5);
  const fn = $derived((x) => Math.tanh(n * x) / (Math.sqrt(Math.sin(x)) * (2 + n * x ** 3)));
</script>

<figure class="anim tanhseq">
  <svg viewBox="0 0 690 300" role="img" aria-label="On the interval from 0 to 2, the function f n for the chosen n, with the region under its graph shaded, below the dashed bound g, which grows without bound near 0">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
      <clipPath id="{uid}-clip">
        <rect x={OX} y={sy(TOP)} width={2 * UX + 4} height={TOP * UY} />
      </clipPath>
    </defs>
    <g clip-path="url(#{uid}-clip)">
      <path class="region" d={under(fn, E, 2, sx, sy, 600, 3)} />
      <polyline class="g" points={gLine} />
      <polyline class="fn" points={graph(fn, E, 2, sx, sy, 600, 3)} />
    </g>
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(2) + 26} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 12} x2={OX} y2={sy(TOP) - 8} marker-end="url(#{uid}-head)" />
    {#each [1, 2] as k}
      <line class="tick" x1={sx(k)} y1={OY - 4} x2={sx(k)} y2={OY + 4} />
      <text class="num" x={sx(k)} y={OY + 21}>{k}</text>
    {/each}
    {#each yTicks as k}
      <line class="tick" x1={OX - 4} y1={sy(k)} x2={OX + 4} y2={sy(k)} />
      <text class="num right" x={OX - 10} y={sy(k)}>{k}</text>
    {/each}
    <text class="num" x={OX - 14} y={OY + 19}>0</text>

    <line class="fn" x1="470" y1="56" x2="510" y2="56" />
    <text class="left it" x="522" y="56">f<tspan class="sub" dy="5">n</tspan></text>
    <line class="g" x1="470" y1="90" x2="510" y2="90" />
    <text class="left it" x="522" y="90">g</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={100} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .tanhseq { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .region { fill: var(--anim-accent); fill-opacity: 0.16; }
  .g { fill: none; stroke: var(--anim-muted); stroke-width: 2; stroke-dasharray: 7 5; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
