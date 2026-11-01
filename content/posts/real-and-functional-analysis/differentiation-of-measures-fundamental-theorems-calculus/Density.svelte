<script>
  // Remark 1, an instance with X an interval and μ = λ: the graph of a
  // measurable f ≥ 0, a set E on the axis, and the region under the graph
  // over E, whose area is ν(E) = ∫_E f dλ.
  import { graph, under, bump } from './plot.js';

  const OX = 60, UX = 570, OY = 214, UY = 150;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  const b1 = bump(0.72, 0.33, 0.14);
  const b2 = bump(0.38, 0.78, 0.11);
  const f = (t) => 0.28 + b1(t) + b2(t);
  const E = [0.19, 0.46];
  const mid = (E[0] + E[1]) / 2;
</script>

<figure class="anim density">
  <svg viewBox="0 40 690 212" role="img" aria-label="The graph of a nonnegative function f on an interval X, a set E on the axis, and the shaded region under the graph over E, whose area is nu of E">
    <path class="region" d={under(f, E[0], E[1], sx, sy, 120)} />
    <line class="axis" x1={sx(0)} y1={OY} x2={sx(1)} y2={OY} />
    <line class="tick" x1={sx(0)} y1={OY - 6} x2={sx(0)} y2={OY + 6} />
    <line class="tick" x1={sx(1)} y1={OY - 6} x2={sx(1)} y2={OY + 6} />
    <line class="guide" x1={sx(E[0])} y1={OY} x2={sx(E[0])} y2={sy(f(E[0]))} />
    <line class="guide" x1={sx(E[1])} y1={OY} x2={sx(E[1])} y2={sy(f(E[1]))} />
    <line class="set" x1={sx(E[0])} y1={OY} x2={sx(E[1])} y2={OY} />
    <polyline class="curve" points={graph(f, 0, 1, sx, sy, 300)} />

    <text class="it accent" x={sx(mid)} y={OY + 24}>E</text>
    <text class="it muted" x={sx(1) + 18} y={OY + 2}>X</text>
    <text class="accent" x={sx(mid)} y={sy(0.42)}><tspan class="it">ν</tspan>(<tspan class="it">E</tspan>)</text>
    <text class="it" x={sx(0.9)} y={sy(f(0.9)) - 22}>f</text>
  </svg>
</figure>

<style>
  .density { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-accent); fill-opacity: 0.18; }
  .guide { stroke: var(--anim-accent); stroke-width: 1.2; stroke-dasharray: 4 3; }
  .set { stroke: var(--anim-accent); stroke-width: 5; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
