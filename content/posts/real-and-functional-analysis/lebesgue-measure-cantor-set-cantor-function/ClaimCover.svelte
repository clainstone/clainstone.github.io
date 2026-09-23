<script>
  // The proof of the claim in Theorem 4 (3), an instance with N = 2 as in the
  // drawing of the lecture: a set Z covered by three rectangles R₁, R₂, R₃ of
  // a sequence (Rₘ), and the rectangle R.
  const cover = [
    { x: 40, y: 76, w: 125, h: 228, name: '1', lx: 20, ly: 190 },
    { x: 129, y: 24, w: 171, h: 156, name: '2', lx: 112, ly: 16 },
    { x: 126, y: 118, w: 204, h: 233, name: '3', lx: 350, ly: 336 },
  ];
  const R = { x: 212, y: 52, w: 270, h: 149 };
  const P = [[69, 250], [88, 190], [128, 135], [185, 92], [238, 72], [270, 92], [284, 128], [304, 160], [296, 196], [252, 238], [205, 262], [150, 272], [100, 270]];

  // A closed Catmull–Rom curve through P, as cubic Bézier segments.
  function smooth(pts, t = 0.18) {
    const n = pts.length;
    let d = `M${pts[0].join(',')}`;
    for (let i = 0; i < n; i++) {
      const [p0, p1, p2, p3] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
      const c1 = [p1[0] + (p2[0] - p0[0]) * t, p1[1] + (p2[1] - p0[1]) * t];
      const c2 = [p2[0] - (p3[0] - p1[0]) * t, p2[1] - (p3[1] - p1[1]) * t];
      d += ` C${c1.map((v) => v.toFixed(1)).join(',')} ${c2.map((v) => v.toFixed(1)).join(',')} ${p2.join(',')}`;
    }
    return `${d}Z`;
  }
  const Z = smooth(P);
</script>

<figure class="anim claim-cover">
  <svg viewBox="0 0 520 380" role="img" aria-label="A set Z covered by three overlapping rectangles R1, R2 and R3, and a rectangle R that meets Z">
    {#each cover as c}
      <rect class="cover" x={c.x} y={c.y} width={c.w} height={c.h} />
    {/each}
    <path class="set" d={Z} />
    <rect class="rect" x={R.x} y={R.y} width={R.w} height={R.h} />
    {#each cover as c}
      <text class="lab muted" x={c.lx} y={c.ly}>R<tspan dy="5" font-size="13" font-style="normal">{c.name}</tspan></text>
    {/each}
    <text class="lab" x="452" y="80">R</text>
    <text class="lab accent" x="178" y="196">Z</text>
  </svg>
</figure>

<style>
  .claim-cover { margin: 1.5rem auto; max-width: 26rem; }
  svg { font-family: var(--anim-font); }
  .cover { fill: var(--anim-muted); fill-opacity: 0.06; stroke: var(--anim-muted); stroke-width: 1.5; }
  .set { fill: var(--anim-accent); fill-opacity: 0.18; stroke: var(--anim-accent); stroke-width: 2; }
  .rect { fill: none; stroke: var(--anim-ink); stroke-width: 2; }
  text { fill: var(--anim-ink); font-size: 18px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
