<script>
  // Example 11, Part 2 (2), on D = (−2, 2]: g_n(x) = (x/2)^n for the n of the
  // slider, the region between its graph and the axis, shaded, whose area is
  // the integral of |g_n| over D, and the dashed constant h = 1. The empty
  // circle at x = −2 is not on the graph, the filled dot at x = 2 is.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under } from './plot.js';
  const uid = $props.id();

  const CX = 360, UX = 135, OY = 150, UY = 108;
  const sx = (x) => CX + x * UX;
  const sy = (v) => OY - v * UY;

  let n = $state(4);
  const gn = $derived((x) => (x / 2) ** n);
</script>

<figure class="anim powersarea">
  <svg viewBox="0 0 690 300" role="img" aria-label="On the interval from minus 2 to 2, the function g n for the chosen n, flat near 0 and reaching 1 at 2, with the region between its graph and the axis shaded, and the dashed constant 1">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <path class="region" d={under(gn, -2, 2, sx, sy, 400)} />
    <line class="h" x1={sx(-2)} y1={sy(1)} x2={sx(2)} y2={sy(1)} />
    <line class="axis" x1={sx(-2) - 30} y1={OY} x2={sx(2) + 40} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={CX} y1={sy(-1.25)} x2={CX} y2={sy(1.28)} marker-end="url(#{uid}-head)" />
    <polyline class="g" points={graph(gn, -2, 2, sx, sy, 400)} />
    <circle class="hole" cx={sx(-2)} cy={sy((-1) ** n)} r="4.5" />
    <circle class="dot" cx={sx(2)} cy={sy(1)} r="4.5" />
    <line class="tick" x1={sx(-2)} y1={OY - 5} x2={sx(-2)} y2={OY + 5} />
    <line class="tick" x1={sx(2)} y1={OY - 5} x2={sx(2)} y2={OY + 5} />
    <text class="num" x={sx(-2) - 16} y={OY + 20}>−2</text>
    <text class="num" x={sx(2) + 12} y={OY + 20}>2</text>
    <text class="num" x={CX - 12} y={OY + 18}>0</text>
    <text class="it" x={sx(2) + 42} y={OY + 21}>x</text>
    <text class="right" x={sx(-2) - 14} y={sy(1)}><tspan class="it">h</tspan> = 1</text>
    <text class="lab it" x={sx(1.25)} y={sy((1.25 / 2) ** n) - 22}>g<tspan class="sub" dy="5">n</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={30} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .powersarea { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .region { fill: var(--anim-accent); fill-opacity: 0.16; }
  .h { stroke: var(--anim-muted); stroke-width: 1.8; stroke-dasharray: 7 5; }
  .g { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .dot { fill: var(--anim-accent); }
  .hole { fill: var(--page, #fff); stroke: var(--anim-accent); stroke-width: 2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .lab { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
