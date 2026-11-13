<script>
  // Example 8.11, Part 2, the two drawings of the lecture: g_n(x) = (x/2)^n for n
  // even and for n odd, an instance with n = 2 and n = 3. Without `marked`, on
  // a stretch of ℝ with no marks, as the first drawing; with `marked`, on
  // D = (−2, 2] with the ticks −2 and 2, the empty circle at x = −2, which is
  // not in D, and the filled dot of g_n(2) = 1, as the second drawing.
  import { graph } from './plot.js';
  let { marked = false } = $props();

  const HALF = 130;
  const A = marked ? 2 : 2.6;
  const UX = HALF / A, UY = marked ? 76 : 44;
  const OY = marked ? 128 : 124;
  const panels = [
    { n: 2, cx: 172, name: 'even' },
    { n: 3, cx: 518, name: 'odd' },
  ].map((p) => {
    const sx = (x) => p.cx + x * UX;
    const sy = (v) => OY - v * UY;
    return { ...p, sx, sy, line: graph((x) => (x / 2) ** p.n, -A, A, sx, sy, 300), left: (-1) ** p.n };
  });
  const label = marked
    ? 'Two graphs of the functions g n on the interval from minus 2 to 2: for n even, a curve that falls from height 1 to 0 and rises back to 1; for n odd, a curve that rises from minus 1 through 0 to 1. The value at 2 is 1 and the left end is marked by an empty circle'
    : 'Two graphs of the functions g n on a stretch of the real line: for n even, a curve with its minimum 0 at the origin that rises on both sides; for n odd, a curve that rises from below the axis through the origin to above it';
</script>

<figure class="anim powers">
  <svg viewBox="0 0 690 {marked ? 250 : 248}" role="img" aria-label={label}>
    {#each panels as p}
      <line class="axis" x1={p.cx - HALF - 26} y1={OY} x2={p.cx + HALF + 26} y2={OY} />
      {#if marked}
        <line class="tick" x1={p.sx(-2)} y1={OY - 5} x2={p.sx(-2)} y2={OY + 5} />
        <line class="tick" x1={p.sx(2)} y1={OY - 5} x2={p.sx(2)} y2={OY + 5} />
        <text class="num" x={p.sx(-2) - 4} y={OY + (p.n % 2 ? -18 : 22)}>−2</text>
        <text class="num" x={p.sx(2) + 4} y={OY + 22}>2</text>
      {/if}
      <polyline class="g" points={p.line} />
      <circle class="dot" cx={p.cx} cy={OY} r="3.5" />
      {#if marked}
        <circle class="hole" cx={p.sx(-2)} cy={p.sy(p.left)} r="4.5" />
        <circle class="dot" cx={p.sx(2)} cy={p.sy(1)} r="4.5" />
        <text class="lab" x={p.sx(2) - 8} y={p.sy(1) - 24}><tspan class="it">g</tspan><tspan class="sub it" dy="5">n</tspan><tspan dy="-5">(2) = 1</tspan></text>
      {/if}
      {#if marked}
        <text class="lab it" x={p.cx - 10} y="56">g<tspan class="sub" dy="5">n</tspan></text>
      {:else}
        <text class="lab it" x={p.sx(A) - 34} y={p.sy((A / 2) ** p.n) + 8}>g<tspan class="sub" dy="5">n</tspan></text>
      {/if}
      <text class="name" x={p.cx} y={marked ? 236 : 234}><tspan class="it">n</tspan> {p.name}</text>
    {/each}
  </svg>
</figure>

<style>
  .powers { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .g { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .dot { fill: var(--anim-accent); }
  .hole { fill: var(--page, #fff); stroke: var(--anim-accent); stroke-width: 2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .lab { fill: var(--anim-accent); }
  .name { fill: var(--anim-muted); font-size: 17px; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
