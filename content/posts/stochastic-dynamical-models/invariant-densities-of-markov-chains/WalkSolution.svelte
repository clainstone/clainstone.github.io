<script>
  // Example 5.1: the solution of (10), q(π_{i+1} − π_i) = p(π_i − π_{i−1}),
  // with the π_0 and π_1 of the sliders, for i = −12, ..., 12, and the band
  // 0 ≤ π_i ≤ 1. Points outside the drawing are marked on its edge.
  import Slider from '@toolkit/Slider.svelte';
  import { walkSolution } from './chains.js';

  const M = 12, LO = -1.5, HI = 2.5;
  const X0 = 70, X1 = 590, Y0 = 290, Y1 = 30;
  const px = (i) => X0 + ((i + M) * (X1 - X0)) / (2 * M);
  const py = (v) => Y0 - ((v - LO) * (Y0 - Y1)) / (HI - LO);
  let p = $state(0.6);
  let pi0 = $state(0.2);
  let pi1 = $state(0.25);
  const sol = $derived(walkSolution(p, pi0, pi1, M));
  const pts = $derived(sol.map((v, k) => ({ i: k - M, v, out: v > HI ? 1 : v < LO ? -1 : 0 })));
  const clip = (v) => Math.max(LO, Math.min(HI, v));
  const q = $derived(1 - p);
  const which = $derived(Math.abs(p - q) < 1e-9 ? 'p = q = 1/2' : p > q ? 'p > q' : 'p < q');
</script>

<figure class="anim walk-solution">
  <svg viewBox="0 0 640 352" role="img" aria-label="The values of a solution of equation (10) for i from minus 12 to 12, against the band between 0 and 1">
    <rect class="band" x={X0} y={py(1)} width={X1 - X0} height={py(0) - py(1)} />
    <line class="axis" x1={X0} y1={py(0)} x2={X1} y2={py(0)} />
    <line class="guide" x1={X0} y1={py(1)} x2={X1} y2={py(1)} />
    {#each [-1, 0, 1, 2] as v}
      <text class="num" x={X0 - 24} y={py(v)}>{String(v).replace('-', '−')}</text>
    {/each}
    {#each [-12, -6, 0, 6, 12] as i}
      <line class="tick" x1={px(i)} y1={Y0} x2={px(i)} y2={Y0 + 5} />
      <text class="num" x={px(i)} y={Y0 + 20}>{String(i).replace('-', '−')}</text>
    {/each}
    <line class="axis" x1={X0} y1={Y0} x2={X1} y2={Y0} />
    <polyline class="line" points={pts.map((d) => `${px(d.i).toFixed(1)},${py(clip(d.v)).toFixed(1)}`).join(' ')} />
    {#each pts as d}
      {#if d.out}
        <polygon class="off" points="{px(d.i) - 6},{py(clip(d.v)) + 8 * d.out} {px(d.i) + 6},{py(clip(d.v)) + 8 * d.out} {px(d.i)},{py(clip(d.v))}" />
      {:else}
        <circle class="pt" class:given={d.i === 0 || d.i === 1} cx={px(d.i)} cy={py(d.v)} r={d.i === 0 || d.i === 1 ? 6 : 4} />
      {/if}
    {/each}
    <text class="axis-l" x={X1 + 22} y={Y0 + 20}>i</text>
    <text class="note" x={(X0 + X1) / 2} y="340">{which}; the larger dots are π<tspan dy="5" font-size="12">0</tspan><tspan dy="-5">&nbsp;and π</tspan><tspan dy="5" font-size="12">1</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="p" min={0.05} max={0.95} step={0.05} bind:value={p} format={(v) => v.toFixed(2)} />
      <Slider label="π₀" min={0} max={1} step={0.05} bind:value={pi0} format={(v) => v.toFixed(2)} />
      <Slider label="π₁" min={0} max={1} step={0.05} bind:value={pi1} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .walk-solution { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .band { fill: var(--anim-accent); fill-opacity: 0.08; }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.1; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  .line { fill: none; stroke: var(--anim-muted); stroke-width: 1.3; }
  .pt { fill: var(--anim-ink); }
  .pt.given { fill: var(--anim-accent); }
  .off { fill: var(--anim-muted); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .axis-l { font-style: italic; fill: var(--anim-muted); }
  .note { font-size: 16px; fill: var(--anim-muted); }
  .walk-solution :global(.anim-slider-label) { font-style: italic; }
</style>
