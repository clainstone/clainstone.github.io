<script>
  // Theorem 4 (4), as in the drawing of the lecture: a set E, an open set A
  // that contains it and a compact set K contained in it. The arrows point
  // from A inwards and from K outwards, towards E.
  import { blob, blobPoint } from './shapes.js';

  const C = [240, 128];
  const E = { rx: 150, ry: 74 };
  const WA = [[0.05, 3, 0.4], [0.035, 5, 2.1], [0.02, 8, 0.9]];
  const A = blob(C[0], C[1], 200, 104, WA);
  const K = [[150, 146], [182, 96], [298, 96], [330, 124], [288, 172]];

  // An arrow of length `len` from p in the direction d (a unit vector).
  function arrow([x, y], [dx, dy], len = 26) {
    const [ex, ey] = [x + dx * len, y + dy * len];
    const [nx, ny] = [-dy, dx];
    const head = `${ex},${ey} ${ex - dx * 9 + nx * 5},${ey - dy * 9 + ny * 5} ${ex - dx * 9 - nx * 5},${ey - dy * 9 - ny * 5}`;
    return { line: [x, y, ex - dx * 6, ey - dy * 6], head };
  }
  const unit = ([x, y]) => { const n = Math.hypot(x, y); return [x / n, y / n]; };

  const inward = [0.6, 1.9, 3.4, 4.9].map((t) => {
    const p = blobPoint(C[0], C[1], 200, 104, WA, 1, t);
    return arrow(p, unit([C[0] - p[0], C[1] - p[1]]));
  });
  const outward = K.map((p, i) => {
    const q = K[(i + 1) % K.length];
    const mid = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    return arrow(mid, unit([q[1] - p[1], p[0] - q[0]]), 22);
  }).filter((_, i) => i !== 4);
</script>

<figure class="anim regularity">
  <svg viewBox="0 0 480 256" role="img" aria-label="A set E inside an open set A, with a compact set K inside E; arrows point from A and from K towards the boundary of E">
    <path class="open" d={A} />
    <ellipse class="set" cx={C[0]} cy={C[1]} rx={E.rx} ry={E.ry} />
    <polygon class="compact" points={K.map((p) => p.join(',')).join(' ')} />
    {#each inward as a}
      <line class="arrow open-arrow" x1={a.line[0]} y1={a.line[1]} x2={a.line[2]} y2={a.line[3]} />
      <polygon class="head open-head" points={a.head} />
    {/each}
    {#each outward as a}
      <line class="arrow compact-arrow" x1={a.line[0]} y1={a.line[1]} x2={a.line[2]} y2={a.line[3]} />
      <polygon class="head compact-head" points={a.head} />
    {/each}
    <text class="lab accent" x="452" y="60">A</text>
    <text class="lab" x="240" y="186">E</text>
    <text class="lab muted" x="240" y="134">K</text>
  </svg>
</figure>

<style>
  .regularity { margin: 1.5rem auto; max-width: 26rem; }
  svg { font-family: var(--anim-font); }
  .open { fill: var(--anim-accent); fill-opacity: 0.07; stroke: var(--anim-accent); stroke-width: 1.8; }
  .set { fill: none; stroke: var(--anim-ink); stroke-width: 1.8; }
  .compact { fill: var(--anim-muted); fill-opacity: 0.2; stroke: var(--anim-muted); stroke-width: 1.8; stroke-linejoin: round; }
  .arrow { stroke-width: 1.6; }
  .open-arrow { stroke: var(--anim-accent); }
  .open-head { fill: var(--anim-accent); }
  .compact-arrow { stroke: var(--anim-muted); }
  .compact-head { fill: var(--anim-muted); }
  text { fill: var(--anim-ink); font-size: 17px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
