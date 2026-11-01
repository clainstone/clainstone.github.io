<script>
  // Proof of Theorem 14, from (1) to (2), an instance: above, the graph of f
  // and, over three disjoint intervals (a_i, b_i), the increments
  // |f(b_i) − f(a_i)| as vertical segments at b_i; below, the graph of |f′| and
  // the regions under it over the same intervals, whose total area bounds the
  // sum of the increments.
  import { graph, under } from './plot.js';

  const OX = 50, UX = 590;
  const sx = (t) => OX + t * UX;
  const TOP = 196, UY1 = 190;
  const BOT = 408, UY2 = 44;
  const sy1 = (v) => TOP - v * UY1;
  const sy2 = (v) => BOT - v * UY2;
  const f = (t) => 0.5 + 0.28 * Math.sin(2 * Math.PI * t) + 0.08 * Math.sin(6 * Math.PI * t);
  const df = (t) => 0.28 * 2 * Math.PI * Math.cos(2 * Math.PI * t) + 0.08 * 6 * Math.PI * Math.cos(6 * Math.PI * t);
  const adf = (t) => Math.abs(df(t));
  const spans = [[0.03, 0.12], [0.42, 0.55], [0.8, 0.92]];
</script>

<figure class="anim increments">
  <svg viewBox="0 0 690 440" role="img" aria-label="Above, the graph of a function f with vertical segments showing its increments over three disjoint intervals; below, the graph of the absolute value of its derivative with the regions under it over the same three intervals shaded">
    <!-- Above: f and the increments. -->
    <line class="axis" x1={sx(0)} y1={TOP} x2={sx(1)} y2={TOP} />
    {#each spans as [a, b]}
      <line class="set" x1={sx(a)} y1={TOP} x2={sx(b)} y2={TOP} />
      <line class="guide" x1={sx(a)} y1={sy1(f(a))} x2={sx(b)} y2={sy1(f(a))} />
    {/each}
    <polyline class="curve" points={graph(f, 0, 1, sx, sy1, 300)} />
    {#each spans as [a, b]}
      <line class="bar" x1={sx(b)} y1={sy1(f(a))} x2={sx(b)} y2={sy1(f(b))} />
      <circle class="dot" cx={sx(a)} cy={sy1(f(a))} r="4" />
      <circle class="dot" cx={sx(b)} cy={sy1(f(b))} r="4" />
    {/each}
    <text class="it" x={sx(0.25)} y={sy1(f(0.25)) - 22}>f</text>
    <text class="it muted" x={sx(0)} y={TOP + 20}>a</text>
    <text class="it muted" x={sx(1)} y={TOP + 20}>b</text>

    <!-- Below: |f′| and the regions over the same intervals. -->
    {#each spans as [a, b]}
      <path class="region" d={under(adf, a, b, sx, sy2, 80)} />
      <line class="set" x1={sx(a)} y1={BOT} x2={sx(b)} y2={BOT} />
    {/each}
    <line class="axis" x1={sx(0)} y1={BOT} x2={sx(1)} y2={BOT} />
    <polyline class="curve" points={graph(adf, 0, 1, sx, sy2, 400)} />
    <text class="muted" x={sx(0.97) - 4} y={sy2(adf(0.97)) - 22}>|<tspan class="it">f</tspan>′|</text>
    <text class="it muted" x={sx(0)} y={BOT + 20}>a</text>
    <text class="it muted" x={sx(1)} y={BOT + 20}>b</text>
  </svg>
</figure>

<style>
  .increments { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .set { stroke: var(--anim-accent); stroke-width: 5; }
  .guide { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 4 3; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .bar { stroke: var(--anim-accent); stroke-width: 3; }
  .dot { fill: var(--anim-ink); }
  .region { fill: var(--anim-accent); fill-opacity: 0.25; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .muted { fill: var(--anim-muted); }
</style>
