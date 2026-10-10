<script>
  // Example 9 (i), as in the drawing of the lecture: a function f on the real
  // line that is 0 at every point except one, where it is 1. The empty circle
  // marks the point of the axis that is not on the graph.
  const X0 = 30, X1 = 610, OY = 150, OX = 220, P = 380, UNIT = 90;
</script>

<figure class="anim spike">
  <svg viewBox="0 0 640 190" role="img" aria-label="The graph of a function that is 0 on the whole real line except at one point, where its value is 1">
    <line class="axis" x1={X0} y1={OY} x2={X1} y2={OY} />
    <path class="head" d="M{X1 + 10},{OY} l-11,-5 l0,10 z" />
    <line class="axis" x1={OX} y1={OY + 22} x2={OX} y2={OY - UNIT - 40} />
    <path class="head" d="M{OX},{OY - UNIT - 50} l-5,11 l10,0 z" />
    <line class="graph" x1={X0} y1={OY} x2={P - 6} y2={OY} />
    <line class="graph" x1={P + 6} y1={OY} x2={X1 - 4} y2={OY} />
    <circle class="hole" cx={P} cy={OY} r="5.5" />
    <circle class="dot" cx={P} cy={OY - UNIT} r="5.5" />
    <line class="guide" x1={OX} y1={OY - UNIT} x2={P - 8} y2={OY - UNIT} />
    <line class="tick" x1={OX - 6} y1={OY - UNIT} x2={OX + 6} y2={OY - UNIT} />
    <text class="num" x={OX - 20} y={OY - UNIT}>1</text>
    <text class="num" x={OX - 14} y={OY + 16}>0</text>
    <text class="lab" x={560} y={OY - 26}>f</text>
  </svg>
</figure>

<style>
  .spike { margin: 1.5rem auto; max-width: 33.5rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .graph { stroke: var(--anim-accent); stroke-width: 3.4; }
  .hole { fill: var(--page, #fff); stroke: var(--anim-accent); stroke-width: 2; }
  .dot { fill: var(--anim-accent); }
  .guide { stroke: var(--anim-rule); stroke-width: 1.2; stroke-dasharray: 5 4; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
