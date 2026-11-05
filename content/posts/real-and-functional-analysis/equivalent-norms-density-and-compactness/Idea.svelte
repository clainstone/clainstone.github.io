<script>
  // The drawing of the proof of Theorem 13, an instance: a function f ∈ L^1
  // with a jump at x = 3.3, drawn through control points; below it a simple
  // function s, constant on [1.3, 3.3], [3.3, 6.85] and [6.85, 8.85] with
  // values 1.3, 2.65 and 1.8; and a continuous function f_n close to s, equal to
  // 0.94 s away from the ends of the three intervals and falling to 0 at them.
  import { smooth, head } from './plot.js';

  const OX = 60, UX = 66, OY = 236, UY = 62;
  const sx = (x) => OX + x * UX;
  const sy = (y) => OY - y * UY;
  const page = (pts) => pts.map(([x, y]) => [sx(x), sy(y)]);
  const left = smooth(page([[0.6, 0], [1.0, 1.2], [1.5, 1.65], [2.2, 1.55], [2.8, 1.8], [3.3, 2.05]]));
  const right = smooth(page([[3.3, 2.9], [4.0, 3.1], [5.0, 2.95], [6.0, 3.0], [6.8, 2.9], [7.4, 2.4], [8.0, 2.05], [8.6, 2.0], [9.0, 1.95], [9.2, 1.4], [9.35, 0]]));
  const steps = [[1.3, 3.3, 1.3], [3.3, 6.85, 2.65], [6.85, 8.85, 1.8]];
  const W = 0.14;
  const ease = (t) => { const u = Math.min(1, Math.max(0, t)); return u * u * (3 - 2 * u); };
  const fn = (x) => steps.reduce((s, [a, b, h]) => (x >= a && x <= b ? s + 0.94 * h * ease((x - a) / W) * ease((b - x) / W) : s), 0);
  const fnLine = Array.from({ length: 801 }, (_, j) => 1.1 + (8.0 * j) / 800)
    .map((x) => `${sx(x).toFixed(1)},${sy(fn(x)).toFixed(1)}`).join(' ');
  const rect = ([a, b, h]) => `${sx(a)},${sy(0)} ${sx(a)},${sy(h)} ${sx(b)},${sy(h)} ${sx(b)},${sy(0)}`;
</script>

<figure class="anim idea">
  <svg viewBox="0 0 760 270" role="img" aria-label="A function f with a jump, below it a step function with three steps, and a continuous function close to the step function that falls to zero at the ends of the steps">
    <line class="axis" x1={sx(-0.3)} y1={OY} x2={sx(10.3)} y2={OY} />
    <polygon class="head" points={head(sx(10.3) + 10, OY, 1, 0)} />
    {#each steps as st}<polyline class="simple" points={rect(st)} />{/each}
    <polyline class="fn" points={fnLine} />
    <polyline class="f" points={left} />
    <polyline class="f" points={right} />
    <line class="jump" x1={sx(3.3)} y1={sy(2.05)} x2={sx(3.3)} y2={sy(2.9)} />
    <text class="start" x={sx(9.15)} y={sy(2.55)}><tspan class="it">f</tspan> ∈ <tspan class="it">L</tspan><tspan class="sup" dy="-8">1</tspan></text>
    <text class="it acc" x={sx(3.75)} y={sy(1.55)}>f<tspan class="sub" dy="5">n</tspan></text>
  </svg>
</figure>

<style>
  .idea { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .f { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .jump { stroke: var(--anim-ink); stroke-width: 1.4; stroke-dasharray: 2 4; }
  .simple { fill: none; stroke: var(--anim-muted); stroke-width: 2; }
  .fn { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .start { text-anchor: start; }
  .acc { fill: var(--anim-accent); }
  .it { font-style: italic; }
  .sub, .sup { font-size: 13px; font-style: normal; }
</style>
