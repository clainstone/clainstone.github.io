<script>
  // Exercise 5, an instance: a path Y₀, …, Y₄₀ with Y₀ = 1 and
  // Y_{n+1} = Yₙ(2Z_{n+1} − 1), the Zₙ Bernoulli with parameter q. The slider
  // sets q and the button draws another path.
  import Slider from '@toolkit/Slider.svelte';
  import { mulberry32 } from './draw.js';

  const LEN = 40, X0 = 70, X1 = 610, YP = 60, YM = 170;
  const px = (n) => X0 + (n * (X1 - X0)) / LEN;
  let q = $state(0.7);
  let seed = $state(3);
  const ys = $derived.by(() => {
    const u = mulberry32(seed);
    const out = [1];
    for (let n = 0; n < LEN; n++) out.push(out[n] * (u() < q ? 1 : -1));
    return out;
  });
</script>

<figure class="anim sign-path">
  <svg viewBox="0 0 640 230" role="img" aria-label="A path of the chain Y_n with values +1 and -1 over 40 steps">
    <line class="grid" x1={X0} y1={YP} x2={X1} y2={YP} />
    <line class="grid" x1={X0} y1={YM} x2={X1} y2={YM} />
    <text class="lab" x={X0 - 34} y={YP}>+1</text>
    <text class="lab" x={X0 - 34} y={YM}>−1</text>
    {#each ys as y, n}
      {#if n > 0}<line class="step" class:flip={y !== ys[n - 1]} x1={px(n - 1)} y1={ys[n - 1] > 0 ? YP : YM} x2={px(n)} y2={y > 0 ? YP : YM} />{/if}
    {/each}
    {#each ys as y, n}
      <circle class="pt" cx={px(n)} cy={y > 0 ? YP : YM} r="4" />
    {/each}
    {#each [0, 10, 20, 30, 40] as n}
      <text class="num" x={px(n)} y="205">{n}</text>
    {/each}
    <text class="lab" x={X1 + 18} y="205">n</text>
  </svg>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New path</button>
    <div class="anim-sliders">
      <Slider label="q" min={0.05} max={0.95} step={0.01} bind:value={q} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .sign-path { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .grid { stroke: var(--anim-rule); stroke-width: 1; }
  .step { stroke: var(--anim-muted); stroke-width: 1.4; }
  .step.flip { stroke: var(--anim-accent); stroke-width: 1.8; }
  .pt { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { fill: var(--anim-muted); font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
