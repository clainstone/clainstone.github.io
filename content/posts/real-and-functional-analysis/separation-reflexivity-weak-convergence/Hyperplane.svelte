<script>
  // The drawing of Corollary 16.5, as in the lecture: the hyperplane H = {T = α}
  // with α = Tx, drawn as a line, the point x on it and the point y outside
  // it. The points are read off the lecture's drawing.
  import { place } from './plot.js';

  const P = place(908, 1808, 1.25, 95, 25);
  const [h0, h1] = [P([908, 1962]), P([1365, 1858])];
  const x = P([1197, 1897]), y = P([1083, 1823]);
  const hLabel = P([1300, 1846]), xLabel = P([1205, 1922]), yLabel = P([1062, 1818]);
</script>

<figure class="anim hyperplane">
  <svg viewBox="0 0 760 240" role="img" aria-label="A line labelled H, a point x on the line and a point y above the line, to the left of x">
    <line class="line" x1={h0[0]} y1={h0[1]} x2={h1[0]} y2={h1[1]} />
    <circle class="dot" cx={x[0]} cy={x[1]} r="5" />
    <circle class="dot" cx={y[0]} cy={y[1]} r="5" />
    <text class="it acc" x={hLabel[0]} y={hLabel[1]}>H</text>
    <text class="it" x={xLabel[0]} y={xLabel[1]}>x</text>
    <text class="it" x={yLabel[0]} y={yLabel[1]}>y</text>
  </svg>
</figure>

<style>
  .hyperplane { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .line { stroke: var(--anim-accent); stroke-width: 2.6; stroke-linecap: round; }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 19px; text-anchor: middle; dominant-baseline: central; }
  .acc { fill: var(--anim-accent); }
  .it { font-style: italic; }
</style>
