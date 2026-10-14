<script>
  // Definition 11, the drawing "Idea" of the lecture: a function f that is 0,
  // then positive, then negative, then 0; its positive part f⁺ over the
  // positive bump and its negative part f⁻, dashed, the negative bump of f
  // reflected above the axis.
  import { graph } from './plot.js';
  const uid = $props.id();

  const BASE = 132;
  const bump = (x, a, b, h) => (x <= a || x >= b ? 0 : h * Math.sin((Math.PI * (x - a)) / (b - a)));
  const f = (x) => bump(x, 175, 370, 72) - bump(x, 370, 585, 70);
  const id = (x) => x;
  const sy = (v) => BASE - v;
  const fLine = graph(f, 30, 650, id, sy, 500);
  const plus = graph(f, 175, 370, id, sy, 160);
  const minus = graph((x) => -f(x), 370, 585, id, sy, 160);
</script>

<figure class="anim parts">
  <svg viewBox="0 0 690 230" role="img" aria-label="A function f with a positive bump and a negative bump, its positive part drawn over the positive bump, and its negative part drawn dashed as the negative bump reflected above the axis">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="head" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <line class="axis" x1="25" y1={BASE} x2="668" y2={BASE} marker-end="url(#{uid}-head)" />
    <polyline class="curve" points={fLine} />
    <polyline class="plus" points={plus} />
    <polyline class="minus" points={minus} />
    <text class="lab" x="118" y={BASE - 22}>f</text>
    <text class="lab accent" x="300" y={BASE - 92}>f<tspan class="sup" dx="2" dy="-8">+</tspan></text>
    <text class="lab accent" x="560" y={BASE - 90}>f<tspan class="sup" dx="2" dy="-8">−</tspan></text>
  </svg>
</figure>

<style>
  .parts { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 1.8; stroke-linejoin: round; }
  .plus { fill: none; stroke: var(--anim-accent); stroke-width: 4; stroke-linejoin: round; stroke-linecap: round; }
  .minus { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-dasharray: 7 6; }
  text { fill: var(--anim-ink); font-size: 18px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .sup { font-size: 14px; font-style: normal; }
  .accent { fill: var(--anim-accent); }
</style>
