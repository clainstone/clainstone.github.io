<script>
  // Example 19: an instance of a symmetric set of integers, each pair {−k, k}
  // joined by an arc, and, with `complement`, its complement in ℤ, which is
  // symmetric too.
  let { complement = false } = $props();
  const M = 8;
  const A = new Set([-7, -4, -3, -1, 0, 1, 3, 4, 7]);
  const xs = Array.from({ length: 2 * M + 1 }, (_, i) => i - M);
  const px = (x) => 320 + x * 34;
  const rows = complement
    ? [{ name: 'A', has: (x) => A.has(x) }, { name: 'ℤ \\ A', has: (x) => !A.has(x) }]
    : [{ name: 'E', has: (x) => A.has(x) }];
  const arc = (k, y) => `M${px(-k)},${y + 8} Q${px(0)},${y + 16 + k * 9} ${px(k)},${y + 8}`;
  const H = rows.length * 120;
</script>

<figure class="anim symmetric">
  <svg viewBox="0 0 640 {H}" role="img" aria-label={complement ? 'A symmetric set A of integers and its complement, both with arcs joining opposite points' : 'A symmetric set E of integers, with arcs joining each point to its opposite'}>
    {#each rows as row, r}
      {@const y = 40 + r * 120}
      <line class="axis" x1={px(-M) - 18} y1={y} x2={px(M) + 18} y2={y} />
      <text class="dots" x={px(-M) - 34} y={y}>…</text>
      <text class="dots" x={px(M) + 34} y={y}>…</text>
      {#each xs as x}
        {#if x > 0 && row.has(x)}<path class="arc" d={arc(x, y)} />{/if}
        <circle class="pt" class:on={row.has(x)} cx={px(x)} cy={y} r={row.has(x) ? 6.5 : 3} />
      {/each}
      <text class="name" x="16" y={y - 22}>{#if row.name.length > 1}<tspan font-style="normal">{row.name.slice(0, -1)}</tspan>{row.name.slice(-1)}{:else}{row.name}{/if}</text>
      <text class="num" x={px(0)} y={y - 20}>0</text>
    {/each}
  </svg>
</figure>

<style>
  .symmetric { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-rule); stroke-width: 1.2; }
  .pt { fill: var(--anim-muted); }
  .pt.on { fill: var(--anim-accent); }
  .arc { fill: none; stroke: var(--anim-accent); stroke-width: 1.3; stroke-opacity: 0.7; }
  text { fill: var(--anim-ink); font-size: 17px; dominant-baseline: central; }
  .name { font-style: italic; text-anchor: start; }
  .dots, .num { fill: var(--anim-muted); text-anchor: middle; }
</style>
