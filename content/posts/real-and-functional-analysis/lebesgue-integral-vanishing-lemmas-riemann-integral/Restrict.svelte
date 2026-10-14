<script>
  // Remark 2, an instance with the simple function s of Figure 1. Left: s and
  // the region under its graph over E. Right: s·χ_E, equal to s on E and to 0
  // outside E, and the region under its graph over the whole line X.
  import { STEPS } from './plot.js';

  const BASE = 200;
  const SHIFT = 362;
  const { cuts, heights, E } = STEPS;
  const sy = (v) => BASE - v;
  const pieces = [0, 1, 2].map((i) => ({ x0: cuts[i], x1: cuts[i + 1], h: heights[i] }));
  const overE = pieces
    .map((p) => ({ x0: Math.max(p.x0, E[0]), x1: Math.min(p.x1, E[1]), h: p.h }))
    .filter((p) => p.x1 > p.x0);
  // The pieces of s·χ_E: the pieces over E, and the value 0 outside E.
  const restricted = [{ x0: cuts[0], x1: E[0], h: 0 }, ...overE, { x0: E[1], x1: cuts[3], h: 0 }];
  const panels = [
    { dx: 0, steps: pieces },
    { dx: SHIFT, steps: restricted },
  ];
</script>

<figure class="anim restrict">
  <svg viewBox="0 0 720 255" role="img" aria-label="Two panels. Left: a step function s with the region under it over a set E shaded. Right: the function s times the characteristic function of E, zero outside E, with the region under it shaded">
    {#each panels as panel, k}
      <g transform="translate({panel.dx},0)">
        {#each overE as p}
          <rect class="region" x={p.x0} y={sy(p.h)} width={p.x1 - p.x0} height={p.h} />
        {/each}
        <line class="axis" x1="35" y1={BASE} x2="335" y2={BASE} />
        {#each panel.steps as p}
          <line class="step" x1={p.x0} y1={sy(p.h)} x2={p.x1} y2={sy(p.h)} />
        {/each}
        <line class="set" x1={E[0]} y1={BASE + 9} x2={E[1]} y2={BASE + 9} />
        <text class="lab it accent" x={(E[0] + E[1]) / 2} y={BASE + 30}>E</text>
        <text class="lab it muted" x="350" y={BASE}>X</text>
        {#if k === 0}
          <text class="lab it accent" x={(cuts[1] + cuts[2]) / 2} y={sy(heights[1]) - 18}>s</text>
        {:else}
          <text class="lab it accent" x={(cuts[1] + cuts[2]) / 2} y={sy(heights[1]) - 18}>sχ<tspan class="sub" dy="5">E</tspan></text>
        {/if}
      </g>
    {/each}
  </svg>
</figure>

<style>
  .restrict { margin: 1.5rem auto; max-width: 38rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.4; }
  .step { stroke: var(--anim-accent); stroke-width: 3; }
  .set { stroke: var(--anim-accent); stroke-width: 3; stroke-opacity: 0.55; }
  .region { fill: var(--anim-accent); fill-opacity: 0.2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
