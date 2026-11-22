<script>
  // The drawing of (2) in Example 18.1: a function g of C_c^∞((0, 1)), equal
  // to 0 near 0 and near 1, where it is thick on the axis, and oscillating in
  // between. An instance.
  import { graph, head } from './plot.js';

  const OX = 120, X1 = 560, OY = 150, UY = 62;
  // g vanishes on (0, E0] and on [E1, 1).
  const E0 = 0.1, E1 = 0.88;
  const sx = (t) => OX + t * (X1 - OX);
  const sy = (v) => OY - v * UY;
  // Bumps (height, centre, width), times the window
  // exp(0.3 (4 − 1/(u(1 − u)))), which is infinitely differentiable and flat
  // at both ends of (E0, E1): the function, 0 outside, is infinitely
  // differentiable.
  const bumps = [[0.8, 0.14, 0.07], [-0.45, 0.3, 0.06], [1.05, 0.47, 0.07], [-0.35, 0.63, 0.06], [0.85, 0.8, 0.06]];
  const g = (t) => {
    if (t <= E0 || t >= E1) return 0;
    const u = (t - E0) / (E1 - E0);
    const w = Math.exp(0.3 * (4 - 1 / (u * (1 - u))));
    return 1.5 * w * bumps.reduce((s, [a, c, d]) => s + a * Math.exp(-(((u - c) / d) ** 2)), 0);
  };
  // The name of the function, beside its highest point.
  let top = E0;
  for (let j = 0; j <= 400; j++) if (g(j / 400) > g(top)) top = j / 400;
</script>

<figure class="anim support">
  <svg viewBox="0 0 680 222" role="img" aria-label="A function g on the interval from 0 to 1, equal to zero near 0 and near 1, where it is drawn thick on the axis, and oscillating in between">
    <line class="axis" x1={OX - 50} y1={OY} x2={X1 + 70} y2={OY} />
    <polygon class="head" points={head(X1 + 80, OY, 1, 0)} />
    <line class="axis" x1={OX} y1={OY + 55} x2={OX} y2={OY - 112} />
    <polygon class="head" points={head(OX, OY - 122, 0, -1)} />
    <line class="zero" x1={sx(0)} y1={OY} x2={sx(E0)} y2={OY} />
    <line class="zero" x1={sx(E1)} y1={OY} x2={sx(1)} y2={OY} />
    <polyline class="g" points={graph(g, E0, E1, sx, sy, 500)} />
    <line class="tick" x1={sx(1)} y1={OY - 7} x2={sx(1)} y2={OY + 7} />
    <text x={OX - 16} y={OY + 22}>0</text>
    <text x={sx(1)} y={OY + 26}>1</text>
    <text class="lab it" x={sx(top) + 20} y={sy(g(top)) - 14}>g</text>
  </svg>
</figure>

<style>
  .support { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .zero { stroke: var(--anim-accent); stroke-width: 5; stroke-linecap: butt; }
  .g { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .lab { fill: var(--anim-accent); }
</style>
