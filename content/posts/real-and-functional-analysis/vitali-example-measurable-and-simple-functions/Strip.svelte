<script>
  // Example 18, as in the drawing of the exercise: the set A on the horizontal
  // axis and E = A × {x₀} at height x₀, both drawn schematically as points
  // (seeded), and the open rectangle R_m = (−1, 2) × (x₀ − 1/m, x₀ + 1/m).
  import Slider from '@toolkit/Slider.svelte';

  const OX = 170, OY = 330, U = 140;
  const sx = (x) => OX + x * U;
  const sy = (y) => OY - y * U;
  const X0 = 1;
  // mulberry32: the same schematic points for every reader.
  function mulberry32(a) {
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const rand = mulberry32(24);
  const A = Array.from({ length: 16 }, () => 0.04 + 0.92 * rand());

  let m = $state(2);
</script>

<figure class="anim strip">
  <svg viewBox="0 0 640 375" role="img" aria-label="Points of a set A on the horizontal axis between 0 and 1, the same points at height x0 forming E, and an open rectangle around E whose height shrinks as m grows">
    <rect class="rect" x={sx(-1)} y={sy(X0 + 1 / m)} width={3 * U} height={2 * U / m} />
    <line class="axis" x1={sx(-1.05)} y1={OY} x2={sx(2.6)} y2={OY} />
    <path class="head" d="M{sx(2.6) + 10},{OY} l-11,-5 l0,10 z" />
    <line class="axis" x1={OX} y1={OY + 20} x2={OX} y2={sy(2) - 20} />
    <path class="head" d="M{OX},{sy(2) - 30} l-5,11 l10,0 z" />
    {#each A as a}
      <circle class="pt" cx={sx(a)} cy={OY} r="3.5" />
      <circle class="pt e" cx={sx(a)} cy={sy(X0)} r="3.5" />
    {/each}
    {#each [-1, 1, 2] as x}
      <line class="tick" x1={sx(x)} y1={OY - 6} x2={sx(x)} y2={OY + 6} />
      <text class="num" x={sx(x)} y={OY + 24}>{x < 0 ? '−1' : x}</text>
    {/each}
    <text class="num" x={OX - 12} y={OY + 18}>0</text>
    <line class="tick" x1={OX - 6} y1={sy(X0)} x2={OX + 6} y2={sy(X0)} />
    <text class="num it" x={OX - 26} y={sy(X0)}>x<tspan class="sub" dy="5">0</tspan></text>
    <text class="lab it accent" x={sx(1.25)} y={sy(X0)}>E</text>
    <text class="lab it" x={sx(0.5)} y={OY + 26}>A</text>
    <text class="lab it accent" x={sx(2) + 26} y={sy(X0 + 1 / m) + 10}>R<tspan class="sub" dy="5">m</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="m" min={1} max={12} step={1} bind:value={m} />
    </div>
  </div>
</figure>

<style>
  .strip { margin: 1.5rem auto; max-width: 33.5rem; }
  svg { font-family: var(--anim-font); }
  .rect { fill: var(--anim-accent); fill-opacity: 0.1; stroke: var(--anim-accent); stroke-width: 1.6; stroke-dasharray: 6 4; }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .head { fill: var(--anim-ink); }
  .pt { fill: var(--anim-muted); }
  .pt.e { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 12px; }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
