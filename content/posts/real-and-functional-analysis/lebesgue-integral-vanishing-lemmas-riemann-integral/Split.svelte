<script>
  // The proof of Proposition 14, (3) implies (1), an instance on an interval:
  // two functions f and g, the set E = {f ≥ g} on the axis and, below it, the
  // set {f ≤ g}.
  import { graph, intervals } from './plot.js';

  const OX = 60, OY = 200, UX = 560, UY = 220;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  const f = (t) => 0.5 + 0.22 * Math.sin(2 * Math.PI * 1.15 * t + 0.2);
  const g = (t) => 0.48 + 0.2 * Math.sin(2 * Math.PI * 1.7 * t + 1.0);
  const fLine = graph(f, 0, 1, sx, sy, 400);
  const gLine = graph(g, 0, 1, sx, sy, 400);
  const E = intervals((t) => f(t) >= g(t), 0, 1, 2000);
  const below = intervals((t) => f(t) <= g(t), 0, 1, 2000);
  const widest = (list) => list.reduce((a, b) => (b[1] - b[0] > a[1] - a[0] ? b : a));
  const mid = ([a, b]) => (sx(a) + sx(b)) / 2;
</script>

<figure class="anim split">
  <svg viewBox="0 0 690 290" role="img" aria-label="Two functions f and g on an interval that cross several times, the set where f is at least g marked on the axis, and below it the set where f is at most g">
    <polyline class="g" points={gLine} />
    <polyline class="f" points={fLine} />
    <line class="axis" x1={OX} y1={OY} x2={sx(1) + 20} y2={OY} />
    <line class="axis" x1={OX} y1={OY} x2={OX} y2={sy(0.8)} />
    {#each E as [a, b]}
      <line class="set" x1={sx(a)} y1={OY} x2={sx(b)} y2={OY} />
    {/each}
    {#each below as [a, b]}
      <line class="other" x1={sx(a)} y1={OY + 40} x2={sx(b)} y2={OY + 40} />
    {/each}
    <text class="lab it" x={sx(0.27)} y={sy(f(0.27)) - 18}>f</text>
    <text class="lab it muted" x={sx(0.62)} y={sy(g(0.62)) - 18}>g</text>
    <text class="lab it accent" x={mid(widest(E))} y={OY + 20}>E</text>
    <text class="lab it muted" x={mid(widest(below))} y={OY + 62}>{`{f ≤ g}`}</text>
  </svg>
</figure>

<style>
  .split { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .f { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .g { fill: none; stroke: var(--anim-muted); stroke-width: 2.2; stroke-dasharray: 8 5; }
  .set { stroke: var(--anim-accent); stroke-width: 5; }
  .other { stroke: var(--anim-muted); stroke-width: 5; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
