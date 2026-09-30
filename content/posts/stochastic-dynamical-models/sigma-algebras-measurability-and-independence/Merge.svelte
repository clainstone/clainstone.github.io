<script>
  // Section 7, an instance: X takes the values 1, …, 6 and Y = h(X) tells whether
  // X ≤ 3. The 6 blocks of X (as in Figure 6) merge into the 2 blocks of Y; the
  // block {X = 2} is an event of σ(X) that cuts the block {X ≤ 3} of Y.
  const BW = 104, X0 = 38, G = 10;
  const bx = (k) => X0 + k * (BW + G);
  const cx = (k, j) => bx(k) + 30 + j * 44;
  const merged = [{ from: 0, to: 2, head: 'X ≤ 3' }, { from: 3, to: 5, head: 'X ≥ 4' }];
</script>

<figure class="anim merge">
  <svg viewBox="0 0 760 290" role="img" aria-label="Six blocks of X, each with two outcomes, merged into two blocks of Y: X at most 3 and X at least 4; the block X = 2 is shaded in both rows">
    <text class="row" x={X0} y="16">blocks of <tspan class="it">X</tspan></text>
    {#each Array(6) as _, k}
      <rect class="block" class:on={k === 1} x={bx(k)} y="34" width={BW} height="56" rx="14" />
      <text x={bx(k) + BW / 2} y="110">{'{'}<tspan class="it">X</tspan> = {k + 1}{'}'}</text>
      {#each [0, 1] as j}<circle class="pt" class:hot={k === 1} cx={cx(k, j)} cy="62" r="7" />{/each}
    {/each}
    <text class="row" x={X0} y="146">blocks of <tspan class="it">Y</tspan> = <tspan class="it">h</tspan>(<tspan class="it">X</tspan>)</text>
    {#each merged as m, n}
      {@const x = bx(m.from)}
      {@const w = bx(m.to) + BW - bx(m.from)}
      <rect class="block" class:cutb={n === 0} x={x} y="170" width={w} height="56" rx="14" />
      <text x={x + w / 2} y="246">{'{'}<tspan class="it">X</tspan> {m.head.slice(2)}{'}'}</text>
      {#each Array(6) as _, i}
        {@const k = m.from + Math.floor(i / 2)}
        <circle class="pt" class:hot={k === 1} cx={cx(k, i % 2)} cy="198" r="7" />
      {/each}
    {/each}
    <text class="note" x={X0} y="276">{'{'}<tspan class="it">X</tspan> = 2{'}'} is a block of <tspan class="it">X</tspan> but cuts the block {'{'}<tspan class="it">X</tspan> ≤ 3{'}'} of <tspan class="it">Y</tspan></text>
  </svg>
</figure>

<style>
  .merge { margin: 1.5rem auto; max-width: 40rem; }
  svg { font-family: var(--anim-font); }
  .block { fill: none; stroke: var(--anim-ink); stroke-width: 1.3; }
  .block.on { fill: var(--anim-accent); fill-opacity: 0.25; stroke: var(--anim-accent); }
  .block.cutb { stroke: var(--anim-accent); stroke-width: 2; stroke-dasharray: 6 5; }
  .join { stroke: var(--anim-rule); stroke-width: 1.2; }
  .pt { fill: var(--anim-muted); }
  .pt.hot { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .row { text-anchor: start; fill: var(--anim-muted); font-size: 16px; }
  .note { text-anchor: start; font-size: 16px; }
  .it { font-style: italic; }
</style>
