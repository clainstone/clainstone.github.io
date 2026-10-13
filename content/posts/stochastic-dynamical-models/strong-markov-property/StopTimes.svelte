<script>
  // Definition 6.2 on an instance: a path X_0, ..., X_14 of the chain of
  // Example 2.1 started at X_0 = 2. The slider sets n: the states up to time n
  // are drawn in full, the later ones faint, and the figure says whether
  // T_j <= n and U_j <= n, reading only X_0, ..., X_n. T_j is ringed and U_j
  // boxed once they are at most n. The buttons choose j and draw another path.
  import Slider from '@toolkit/Slider.svelte';
  import { path, entrance, exit } from './chain.js';

  const LEN = 14, X0 = 84, X1 = 716, Y = { 3: 56, 2: 110, 1: 164 };
  const px = (n) => X0 + (n * (X1 - X0)) / LEN;
  let seed = $state(19);
  let j = $state(2);
  let n = $state(3);
  const xs = $derived(path(seed, 2, LEN));
  const t = $derived(entrance(xs, j));
  const u = $derived(exit(xs, j));
</script>

<figure class="anim stop-times">
  <svg viewBox="0 0 760 290" role="img" aria-label="A path of the chain of Example 2.1 over 14 steps, drawn in full up to the time n set by the slider, with the first entrance in j and the first exit from j marked when they are at most n">
    <rect class="past" x={px(0) - 14} y="34" width={px(n) - px(0) + 28} height="152" />
    {#each [1, 2, 3] as s}
      <line class="grid" class:target={s === j} x1={X0} y1={Y[s]} x2={X1} y2={Y[s]} />
      <text class="lab" class:target={s === j} x={X0 - 36} y={Y[s]}>{s}</text>
    {/each}
    {#each xs as x, k}
      {#if k > 0}
        <line class="step" class:later={k > n} x1={px(k - 1)} y1={Y[xs[k - 1]]} x2={px(k)} y2={Y[x]} />
      {/if}
    {/each}
    {#each xs as x, k}
      <circle class="pt" class:later={k > n} cx={px(k)} cy={Y[x]} r="5" />
      <text class="num" x={px(k)} y="206">{k}</text>
    {/each}
    {#if t <= n}<circle class="ring" cx={px(t)} cy={Y[xs[t]]} r="11" />{/if}
    {#if u <= n}<rect class="box" x={px(u) - 10} y={Y[xs[u]] - 10} width="20" height="20" />{/if}
    <text class="lab it" x={px(n)} y="20">n</text>
    <text class="lab it" x={X1 + 26} y="206">n</text>
    <circle class="ring" cx={X0 + 8} cy="240" r="9" />
    <text class="status" x={X0 + 28} y="240"><tspan class="it">T</tspan><tspan class="sub" dy="5">{j}</tspan><tspan dy="-5">{t <= n ? ` = ${t} ≤ ` : ' > '}</tspan><tspan class="it">n</tspan></text>
    <rect class="box" x={X0 + 324} y="231" width="18" height="18" />
    <text class="status" x={X0 + 356} y="240"><tspan class="it">U</tspan><tspan class="sub" dy="5">{j}</tspan><tspan dy="-5">{u <= n ? ` = ${u} ≤ ` : ' > '}</tspan><tspan class="it">n</tspan></text>
    <text class="note" x={(X0 + X1) / 2} y="274">{n === 0 ? 'decided by the state at time 0 only' : `decided by the states at the times 0 to ${n} only`}</text>
  </svg>
  <div class="anim-controls">
    {#each [1, 2, 3] as s}
      <button type="button" class="anim-toggle" aria-pressed={s === j} onclick={() => (j = s)}>j = {s}</button>
    {/each}
    <button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New path</button>
    <div class="anim-sliders">
      <Slider label="n" min={0} max={LEN} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .stop-times { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .past { fill: var(--anim-accent); fill-opacity: 0.07; stroke: var(--anim-accent); stroke-opacity: 0.3; stroke-dasharray: 4 4; }
  .grid { stroke: var(--anim-rule); stroke-width: 1; }
  .grid.target { stroke: var(--anim-accent); stroke-opacity: 0.45; stroke-width: 2; }
  .step { stroke: var(--anim-ink); stroke-width: 1.5; }
  .step.later { stroke: var(--anim-rule); stroke-dasharray: 3 3; }
  .pt { fill: var(--anim-ink); }
  .pt.later { fill: var(--anim-rule); }
  .ring { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; }
  .box { fill: none; stroke: var(--anim-ink); stroke-width: 1.8; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { fill: var(--anim-muted); }
  .lab.target { fill: var(--anim-accent); }
  .it { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .sub { font-size: 13px; }
  .status { text-anchor: start; }
  .note { fill: var(--anim-muted); font-size: 16px; }
  .anim-toggle[aria-pressed='true'] { color: var(--anim-ink); border-color: var(--anim-accent); }
  .stop-times :global(.anim-slider-label) { font-style: italic; }
</style>
