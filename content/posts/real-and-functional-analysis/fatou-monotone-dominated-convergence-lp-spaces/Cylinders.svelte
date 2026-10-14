<script>
  // Proposition 8, the drawing of the proof: three pairwise disjoint sets
  // E₁, E₂, E₃ in a plane (ellipses seen in perspective) and, above each of
  // them at height 1, the graph of its characteristic function, joined to
  // the set by dashed lines; the first one is marked χ_{E₁}.
  const H = 92;
  const sets = [
    { name: '1', cx: 150, cy: 196, rx: 78, lx: 150, ly: 244 },
    { name: '2', cx: 340, cy: 168, rx: 62, lx: 340, ly: 208 },
    { name: '3', cx: 484, cy: 250, rx: 70, lx: 574, ly: 268 },
  ];
  const ry = (rx) => rx * 0.27;
</script>

<figure class="anim cylinders">
  <svg viewBox="0 0 640 300" role="img" aria-label="Three disjoint ellipses E1, E2, E3 in a plane seen in perspective; above each, at the same height, a copy of the ellipse joined to it by dashed vertical lines, the top of the first labelled chi of E1">
    {#each sets as e}
      <ellipse class="set" cx={e.cx} cy={e.cy} rx={e.rx} ry={ry(e.rx)} />
      <line class="wall" x1={e.cx - e.rx} y1={e.cy} x2={e.cx - e.rx} y2={e.cy - H} />
      <line class="wall" x1={e.cx + e.rx} y1={e.cy} x2={e.cx + e.rx} y2={e.cy - H} />
      <ellipse class="top" cx={e.cx} cy={e.cy - H} rx={e.rx} ry={ry(e.rx)} />
      <text class="it accent" x={e.lx} y={e.ly}>E<tspan class="sub n" dy="5">{e.name}</tspan></text>
    {/each}
    <text class="it" x={sets[0].cx + 34} y={sets[0].cy - H - ry(sets[0].rx) - 18}>χ<tspan class="sub" dy="6">E</tspan><tspan class="subsub" dy="4">1</tspan></text>
  </svg>
</figure>

<style>
  .cylinders { margin: 1.5rem auto; max-width: 31rem; }
  svg { font-family: var(--anim-font); }
  .set { fill: var(--anim-accent); fill-opacity: 0.14; stroke: var(--anim-accent); stroke-width: 2; }
  .top { fill: var(--anim-ink); fill-opacity: 0.06; stroke: var(--anim-ink); stroke-width: 1.8; }
  .wall { stroke: var(--anim-muted); stroke-width: 1.3; stroke-dasharray: 5 4; }
  text { fill: var(--anim-ink); font-size: 19px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 14px; }
  .subsub { font-size: 11px; font-style: normal; }
  .n { font-style: normal; }
  .accent { fill: var(--anim-accent); }
</style>
