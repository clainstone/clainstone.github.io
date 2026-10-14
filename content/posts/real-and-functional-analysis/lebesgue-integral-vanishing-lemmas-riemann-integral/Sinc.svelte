<script>
  // Example 18. Above: (sin x)/x on [π, (N+1)π], with the regions above and
  // below the axis. Below: |sin x|/x and, under it on each [mπ, (m+1)π) with
  // 1 ≤ m ≤ N, the function |sin x|/((m+1)π) of the proof of (ii), its
  // integral 2/(π(m+1)) shaded. Beyond (N+1)π the graphs are faint. The
  // slider sets N.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under } from './plot.js';

  const PI = Math.PI;
  const X0 = 60, X1 = 640, TOP = 108, BOT = 330, UT = 320, UB = 420;
  const sx = (x) => X0 + ((x - PI) / (10 * PI)) * (X1 - X0);
  const syT = (v) => TOP - v * UT;
  const syB = (v) => BOT - v * UB;
  const sinc = (x) => Math.sin(x) / x;
  const abs = (x) => Math.abs(Math.sin(x)) / x;
  const ticks = Array.from({ length: 11 }, (_, k) => k + 1);

  let N = $state(3);
  const end = $derived((N + 1) * PI);
  const humps = $derived(Array.from({ length: N }, (_, k) => k + 1).map((m) => ({
    m,
    sign: Math.sin((m + 0.5) * PI) > 0,
    top: under(sinc, m * PI, (m + 1) * PI, sx, syT, 80),
    bound: under((x) => Math.abs(Math.sin(x)) / ((m + 1) * PI), m * PI, (m + 1) * PI, sx, syB, 80),
    line: graph((x) => Math.abs(Math.sin(x)) / ((m + 1) * PI), m * PI, (m + 1) * PI, sx, syB, 80),
  })));
</script>

<figure class="anim sinc">
  <svg viewBox="0 0 690 372" role="img" aria-label="Above, the oscillating function sine of x over x from pi to N plus 1 times pi with its regions above and below the axis. Below, its absolute value and, under each arch, the arch of absolute sine divided by m plus 1 times pi, shaded">
    {#each humps as h}
      <path class={h.sign ? 'pos' : 'neg'} d={h.top} />
      <path class="bound" d={h.bound} />
      <polyline class="bound-line" points={h.line} />
    {/each}
    <polyline class="faint" points={graph(sinc, end, 11 * PI, sx, syT, 300)} />
    <polyline class="curve" points={graph(sinc, PI, end, sx, syT, 60 * N)} />
    <polyline class="faint" points={graph(abs, end, 11 * PI, sx, syB, 300)} />
    <polyline class="curve" points={graph(abs, PI, end, sx, syB, 60 * N)} />
    <line class="axis" x1={X0} y1={TOP} x2={X1 + 16} y2={TOP} />
    <line class="axis" x1={X0} y1={BOT} x2={X1 + 16} y2={BOT} />
    <line class="mark" x1={sx(end)} y1={TOP - 52} x2={sx(end)} y2={BOT + 8} />
    {#each ticks as k}
      <line class="tick" x1={sx(k * PI)} y1={TOP - 4} x2={sx(k * PI)} y2={TOP + 4} />
      <line class="tick" x1={sx(k * PI)} y1={BOT - 4} x2={sx(k * PI)} y2={BOT + 4} />
      <text class="num" x={sx(k * PI)} y={BOT + 22}>{k === 1 ? 'π' : `${k}π`}</text>
    {/each}
    <text class="lab" x="104" y="34">sin <tspan class="it">x</tspan> / <tspan class="it">x</tspan></text>
    <text class="lab" x="108" y="206">|sin <tspan class="it">x</tspan>| / <tspan class="it">x</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="N" min={1} max={10} step={1} bind:value={N} />
    </div>
  </div>
</figure>

<style>
  .sinc { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2; stroke-linejoin: round; }
  .faint { fill: none; stroke: var(--anim-rule); stroke-width: 1.6; }
  .pos { fill: var(--anim-accent); fill-opacity: 0.25; }
  .neg { fill: var(--anim-muted); fill-opacity: 0.25; }
  .bound { fill: var(--anim-accent); fill-opacity: 0.28; }
  .bound-line { fill: none; stroke: var(--anim-accent); stroke-width: 1.6; }
  .mark { stroke: var(--anim-muted); stroke-width: 1; stroke-dasharray: 5 5; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
