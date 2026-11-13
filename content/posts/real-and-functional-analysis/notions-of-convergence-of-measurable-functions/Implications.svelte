<script>
  // Remark 7.3, the drawing of the lecture: five notions of convergence of f_n
  // to f, a double arrow for each implication and a crossed double arrow for
  // each implication that does not hold. Uniformly ⇒ pointwise ⇒ almost
  // everywhere, uniformly ⇒ in L^∞, in L^∞ ⇒ almost everywhere (the long
  // arrow), in L^∞ ⇒ in measure; the converses of the first three are crossed.
  const uid = $props.id();

  const nodes = [
    { x: 120, y: 50, label: 'uniformly' },
    { x: 360, y: 50, label: 'pointwise' },
    { x: 590, y: 50, label: 'almost everywhere' },
    { x: 120, y: 175, label: 'in L∞', sup: '∞' },
    { x: 120, y: 300, label: 'in measure' },
  ];

  // A double arrow from (x1, y1) to (x2, y2): two parallel strokes and a chevron.
  function dbl(x1, y1, x2, y2) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const dx = (x2 - x1) / len, dy = (y2 - y1) / len;
    const nx = -dy * 3.2, ny = dx * 3.2;
    const ex = x2 - dx * 6, ey = y2 - dy * 6;
    return {
      a: [x1 + nx, y1 + ny, ex + nx, ey + ny],
      b: [x1 - nx, y1 - ny, ex - nx, ey - ny],
      head: `${x2 - dx * 11 - dy * 9},${y2 - dy * 11 + dx * 9} ${x2},${y2} ${x2 - dx * 11 + dy * 9},${y2 - dy * 11 - dx * 9}`,
    };
  }
  const yes = [dbl(185, 42, 290, 42), dbl(425, 42, 500, 42), dbl(106, 92, 106, 150), dbl(120, 222, 120, 278)];
  const no = [dbl(290, 64, 185, 64), dbl(500, 64, 425, 64), dbl(140, 150, 140, 92)];
  const crosses = [[237, 64], [462, 64], [140, 121]];

  // The long arrow from "in L^∞" to "almost everywhere": a horizontal stretch,
  // a quarter circle of radius 40 and a vertical stretch, drawn twice.
  const inner = 'M178,172 H550 A37,37 0 0 0 587,135 V100';
  const outer = 'M178,178 H550 A43,43 0 0 0 593,135 V100';
  const longHead = '581,103 590,92 599,103';
</script>

<figure class="anim implications">
  <svg viewBox="0 0 690 340" role="img" aria-label="Five notions of convergence of f n to f joined by double arrows: uniformly implies pointwise, which implies almost everywhere; uniformly implies in L infinity, which implies almost everywhere and in measure; the converse arrows of the first three implications are crossed">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    {#each nodes as node}
      <text class="end it" x={node.x - 13} y={node.y}>f<tspan class="sub" dy="5">n</tspan></text>
      <line class="small" x1={node.x - 8} y1={node.y} x2={node.x + 11} y2={node.y} marker-end="url(#{uid}-head)" />
      <text class="start it" x={node.x + 17} y={node.y}>f</text>
      {#if node.sup}
        <text x={node.x} y={node.y + 30}>in <tspan class="it">L</tspan><tspan class="sup" dy="-7">{node.sup}</tspan></text>
      {:else}
        <text x={node.x} y={node.y + 30}>{node.label}</text>
      {/if}
    {/each}
    {#each [...yes, ...no] as arrow}
      <line class="stroke" x1={arrow.a[0]} y1={arrow.a[1]} x2={arrow.a[2]} y2={arrow.a[3]} />
      <line class="stroke" x1={arrow.b[0]} y1={arrow.b[1]} x2={arrow.b[2]} y2={arrow.b[3]} />
      <polyline class="stroke" points={arrow.head} />
    {/each}
    {#each crosses as [cx, cy]}
      <line class="cross" x1={cx - 8} y1={cy - 9} x2={cx + 8} y2={cy + 9} />
      <line class="cross" x1={cx - 8} y1={cy + 9} x2={cx + 8} y2={cy - 9} />
    {/each}
    <path class="stroke" d={inner} />
    <path class="stroke" d={outer} />
    <polyline class="stroke" points={longHead} />
  </svg>
</figure>

<style>
  .implications { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .stroke { fill: none; stroke: var(--anim-ink); stroke-width: 1.6; stroke-linejoin: round; stroke-linecap: round; }
  .cross { stroke: var(--anim-accent); stroke-width: 2.2; stroke-linecap: round; }
  .small { stroke: var(--anim-ink); stroke-width: 1.4; }
  .headfill { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .end { text-anchor: end; }
  .start { text-anchor: start; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .sup { font-size: 13px; }
</style>
