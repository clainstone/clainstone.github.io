<script>
  // The drawing of Remark 12 (ii), as in the lecture: the two axes, the graph
  // of f, made of a branch over the negative half-line, a branch over the
  // positive half-line and the dot at the origin, and the label "graph f" with
  // its three arrows. The points are read off the lecture's drawing.
  import { place, smooth, head } from './plot.js';

  const P = place(107, 60, 0.6, 128, 22);
  const left = [[107, 271], [200, 268], [265, 262], [320, 248], [365, 222], [400, 186], [428, 140], [447, 100], [457, 70]].map(P);
  const right = [[510, 478], [515, 440], [530, 400], [555, 370], [590, 345], [640, 328], [720, 317], [800, 315], [888, 322]].map(P);
  const O = P([485, 290]);
  const xEnd = P([950, 290]), yBottom = P([485, 482]), yEnd = P([485, 75]);
  const arrows = [[[645, 148], [560, 148]], [[665, 162], [603, 207]], [[708, 178], [652, 252]]].map(([a, b]) => [P(a), P(b)]);
</script>

<figure class="anim graph">
  <svg viewBox="0 0 760 290" role="img" aria-label="Two axes; over the negative half-line a branch that rises steeply near the vertical axis, over the positive half-line a branch that comes up from the bottom near the vertical axis and flattens below the horizontal axis, a dot at the origin, and the label graph f with arrows to the two branches and to the dot">
    <line class="axis" x1={P([107, 290])[0]} y1={O[1]} x2={xEnd[0] - 9} y2={O[1]} />
    <polygon class="head" points={head(xEnd[0], O[1], 1, 0)} />
    <line class="axis" x1={O[0]} y1={yBottom[1]} x2={O[0]} y2={yEnd[1] + 9} />
    <polygon class="head" points={head(O[0], yEnd[1], 0, -1)} />

    <path class="fn" d={smooth(left)} />
    <path class="fn" d={smooth(right)} />
    <circle class="dot" cx={O[0]} cy={O[1]} r="5" />

    <text class="start" x="470" y="58">graph <tspan class="it">f</tspan></text>
    {#each arrows as [a, b]}
      <line class="lead" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
      <polygon class="lead-head" points={head(b[0], b[1], b[0] - a[0], b[1] - a[1], 8)} />
    {/each}
  </svg>
</figure>

<style>
  .graph { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.2; }
  .head { fill: var(--anim-ink); }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }
  .dot { fill: var(--anim-accent); }
  .lead { stroke: var(--anim-ink); stroke-width: 1.3; }
  .lead-head { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; dominant-baseline: central; }
  .start { text-anchor: start; }
  .it { font-style: italic; }
</style>
