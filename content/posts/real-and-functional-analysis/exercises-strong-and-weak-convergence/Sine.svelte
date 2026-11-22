<script>
  // The drawing of Example 18.5: the graph of f_m(x) = sin(mx) on [0, 1],
  // between the dashed levels 1 and −1, for the m of the slider.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, head } from './plot.js';

  const OX = 110, X1 = 610, OY = 140, UY = 82;
  const sx = (t) => OX + t * (X1 - OX);
  const sy = (v) => OY - v * UY;

  let m = $state(40);
  const pts = $derived(graph((t) => Math.sin(m * t), 0, 1, sx, sy, 1400));
</script>

<figure class="anim sine">
  <svg viewBox="0 0 740 285" role="img" aria-label="The graph of f m, equal to sine of m x, on the interval from 0 to 1, oscillating between the dashed levels 1 and minus 1">
    <line class="axis" x1={OX - 40} y1={OY} x2={X1 + 60} y2={OY} />
    <polygon class="head" points={head(X1 + 70, OY, 1, 0)} />
    <line class="axis" x1={OX} y1={sy(-1.35)} x2={OX} y2={sy(1.4)} />
    <polygon class="head" points={head(OX, sy(1.4) - 10, 0, -1)} />
    <line class="level" x1={OX} y1={sy(1)} x2={sx(1)} y2={sy(1)} />
    <line class="level" x1={OX} y1={sy(-1)} x2={sx(1)} y2={sy(-1)} />
    <line class="tick" x1={sx(1)} y1={OY - 7} x2={sx(1)} y2={OY + 7} />
    <polyline class="fn" points={pts} />
    <text x={OX - 16} y={OY + 22}>0</text>
    <text x={sx(1) + 16} y={OY + 22}>1</text>
    <text x={OX - 20} y={sy(1)}>1</text>
    <text x={OX - 26} y={sy(-1)}>−1</text>
    <text class="lab it" x={sx(1) + 42} y={sy(1)}>f<tspan class="sub" dy="5">m</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="m" min={1} max={100} step={1} bind:value={m} />
    </div>
  </div>
</figure>

<style>
  .sine { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.2; }
  .head { fill: var(--anim-ink); }
  .level { stroke: var(--anim-muted); stroke-width: 1.3; stroke-dasharray: 6 5; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 1.8; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .lab { fill: var(--anim-accent); }
  .sub { font-size: 13px; }
</style>
