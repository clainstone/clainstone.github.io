<script>
  // Section 4: on Ω = {1, 2, 3}, the σ-algebras {∅, {1}, {2, 3}, Ω} and
  // {∅, {2}, {1, 3}, Ω}, each drawn by its blocks, and their union, which
  // contains {1} and {2} but not {1, 2}.
  const P = { 1: [60, 38], 2: [22, 104], 3: [98, 104] }; // the points, as a triangle
  // A capsule around the points a and b (a disc when a = b).
  function capsule(a, b, r = 18) {
    const [x1, y1] = P[a], [x2, y2] = P[b];
    const len = Math.hypot(x2 - x1, y2 - y1), ang = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
    return { x: -r, y: -r, w: len + 2 * r, h: 2 * r, r, t: `translate(${x1},${y1}) rotate(${ang})` };
  }
  // The third panel: the sets {1} and {2} of the union, and the missing {1, 2}.
  const one = capsule(1, 1), two = capsule(2, 2), both = capsule(1, 2, 26);
  const panels = [
    { blocks: [[1, 1], [2, 3]], text: '{∅, {1}, {2, 3}, Ω}' },
    { blocks: [[2, 2], [1, 3]], text: '{∅, {2}, {1, 3}, Ω}' },
  ];
</script>

<figure class="anim union-fails">
  <svg viewBox="0 0 760 212" role="img" aria-label="Two sigma-algebras on the points 1, 2, 3 drawn by their blocks, and their union, which contains the sets 1 and 2 but not the set 1, 2">
    {#each panels as p, k}
      <g transform="translate({40 + k * 250}, 20)">
        {#each p.blocks as [a, b]}
          {@const c = capsule(a, b)}
          <rect class="block" x={c.x} y={c.y} width={c.w} height={c.h} rx={c.r} transform={c.t} />
        {/each}
        {#each [1, 2, 3] as i}<circle class="pt" cx={P[i][0]} cy={P[i][1]} r="4.5" /><text class="num" x={P[i][0] + (i === 1 ? 0 : i === 2 ? -30 : 30)} y={P[i][1] + (i === 1 ? -30 : 0)}>{i}</text>{/each}
      </g>
      <text x={100 + k * 250} y="186">{p.text}</text>
    {/each}
    <g transform="translate(540, 20)">
      <rect class="missing" x={both.x} y={both.y} width={both.w} height={both.h} rx={both.r} transform={both.t} />
      <rect class="block on" x={one.x} y={one.y} width={one.w} height={one.h} rx={one.r} transform={one.t} />
      <rect class="block on" x={two.x} y={two.y} width={two.w} height={two.h} rx={two.r} transform={two.t} />
      {#each [1, 2, 3] as i}<circle class="pt" cx={P[i][0]} cy={P[i][1]} r="4.5" /><text class="num" x={P[i][0] + (i === 1 ? 0 : i === 2 ? -36 : 30)} y={P[i][1] + (i === 1 ? -32 : 0)}>{i}</text>{/each}
    </g>
    <text x="600" y="176">the union has {'{1}'} and {'{2}'},</text>
    <text x="600" y="200">not {'{1, 2}'} (dashed)</text>
  </svg>
</figure>

<style>
  .union-fails { margin: 1.5rem auto; max-width: 40rem; }
  svg { font-family: var(--anim-font); }
  .block { fill: none; stroke: var(--anim-ink); stroke-width: 1.3; }
  .block.on { fill: var(--anim-accent); fill-opacity: 0.3; stroke: var(--anim-accent); }
  .missing { fill: none; stroke: var(--anim-accent); stroke-width: 1.6; stroke-dasharray: 5 5; }
  .pt { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
