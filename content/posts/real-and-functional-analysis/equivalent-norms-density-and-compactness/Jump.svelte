<script>
  // The drawing of Example 16: H on (−1, 1), equal to 0 on (−1, 0) and to 1 on
  // (0, 1); the dashed levels −1/3 and 1/3 over (−1, 0) and 2/3 and 4/3 over
  // (0, 1); an instance f of the ball B_{1/3}(H): f = 0.14 + 0.15 w(14x) on
  // (−1, 0) and f = 1 + 0.17 sin(25x + 0.6) on (0, 1), with w a triangle wave
  // between −1 and 1. At 0 a bracket marks the gap between 1/3 and 2/3.
  import { graph, head } from './plot.js';

  const OX = 380, UX = 280, OY = 250, UY = 140;
  const sx = (x) => OX + x * UX;
  const sy = (y) => OY - y * UY;
  const wave = (t) => 2 * Math.abs(2 * (t / (2 * Math.PI) - Math.floor(t / (2 * Math.PI) + 0.5))) - 1;
  const fLeft = graph((x) => 0.14 + 0.15 * wave(14 * x), -0.97, -0.03, sx, sy, 400);
  const fRight = graph((x) => 1 + 0.17 * Math.sin(25 * x + 0.6), 0.03, 0.97, sx, sy, 400);
  const levels = [
    { a: -1, b: 0, y: 1 / 3, t: '1/3', end: true },
    { a: -1, b: 0, y: -1 / 3, t: '−1/3', end: true },
    { a: 0, b: 1, y: 4 / 3, t: '4/3', end: false },
    { a: 0, b: 1, y: 2 / 3, t: '2/3', end: false },
  ];
</script>

<figure class="anim jump">
  <svg viewBox="0 0 760 330" role="img" aria-label="The function H, equal to zero on the left of the origin and to one on the right, dashed bands of half-width one third around it, and an oscillating function inside the bands">
    <line class="axis" x1={sx(-1.2)} y1={OY} x2={sx(1.2)} y2={OY} />
    <polygon class="head" points={head(sx(1.2) + 10, OY, 1, 0)} />
    <line class="axis" x1={sx(0)} y1={sy(-0.5)} x2={sx(0)} y2={sy(1.55)} />
    <polygon class="head" points={head(sx(0), sy(1.55) - 10, 0, -1)} />
    {#each levels as l}
      <line class="level" x1={sx(l.a)} y1={sy(l.y)} x2={sx(l.b)} y2={sy(l.y)} />
      <text class={l.end ? 'end' : 'start'} x={l.end ? sx(l.a) - 10 : sx(l.b) + 10} y={sy(l.y)}>{l.t}</text>
    {/each}
    <line class="h" x1={sx(-1)} y1={sy(0)} x2={sx(0)} y2={sy(0)} />
    <line class="h" x1={sx(0)} y1={sy(1)} x2={sx(1)} y2={sy(1)} />
    <polyline class="f" points={fLeft} />
    <polyline class="f" points={fRight} />
    <path class="gap" d="M{sx(0) + 14},{sy(1 / 3)} h8 V{sy(2 / 3)} h-8" />
    <line class="tick" x1={sx(-1)} y1={OY - 5} x2={sx(-1)} y2={OY + 5} />
    <line class="tick" x1={sx(1)} y1={OY - 5} x2={sx(1)} y2={OY + 5} />
    <text x={sx(-1)} y={OY + 22}>−1</text>
    <text x={sx(1)} y={OY + 22}>1</text>
    <text class="start" x={sx(1) + 10} y={sy(1)}>1</text>
    <text class="it" x="742" y={sy(1.16)}>H</text>
    <text class="it acc" x={sx(-0.62)} y={sy(-0.19)}>f</text>
  </svg>
</figure>

<style>
  .jump { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.2; }
  .head { fill: var(--anim-ink); }
  .level { stroke: var(--anim-muted); stroke-width: 1.5; stroke-dasharray: 7 5; }
  .h { stroke: var(--anim-ink); stroke-width: 2.6; }
  .f { fill: none; stroke: var(--anim-accent); stroke-width: 2; stroke-linejoin: round; }
  .gap { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .start { text-anchor: start; }
  .end { text-anchor: end; }
  .acc { fill: var(--anim-accent); }
  .it { font-style: italic; }
</style>
