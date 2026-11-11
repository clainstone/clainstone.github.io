<script>
  // The drawing of Lemma 15, as in the lecture: elements of S, some joined by
  // segments; a vertical row of them inside a closed curve, the family {x_α};
  // at its top a larger dot, the element x, with an arrow from its label; and
  // a branch of other elements at the left. The points are read off the
  // lecture's drawing.
  import { place, smooth } from './plot.js';

  const P = place(200, 60, 0.33, 180, 12);
  const chain = [[770, 165], [755, 278], [742, 400], [730, 522], [733, 628], [727, 750], [715, 858], [705, 950], [690, 1050]].map(P);
  const side = { s1: [575, 400], s2: [352, 522], s3: [355, 622], l1: [222, 712], l2: [353, 715], l3: [458, 692] };
  const S = Object.fromEntries(Object.entries(side).map(([k, v]) => [k, P(v)]));
  const edges = [[chain[3], S.s1], [S.s1, S.s2], [S.s2, S.s3], [S.s3, S.l1], [S.s3, S.l2], [S.s3, S.l3]];
  const loop = smooth([[735, 128], [800, 108], [860, 160], [885, 280], [885, 600], [875, 800], [840, 980], [780, 1120], [700, 1185], [630, 1175], [618, 1080], [630, 960], [655, 800], [680, 650], [680, 480], [700, 300]].map(P), true);
  const [aS, aC, aE] = [P([1285, 140]), P([1060, 10]), P([800, 148])];
  // The arrowhead points along the end tangent of the curve, from aC to aE.
  const t = [aE[0] - aC[0], aE[1] - aC[1]];
  const l = Math.hypot(t[0], t[1]);
  const [ux, uy] = [t[0] / l, t[1] / l];
  const tip = `${aE[0]},${aE[1]} ${aE[0] - 9 * ux - 3.8 * uy},${aE[1] - 9 * uy + 3.8 * ux} ${aE[0] - 9 * ux + 3.8 * uy},${aE[1] - 9 * uy - 3.8 * ux}`;
</script>

<figure class="anim zorn">
  <svg viewBox="0 0 760 396" role="img" aria-label="Points joined by segments: a vertical row of points enclosed by a closed curve and labelled x alpha, a larger point at the top of the row labelled x, and a branch of other points at the left">
    <path class="loop" d={loop} />
    {#each chain.slice(1) as q, i}
      <line class="edge" x1={chain[i][0]} y1={chain[i][1]} x2={q[0]} y2={q[1]} />
    {/each}
    {#each edges as [a, b]}
      <line class="edge" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
    {/each}
    {#each chain.slice(1) as q}
      <circle class="node" cx={q[0]} cy={q[1]} r="4.5" />
    {/each}
    {#each Object.values(S) as q}
      <circle class="node" cx={q[0]} cy={q[1]} r="4.5" />
    {/each}
    <circle class="top" cx={chain[0][0]} cy={chain[0][1]} r="7.5" />

    <text class="acc" x="446" y="58">&#123;<tspan class="it">x</tspan><tspan class="sub it" dy="5">α</tspan><tspan dy="-5">&#125;</tspan></text>
    <path class="arrow" d="M {aS[0]} {aS[1]} Q {aC[0]} {aC[1]} {aE[0]} {aE[1]}" />
    <polygon class="tip" points={tip} />
    <text class="it" x={aS[0] + 14} y={aS[1]}>x</text>
  </svg>
</figure>

<style>
  .zorn { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .loop { fill: var(--anim-accent); fill-opacity: 0.07; stroke: var(--anim-accent); stroke-width: 2; }
  .edge { stroke: var(--anim-ink); stroke-width: 1.4; }
  .node { fill: var(--anim-ink); }
  .top { fill: var(--anim-ink); }
  .arrow { fill: none; stroke: var(--anim-ink); stroke-width: 1.3; }
  .tip { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 19px; text-anchor: middle; dominant-baseline: central; }
  .acc { fill: var(--anim-accent); }
  .it { font-style: italic; }
  .sub { font-size: 14px; }
</style>
