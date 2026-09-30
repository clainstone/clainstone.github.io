<script>
  // Section 8, an instance with I of 4 points and J of 5 points. Left, a
  // rectangle A × B, the cells (i, j) with i in A and j in B; right, a subset of
  // I × J as the union of its singletons {i} × {j}.
  const C = 40, ROWS = 4, COLS = 5;
  const A = [0, 2], B = [1, 2, 4];
  const S = [[0, 0], [1, 1], [1, 2], [2, 4], [3, 0], [3, 3]];
  const inRect = (i, j) => A.includes(i) && B.includes(j);
  const inS = (i, j) => S.some(([a, b]) => a === i && b === j);
  const grids = [{ x0: 80, on: inRect, gap: 0 }, { x0: 470, on: inS, gap: 3 }];
</script>

<figure class="anim product">
  <svg viewBox="0 0 760 262" role="img" aria-label="Two grids of 4 rows and 5 columns: a rectangle A times B, and a subset written as a union of single cells">
    {#each grids as g, k}
      {#each Array(ROWS) as _, i}
        <text class="lab" class:hot={k === 0 && A.includes(i)} x={g.x0 - 20} y={40 + i * C + C / 2}>{i + 1}</text>
        {#each Array(COLS) as _, j}
          <rect class="cell" class:on={g.on(i, j)} x={g.x0 + j * C + g.gap * (g.on(i, j) ? 1 : 0)} y={40 + i * C + g.gap * (g.on(i, j) ? 1 : 0)} width={C - 2 * g.gap * (g.on(i, j) ? 1 : 0)} height={C - 2 * g.gap * (g.on(i, j) ? 1 : 0)} />
        {/each}
      {/each}
      {#each Array(COLS) as _, j}
        <text class="lab" class:hot={k === 0 && B.includes(j)} x={g.x0 + j * C + C / 2} y="24">{j + 1}</text>
      {/each}
      <text class="axis it" x={g.x0 - 50} y={40 + 2 * C}>I</text>
      <text class="axis it" x={g.x0 + COLS * C + 22} y="24">J</text>
    {/each}
    <text x={80 + 2.5 * C} y="226"><tspan class="it">A</tspan> × <tspan class="it">B</tspan>, <tspan class="it">A</tspan> = {'{'}1, 3{'}'}, <tspan class="it">B</tspan> = {'{'}2, 3, 5{'}'}</text>
    <text x={470 + 2.5 * C} y="226">a union of singletons {'{'}<tspan class="it">i</tspan>{'}'} × {'{'}<tspan class="it">j</tspan>{'}'}</text>
  </svg>
</figure>

<style>
  .product { margin: 1.5rem auto; max-width: 40rem; }
  svg { font-family: var(--anim-font); overflow: visible; }
  .cell { fill: none; stroke: var(--anim-rule); stroke-width: 1; }
  .cell.on { fill: var(--anim-accent); fill-opacity: 0.35; stroke: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { fill: var(--anim-muted); font-size: 16px; }
  .lab.hot { fill: var(--anim-accent); font-weight: 600; }
  .axis { fill: var(--anim-muted); }
  .it { font-style: italic; }
</style>
