<script>
  // Theorem 13, as in the drawing of the proof: the graphs of the Cantor
  // function v and of f(x) = x + v(x) on [0, 1]; f goes from 0 to 2.
  import { v, f } from './cantor.js';

  const OX = 70, OY = 330, UX = 360, UY = 140;
  const sx = (x) => OX + x * UX;
  const sy = (y) => OY - y * UY;
  const N = 3 ** 6;
  const graph = (g) => Array.from({ length: N + 1 }, (_, j) => `${sx(j / N).toFixed(1)},${sy(g(j / N)).toFixed(1)}`).join(' ');
  if (Math.abs(f(1) - 2) > 1e-9 || Math.abs(f(0)) > 1e-9) throw new Error('f must go from 0 to 2');
  const vLine = graph(v);
  const fLine = graph(f);
</script>

<figure class="anim graphs">
  <svg viewBox="0 0 500 370" role="img" aria-label="The graph of the Cantor function v, a staircase from 0 to 1, and above it the graph of f(x) = x + v(x), increasing from 0 to 2">
    <line class="axis" x1={OX} y1={OY} x2={sx(1) + 34} y2={OY} />
    <path class="head" d="M{sx(1) + 44},{OY} l-11,-5 l0,10 z" />
    <line class="axis" x1={OX} y1={OY} x2={OX} y2={sy(2) - 26} />
    <path class="head" d="M{OX},{sy(2) - 36} l-5,11 l10,0 z" />
    {#each [1, 2] as y}
      <line class="tick" x1={OX - 5} y1={sy(y)} x2={OX + 5} y2={sy(y)} />
      <text class="num" x={OX - 22} y={sy(y)}>{y}</text>
      <line class="guide" x1={OX} y1={sy(y)} x2={sx(1)} y2={sy(y)} />
    {/each}
    <line class="tick" x1={sx(1)} y1={OY - 5} x2={sx(1)} y2={OY + 5} />
    <text class="num" x={sx(1)} y={OY + 22}>1</text>
    <text class="num" x={OX - 16} y={OY + 18}>0</text>
    <line class="guide" x1={sx(1)} y1={OY} x2={sx(1)} y2={sy(2)} />
    <polyline class="vcurve" points={vLine} />
    <polyline class="fcurve" points={fLine} />
    <text class="lab muted" x={sx(0.62)} y={sy(0.5) + 22}>v</text>
    <text class="lab accent" x={sx(0.5) - 20} y={sy(1) - 12}>f</text>
  </svg>
</figure>

<style>
  .graphs { margin: 1.5rem auto; max-width: 26.5rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 4 4; }
  .vcurve { fill: none; stroke: var(--anim-muted); stroke-width: 1.8; stroke-linejoin: round; }
  .fcurve { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; }
  .muted { fill: var(--anim-muted); }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
