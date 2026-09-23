<script>
  // Theorem 4 (2), an instance with N = 2 as in the drawing of the lecture: a
  // set E covered by two rectangles, and x₀ + E covered by the same
  // rectangles translated by x₀.
  import { blob } from './shapes.js';

  const SHIFT = [250, 0];
  const rects = [
    { x: 40, y: 64, w: 92, h: 126 },
    { x: 102, y: 40, w: 84, h: 128 },
  ];
  const E = blob(113, 118, 54, 40, [[0.07, 3, 1.2], [0.04, 5, 0.3]]);
</script>

<figure class="anim translate">
  <svg viewBox="0 0 480 240" role="img" aria-label="A set E covered by two rectangles, and at its right the set x0 + E covered by the same two rectangles translated by x0">
    {#each [[0, 0], SHIFT] as [dx, dy]}
      <g transform="translate({dx} {dy})">
        {#each rects as r}
          <rect class="rect" x={r.x} y={r.y} width={r.w} height={r.h} />
        {/each}
        <path class="set" d={E} />
      </g>
    {/each}
    <text class="lab" x="113" y="218">E</text>
    <text class="lab" x={113 + SHIFT[0]} y="218">x<tspan dy="5" font-size="12" font-style="normal">0</tspan><tspan dy="-5" font-style="normal"> + </tspan>E</text>
  </svg>
</figure>

<style>
  .translate { margin: 1.5rem auto; max-width: 26rem; }
  svg { font-family: var(--anim-font); }
  .rect { fill: var(--anim-muted); fill-opacity: 0.07; stroke: var(--anim-muted); stroke-width: 1.4; }
  .set { fill: var(--anim-accent); fill-opacity: 0.2; stroke: var(--anim-accent); stroke-width: 2; }
  text { fill: var(--anim-ink); font-size: 17px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
</style>
