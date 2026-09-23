<script>
  // Example 8: the graph of vₘ for the m set by the slider and, thinner, the
  // graph of vₘ₋₁, from v₀(x) = x and the recursion of the lecture. For m ≥ 2
  // the dashed lines mark x = 7/9 and x = 8/9, as in the drawing of v₂.
  import Slider from '@toolkit/Slider.svelte';

  const MMAX = 7;
  const OX = 70, OY = 330, UX = 420, UY = 280;
  const sx = (x) => OX + x * UX;
  const sy = (y) => OY - y * UY;

  function v(m, x) {
    if (m === 0) return x;
    if (x <= 1 / 3) return 0.5 * v(m - 1, 3 * x);
    if (x < 2 / 3) return 0.5;
    return 0.5 + 0.5 * v(m - 1, 3 * x - 2);
  }
  // vₘ is linear between consecutive multiples of 3^(−m).
  function graph(m) {
    const n = 3 ** Math.max(m, 1);
    return Array.from({ length: n + 1 }, (_, j) => `${sx(j / n).toFixed(1)},${sy(v(m, j / n)).toFixed(1)}`).join(' ');
  }
  const graphs = Array.from({ length: MMAX + 1 }, (_, m) => graph(m));
  const coarse = [[1 / 3, '1/3'], [2 / 3, '2/3'], [1, '1']];
  const fine = [[1 / 9, '1/9'], [2 / 9, '2/9'], [7 / 9, '7/9'], [8 / 9, '8/9']];

  let m = $state(2);
</script>

<figure class="anim cantor-function">
  <svg viewBox="0 0 540 380" role="img" aria-label="The graph of v_m on the unit interval, rising from 0 to 1, and, for m at least 1, the thinner graph of v_(m-1)">
    <line class="axis" x1={OX} y1={OY} x2={sx(1) + 24} y2={OY} />
    <line class="axis" x1={OX} y1={OY} x2={OX} y2={sy(1) - 24} />
    {#each [...coarse, ...(m >= 2 ? fine : [])] as [x, label]}
      <line class="tick" x1={sx(x)} y1={OY - 5} x2={sx(x)} y2={OY + 5} />
      <text class="num" x={sx(x)} y={OY + 22}>{label}</text>
    {/each}
    {#each [[0.5, '1/2'], [1, '1']] as [y, label]}
      <line class="tick" x1={OX - 5} y1={sy(y)} x2={OX + 5} y2={sy(y)} />
      <text class="num" x={OX - 26} y={sy(y)}>{label}</text>
    {/each}
    <text class="num" x={OX - 14} y={OY + 16}>0</text>
    {#if m >= 2}
      {#each [7 / 9, 8 / 9] as x}
        <line class="guide" x1={sx(x)} y1={sy(0.75)} x2={sx(x)} y2={OY} />
      {/each}
    {/if}
    {#if m >= 1}
      <polyline class="previous" points={graphs[m - 1]} />
    {/if}
    <polyline class="curve" points={graphs[m]} />
    <text class="lab" x={sx(0.5)} y={sy(0.5) - 20}>v<tspan dy="5" font-size="12">m</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="m" min={0} max={MMAX} step={1} bind:value={m} />
    </div>
  </div>
</figure>

<style>
  .cantor-function { margin: 1.5rem auto; max-width: 28rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.2; }
  .guide { stroke: var(--anim-muted); stroke-width: 1.2; stroke-dasharray: 5 4; }
  .previous { fill: none; stroke: var(--anim-muted); stroke-width: 1.2; stroke-linejoin: round; }
  .curve { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
