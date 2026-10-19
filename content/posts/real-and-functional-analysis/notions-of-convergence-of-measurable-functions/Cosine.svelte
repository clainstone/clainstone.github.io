<script>
  // Example 13, the drawing of the lecture extended to f_n: on [0, 1], the graph
  // of x^n, which ends at (1, 1), the graph of f_n(x) = cos(x^n), which ends at
  // (1, cos(1)), and, dashed, the constant 1. The slider sets n.
  import Slider from '@toolkit/Slider.svelte';
  import { graph } from './plot.js';
  const uid = $props.id();

  const NMAX = 40;
  const OX = 80, UX = 500, OY = 268, UY = 210;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;

  let n = $state(4);
  const pow = $derived((x) => x ** n);
  const fn = $derived((x) => Math.cos(x ** n));
  const half = $derived(0.5 ** (1 / n));
</script>

<figure class="anim cosine">
  <svg viewBox="0 0 690 306" role="img" aria-label="On the unit interval, the graph of x to the n, rising from 0 to 1, the graph of the cosine of x to the n, falling from 1 to the cosine of 1, and a dashed horizontal line at height 1">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <line class="axis" x1={OX - 14} y1={OY} x2={sx(1.18)} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 14} x2={OX} y2={sy(1.16)} marker-end="url(#{uid}-head)" />
    <line class="tick" x1={sx(1)} y1={OY - 5} x2={sx(1)} y2={OY + 5} />
    <line class="guide" x1={sx(1)} y1={OY} x2={sx(1)} y2={sy(1)} />
    <line class="one" x1={OX} y1={sy(1)} x2={sx(1)} y2={sy(1)} />
    <polyline class="pow" points={graph(pow, 0, 1, sx, sy, 400)} />
    <polyline class="fn" points={graph(fn, 0, 1, sx, sy, 400)} />
    <circle class="dot" cx={sx(1)} cy={sy(1)} r="4" />
    <circle class="dot accent" cx={sx(1)} cy={sy(Math.cos(1))} r="4.5" />

    <text class="num" x={OX - 16} y={OY + 18}>0</text>
    <text class="num" x={sx(1)} y={OY + 22}>1</text>
    <text class="num" x={OX - 18} y={sy(1)}>1</text>
    <text class="left it" x={sx(half) + 14} y={sy(0.5) + 6}>x<tspan class="sup" dy="-7">n</tspan></text>
    <text class="it accent" x={sx(0.16)} y={sy(fn(0.16)) + 24}>f<tspan class="sub" dy="5">n</tspan></text>
    <text class="left accent" x={sx(1) + 14} y={sy(Math.cos(1))}>cos(1)</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={1} max={NMAX} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .cosine { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .guide { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 4 4; }
  .one { stroke: var(--anim-muted); stroke-width: 1.8; stroke-dasharray: 8 6; }
  .pow { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .dot { fill: var(--anim-ink); }
  .dot.accent { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .sup { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
