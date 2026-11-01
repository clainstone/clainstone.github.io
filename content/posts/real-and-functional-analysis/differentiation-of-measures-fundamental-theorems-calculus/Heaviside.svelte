<script>
  // Remark 10 (2), the drawing of the lecture: the Heaviside function H, equal
  // to 0 on (−∞, 0], with the filled dot at the origin, and to 1 on (0, +∞),
  // with the labels H and 1 placed as in the drawing; the point −3 is marked.
  const X0 = 30, X1 = 610, OY = 160, OX = 330, UNIT = 90, STEP = 52;
  const px = (v) => OX + v * STEP;
</script>

<figure class="anim heaviside">
  <svg viewBox="0 0 640 214" role="img" aria-label="The graph of the Heaviside function: 0 on the negative half line up to a filled dot at the origin, and 1 on the positive half line">
    <line class="axis" x1={X0} y1={OY} x2={X1} y2={OY} />
    <path class="head" d="M{X1 + 10},{OY} l-11,-5 l0,10 z" />
    <line class="axis" x1={OX} y1={OY + 22} x2={OX} y2={OY - UNIT - 40} />
    <path class="head" d="M{OX},{OY - UNIT - 50} l-5,11 l10,0 z" />
    <line class="graph" x1={X0} y1={OY} x2={OX} y2={OY} />
    <circle class="dot" cx={OX} cy={OY} r="5.5" />
    <line class="graph" x1={OX} y1={OY - UNIT} x2={X1 - 30} y2={OY - UNIT} />
    <line class="tick" x1={px(-3)} y1={OY - 7} x2={px(-3)} y2={OY + 7} />

    <text class="lab" x={OX - 52} y={OY - UNIT - 4}>H</text>
    <text class="num" x={OX + 130} y={OY - UNIT - 24}>1</text>
    <text class="num" x={OX + 12} y={OY + 20}>0</text>
    <text class="num" x={px(-3)} y={OY + 24}>−3</text>
  </svg>
</figure>

<style>
  .heaviside { margin: 1.5rem auto; max-width: 33.5rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .graph { stroke: var(--anim-accent); stroke-width: 3.4; }
  .dot { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
