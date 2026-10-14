<script>
  // Corollary 16, instances on an interval (a, b): a function g of C_c^∞(a, b),
  // its derivative g′, and a function g of C_c^∞(a, b) whose integral is 0, as
  // in the hypotheses of (1), (2) and (3).
  import { graph } from './plot.js';

  const W = 190, BASE = 122, H = 72;
  const bump = (u) => (Math.abs(u) >= 1 ? 0 : Math.exp(1 - 1 / (1 - u * u)));
  const dbump = (u) => (Math.abs(u) >= 1 ? 0 : (bump(u) * -2 * u) / (1 - u * u) ** 2);
  const zero = (u) => bump(2 * u + 1) - bump(2 * u - 1);
  let peak = 0;
  for (let j = 1; j < 2000; j++) peak = Math.max(peak, Math.abs(dbump(-1 + j / 1000)));
  // Each panel draws its function of u ∈ [−1, 1] on the middle of (a, b).
  const panels = [
    { x0: 25, fn: bump, name: 'g', prime: false, lx: 150 },
    { x0: 265, fn: (u) => dbump(u) / peak, name: 'g', prime: true, lx: 112 },
    { x0: 505, fn: zero, name: 'g', prime: false, lx: 118 },
  ].map((p, k) => {
    const sx = (u) => p.x0 + W / 2 + u * (W / 2 - 42);
    const sy = (v) => BASE - v * H;
    // Labels sit where the graph is on or below the axis.
    return { ...p, k, line: graph(p.fn, -1.2, 1.2, sx, sy, 300), lx: p.x0 + p.lx, ly: BASE - 46 };
  });
</script>

<figure class="anim tests">
  <svg viewBox="0 0 720 220" role="img" aria-label="Three panels on an interval from a to b: a smooth bump that vanishes near a and b, its derivative, and a smooth function with a positive bump and a negative bump of equal size">
    {#each panels as p}
      <text class="title" x={p.x0 + W / 2} y="14">({p.k + 1})</text>
      <line class="axis" x1={p.x0} y1={BASE} x2={p.x0 + W} y2={BASE} />
      <line class="tick" x1={p.x0} y1={BASE - 6} x2={p.x0} y2={BASE + 6} />
      <line class="tick" x1={p.x0 + W} y1={BASE - 6} x2={p.x0 + W} y2={BASE + 6} />
      <text class="lab it muted" x={p.x0} y={BASE + 22}>a</text>
      <text class="lab it muted" x={p.x0 + W} y={BASE + 22}>b</text>
      <polyline class="curve" points={p.line} />
      <text class="lab it accent" x={p.lx} y={p.ly}>{p.name}{p.prime ? '′' : ''}</text>
    {/each}
  </svg>
</figure>

<style>
  .tests { margin: 1.5rem auto; max-width: 38rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .curve { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .title { fill: var(--anim-muted); font-size: 16px; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
