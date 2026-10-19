<script>
  // Proof of Remark 12, an instance of the indices: the indices n = 1, …, 24,
  // the indices n_k of a subsequence (f_{n_k}), and the indices n_{k_l} of a
  // subsequence of it, each row a subset of the row above. The choice of the
  // subsets is only an instance.
  const COUNT = 24;
  const sx = (i) => 130 + (i - 1) * 22;
  const ROWS = [52, 112, 172];
  const all = Array.from({ length: COUNT }, (_, i) => i + 1);
  const sub = [2, 4, 5, 8, 11, 13, 16, 18, 21, 23];
  const subsub = [4, 11, 16, 23];
</script>

<figure class="anim indices">
  <svg viewBox="0 0 690 206" role="img" aria-label="Three rows of indices: all the indices from 1 to 24, below them the indices of a subsequence, and at the bottom the indices of a subsequence of that subsequence">
    {#each sub as i}
      <line class="link" x1={sx(i)} y1={ROWS[0] + 6} x2={sx(i)} y2={ROWS[1] - 6} />
    {/each}
    {#each subsub as i}
      <line class="link strong" x1={sx(i)} y1={ROWS[1] + 6} x2={sx(i)} y2={ROWS[2] - 7} />
    {/each}
    {#each all as i}
      <circle class="dot faint" cx={sx(i)} cy={ROWS[0]} r="3.6" />
      <text class="num" x={sx(i)} y={ROWS[0] - 22}>{i}</text>
    {/each}
    {#each sub as i}
      <circle class="dot" cx={sx(i)} cy={ROWS[1]} r="4.2" />
    {/each}
    {#each subsub as i}
      <circle class="dot accent" cx={sx(i)} cy={ROWS[2]} r="5.2" />
    {/each}
    {#each ROWS as y}
      <text class="num" x={sx(COUNT) + 28} y={y}>…</text>
    {/each}

    <text class="it" x="62" y={ROWS[0]}>n</text>
    <text class="it" x="62" y={ROWS[1]}>n<tspan class="sub" dy="5">k</tspan></text>
    <text class="it accent" x="62" y={ROWS[2]}>n<tspan class="sub" dy="5">k</tspan><tspan class="subsub" dy="4">l</tspan></text>
  </svg>
</figure>

<style>
  .indices { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .link { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 3 3; }
  .link.strong { stroke: var(--anim-accent); }
  .dot { fill: var(--anim-ink); }
  .dot.faint { fill: var(--anim-muted); }
  .dot.accent { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
  .subsub { font-size: 11px; }
  .accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
