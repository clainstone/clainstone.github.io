<script>
  // Example 4 on (0, 4]: f_n(x) = (π/2 − arctan(nx))/(1 + x) for the n of the
  // slider, g_2(x) = π/(1 + x) and g_1(x) = 1/(x(1 + x)). The dominating
  // function g_2 χ_(0,1) + g_1 χ_(1,∞) is solid, the rest of g_1 and g_2 dashed,
  // and the dotted line marks x = 1. Heights above 3.4 are cut.
  import Slider from '@toolkit/Slider.svelte';
  import { graph } from './plot.js';
  const uid = $props.id();

  const OX = 70, UX = 142, OY = 262, UY = 68, B = 4, TOP = 3.4, E = 1e-4;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const g2 = (x) => Math.PI / (1 + x);
  const g1 = (x) => 1 / (x * (1 + x));
  const g2In = graph(g2, 0, 1, sx, sy, 120);
  const g2Out = graph(g2, 1, B, sx, sy, 200);
  const g1In = graph(g1, E, 1, sx, sy, 300, 3);
  const g1Out = graph(g1, 1, B, sx, sy, 200);

  let n = $state(3);
  const fn = $derived((x) => (Math.PI / 2 - Math.atan(n * x)) / (1 + x));
</script>

<figure class="anim arctanbounds">
  <svg viewBox="0 0 690 300" role="img" aria-label="On the interval from 0 to 4, the function f n for the chosen n below the bound pi over 1 plus x, drawn solid up to 1 and dashed after it, and the bound 1 over x times 1 plus x, drawn dashed up to 1 and solid after it">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
      <clipPath id="{uid}-clip">
        <rect x={OX} y={sy(TOP)} width={B * UX + 4} height={TOP * UY} />
      </clipPath>
    </defs>
    <line class="dotted" x1={sx(1)} y1={OY} x2={sx(1)} y2={sy(TOP)} />
    <g clip-path="url(#{uid}-clip)">
      <polyline class="rest" points={g2Out} />
      <polyline class="rest" points={g1In} />
      <polyline class="bound" points={g2In} />
      <polyline class="bound" points={g1Out} />
      <polyline class="fn" points={graph(fn, 0, B, sx, sy, 500, 2)} />
    </g>
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(B) + 24} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 12} x2={OX} y2={sy(TOP) - 8} marker-end="url(#{uid}-head)" />
    {#each [1, 2, 3, 4] as k}
      <line class="tick" x1={sx(k)} y1={OY - 4} x2={sx(k)} y2={OY + 4} />
      <text class="num" x={sx(k)} y={OY + 21}>{k}</text>
    {/each}
    <line class="tick" x1={OX - 4} y1={sy(Math.PI)} x2={OX + 4} y2={sy(Math.PI)} />
    <text class="num right" x={OX - 10} y={sy(Math.PI)}>π</text>
    <line class="tick" x1={OX - 4} y1={sy(Math.PI / 2)} x2={OX + 4} y2={sy(Math.PI / 2)} />
    <text class="num right" x={OX - 10} y={sy(Math.PI / 2)}>π/2</text>
    <text class="num" x={OX - 14} y={OY + 19}>0</text>

    <text class="lab it" x={sx(0.86)} y={sy(g2(0.86)) - 18}>g<tspan class="sub" dy="5">2</tspan></text>
    <text class="lab it" x={sx(2.2)} y={sy(g1(2.2)) - 20}>g<tspan class="sub" dy="5">1</tspan></text>
    <text class="lab it accent" x={OX + 20} y={sy(Math.PI / 2) - 18}>f<tspan class="sub" dy="5">n</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={40} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .arctanbounds { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .dotted { stroke: var(--anim-muted); stroke-width: 1.4; stroke-dasharray: 2 4; stroke-linecap: round; }
  .bound { fill: none; stroke: var(--anim-ink); stroke-width: 2.4; stroke-linejoin: round; }
  .rest { fill: none; stroke: var(--anim-muted); stroke-width: 1.8; stroke-dasharray: 7 5; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
