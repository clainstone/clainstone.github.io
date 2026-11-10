<script>
  // The two drawings of (2) in Example 6: on the left the graph of e^{−x},
  // which starts at the point (0, 1), marked 1 on the vertical axis; on the
  // right the graph of 1 − e^{−x}, which starts at the origin. Both for x in
  // [0, 1], with the dots of the lecture's drawing.
  import { graph, head } from './plot.js';

  const UX = 220, UY = 160, OY = 210;
  const L = 90, R = 460;
  const sx = (o) => (x) => o + x * UX;
  const sy = (y) => OY - y * UY;
  const down = (x) => Math.exp(-x);
  const up = (x) => 1 - Math.exp(-x);
</script>

<figure class="anim exponentials">
  <svg viewBox="0 0 760 250" role="img" aria-label="On the left the graph of e to the minus x for x from 0 to 1, which starts at height 1 and decreases; on the right the graph of 1 minus e to the minus x for x from 0 to 1, which starts at the origin and increases">
    {#each [L, R] as o}
      <line class="axis" x1={o - 20} y1={OY} x2={o + 1.2 * UX} y2={OY} />
      <polygon class="head" points={head(o + 1.2 * UX + 10, OY, 1, 0)} />
      <line class="axis" x1={o} y1={OY + 20} x2={o} y2={sy(1.18)} />
      <polygon class="head" points={head(o, sy(1.18) - 10, 0, -1)} />
    {/each}

    <polyline class="fn" points={graph(down, 0, 1, sx(L), sy)} />
    <circle class="pt" cx={L} cy={sy(1)} r="4.5" />
    <text x={L - 18} y={sy(1)}>1</text>
    <text class="lab" x={sx(L)(0.45) + 8} y={sy(down(0.45)) - 30}>e<tspan class="sup" dy="-8">−<tspan class="it">x</tspan></tspan></text>

    <polyline class="fn" points={graph(up, 0, 1, sx(R), sy)} />
    <circle class="pt" cx={R} cy={OY} r="4.5" />
    <circle class="pt" cx={sx(R)(1)} cy={sy(up(1))} r="4.5" />
    <text class="lab end" x={sx(R)(1) - 12} y={sy(up(1)) - 34}>1 − e<tspan class="sup" dy="-8">−<tspan class="it">x</tspan></tspan></text>
  </svg>
</figure>

<style>
  .exponentials { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.2; }
  .head { fill: var(--anim-ink); }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .pt { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .lab { fill: var(--anim-accent); }
  .end { text-anchor: end; }
  .it { font-style: italic; }
  .sup { font-size: 13px; }
</style>
