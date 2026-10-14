<script>
  // The drawing "Idea" of the lecture, at the start of the Lebesgue integral.
  // Left: a simple function on three adjacent sets D₁, D₂, D₃, the region under
  // its graph hatched, and a set E over which that region is shaded. Right: a
  // function f and, below its graph, the region under a simple function.
  import { STEPS, graph } from './plot.js';
  const uid = $props.id();

  const BASE = 200;
  const { cuts, heights, E } = STEPS;
  const pieces = [0, 1, 2].map((i) => ({ x0: cuts[i], x1: cuts[i + 1], h: heights[i] }));
  const overE = pieces
    .map((p) => ({ x0: Math.max(p.x0, E[0]), x1: Math.min(p.x1, E[1]), h: p.h }))
    .filter((p) => p.x1 > p.x0);

  // The function f of the right half, in page units, on t ∈ [0, 1].
  const sm = (u) => (u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u));
  const f = (t) => 140 * sm((t - 0.02) / 0.16) * sm((0.98 - t) / 0.1) *
    (0.78 + 0.12 * Math.sin(2 * Math.PI * 1.3 * t + 0.4) + 0.08 * Math.sin(2 * Math.PI * 3.1 * t + 1.2));
  const sx = (t) => 410 + 285 * t;
  const sy = (v) => BASE - v;
  const fLine = graph(f, 0, 1, sx, sy, 300);
  // A simple function below f: on each base, a little under the minimum of f there.
  const blocks = [[0.12, 0.31], [0.31, 0.66], [0.66, 0.89]].map(([a, b]) => {
    let m = Infinity;
    for (let j = 0; j <= 200; j++) m = Math.min(m, f(a + ((b - a) * j) / 200));
    return { x0: sx(a), x1: sx(b), h: 0.93 * m };
  });
</script>

<figure class="anim idea">
  <svg viewBox="0 0 720 255" role="img" aria-label="Left: a step function on three adjacent intervals D1, D2, D3 with the region under it hatched and the part over a set E shaded. Right: a function f with rectangles of a step function below its graph">
    <defs>
      <pattern id="{uid}-ink" patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(40)">
        <line class="hatch-ink" x1="0" y1="0" x2="0" y2="9" />
      </pattern>
      <pattern id="{uid}-acc" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(40)">
        <line class="hatch-acc" x1="0" y1="0" x2="0" y2="7" />
      </pattern>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="head" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>

    {#each pieces as p}
      <rect x={p.x0} y={sy(p.h)} width={p.x1 - p.x0} height={p.h} fill="url(#{uid}-ink)" />
    {/each}
    {#each overE as p}
      <rect class="over-e" x={p.x0} y={sy(p.h)} width={p.x1 - p.x0} height={p.h} />
      <rect x={p.x0} y={sy(p.h)} width={p.x1 - p.x0} height={p.h} fill="url(#{uid}-acc)" />
    {/each}
    {#each pieces as p}
      <line class="step" x1={p.x0} y1={sy(p.h)} x2={p.x1} y2={sy(p.h)} />
    {/each}
    <line class="axis" x1="35" y1={BASE} x2="335" y2={BASE} />
    <line class="set" x1={E[0]} y1={BASE} x2={E[1]} y2={BASE} />
    {#each pieces as p, i}
      <text class="lab it" x={(p.x0 + p.x1) / 2} y={BASE + 22}>D<tspan class="sub" dy="5">{i + 1}</tspan></text>
    {/each}
    <text class="lab it accent" x={(E[0] + E[1]) / 2} y={BASE + 46}>E</text>
    <text class="word" x="300" y="62">simple</text>

    <path class="arrow" d="M348,122 C362,104 380,102 394,114" marker-end="url(#{uid}-head)" />

    {#each blocks as b}
      <rect class="block" x={b.x0} y={sy(b.h)} width={b.x1 - b.x0} height={b.h} />
      <rect x={b.x0} y={sy(b.h)} width={b.x1 - b.x0} height={b.h} fill="url(#{uid}-acc)" />
    {/each}
    <polyline class="curve" points={fLine} />
    <line class="axis" x1="400" y1={BASE} x2="708" y2={BASE} />
    <text class="lab it" x={sx(0.97) + 6} y={sy(f(0.9)) - 26}>f</text>
  </svg>
</figure>

<style>
  .idea { margin: 1.5rem auto; max-width: 38rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.4; }
  .step { stroke: var(--anim-ink); stroke-width: 2.2; }
  .set { stroke: var(--anim-accent); stroke-width: 4; }
  .hatch-ink { stroke: var(--anim-muted); stroke-width: 1.2; }
  .hatch-acc { stroke: var(--anim-accent); stroke-width: 1.4; }
  .over-e { fill: var(--anim-accent); fill-opacity: 0.16; }
  .block { fill: var(--anim-accent); fill-opacity: 0.1; stroke: var(--anim-accent); stroke-width: 1.6; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .arrow { fill: none; stroke: var(--anim-muted); stroke-width: 1.6; }
  .head { fill: var(--anim-muted); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: normal; }
  .accent { fill: var(--anim-accent); }
  .word { fill: var(--anim-muted); font-size: 16px; }
</style>
