<script>
  // The two drawings of Example 8, an instance of each: a function f_0 of
  // L^1((0, ∞)) that is not 0 and vanishes outside [a, b], its zero parts
  // thick on the axis. With a = 2 and b = 3 the drawing of (2); with a = 0
  // and b = 1, and the dots of the lecture at the ends of the bump, that of (3).
  import { graph, head } from './plot.js';
  let { a = 2, b = 3, end = 4.4, dots = false } = $props();

  const OX = 80, OY = 170, UY = 95, RIGHT = 690;
  const ux = $derived((RIGHT - OX) / end);
  const sx = $derived((x) => OX + x * ux);
  const sy = (v) => OY - v * UY;
  // A wavy bump on [0, 1], 0 at both ends and positive inside.
  const shape = (t) => (t <= 0 || t >= 1 ? 0
    : Math.sin(Math.PI * t) ** 0.55 * (1 + 0.07 * Math.sin(7 * Math.PI * t + 0.5) + 0.04 * Math.sin(13 * Math.PI * t)));
  const f0 = $derived((x) => shape((x - a) / (b - a)));
  // The name goes above the right part of the bump.
  const at = $derived(a + 0.72 * (b - a));
  const ticks = $derived([a, b].filter((t) => t > 0));
  const label = $derived(`A function on the half line from 0, equal to 0 except on the interval from ${a} to ${b}, where it is a positive wavy bump; the parts where it is 0 are thick on the axis`);
</script>

<figure class="anim bump">
  <svg viewBox="0 0 760 220" role="img" aria-label={label}>
    <line class="axis" x1={OX - 50} y1={OY} x2={RIGHT + 20} y2={OY} />
    <polygon class="head" points={head(RIGHT + 30, OY, 1, 0)} />
    <line class="axis" x1={OX} y1={OY + 14} x2={OX} y2={sy(1.55)} />
    <polygon class="head" points={head(OX, sy(1.55) - 10, 0, -1)} />

    {#if a > 0}<line class="zero" x1={OX} y1={OY} x2={sx(a)} y2={OY} />{/if}
    <line class="zero" x1={sx(b)} y1={OY} x2={RIGHT + 8} y2={OY} />
    <polyline class="fn" points={graph(f0, a, b, sx, sy, 300)} />
    {#each ticks as t}
      <line class="tick" x1={sx(t)} y1={OY - 6} x2={sx(t)} y2={OY + 6} />
      <text x={sx(t)} y={OY + 26}>{t}</text>
    {/each}
    {#if dots}
      <circle class="pt" cx={sx(a)} cy={OY} r="4.5" />
      <circle class="pt" cx={sx(b)} cy={OY} r="4.5" />
    {/if}
    <text class="lab it" x={sx(at) + 30} y={sy(f0(at)) - 24}>f<tspan class="sub" dy="5">0</tspan></text>
  </svg>
</figure>

<style>
  .bump { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.2; }
  .head { fill: var(--anim-ink); }
  .zero { stroke: var(--anim-accent); stroke-width: 5; stroke-linecap: butt; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .pt { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .lab { fill: var(--anim-accent); }
  .sub { font-size: 13px; font-style: normal; }
</style>
