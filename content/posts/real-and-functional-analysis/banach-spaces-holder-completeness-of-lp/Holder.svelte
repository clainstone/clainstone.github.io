<script>
  // Proposition 12, an instance on [0, 1] with μ = λ: u0 = 0.35 + 1.3x² and
  // v0 = 1.25 − 0.8x + 0.25 sin 7x, normalized to u = u0/‖u0‖_p and
  // v = v0/‖v0‖_p' for the p of the slider. Shaded, the region under |uv|;
  // above it the graph of |u|^p/p + |v|^p'/p', whose integral is 1/p + 1/p' = 1.
  // For p = 1 (p' = ∞) the upper graph is ‖v‖_∞ |u| = |u|.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under, integral } from './plot.js';

  const OX = 60, UX = 560, OY = 246, UY = 214;
  const u0 = (x) => 0.35 + 1.3 * x * x;
  const v0 = (x) => 1.25 - 0.8 * x + 0.25 * Math.sin(7 * x);
  const vmax = Math.max(...Array.from({ length: 1001 }, (_, j) => v0(j / 1000)));
  const pNorm = (f, p) => integral((x) => f(x) ** p, 0, 1, 800) ** (1 / p);
  // The functions of the figure for an exponent p: |uv| and the upper graph.
  function pieces(p) {
    if (p === 1) {
      const cu = pNorm(u0, 1);
      return { low: (x) => (u0(x) / cu) * (v0(x) / vmax), top: (x) => u0(x) / cu };
    }
    const q = p / (p - 1);
    const cu = pNorm(u0, p), cv = pNorm(v0, q);
    return { low: (x) => (u0(x) / cu) * (v0(x) / cv), top: (x) => (u0(x) / cu) ** p / p + (v0(x) / cv) ** q / q };
  }
  // One vertical scale for every p of the slider.
  let top = 0;
  for (let p = 1; p <= 4.0001; p += 0.05) {
    const f = pieces(Math.round(p * 100) / 100).top;
    for (let j = 0; j <= 200; j++) top = Math.max(top, f(j / 200));
  }
  const sx = (x) => OX + x * UX;
  const sy = (v) => OY - (v / top) * UY;

  let p = $state(2);
  const f = $derived(pieces(p));
</script>

<figure class="anim holder">
  <svg viewBox="0 0 690 290" role="img" aria-label="On the unit interval, the region under the product of the absolute values of two normalized functions, and above it the graph of the bound given by the Young inequality, whose integral is one">
    <path class="region" d={under(f.low, 0, 1, sx, sy, 300)} />
    <polyline class="curve" points={graph(f.top, 0, 1, sx, sy, 300)} />
    <polyline class="low" points={graph(f.low, 0, 1, sx, sy, 300)} />
    <line class="axis" x1={OX - 16} y1={OY} x2={sx(1) + 16} y2={OY} />
    <line class="tick" x1={sx(0)} y1={OY - 5} x2={sx(0)} y2={OY + 5} />
    <line class="tick" x1={sx(1)} y1={OY - 5} x2={sx(1)} y2={OY + 5} />
    <text class="num" x={sx(0)} y={OY + 20}>0</text>
    <text class="num" x={sx(1)} y={OY + 20}>1</text>
    <text class="lab" x={sx(0.3)} y={(OY + sy(f.low(0.3))) / 2}>|<tspan class="it">uv</tspan>|</text>
    {#if p === 1}
      <text class="start" x={sx(1) + 10} y={sy(f.top(1))}>|<tspan class="it">u</tspan>|</text>
    {:else}
      <text class="end" x={sx(0.86)} y={sy(f.top(0.86)) - 24}>|<tspan class="it">u</tspan>|<tspan class="sup it" dy="-8">p</tspan><tspan dy="8">/</tspan><tspan class="it">p</tspan> + |<tspan class="it">v</tspan>|<tspan class="sup it" dy="-8">p′</tspan><tspan dy="8">/</tspan><tspan class="it">p′</tspan></text>
    {/if}
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="p" min={1} max={4} step={0.05} bind:value={p} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .holder { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .region { fill: var(--anim-accent); fill-opacity: 0.2; }
  .low { fill: none; stroke: var(--anim-accent); stroke-width: 1.6; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .lab { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .start { text-anchor: start; }
  .end { text-anchor: end; }
  .sup { font-size: 13px; }
</style>
