<script>
  // Theorem 6.3, second claim, on an instance: a state j whose row of the
  // transition matrix gives p_jj to j and the rest to two states k and l.
  // Outlines, the row of j; filled, P_j{X_(U_j) = k} = p_jk / (1 - p_jj) and
  // the same for l. The sliders set p_jj and p_jk; p_jl is what remains.
  const uid = $props.id();
  const BASE = 236, TOP = 52;
  const X = { j: 170, k: 330, l: 490 };
  const ry = (v) => BASE - (BASE - TOP) * v;
  let pjj = $state(0.5);
  let pjk = $state(0.3);
  $effect(() => {
    if (pjk > 1 - pjj) pjk = Math.round((1 - pjj) * 100) / 100;
  });
  const pjl = $derived(Math.max(0, Math.round((1 - pjj - pjk) * 100) / 100));
  const row = $derived({ j: pjj, k: pjk, l: pjl });
  const exits = $derived({ k: pjk / (1 - pjj), l: pjl / (1 - pjj) });
</script>

<figure class="anim exit">
  <svg viewBox="0 0 760 276" role="img" aria-label="Outlined bars for the row of the transition matrix from j to j, k and l, and filled bars for the probabilities that the chain started at j, at its first exit from j, is in k or in l">
    <line class="axis" x1={X.j - 70} y1={BASE} x2={X.l + 70} y2={BASE} />
    {#each [0, 0.5, 1] as v}
      <line class="guide" x1={X.j - 70} y1={ry(v)} x2={X.l + 70} y2={ry(v)} />
      <text class="num" x={X.j - 98} y={ry(v)}>{v.toFixed(1)}</text>
    {/each}
    {#each ['j', 'k', 'l'] as s}
      <rect class="row" x={X[s] - 36} y={ry(row[s])} width="72" height={BASE - ry(row[s])} />
      {#if s !== 'j'}
        <rect class="bar" x={X[s] - 22} y={ry(exits[s])} width="44" height={BASE - ry(exits[s])} />
        <text class="val" x={X[s]} y={ry(exits[s]) - 14}>{exits[s].toFixed(2)}</text>
      {/if}
      <text class="lab it" x={X[s]} y={BASE + 22}>{s}</text>
    {/each}
    <rect class="row" x="600" y="104" width="18" height="18" />
    <text class="key" x="630" y="113">row of <tspan class="it">j</tspan></text>
    <rect class="bar" x="600" y="140" width="18" height="18" />
    <text class="key" x="630" y="149"><tspan class="it">X</tspan><tspan class="sub" dy="5">U</tspan><tspan class="subsub" dy="3">j</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <label class="anim-slider" for="{uid}-jj">
        <span class="anim-slider-label"><i>p</i><sub>jj</sub></span>
        <input id="{uid}-jj" type="range" min="0.05" max="0.95" step="0.05" bind:value={pjj} />
        <output for="{uid}-jj">{pjj.toFixed(2)}</output>
      </label>
      <label class="anim-slider" for="{uid}-jk">
        <span class="anim-slider-label"><i>p</i><sub>jk</sub></span>
        <input id="{uid}-jk" type="range" min="0" max={Math.round((1 - pjj) * 100) / 100} step="0.05" bind:value={pjk} />
        <output for="{uid}-jk">{pjk.toFixed(2)}</output>
      </label>
    </div>
  </div>
</figure>

<style>
  .exit { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  .bar { fill: var(--anim-accent); fill-opacity: 0.55; stroke: var(--anim-accent); stroke-width: 1; }
  .row { fill: none; stroke: var(--anim-muted); stroke-width: 1.6; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .val { font-size: 16px; }
  .lab { fill: var(--anim-muted); }
  .it { font-style: italic; }
  .key { font-size: 17px; fill: var(--anim-muted); text-anchor: start; }
  .sub { font-size: 13px; }
  .subsub { font-size: 11px; }
  .anim-slider-label sub { font-size: 0.75em; font-style: italic; }
</style>
