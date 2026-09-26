<script>
  // An instance with d = 3: the numbers n!/(k₁! k₂! k₃!) over the triples with
  // k₁ + k₂ + k₃ = n, one hexagon each, darker for larger values; the largest
  // are outlined. The slider sets n.
  import Slider from '@toolkit/Slider.svelte';
  import { multinomial3 } from './walks.js';

  const CX = 320, TOP = 34, SIDE = 300;
  let n = $state(9);
  const cells = $derived.by(() => {
    const out = [];
    for (let a = 0; a <= n; a++) for (let b = 0; a + b <= n; b++) out.push({ a, b, c: n - a - b, v: multinomial3(a, b, n - a - b) });
    const max = Math.max(...out.map((t) => t.v));
    return out.map((t) => ({ ...t, r: t.v / max, top: t.v > max * (1 - 1e-9) }));
  });
  // Triangular coordinates: k₁ runs down the rows, k₂ across them.
  const step = $derived(SIDE / Math.max(n, 1));
  const pos = (t) => [CX + (t.b - t.c) * step * 0.5, TOP + t.a * step * 0.866];
  const radius = $derived(Math.min(step * 0.5, 22));
  const hex = (x, y, r) => Array.from({ length: 6 }, (_, k) => `${x + r * Math.cos((Math.PI / 3) * k + Math.PI / 6)},${y + r * Math.sin((Math.PI / 3) * k + Math.PI / 6)}`).join(' ');
  const best = $derived(cells.filter((t) => t.top));
</script>

<figure class="anim multinomial">
  <svg viewBox="0 0 640 330" role="img" aria-label="A triangle of hexagons, one for each triple k1 + k2 + k3 = n, shaded by n!/(k1! k2! k3!), with the largest values outlined">
    {#each cells as t}
      {@const [x, y] = pos(t)}
      <polygon class="cell" class:top={t.top} points={hex(x, y, radius * 0.95)} style:fill-opacity={0.08 + 0.8 * t.r} />
    {/each}
    <text class="note" x={CX} y="318">largest: {best.map((t) => `(${t.a}, ${t.b}, ${t.c})`).join(', ')}, value {Math.round(best[0].v).toLocaleString('en-GB')}</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={3} max={15} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .multinomial { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .cell { fill: var(--anim-accent); stroke: var(--anim-rule); stroke-width: 1; }
  .cell.top { stroke: var(--anim-ink); stroke-width: 2.2; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .note { font-style: italic; }
</style>
