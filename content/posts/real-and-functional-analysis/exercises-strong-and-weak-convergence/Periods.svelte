<script>
  // The drawing of the proof of Remark 18.6 (i): the points 2πk, m and
  // 2π(k + 1) of the real line, in this order, as the lecture draws them.
  import { head } from './plot.js';

  const Y = 62, X0 = 70, X1 = 620;
  const K0 = 270, M = 345, K1 = 500;
</script>

<figure class="anim periods">
  <svg viewBox="0 0 680 92" role="img" aria-label="The real line with three marked points in this order: 2 pi k, then m, then 2 pi times k plus 1">
    <line class="axis" x1={X0} y1={Y} x2={X1} y2={Y} />
    <polygon class="head" points={head(X1 + 10, Y, 1, 0)} />
    {#each [K0, M, K1] as x}
      <line class="tick" x1={x} y1={Y - 9} x2={x} y2={Y + 9} />
    {/each}
    <text x={K0} y={Y - 30}>2<tspan class="it">πk</tspan></text>
    <text class="it" x={M} y={Y - 30}>m</text>
    <text x={K1} y={Y - 30}>2<tspan class="it">π</tspan>(<tspan class="it">k</tspan> + 1)</text>
  </svg>
</figure>

<style>
  .periods { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.4; }
  .head { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
</style>
