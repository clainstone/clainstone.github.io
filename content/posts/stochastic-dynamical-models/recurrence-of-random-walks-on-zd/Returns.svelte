<script>
  // The return probabilities p⁽²ⁿ⁾₀₀ for n = 1, …, 40, dots, and their
  // asymptotic value, line: (4pq)ⁿ/√(πn) on ℤ, with the slider setting p and
  // q = 1 − p, or 1/(πn) on ℤ² (dim = 2).
  import Slider from '@toolkit/Slider.svelte';
  import { returnZ, returnZ2 } from './walks.js';

  let { dim = 1 } = $props();
  const NMAX = 40;
  const X0 = 70, X1 = 600, Y0 = 250, Y1 = 30, YMAX = 0.6;
  const px = (n) => X0 + ((n - 1) * (X1 - X0)) / (NMAX - 1);
  const py = (v) => Y0 - (Math.min(v, YMAX) * (Y0 - Y1)) / YMAX;
  const ns = Array.from({ length: NMAX }, (_, k) => k + 1);
  let p = $state(0.5);
  const exact = $derived(ns.map((n) => (dim === 1 ? returnZ(n, p) : returnZ2(n))));
  const asym = $derived(ns.map((n) => (dim === 1 ? (4 * p * (1 - p)) ** n / Math.sqrt(Math.PI * n) : 1 / (Math.PI * n))));
</script>

<figure class="anim returns">
  <svg viewBox="0 0 640 312" role="img" aria-label="Dots for the return probabilities p_00^(2n) against n from 1 to 40, and a line for their asymptotic value">
    <line class="axis" x1={X0} y1={Y0} x2={X1 + 12} y2={Y0} />
    <line class="axis" x1={X0} y1={Y0} x2={X0} y2={Y1 - 10} />
    {#each [1, 10, 20, 30, 40] as n}
      <line class="tick" x1={px(n)} y1={Y0} x2={px(n)} y2={Y0 + 5} />
      <text class="num" x={px(n)} y={Y0 + 20}>{n}</text>
    {/each}
    {#each [0, 0.2, 0.4, 0.6] as v}
      <line class="tick" x1={X0 - 5} y1={py(v)} x2={X0} y2={py(v)} />
      <text class="num" x={X0 - 26} y={py(v)}>{v}</text>
    {/each}
    <polyline class="asym" points={asym.map((v, k) => `${px(ns[k])},${py(v)}`).join(' ')} />
    {#each exact as v, k}
      <circle class="pt" cx={px(ns[k])} cy={py(v)} r="3.5" />
    {/each}
    <text class="lab" x={X1 + 18} y={Y0 + 20}>n</text>
    <text class="note" x={(X0 + X1) / 2} y="300">{dim === 1 ? `4pq = ${(4 * p * (1 - p)).toFixed(3)}` : 'dots: exact values; line: 1/(πn)'}</text>
  </svg>
  {#if dim === 1}
    <div class="anim-controls">
      <div class="anim-sliders">
        <Slider label="p" min={0.05} max={0.95} step={0.01} bind:value={p} format={(v) => v.toFixed(2)} />
      </div>
    </div>
  {/if}
</figure>

<style>
  .returns { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.1; }
  .asym { fill: none; stroke: var(--anim-muted); stroke-width: 1.4; }
  .pt { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .lab { font-style: italic; fill: var(--anim-muted); }
  .note { font-style: italic; }
</style>
