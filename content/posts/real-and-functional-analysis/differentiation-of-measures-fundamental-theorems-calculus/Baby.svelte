<script>
  // Theorem 7, an instance: above, a continuous f on [a, b] and the region
  // under its graph over [a, x], whose area is F(x); below, the graph of
  // F(x) = ∫_a^x f(t) dt and its tangent at x, of slope f(x). The slider sets x.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under, fmt } from './plot.js';

  const OX = 60, UX = 560;
  const sx = (t) => OX + t * UX;
  const TOP = 182, UY1 = 135;
  const BOT = 404, UY2 = 250;
  const sy1 = (v) => TOP - v * UY1;
  const sy2 = (v) => BOT - v * UY2;
  const f = (t) => 0.62 + 0.28 * Math.sin(2 * Math.PI * (t - 0.12)) + 0.1 * Math.sin(2 * Math.PI * 2.5 * t);
  // F on a grid, by the trapezoid rule.
  const N = 400;
  const Fgrid = [0];
  for (let j = 1; j <= N; j++) Fgrid.push(Fgrid[j - 1] + (f((j - 1) / N) + f(j / N)) / (2 * N));
  const F = (t) => {
    const u = Math.min(Math.max(t, 0), 1) * N;
    const j = Math.min(Math.floor(u), N - 1);
    return Fgrid[j] + (u - j) * (Fgrid[j + 1] - Fgrid[j]);
  };

  let x = $state(0.45);
  const Fx = $derived(F(x));
  const slope = $derived(f(x));
  const d = 0.14;
</script>

<figure class="anim baby">
  <svg viewBox="0 0 690 440" role="img" aria-label="Above, the graph of a continuous function f on an interval from a to b and the shaded region under it from a to x; below, the graph of the integral function F and its tangent line at x">
    <!-- Above: f and the region over [a, x]. -->
    <path class="region" d={under(f, 0, x, sx, sy1, 200)} />
    <line class="axis" x1={sx(0)} y1={TOP} x2={sx(1)} y2={TOP} />
    <line class="guide" x1={sx(x)} y1={TOP} x2={sx(x)} y2={sy1(f(x))} />
    <polyline class="curve" points={graph(f, 0, 1, sx, sy1, 300)} />
    {#if x > 0.06}<text class="it" x={sx(0)} y={TOP + 20}>a</text>{/if}
    {#if x < 0.94}<text class="it" x={sx(1)} y={TOP + 20}>b</text>{/if}
    <text class="it" x={sx(x)} y={TOP + 20}>x</text>
    <text class="it" x={sx(1) + 22} y={sy1(f(1))}>f</text>
    {#if x > 0.16}
      <text class="accent" x={sx(x / 2)} y={sy1(0.14)}><tspan class="it">F</tspan>(<tspan class="it">x</tspan>)</text>
    {/if}

    <!-- Below: F and its tangent at x. -->
    <line class="axis" x1={sx(0)} y1={BOT} x2={sx(1)} y2={BOT} />
    <line class="guide" x1={sx(x)} y1={BOT} x2={sx(x)} y2={sy2(Fx)} />
    <polyline class="curve" points={graph(F, 0, 1, sx, sy2, 300)} />
    <line class="tangent" x1={sx(x - d)} y1={sy2(Fx - slope * d)} x2={sx(x + d)} y2={sy2(Fx + slope * d)} />
    <circle class="dot" cx={sx(x)} cy={sy2(Fx)} r="4.5" />
    {#if x > 0.06}<text class="it" x={sx(0)} y={BOT + 20}>a</text>{/if}
    {#if x < 0.94}<text class="it" x={sx(1)} y={BOT + 20}>b</text>{/if}
    <text class="it" x={sx(x)} y={BOT + 20}>x</text>
    <text class="it" x={sx(1) + 22} y={sy2(F(1))}>F</text>
    <text class="left muted" x={OX} y="18">slope of the tangent below: <tspan class="it">f</tspan>(<tspan class="it">x</tspan>) = <tspan class="accent">{fmt(slope, 3)}</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="x" min={0.02} max={0.98} step={0.01} bind:value={x} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .baby { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-accent); fill-opacity: 0.2; }
  .guide { stroke: var(--anim-muted); stroke-width: 1; stroke-dasharray: 3 3; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .tangent { stroke: var(--anim-accent); stroke-width: 2.4; }
  .dot { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
