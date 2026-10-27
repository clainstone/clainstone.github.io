<script>
  // Example 14, first step: the parabola x² + 2x with its minimum −1 at x = −1,
  // and the line 2x + 3, which takes the value 1 at x = −1. Dashed: the levels
  // −1 and 1 and the vertical line x = −1. On the axis, the thick part is the
  // interval (−1, 1.2] of the drawing, inside (−1, ∞); the empty circle marks
  // x = −1, which is not in it.
  import { graph } from './plot.js';
  const uid = $props.id();

  const A = -2.6, B = 1.2, L = 70, UX = 146, UY = 34, OY = 210;
  const sx = (x) => L + (x - A) * UX;
  const sy = (v) => OY - v * UY;
  const parabola = graph((x) => x * x + 2 * x, A, B, sx, sy, 300);
  const line = graph((x) => 2 * x + 3, A, B, sx, sy, 2);
</script>

<figure class="anim parabola">
  <svg viewBox="0 0 690 300" role="img" aria-label="The parabola x squared plus 2 x, with its minimum minus 1 at x equal to minus 1, and the line 2 x plus 3, equal to 1 at x equal to minus 1, with dashed guides at the levels minus 1 and 1 and at x equal to minus 1">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <line class="guide" x1={sx(A)} y1={sy(-1)} x2={sx(-1)} y2={sy(-1)} />
    <line class="guide" x1={sx(A)} y1={sy(1)} x2={sx(-1)} y2={sy(1)} />
    <line class="guide" x1={sx(-1)} y1={sy(-2.35)} x2={sx(-1)} y2={sy(5.6)} />
    <line class="axis" x1={sx(A) - 10} y1={OY} x2={sx(B) + 26} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={sx(0)} y1={sy(-2.45)} x2={sx(0)} y2={sy(5.75)} marker-end="url(#{uid}-head)" />
    <line class="domain" x1={sx(-1)} y1={OY} x2={sx(B)} y2={OY} />
    <circle class="hole" cx={sx(-1)} cy={OY} r="4.5" />
    <polyline class="par" points={parabola} />
    <polyline class="lin" points={line} />
    <circle class="dot ink" cx={sx(-1)} cy={sy(-1)} r="4.5" />
    <circle class="dot accent" cx={sx(-1)} cy={sy(1)} r="4.5" />

    <text class="num" x={sx(-1) + 17} y={OY + 16}>−1</text>
    <text class="num" x={sx(0) + 12} y={OY + 20}>0</text>
    <text class="num right" x={sx(A) - 8} y={sy(1)}>1</text>
    <text class="num right" x={sx(A) - 8} y={sy(-1)}>−1</text>
    <text class="it" x={sx(B) + 28} y={OY + 20}>x</text>
    <text class="left" x={sx(-2.5)} y={sy(2.35)}><tspan class="it">x</tspan><tspan class="sup" dy="-7">2</tspan><tspan dy="7"> + 2</tspan><tspan class="it">x</tspan></text>
    <text class="right accent" x={sx(0.5) - 12} y={sy(4.6)}>2<tspan class="it">x</tspan> + 3</text>
  </svg>
</figure>

<style>
  .parabola { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .guide { stroke: var(--anim-muted); stroke-width: 1.3; stroke-dasharray: 6 5; }
  .domain { stroke: var(--anim-ink); stroke-width: 4; }
  .hole { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 2; }
  .par { fill: none; stroke: var(--anim-ink); stroke-width: 2.4; stroke-linejoin: round; }
  .lin { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; }
  .dot.ink { fill: var(--anim-ink); }
  .dot.accent { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .right { text-anchor: end; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .sup { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
