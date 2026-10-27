<script>
  // Example 2, the drawing of the lecture: the graph of sin x for x in [0, 2],
  // its maximum 1 at π/2, the ticks π/2, 2 and π on the axis, and the dotted
  // segment from the axis to the graph at x = 2.
  import { graph } from './plot.js';
  const uid = $props.id();

  const OX = 90, UX = 150, OY = 222, UY = 165;
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - v * UY;
  const line = graph(Math.sin, 0, 2, sx, sy, 240);
  const ticks = [
    { x: Math.PI / 2, label: 'π/2' },
    { x: 2, label: '2' },
    { x: Math.PI, label: 'π' },
  ];
</script>

<figure class="anim sine">
  <svg viewBox="0 0 690 262" role="img" aria-label="The graph of sin x from 0 to 2, rising from 0 to its maximum 1 at pi over 2 and then decreasing, with a dotted segment from the axis to the graph at 2, and the ticks pi over 2, 2 and pi on the axis">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="headfill" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <line class="axis" x1={OX - 50} y1={OY} x2={sx(Math.PI) + 60} y2={OY} marker-end="url(#{uid}-head)" />
    <line class="axis" x1={OX} y1={OY + 24} x2={OX} y2={sy(1.24)} marker-end="url(#{uid}-head)" />
    {#each ticks as t}
      <line class="tick" x1={sx(t.x)} y1={OY - 5} x2={sx(t.x)} y2={OY + 5} />
      <text class="num" x={sx(t.x)} y={OY + 22}>{t.label}</text>
    {/each}
    <line class="dotted" x1={sx(2)} y1={OY} x2={sx(2)} y2={sy(Math.sin(2))} />
    <polyline class="f" points={line} />

    <text class="num" x={OX - 16} y={OY + 20}>0</text>
    <text class="num" x={sx(Math.PI / 2)} y={sy(1) - 18}>1</text>
    <text class="it" x={sx(Math.PI) + 62} y={OY + 22}>x</text>
    <text class="left accent" x={sx(2) + 20} y={sy(0.97)}>sin <tspan class="it">x</tspan></text>
  </svg>
</figure>

<style>
  .sine { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .headfill { fill: var(--anim-ink); }
  .dotted { stroke: var(--anim-muted); stroke-width: 1.6; stroke-dasharray: 2 4; stroke-linecap: round; }
  .f { fill: none; stroke: var(--anim-accent); stroke-width: 2.6; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
