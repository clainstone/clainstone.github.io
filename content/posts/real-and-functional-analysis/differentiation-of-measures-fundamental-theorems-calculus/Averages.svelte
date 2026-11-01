<script>
  // Theorem 6 with N = 1, an instance on an interval: the graph of f, the
  // dashed level f(x), constant in the integral, and the region between them
  // over (x − r, x + r), whose area is ∫ |f − f(x)| dλ over that interval.
  // The number above is that area divided by 2r. The sliders set x and r.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, between, integral, fmt } from './plot.js';

  const OX = 50, UX = 590, OY = 268, UY = 230;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  const f = (t) => 0.46 + 0.22 * Math.sin(2 * Math.PI * (1.25 * t + 0.1)) + 0.11 * Math.sin(2 * Math.PI * 3.6 * t);

  let x = $state(0.42);
  let r = $state(0.08);
  const level = $derived(f(x));
  const lo = $derived(Math.max(0, x - r));
  const hi = $derived(Math.min(1, x + r));
  const mean = $derived(integral((t) => Math.abs(f(t) - level), lo, hi, 400) / (2 * r));
</script>

<figure class="anim averages">
  <svg viewBox="0 0 690 318" role="img" aria-label="The graph of a function f on an interval, a dashed horizontal line at the level f of x, and the shaded region between the graph and the line over the interval from x minus r to x plus r, with the value of the average of the absolute difference written above">
    <path class="region" d={between(f, () => level, lo, hi, sx, sy, 160)} />
    <line class="level" x1={sx(0)} y1={sy(level)} x2={sx(1)} y2={sy(level)} />
    <line class="axis" x1={sx(0)} y1={OY} x2={sx(1) + 14} y2={OY} />
    <line class="guide" x1={sx(x)} y1={OY} x2={sx(x)} y2={sy(level)} />
    <line class="set" x1={sx(lo)} y1={OY} x2={sx(hi)} y2={OY} />
    <polyline class="curve" points={graph(f, 0, 1, sx, sy, 300)} />
    <circle class="dot" cx={sx(x)} cy={sy(level)} r="4.5" />

    <text class="it" x={sx(x)} y={OY + 22}>x</text>
    <text class="it" x={sx(0.97)} y={sy(f(0.97)) - 22}>f</text>
    <text class="muted left" x={sx(1) + 8} y={sy(level)}><tspan class="it">f</tspan>(<tspan class="it">x</tspan>)</text>
    <text class="left" x={OX} y="26">(1/2<tspan class="it">r</tspan>) ∫ |<tspan class="it">f</tspan> − <tspan class="it">f</tspan>(<tspan class="it">x</tspan>)| d<tspan class="it">λ</tspan> over (<tspan class="it">x</tspan> − <tspan class="it">r</tspan>, <tspan class="it">x</tspan> + <tspan class="it">r</tspan>) = <tspan class="accent">{fmt(mean, 4)}</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="x" min={0.12} max={0.88} step={0.01} bind:value={x} format={(v) => v.toFixed(2)} />
      <Slider label="r" min={0.005} max={0.12} step={0.005} bind:value={r} format={(v) => v.toFixed(3)} />
    </div>
  </div>
</figure>

<style>
  .averages { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-accent); fill-opacity: 0.22; }
  .level { stroke: var(--anim-muted); stroke-width: 1.3; stroke-dasharray: 6 5; }
  .guide { stroke: var(--anim-muted); stroke-width: 1; stroke-dasharray: 3 3; }
  .set { stroke: var(--anim-accent); stroke-width: 5; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
