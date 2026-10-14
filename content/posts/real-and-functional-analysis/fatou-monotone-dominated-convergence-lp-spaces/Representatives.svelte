<script>
  // Remark 13, an instance on an interval with μ = λ: two functions f (left)
  // and g (right) that are equal except at one point x₀, so that f ~ g and
  // [f] = [g]. On the right the empty circle is the point of the graph of f
  // that g moves.
  import { graph } from './plot.js';

  const W = 270, GAP = 70, LEFT = 40, OY = 196, UY = 260;
  const panels = [0, 1].map((k) => ({ k, sx: (x) => LEFT + k * (W + GAP) + x * W }));
  const sy = (v) => OY - v * UY;
  const f = (x) => 0.3 + 0.18 * Math.sin(2 * Math.PI * 1.3 * x + 0.5);
  const X0 = 0.62, JUMP = 0.28;
</script>

<figure class="anim representatives">
  <svg viewBox="0 0 690 236" role="img" aria-label="Two copies of the graph of the same function on an interval; on the left the function f, on the right the function g, equal to f except at one point x zero, where its value is higher">
    {#each panels as p}
      <line class="axis" x1={p.sx(0) - 12} y1={OY} x2={p.sx(1) + 12} y2={OY} />
      <line class="tick" x1={p.sx(X0)} y1={OY - 5} x2={p.sx(X0)} y2={OY + 5} />
      <text class="it muted" x={p.sx(X0)} y={OY + 22}>x<tspan class="sub n" dy="5">0</tspan></text>
    {/each}
    <polyline class="curve" points={graph(f, 0, 1, panels[0].sx, sy, 240)} />
    <circle class="dot ink" cx={panels[0].sx(X0)} cy={sy(f(X0))} r="4.5" />
    <text class="it" x={panels[0].sx(0.12)} y={sy(f(0.12)) - 22}>f</text>

    <polyline class="curve accent-line" points={graph(f, 0, 1, panels[1].sx, sy, 240)} />
    <line class="guide" x1={panels[1].sx(X0)} y1={OY} x2={panels[1].sx(X0)} y2={sy(f(X0) + JUMP)} />
    <circle class="hole" cx={panels[1].sx(X0)} cy={sy(f(X0))} r="5" />
    <circle class="dot accent-dot" cx={panels[1].sx(X0)} cy={sy(f(X0) + JUMP)} r="5" />
    <text class="it accent" x={panels[1].sx(0.12)} y={sy(f(0.12)) - 22}>g</text>
  </svg>
</figure>

<style>
  .representatives { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 4 4; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .accent-line { stroke: var(--anim-accent); }
  .ink { fill: var(--anim-ink); }
  .accent-dot { fill: var(--anim-accent); }
  .hole { fill: var(--page, #fff); stroke: var(--anim-accent); stroke-width: 2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .n { font-style: normal; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
