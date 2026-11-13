<script>
  // The drawing of Corollary 16.6, as in the lecture: the kernel of T drawn as a
  // plane, a parallelogram seen at a slant, the closed subspace V drawn as a
  // line through 0 inside it, and the point x_0 above the plane, outside it.
  // The points are read off the lecture's drawing.
  import { place } from './plot.js';

  const P = place(37, 1270, 0.58, 30, 25);
  const plane = [[37, 1508], [880, 1330], [1240, 1505], [290, 1698]].map(P);
  // The line of the drawing, from (130, 1603) to (1048, 1402), is cut where it
  // meets the edges of the plane, so that V stays inside Ker T.
  const [v0, v1] = [P([156, 1597]), P([1034, 1405])];
  const origin = P([625, 1495]), x0 = P([438, 1312]);
  const oLabel = P([612, 1530]), vLabel = P([1090, 1385]), xLabel = P([422, 1280]), kLabel = P([1180, 1560]);
</script>

<figure class="anim kernel">
  <svg viewBox="0 0 760 290" role="img" aria-label="A parallelogram seen at a slant, labelled Ker T, a line labelled V inside it through a point labelled 0, and above the parallelogram a point labelled x zero">
    <polygon class="plane" points={plane.map((q) => q.join(',')).join(' ')} />
    <line class="line" x1={v0[0]} y1={v0[1]} x2={v1[0]} y2={v1[1]} />
    <circle class="dot" cx={origin[0]} cy={origin[1]} r="4.5" />
    <circle class="dot" cx={x0[0]} cy={x0[1]} r="5" />
    <text class="acc" x={oLabel[0]} y={oLabel[1]}>0</text>
    <text class="it acc" x={vLabel[0]} y={vLabel[1]}>V</text>
    <text class="it acc" x={xLabel[0]} y={xLabel[1]}>x<tspan class="sub" dy="6">0</tspan></text>
    <text x={kLabel[0]} y={kLabel[1]}>Ker <tspan class="it">T</tspan></text>
  </svg>
</figure>

<style>
  .kernel { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .plane { fill: var(--anim-ink); fill-opacity: 0.05; stroke: var(--anim-ink); stroke-width: 1.8; stroke-linejoin: round; }
  .line { stroke: var(--anim-accent); stroke-width: 2.6; stroke-linecap: round; }
  .dot { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 19px; text-anchor: middle; dominant-baseline: central; }
  .acc { fill: var(--anim-accent); }
  .it { font-style: italic; }
  .sub { font-size: 14px; font-style: normal; }
</style>
