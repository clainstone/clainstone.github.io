<script>
  // The probability densities on {0, 1, 2} form a triangle in R³ with vertices
  // (1, 0, 0), (0, 1, 0), (0, 0, 1). For the gambler's ruin chain with N = 2,
  // an instance, a density μ set by the sliders and the density μP are marked,
  // with an arrow from μ to μP. The side from (1, 0, 0) to (0, 0, 1), in
  // colour, holds the densities (λ, 0, 1 − λ).
  import Slider from '@toolkit/Slider.svelte';
  import { gambler, step } from './chains.js';

  const A = [120, 262], B = [320, 44], C = [520, 262];
  const at = ([a, b, c]) => [a * A[0] + b * B[0] + c * C[0], a * A[1] + b * B[1] + c * C[1]];
  let m0 = $state(0.2);
  let m1 = $state(0.5);
  let p = $state(0.5);
  // μ₀ + μ₁ ≤ 1: the second slider stops at 1 − μ₀.
  $effect(() => { if (m1 > 1 - m0) m1 = Math.round((1 - m0) * 20) / 20; });
  const mu = $derived([m0, Math.min(m1, 1 - m0), Math.max(0, 1 - m0 - m1)]);
  const muP = $derived(step(mu, gambler(2, p)));
  const a = $derived(at(mu));
  const b = $derived(at(muP));
  const moved = $derived(Math.hypot(a[0] - b[0], a[1] - b[1]) > 1);
  const f = (v) => (Math.abs(v) < 5e-13 ? 0 : v).toFixed(2);
  const vec = (v) => `(${v.map(f).join(', ')})`;
  const uid = $props.id();
</script>

<figure class="anim simplex">
  <svg viewBox="0 0 640 352" role="img" aria-label="A triangle, the probability densities on three states, with a density mu and the density mu P of the gambler's ruin chain with N = 2; the bottom side holds the densities (lambda, 0, 1 minus lambda)">
    <defs>
      <marker id="{uid}-h" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path class="head" d="M0,1 L10,5 L0,9 Z" />
      </marker>
    </defs>
    <polygon class="set" points="{A.join(',')} {B.join(',')} {C.join(',')}" />
    <line class="inv" x1={A[0]} y1={A[1]} x2={C[0]} y2={C[1]} />
    {#each [A, B, C] as v}
      <circle class="vertex" cx={v[0]} cy={v[1]} r="4" />
    {/each}
    <text x={A[0] - 10} y={A[1] + 24}>(1, 0, 0)</text>
    <text x={B[0]} y={B[1] - 22}>(0, 1, 0)</text>
    <text x={C[0] + 10} y={C[1] + 24}>(0, 0, 1)</text>
    <text class="lab" x="320" y="292">(λ, 0, 1 − λ)</text>
    {#if moved}
      <line class="move" x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1] - 9} marker-end="url(#{uid}-h)" />
    {/if}
    <circle class="img" cx={b[0]} cy={b[1]} r="6" />
    <circle class="point" cx={a[0]} cy={a[1]} r="7" />
    <text class="acc" x={a[0] - 18} y={a[1] - 16}>μ</text>
    {#if moved}<text class="ink" x={b[0] + 24} y={b[1] - 16}>μP</text>{/if}
    <text class="note" x="320" y="330">μ = {vec(mu)},   μP = {vec(muP)}</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="μ₀" min={0} max={1} step={0.05} bind:value={m0} format={(v) => v.toFixed(2)} />
      <Slider label="μ₁" min={0} max={1} step={0.05} bind:value={m1} format={(v) => v.toFixed(2)} />
      <Slider label="p" min={0.05} max={0.95} step={0.05} bind:value={p} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .simplex { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .set { fill: var(--anim-muted); fill-opacity: 0.1; stroke: var(--anim-ink); stroke-width: 1.3; }
  .inv { stroke: var(--anim-accent); stroke-width: 4; stroke-linecap: round; }
  .vertex { fill: var(--anim-ink); }
  .move { stroke: var(--anim-muted); stroke-width: 1.5; stroke-dasharray: 5 4; }
  .head { fill: var(--anim-muted); }
  .point { fill: var(--anim-accent); stroke: var(--page, #fff); stroke-width: 2; }
  .img { fill: var(--anim-ink); stroke: var(--page, #fff); stroke-width: 2; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .acc { fill: var(--anim-accent); font-style: italic; }
  .ink { font-style: italic; }
  .lab { fill: var(--anim-accent); }
  .note { fill: var(--anim-ink); white-space: pre; }
  .simplex :global(.anim-slider-label) { font-style: italic; }
</style>
