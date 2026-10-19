<script>
  // Example 4: the values f_n(x) ∈ {0, 1} of the typewriter sequence for
  // n = 1, …, 62 at the x of the slider, the groups of 2, 4, 8, 16 and 32 terms
  // separated by faint lines, the dashed line at N, and the first n_1 ≥ N with
  // f_{n_1}(x) = 0 and the first n_2 ≥ N with f_{n_2}(x) = 1, ringed. The
  // sliders set x and N.
  import Slider from '@toolkit/Slider.svelte';
  import { typewriterValue } from './plot.js';

  const NMAX = 62;
  const sx = (n) => 58 + (n - 1) * 10;
  const Y1 = 72, Y0 = 158;
  const ns = Array.from({ length: NMAX }, (_, i) => i + 1);
  const groups = [2.5, 6.5, 14.5, 30.5];
  const marks = [1, 3, 7, 15, 31, 62];

  let x = $state(0.3);
  let N = $state(9);
  const values = $derived(ns.map((n) => typewriterValue(n, x)));
  const n1 = $derived(ns.find((n) => n >= N && values[n - 1] === 0));
  const n2 = $derived(ns.find((n) => n >= N && values[n - 1] === 1));
</script>

<figure class="anim witnesses">
  <svg viewBox="0 0 690 220" role="img" aria-label="The values 0 or 1 of the typewriter sequence at the chosen point x for n from 1 to 62, a dashed line at N, and the first index after N where the value is 0 and the first where it is 1, ringed">
    <line class="row" x1={sx(1) - 10} y1={Y1} x2={sx(NMAX) + 10} y2={Y1} />
    <line class="row" x1={sx(1) - 10} y1={Y0} x2={sx(NMAX) + 10} y2={Y0} />
    {#each groups as g}
      <line class="group" x1={sx(g)} y1={Y1 - 22} x2={sx(g)} y2={Y0 + 22} />
    {/each}
    <line class="cut" x1={sx(N) - 5} y1={Y1 - 34} x2={sx(N) - 5} y2={Y0 + 24} />
    {#each ns as n}
      <circle class={n >= N ? 'dot' : 'dot faint'} cx={sx(n)} cy={values[n - 1] ? Y1 : Y0} r="3.4" />
    {/each}
    {#if n1}
      <circle class="ring" cx={sx(n1)} cy={Y0} r="8" />
      <text class="lab" x={sx(n1)} y={Y0 + 26}>n<tspan class="sub" dy="5">1</tspan></text>
    {/if}
    {#if n2}
      <circle class="ring" cx={sx(n2)} cy={Y1} r="8" />
      <text class="lab left" x={sx(n2) + 12} y={Y1 - 20}>n<tspan class="sub" dy="5">2</tspan></text>
    {/if}
    <text class="lab dark" x={sx(N) - 5} y={Y1 - 46}>N</text>
    <text class="num" x="28" y={Y1}>1</text>
    <text class="num" x="28" y={Y0}>0</text>
    <text class="num it" x="28" y={Y0 + 46}>n</text>
    {#each marks as m}
      <text class="num" x={sx(m)} y={Y0 + 46}>{m}</text>
    {/each}
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="x" min={0} max={1} step={0.01} bind:value={x} format={(v) => v.toFixed(2)} />
      <Slider label="N" min={1} max={31} step={1} bind:value={N} />
    </div>
  </div>
</figure>

<style>
  .witnesses { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .row { stroke: var(--anim-rule); stroke-width: 1; }
  .group { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 4; }
  .cut { stroke: var(--anim-accent); stroke-width: 1.6; stroke-dasharray: 6 4; }
  .dot { fill: var(--anim-ink); }
  .faint { fill: var(--anim-muted); fill-opacity: 0.55; }
  .ring { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; fill: var(--anim-accent); }
  .lab.dark { fill: var(--anim-accent); }
  .left { text-anchor: start; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: normal; }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
