<script>
  // The drawing of the set S in the proof of Theorem 15.14, as in the lecture:
  // in the space X, a subspace D_R drawn as a plane, a parallelogram, and in
  // it the subspace V drawn as a line. The points are read off the lecture's
  // drawing.
  import { place } from './plot.js';

  const P = place(110, 100, 0.31, 150, 12);
  const plane = [[145, 620], [1250, 305], [1512, 733], [440, 1100]].map(P);
  const [v0, v1] = [P([305, 880]), P([1378, 514])];
  const vLabel = P([1470, 600]), dLabel = P([1495, 850]), xLabel = P([1370, 172]);
</script>

<figure class="anim domainr">
  <svg viewBox="0 0 760 340" role="img" aria-label="In the space X, a parallelogram labelled D R, drawn as a plane, and inside it a line labelled V">
    <polygon class="plane" points={plane.map((q) => q.join(',')).join(' ')} />
    <line class="line" x1={v0[0]} y1={v0[1]} x2={v1[0]} y2={v1[1]} />
    <text class="it" x={vLabel[0] + 8} y={vLabel[1]}>V</text>
    <text class="it acc" x={dLabel[0] + 8} y={dLabel[1]}>D<tspan class="sub it" dy="6">R</tspan></text>
    <text class="it big" x={xLabel[0]} y={xLabel[1]}>X</text>
  </svg>
</figure>

<style>
  .domainr { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .plane { fill: var(--anim-accent); fill-opacity: 0.08; stroke: var(--anim-accent); stroke-width: 2; stroke-linejoin: round; }
  .line { stroke: var(--anim-ink); stroke-width: 2.4; stroke-linecap: round; }
  text { fill: var(--anim-ink); font-size: 19px; text-anchor: middle; dominant-baseline: central; }
  .acc { fill: var(--anim-accent); }
  .it { font-style: italic; }
  .big { font-size: 20px; }
  .sub { font-size: 14px; }
</style>
