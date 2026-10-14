<script>
  // Proposition 5, the drawing of the proof: a set Dᵢ (a triangle) and three
  // pairwise disjoint sets E₁, E₂, E₃ (circles), with the pieces Dᵢ ∩ Eₘ shaded.
  const uid = $props.id();
  const tri = [[260, 90], [150, 270], [370, 270]];
  const triPath = `M${tri.map((p) => p.join(',')).join(' L')} Z`;
  const sets = [
    { name: '1', cx: 276, cy: 98, lx: 342, ly: 56 },
    { name: '2', cx: 372, cy: 262, lx: 444, ly: 300 },
    { name: '3', cx: 150, cy: 268, lx: 78, ly: 304 },
  ];
  const R = 48;
</script>

<figure class="anim pieces">
  <svg viewBox="0 0 520 330" role="img" aria-label="A triangle D sub i and three disjoint circles E1, E2, E3, each covering one corner of the triangle; the parts of the circles inside the triangle are shaded">
    <defs>
      <clipPath id="{uid}-d"><path d={triPath} /></clipPath>
    </defs>
    <g clip-path="url(#{uid}-d)">
      {#each sets as e}
        <circle class="piece" cx={e.cx} cy={e.cy} r={R} />
      {/each}
    </g>
    <path class="tri" d={triPath} />
    {#each sets as e}
      <circle class="set" cx={e.cx} cy={e.cy} r={R} />
      <text class="lab" x={e.lx} y={e.ly}>E<tspan class="sub n" dy="5">{e.name}</tspan></text>
    {/each}
    <text class="lab accent" x="260" y="212">D<tspan class="sub" dy="5">i</tspan></text>
  </svg>
</figure>

<style>
  .pieces { margin: 1.5rem auto; max-width: 26rem; }
  svg { font-family: var(--anim-font); }
  .tri { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; stroke-linejoin: round; }
  .set { fill: none; stroke: var(--anim-ink); stroke-width: 1.8; }
  .piece { fill: var(--anim-accent); fill-opacity: 0.3; }
  text { fill: var(--anim-ink); font-size: 18px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .sub { font-size: 13px; }
  .n { font-style: normal; }
  .accent { fill: var(--anim-accent); }
</style>
