<script>
  // Proposition 6 (i), an instance: nested sets E₀ ⊂ E₁ ⊂ … growing towards
  // their union E (dashed). The slider sets N; the rings F₀ = E₀ and
  // Fₙ₊₁ = Eₙ₊₁ \ Eₙ up to F_N are shaded, and their union is E_N.
  import Slider from '@toolkit/Slider.svelte';
  import { blob } from './shapes.js';

  const W = [[0.07, 3, 0.5], [0.04, 5, 1.7]];
  const shape = (s) => blob(260, 130, 200, 100, W, s);
  const scale = (n) => 1 - 0.6 * 0.6 ** n;
  const COUNT = 7;
  const sets = Array.from({ length: COUNT }, (_, n) => shape(scale(n)));
  const union = shape(1);

  let N = $state(2);
  const rings = $derived(Array.from({ length: N + 1 }, (_, n) => (n === 0 ? sets[0] : `${sets[n]} ${sets[n - 1]}`)));
</script>

<figure class="anim increasing">
  <svg viewBox="0 0 520 262" role="img" aria-label="Nested sets E0 inside E1 inside E2 and so on, with their union E dashed; the rings F0 up to FN are shaded">
    {#each rings as d, n}
      <path class="ring" style:fill-opacity={n % 2 ? 0.28 : 0.14} {d} fill-rule="evenodd" />
    {/each}
    {#each sets as d, n}
      <path class="edge" class:current={n === N} {d} />
    {/each}
    <path class="limit" d={union} />
    <text class="lab" x="260" y="130">F<tspan dy="5" font-size="0.72em" font-style="normal">0</tspan><tspan dy="-5"> = E</tspan><tspan dy="5" font-size="0.72em" font-style="normal">0</tspan></text>
    <text class="lab" x="478" y="36">E</text>
  </svg>
  <p class="line"><i>E</i><sub>{N}</sub> = <i>F</i><sub>0</sub>{#if N === 1}{' ∪ '}<i>F</i><sub>1</sub>{:else if N > 1}{' ∪ … ∪ '}<i>F</i><sub>{N}</sub>{/if}</p>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="N" min={0} max={COUNT - 1} step={1} bind:value={N} />
    </div>
  </div>
</figure>

<style>
  .increasing { margin: 1.5rem auto; max-width: 30rem; }
  svg { font-family: var(--anim-font); }
  .ring { fill: var(--anim-accent); stroke: none; }
  .edge { fill: none; stroke: var(--anim-muted); stroke-width: 1.1; }
  .edge.current { stroke: var(--anim-accent); stroke-width: 2.2; }
  .limit { fill: none; stroke: var(--anim-ink); stroke-width: 1.4; stroke-dasharray: 6 5; }
  text { fill: var(--anim-ink); font-size: 17px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .accent { fill: var(--anim-accent); }
  .line { margin: 0.3rem 0 0; text-align: center; color: var(--anim-ink); }
</style>
