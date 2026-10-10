<script>
  // Example 20, an instance on an interval: a function f, and a function g
  // equal to f except at the 3 points of N, where the values of g are the
  // filled dots. For the level a of the slider the horizontal axis shows
  // f⁻¹((a, +∞]) \ N, thick with holes at N, and the points of N where g > a,
  // filled: together they are g⁻¹((a, +∞]).
  import Slider from '@toolkit/Slider.svelte';

  const OX = 50, OY = 300, UX = 150, UY = 90, LO = -0.6;
  const sx = (x) => OX + x * UX;
  const sy = (y) => OY - (y - LO) * UY;
  const f = (x) => 1.05 + 0.75 * Math.sin(1.7 * x) + 0.12 * x;
  const N = [[0.85, -0.95], [2.2, 1.05], [3.45, -0.85]].map(([x, d]) => ({ x, g: f(x) + d }));
  const S = 800, XMAX = 4;
  const xs = Array.from({ length: S + 1 }, (_, j) => (j / S) * XMAX);
  const fLine = xs.map((x) => `${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`).join(' ');

  // The maximal runs of sample points where f > a.
  function above(a) {
    const runs = [];
    let start = null;
    xs.forEach((x, j) => {
      if (f(x) > a && start === null) start = x;
      if ((f(x) <= a || j === S) && start !== null) { runs.push([start, f(x) > a ? x : xs[j - 1]]); start = null; }
    });
    return runs;
  }

  let a = $state(1.3);
  const runs = $derived(above(a));
</script>

<figure class="anim almost">
  <svg viewBox="0 0 680 350" role="img" aria-label="A function f, a function g that differs from f at three points, a level a, and on the horizontal axis the set of points where g is above a">
    <line class="axis" x1={OX} y1={sy(LO)} x2={sx(XMAX) + 30} y2={sy(LO)} />
    <line class="axis" x1={OX} y1={sy(LO) + 10} x2={OX} y2={sy(2.6)} />
    <line class="level" x1={OX} y1={sy(a)} x2={sx(XMAX)} y2={sy(a)} />
    <text class="lab it" x={sx(XMAX) + 18} y={sy(a)}>a</text>
    <polyline class="fcurve" points={fLine} />
    {#each runs as [x0, x1]}
      <line class="run" x1={sx(x0)} y1={sy(LO)} x2={sx(x1)} y2={sy(LO)} />
    {/each}
    {#each N as p}
      <line class="drop" x1={sx(p.x)} y1={sy(f(p.x))} x2={sx(p.x)} y2={sy(p.g)} />
      <circle class="hole" cx={sx(p.x)} cy={sy(f(p.x))} r="5" />
      <circle class="gdot" cx={sx(p.x)} cy={sy(p.g)} r="5.5" />
      {#if f(p.x) > a}<circle class="hole axis-hole" cx={sx(p.x)} cy={sy(LO)} r="4.5" />{/if}
      {#if p.g > a}<circle class="gdot" cx={sx(p.x)} cy={sy(LO)} r="5.5" />{/if}
    {/each}
    <text class="lab it" x={sx(0.25)} y={sy(f(0.25)) - 18}>f</text>
    <text class="lab it accent" x={sx(N[1].x) + 18} y={sy(N[1].g)}>g</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="a" min={-0.4} max={2.4} step={0.05} bind:value={a} format={(v) => Number(v).toFixed(2).replace('-', '−')} />
    </div>
  </div>
</figure>

<style>
  .almost { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .level { stroke: var(--anim-muted); stroke-width: 1.3; stroke-dasharray: 6 5; }
  .fcurve { fill: none; stroke: var(--anim-ink); stroke-width: 2; }
  .run { stroke: var(--anim-accent); stroke-width: 7; stroke-linecap: butt; }
  .drop { stroke: var(--anim-rule); stroke-width: 1.1; stroke-dasharray: 3 3; }
  .hole { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 1.6; }
  .axis-hole { stroke: var(--anim-accent); }
  .gdot { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
</style>
