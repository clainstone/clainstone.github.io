<script>
  // Section 6, an instance: a set Ω of 12 outcomes, partitioned by the values
  // 1, …, 6 of X into blocks of 2. Clicking an outcome adds it to the event A or
  // removes it; the figure says whether A cuts a block, that is, whether A ∈ σ(X).
  const N = 6, BW = 104, X0 = 38;
  const cx = (k, j) => X0 + k * (BW + 10) + 30 + j * 44;
  let inA = $state([false, false, true, true, false, false, false, false, true, false, false, false]);
  const cut = $derived(Array.from({ length: N }, (_, k) => inA[2 * k] !== inA[2 * k + 1]));
  const firstCut = $derived(cut.findIndex(Boolean));
  const toggle = (i) => (inA[i] = !inA[i]);
  const key = (e, i) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(i); } };
</script>

<figure class="anim blocks">
  <svg viewBox="0 0 760 196" role="group" aria-label="Twelve outcomes in six blocks of X; each outcome is a button that adds it to the event A or removes it">
    {#each Array(N) as _, k}
      {@const x = X0 + k * (BW + 10)}
      <rect class="block" class:cut={cut[k]} x={x} y="44" width={BW} height="64" rx="14" />
      <text x={x + BW / 2} y="24">{'{'}<tspan class="it">X</tspan> = {k + 1}{'}'}</text>
      {#each [0, 1] as j}
        {@const i = 2 * k + j}
        <circle class="pt" class:on={inA[i]} cx={cx(k, j)} cy="76" r="12" role="checkbox" aria-checked={inA[i]} aria-label="outcome {i + 1}, value {k + 1}" tabindex="0" onclick={() => toggle(i)} onkeydown={(e) => key(e, i)} />
      {/each}
    {/each}
    <text class="status" x={X0} y="146">
      {#if firstCut >= 0}<tspan class="it">A</tspan> cuts the block {'{'}<tspan class="it">X</tspan> = {firstCut + 1}{'}'}: <tspan class="it">A</tspan> is not in σ(<tspan class="it">X</tspan>)
      {:else}<tspan class="it">A</tspan> is a union of blocks: <tspan class="it">A</tspan> ∈ σ(<tspan class="it">X</tspan>){/if}
    </text>
    <text class="hint" x={X0} y="178">filled outcomes are in <tspan class="it">A</tspan>; a dashed block is cut</text>
  </svg>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => (inA = inA.map(() => false))}>Empty A</button>
  </div>
</figure>

<style>
  .blocks { margin: 1.5rem auto; max-width: 40rem; }
  svg { font-family: var(--anim-font); }
  .block { fill: none; stroke: var(--anim-ink); stroke-width: 1.3; }
  .block.cut { stroke: var(--anim-accent); stroke-width: 2; stroke-dasharray: 6 5; }
  .pt { fill: var(--anim-bg, transparent); stroke: var(--anim-ink); stroke-width: 1.5; cursor: pointer; }
  .pt.on { fill: var(--anim-accent); stroke: var(--anim-accent); }
  .pt:focus-visible { outline: none; stroke: var(--anim-accent); stroke-width: 3; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .status { text-anchor: start; }
  .hint { text-anchor: start; fill: var(--anim-muted); font-size: 16px; }
</style>
