<script>
  // Solution 1: the joint distribution of (X₃, X₄), P{X₃ = i, X₄ = j} = pᵢⱼ/3,
  // one cell per pair, darker for larger values.
  const P = [[0, 2 / 3, 1 / 3], [1 / 3, 0, 2 / 3], [2 / 3, 1 / 3, 0]];
  const label = (v) => ({ 0: '0', [2 / 9]: '2/9', [1 / 9]: '1/9' })[v] ?? v.toFixed(3);
  const X0 = 140, Y0 = 60, C = 90;
</script>

<figure class="anim joint-table">
  <svg viewBox="0 0 480 360" role="img" aria-label="A three by three table of the probabilities P(X3 = i, X4 = j) = p_ij / 3, each 0, 1/9 or 2/9">
    {#each P as row, i}
      <text class="head" x={X0 - 40} y={Y0 + i * C + C / 2}>i = {i + 1}</text>
      {#each row as p, j}
        <rect class="cell" x={X0 + j * C} y={Y0 + i * C} width={C} height={C} style:fill-opacity={0.06 + 1.6 * (p / 3)} />
        <text class="val" x={X0 + j * C + C / 2} y={Y0 + i * C + C / 2}>{label(p / 3)}</text>
      {/each}
    {/each}
    {#each [0, 1, 2] as j}
      <text class="head" x={X0 + j * C + C / 2} y={Y0 - 22}>j = {j + 1}</text>
    {/each}
  </svg>
</figure>

<style>
  .joint-table { margin: 1.5rem auto; max-width: 25rem; }
  svg { font-family: var(--anim-font); }
  .cell { fill: var(--anim-accent); stroke: var(--anim-rule); stroke-width: 1.2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .head { fill: var(--anim-muted); font-size: 17px; font-style: italic; }
</style>
