<script>
  // The drawing of the proof of Theorem 14 at the step by contradiction, as in
  // the lecture: the subspace D_T drawn as a plane, a parallelogram seen at a
  // slant, and a point x_0 outside it, joined to a point of D_T by a segment.
  // The points are read off the lecture's drawing.
  import { place } from './plot.js';

  const P = place(300, 220, 0.62, 160, 20);
  const [tl, tr, br, bl] = [[318, 378], [828, 255], [865, 362], [395, 478]].map(P);
  const [cr, cl] = [P([858, 300]), P([325, 445])];
  const strip = `M ${tl} L ${tr} Q ${cr} ${br} L ${bl} Q ${cl} ${tl} Z`;
  const x0 = P([605, 262]), foot = P([572, 372]);
  const xLabel = P([652, 236]), dLabel = P([935, 420]);
</script>

<figure class="anim domaint">
  <svg viewBox="0 0 760 200" role="img" aria-label="A parallelogram seen at a slant, labelled D T, and above it a point x zero joined by a segment to a point inside the parallelogram">
    <path class="plane" d={strip} />
    <line class="seg" x1={foot[0]} y1={foot[1]} x2={x0[0]} y2={x0[1]} />
    <circle class="dot" cx={x0[0]} cy={x0[1]} r="5" />
    <text class="it acc" x={xLabel[0]} y={xLabel[1]}>x<tspan class="sub" dy="6">0</tspan></text>
    <text class="it" x={dLabel[0] + 6} y={dLabel[1]}>D<tspan class="sub it" dy="6">T</tspan></text>
  </svg>
</figure>

<style>
  .domaint { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .plane { fill: var(--anim-ink); fill-opacity: 0.05; stroke: var(--anim-ink); stroke-width: 1.8; stroke-linejoin: round; }
  .seg { stroke: var(--anim-accent); stroke-width: 2.2; stroke-linecap: round; }
  .dot { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 19px; text-anchor: middle; dominant-baseline: central; }
  .acc { fill: var(--anim-accent); }
  .it { font-style: italic; }
  .sub { font-size: 14px; font-style: normal; }
  .sub.it { font-style: italic; }
</style>
