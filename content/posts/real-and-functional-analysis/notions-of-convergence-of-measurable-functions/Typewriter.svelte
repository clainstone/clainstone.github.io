<script>
  // Example 4, the drawing of the lecture: the functions f_1, …, f_14 of the
  // typewriter sequence in rows of 2, 4 and 8, each on its own copy of [0, 1],
  // with f_1, f_3 and f_7 circled. The k-th row holds the characteristic
  // functions of the intervals [j/2^k, (j + 1)/2^k], from left to right.
  import { typewriter } from './plot.js';

  const LEFT = 20, WIDTH = 650, H = 40;
  const rows = [
    { k: 1, gap: 50, base: 105 },
    { k: 2, gap: 26, base: 215 },
    { k: 3, gap: 14, base: 325 },
  ];
  const circled = new Set([1, 3, 7]);

  // One panel per term: its place on the page and its interval [a, b].
  const panels = [];
  for (const { k, gap, base } of rows) {
    const count = 2 ** k;
    const w = (WIDTH - (count - 1) * gap) / count;
    for (let j = 0; j < count; j++) {
      const n = 2 ** k - 1 + j;
      const { a, b } = typewriter(n);
      const px = LEFT + j * (w + gap);
      panels.push({ n, k, px, w, base, x: (t) => px + t * w, a, b });
    }
  }
</script>

<figure class="anim typewriter">
  <svg viewBox="0 0 690 370" role="img" aria-label="The first fourteen functions of the typewriter sequence, each equal to 1 on one interval and 0 elsewhere on its own copy of the unit interval, in rows of two, four and eight intervals of halving length; the first, third and seventh functions are circled">
    {#each panels as p}
      {#if circled.has(p.n)}
        <ellipse class="circle" cx={p.px + p.w / 2} cy={p.base - H / 2 - 6} rx={p.w / 2 + 12} ry={H / 2 + 34} />
      {/if}
      <line class="axis" x1={p.px} y1={p.base} x2={p.px + p.w} y2={p.base} />
      {#each Array.from({ length: 2 ** p.k + 1 }, (_, i) => i / 2 ** p.k) as t}
        <line class="tick" x1={p.x(t)} y1={p.base - 4} x2={p.x(t)} y2={p.base + 4} />
      {/each}
      <line class="guide" x1={p.x(p.a)} y1={p.base} x2={p.x(p.a)} y2={p.base - H} />
      <line class="guide" x1={p.x(p.b)} y1={p.base} x2={p.x(p.b)} y2={p.base - H} />
      <line class="one" x1={p.x(p.a)} y1={p.base - H} x2={p.x(p.b)} y2={p.base - H} />
      <circle class="dot" cx={p.x(p.a)} cy={p.base - H} r="3" />
      <circle class="dot" cx={p.x(p.b)} cy={p.base - H} r="3" />
      <text class="it" x={p.px + p.w / 2} y={p.base - H - 20}>f<tspan class="sub" dy="5">{p.n}</tspan></text>
      {#if p.k === 1}
        <text class="num" x={p.x(0)} y={p.base + 20}>0</text>
        <text class="num" x={p.x(0.5)} y={p.base + 20}>1/2</text>
        <text class="num" x={p.x(1)} y={p.base + 20}>1</text>
      {/if}
    {/each}
  </svg>
</figure>

<style>
  .typewriter { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 4 3; }
  .one { stroke: var(--anim-accent); stroke-width: 2.8; }
  .dot { fill: var(--anim-accent); }
  .circle { fill: none; stroke: var(--anim-accent); stroke-width: 1.8; stroke-opacity: 0.8; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
