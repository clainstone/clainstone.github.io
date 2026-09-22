<script>
  // The Chapman–Kolmogorov equations on the frog chain: to go from i to j in
  // n + m steps the chain is in some state k at time n. Each k contributes
  // p_ik^(n) p_kj^(m); the contributions add up to p_ij^(n+m). All seven
  // paths are always drawn, so that none disappears when its product is 0.
  import Slider from '@toolkit/Slider.svelte';
  import { P, powers } from './frog.js';

  const POW = powers(P, 24);

  let n = $state(2);
  let m = $state(3);
  let i = $state(1);
  let j = $state(3);

  const xs = [60, 310, 560];
  const y = (s) => 30 + s * 44;
  const terms = $derived(P.map((_, k) => ({ k, a: POW[n][i - 1][k], b: POW[m][k][j - 1] })).map((t) => ({ ...t, c: t.a * t.b })));
  const total = $derived(terms.reduce((s, t) => s + t.c, 0));
  const direct = $derived(POW[n + m][i - 1][j - 1]);
  const f = (v) => v.toFixed(4);
</script>

<figure class="anim ck">
  <svg viewBox="0 0 620 350" role="img" aria-label="Three columns of the seven states at times 0, n and n plus m; lines from i to every state k and from k to j, drawn thicker for larger contributions">
    <!-- Every path i -> k -> j is drawn. A step of probability 0 is dashed and
         faint; a path that contributes is thicker when p_ik^(n) p_kj^(m) is larger. -->
    {#each terms as t}
      {@const w = t.c > 0 ? 1 + (10 * t.c) / total : 1.2}
      <path class="step" class:on={t.a > 0} class:path={t.c > 0} style:stroke-width={t.c > 0 ? w : null}
        d="M{xs[0]},{y(i - 1)} L{(xs[0] + xs[1]) / 2},{(y(i - 1) + y(t.k)) / 2} L{xs[1]},{y(t.k)}" />
      <path class="step" class:on={t.b > 0} class:path={t.c > 0} style:stroke-width={t.c > 0 ? w : null}
        d="M{xs[1]},{y(t.k)} L{(xs[1] + xs[2]) / 2},{(y(t.k) + y(j - 1)) / 2} L{xs[2]},{y(j - 1)}" />
    {/each}
    {#each xs as x, c}
      {#each P as _, s}
        <circle class="node" class:on={(c === 0 && s === i - 1) || (c === 2 && s === j - 1)} cx={x} cy={y(s)} r="13" />
        <text class="name" {x} y={y(s)}>{s + 1}</text>
      {/each}
    {/each}
    <text class="time" x={xs[0]} y="340">time 0</text>
    <text class="time" x={xs[1]} y="340">time <tspan font-style="italic">n</tspan> = {n}</text>
    <text class="time" x={xs[2]} y="340">time <tspan font-style="italic">n</tspan> + <tspan font-style="italic">m</tspan> = {n + m}</text>
  </svg>
  <p class="readout">
    <span class="nowrap">∑<sub>k</sub> <i>p</i><sub>{i}<i>k</i></sub><sup>({n})</sup><i>p</i><sub><i>k</i>{j}</sub><sup>({m})</sup> = {f(total)}</span>,
    <span class="nowrap"><i>p</i><sub>{i}{j}</sub><sup>({n + m})</sup> = {f(direct)}</span>
  </p>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="i" min={1} max={7} step={1} bind:value={i} />
      <Slider label="j" min={1} max={7} step={1} bind:value={j} />
      <Slider label="n" min={1} max={12} step={1} bind:value={n} />
      <Slider label="m" min={1} max={12} step={1} bind:value={m} />
    </div>
  </div>
</figure>

<style>
  .ck { margin: 1.5rem auto; max-width: 34rem; }
  svg { font-family: var(--anim-font); }
  .step { fill: none; stroke: var(--anim-rule); stroke-width: 1.2; stroke-dasharray: 3 4; }
  .step.on { stroke: var(--anim-muted); stroke-opacity: 0.7; stroke-dasharray: none; }
  .step.path { stroke: var(--anim-accent); stroke-opacity: 0.55; stroke-linecap: round; stroke-dasharray: none; }
  .node { fill: var(--page, #fff); stroke: var(--anim-muted); stroke-width: 1.4; }
  .node.on { stroke: var(--anim-accent); stroke-width: 3; }
  .name { fill: var(--anim-ink); font-size: 16px; text-anchor: middle; dominant-baseline: central; }
  .time { fill: var(--anim-muted); font-size: 16px; text-anchor: middle; }
  .readout { margin: 0.4rem 0 0; font-size: 0.875rem; color: var(--anim-muted); font-variant-numeric: tabular-nums; }
</style>
