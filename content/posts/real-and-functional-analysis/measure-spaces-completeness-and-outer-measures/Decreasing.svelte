<script>
  // Proposition 6 (ii), an instance: nested sets E₀ ⊃ E₁ ⊃ … shrinking towards
  // their intersection E (dashed). The slider sets n; the shaded set is
  // Aₙ = E₀ \ Eₙ, which grows with n towards E₀ \ E.
  import Slider from '@toolkit/Slider.svelte';
  import { blob, blobPoint } from './shapes.js';

  const W = [[0.06, 3, 2.2], [0.04, 4, 0.3]];
  const shape = (s) => blob(260, 130, 205, 102, W, s);
  const scale = (n) => 0.42 + 0.58 * 0.6 ** n;
  const COUNT = 7;
  const sets = Array.from({ length: COUNT }, (_, n) => shape(scale(n)));
  const meet = shape(0.42);
  const sub = (n) => String(n).split('').map((d) => '₀₁₂₃₄₅₆₇₈₉'[d]).join('');

  let n = $state(1);
  const at = $derived(blobPoint(260, 130, 205, 102, W, scale(n), 0.35));
  const ring = $derived(blobPoint(260, 130, 205, 102, W, (1 + scale(n)) / 2, Math.PI));
</script>

<figure class="anim decreasing">
  <svg viewBox="0 0 520 262" role="img" aria-label="Nested sets E0 containing E1 containing E2 and so on, with their intersection E dashed; the set An, E0 minus En, is shaded">
    {#if n > 0}<path class="ring" d="{sets[0]} {sets[n]}" fill-rule="evenodd" />{/if}
    {#each sets as d, k}
      <path class="edge" class:current={k === n} {d} />
    {/each}
    <path class="limit" d={meet} />
    <text class="lab" x="260" y="130">E</text>
    {#if n > 0}<text class="lab accent" x={ring[0]} y={ring[1]}>A{sub(n)}</text>{/if}
    <text class="lab accent" x={at[0] - 10} y={at[1] + 18}>E{sub(n)}</text>
    <text class="lab" x="478" y="36">E₀</text>
  </svg>
  <p class="line">A{sub(n)} = E₀ \ E{sub(n)}{n === 0 ? ' = ∅' : ''}</p>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="n" min={0} max={COUNT - 1} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .decreasing { margin: 1.5rem auto; max-width: 30rem; }
  svg { font-family: var(--anim-font); }
  .ring { fill: var(--anim-accent); fill-opacity: 0.2; stroke: none; }
  .edge { fill: none; stroke: var(--anim-muted); stroke-width: 1.1; }
  .edge.current { stroke: var(--anim-accent); stroke-width: 2.2; }
  .limit { fill: none; stroke: var(--anim-ink); stroke-width: 1.4; stroke-dasharray: 6 5; }
  text { fill: var(--anim-ink); font-size: 20px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .accent { fill: var(--anim-accent); }
  .line { margin: 0.3rem 0 0; text-align: center; font-style: italic; color: var(--anim-ink); }
</style>
