<script>
  // Remark 9, the drawing of the lecture: on the left the Lebesgue measure λ,
  // a horizontal line; an arrow; on the right the measure φλ, the graph of φ
  // over a dashed line, with the region under it over a small interval
  // hatched.
  import { graph, under } from './plot.js';
  const uid = $props.id();

  const X0 = 372, X1 = 676, BASE = 168, UY = 120;
  const sx = (u) => X0 + u * (X1 - X0);
  const sy = (v) => BASE - v * UY;
  const phi = (u) => 0.12 + 0.82 * Math.exp(-(((u - 0.27) / 0.12) ** 2)) + 0.4 * Math.exp(-(((u - 0.76) / 0.13) ** 2));
  const STRIP = [0.2, 0.27];
</script>

<figure class="anim density">
  <svg viewBox="0 36 690 156" role="img" aria-label="On the left a horizontal line labelled lambda; an arrow; on the right a curve labelled phi lambda above a dashed line, with the region under the curve over a small interval hatched">
    <defs>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="6" />
      </pattern>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="9" markerHeight="9" orient="auto">
        <path class="head" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <line class="lebesgue" x1="58" y1={BASE} x2="262" y2={BASE} />
    <text class="it" x="34" y={BASE - 14}>λ</text>
    <path class="arrow" d="M 290 {BASE - 52} Q 318 {BASE - 74} 346 {BASE - 52}" marker-end="url(#{uid}-head)" />

    <path class="strip" d={under(phi, STRIP[0], STRIP[1], sx, sy, 40)} fill="url(#{uid}-h)" />
    <line class="base" x1={X0} y1={BASE} x2={X1} y2={BASE} />
    <line class="tick" x1={sx(STRIP[0])} y1={BASE - 7} x2={sx(STRIP[0])} y2={BASE + 7} />
    <line class="tick" x1={sx(STRIP[1])} y1={BASE - 7} x2={sx(STRIP[1])} y2={BASE + 7} />
    <line class="guide" x1={sx(STRIP[1])} y1={BASE} x2={sx(STRIP[1])} y2={sy(phi(STRIP[1]))} />
    <polyline class="curve" points={graph(phi, 0, 1, sx, sy, 300)} />
    <text class="it" x={sx(0.9)} y={sy(phi(0.9)) - 24}>φλ</text>
  </svg>
</figure>

<style>
  .density { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .lebesgue { stroke: var(--anim-accent); stroke-width: 2.4; }
  .arrow { fill: none; stroke: var(--anim-ink); stroke-width: 1.5; }
  .head { fill: var(--anim-ink); }
  .base { stroke: var(--anim-muted); stroke-width: 1.4; stroke-dasharray: 6 5; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.6; }
  .guide { stroke: var(--anim-ink); stroke-width: 1.2; stroke-dasharray: 4 3; }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.4; }
  .strip { stroke: none; }
  .curve { fill: none; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 19px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
</style>
