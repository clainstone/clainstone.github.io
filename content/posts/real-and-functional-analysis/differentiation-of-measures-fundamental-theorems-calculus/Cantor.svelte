<script>
  // Remark 10 (1): the graph of the Cantor function v, which ends at (1, 1),
  // and the graph of x ↦ ∫_0^x v′ dλ = 0, which ends at (1, 0).
  import { graph, cantor } from './plot.js';

  const OX = 70, OY = 330, UX = 400, UY = 280;
  const sx = (x) => OX + x * UX;
  const sy = (y) => OY - y * UY;
  const v = (x) => cantor(x, 12);
  const line = graph(v, 0, 1, sx, sy, 2187);
</script>

<figure class="anim cantor">
  <svg viewBox="0 0 560 380" role="img" aria-label="The graph of the Cantor function on the unit interval, rising from 0 to 1, and the graph of the zero function on the axis, which ends at the point 1 comma 0">
    <line class="axis" x1={OX} y1={OY} x2={sx(1) + 24} y2={OY} />
    <line class="axis" x1={OX} y1={OY} x2={OX} y2={sy(1) - 24} />
    <line class="tick" x1={sx(1)} y1={OY - 5} x2={sx(1)} y2={OY + 5} />
    <line class="tick" x1={OX - 5} y1={sy(1)} x2={OX + 5} y2={sy(1)} />
    <line class="guide" x1={OX} y1={sy(1)} x2={sx(1)} y2={sy(1)} />
    <line class="guide" x1={sx(1)} y1={sy(1)} x2={sx(1)} y2={OY} />
    <text class="num" x={OX - 14} y={OY + 16}>0</text>
    <text class="num" x={sx(1)} y={OY + 22}>1</text>
    <text class="num" x={OX - 22} y={sy(1)}>1</text>

    <line class="zero" x1={OX} y1={OY} x2={sx(1)} y2={OY} />
    <polyline class="curve" points={line} />
    <circle class="end" cx={sx(1)} cy={sy(1)} r="5" />
    <circle class="end0" cx={sx(1)} cy={OY} r="5" />

    <text class="lab it" x={sx(0.5) - 18} y={sy(0.5) - 22}>v</text>
    <text class="lab0" x={sx(0.66)} y={OY - 24}>∫<tspan class="sub" dx="1" dy="8">0</tspan><tspan class="sup it" dx="-7" dy="-17">x</tspan><tspan dx="4" dy="9"><tspan class="it">v</tspan>′ d<tspan class="it">λ</tspan> = 0</tspan></text>
  </svg>
</figure>

<style>
  .cantor { margin: 1.5rem auto; max-width: 28rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-rule); stroke-width: 1.2; stroke-dasharray: 5 4; }
  .zero { stroke: var(--anim-ink); stroke-width: 4; stroke-opacity: 0.55; }
  .curve { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; stroke-linejoin: round; }
  .end { fill: var(--anim-accent); }
  .end0 { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { fill: var(--anim-accent); }
  .lab0 { fill: var(--anim-ink); }
  .it { font-style: italic; }
  .sub, .sup { font-size: 13px; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
