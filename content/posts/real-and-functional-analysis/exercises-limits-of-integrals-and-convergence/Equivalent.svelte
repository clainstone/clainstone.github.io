<script>
  // Example 2: on (0, 2], the functions 1/√(sin x) and, dashed, 1/√x, which are
  // equivalent as x → 0⁺. Heights above 4.2 are cut.
  import { graph } from './plot.js';
  const uid = $props.id();

  const OX = 70, UX = 290, OY = 252, UY = 54, TOP = 4.2, E = 1e-6;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const inv = graph((x) => 1 / Math.sqrt(Math.sin(x)), E, 2, sx, sy, 400, 3);
  const root = graph((x) => 1 / Math.sqrt(x), E, 2, sx, sy, 400, 3);
</script>

<figure class="anim equivalent">
  <svg viewBox="0 0 690 290" role="img" aria-label="On the interval from 0 to 2, the graphs of 1 over the square root of sin x and, dashed, of 1 over the square root of x, which grow without bound near 0 and come together there">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
      <clipPath id="{uid}-clip">
        <rect x={OX} y={sy(TOP)} width={2 * UX + 4} height={TOP * UY} />
      </clipPath>
    </defs>
    <g clip-path="url(#{uid}-clip)">
      <polyline class="root" points={root} />
      <polyline class="inv" points={inv} />
    </g>
    <line class="axis" x1={OX - 12} y1={OY} x2={sx(2) + 26} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 12} x2={OX} y2={sy(TOP) - 8} marker-end="url(#{uid}-head)" />
    {#each [1, 2] as k}
      <line class="tick" x1={sx(k)} y1={OY - 4} x2={sx(k)} y2={OY + 4} />
      <text class="num" x={sx(k)} y={OY + 21}>{k}</text>
    {/each}
    {#each [1, 2, 3, 4] as k}
      <line class="tick" x1={OX - 4} y1={sy(k)} x2={OX + 4} y2={sy(k)} />
      <text class="num right" x={OX - 10} y={sy(k)}>{k}</text>
    {/each}
    <text class="num" x={OX - 14} y={OY + 19}>0</text>

    <line class="inv" x1="450" y1="56" x2="490" y2="56" />
    <text class="left" x="502" y="56">1/√(sin <tspan class="it">x</tspan>)</text>
    <line class="root" x1="450" y1="90" x2="490" y2="90" />
    <text class="left" x="502" y="90">1/√<tspan class="it">x</tspan></text>
  </svg>
</figure>

<style>
  .equivalent { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .inv { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  .root { fill: none; stroke: var(--anim-ink); stroke-width: 2; stroke-dasharray: 7 5; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .right { text-anchor: end; }
  .it { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
