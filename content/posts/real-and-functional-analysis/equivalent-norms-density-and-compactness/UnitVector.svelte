<script>
  // The drawing of Step 1 in the proof of Theorem 12.18, an instance in R^2 with
  // the Euclidean norm: the closed subspace M, the horizontal line through 0;
  // the dashed circle of the vectors of norm 1; and the vector v = (0, 1) on
  // it, with d(v, M) = 1.
  import { head } from './plot.js';

  const O = [380, 168], U = 92;
</script>

<figure class="anim unitvector">
  <svg viewBox="0 0 760 290" role="img" aria-label="A line M through the origin of the plane, the dashed circle of radius one around the origin, and a vector v on the circle, perpendicular to M">
    <line class="axis" x1={O[0]} y1={O[1] + 112} x2={O[0]} y2={O[1] - 140} />
    <polygon class="head" points={head(O[0], O[1] - 150, 0, -1)} />
    <circle class="sphere" cx={O[0]} cy={O[1]} r={U} />
    <line class="m" x1="90" y1={O[1]} x2="652" y2={O[1]} />
    <polygon class="mhead" points={head(670, O[1], 1, 0, 18)} />
    <text class="it big" x="694" y={O[1]}>M</text>
    <circle class="dot" cx={O[0]} cy={O[1] - U} r="5.5" />
    <text class="it" x={O[0] + 20} y={O[1] - U - 16}>v</text>
  </svg>
</figure>

<style>
  .unitvector { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.2; }
  .head { fill: var(--anim-ink); }
  .sphere { fill: none; stroke: var(--anim-ink); stroke-width: 1.6; stroke-dasharray: 7 6; }
  .m { stroke: var(--anim-accent); stroke-width: 5; }
  .mhead { fill: var(--anim-accent); }
  .dot { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .big { font-size: 20px; }
</style>
