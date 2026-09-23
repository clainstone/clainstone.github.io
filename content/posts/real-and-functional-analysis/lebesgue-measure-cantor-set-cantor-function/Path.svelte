<script>
  // The proof of Theorem 6 (1): the terms of a sequence of 0s and 1s choose,
  // row after row, the left (0) or the right (1) of the two intervals left in
  // the interval chosen before. The buttons change the first five terms; at
  // the start they are those of (0, 1, 1, 0, 1, …), as in the lecture.
  const LEVELS = 5;
  const X0 = 70, X1 = 610, TOP = 36, STEP = 44;
  const px = (x) => X0 + x * (X1 - X0);

  function intervals(k) {
    let list = [[0, 1]];
    for (let j = 0; j < k; j++) {
      list = list.flatMap(([a, b]) => { const t = (b - a) / 3; return [[a, a + t], [b - t, b]]; });
    }
    return list;
  }
  const rows = Array.from({ length: LEVELS + 1 }, (_, k) => intervals(k));

  let terms = $state([0, 1, 1, 0, 1]);
  const chosen = $derived.by(() => {
    const out = [[0, 1]];
    for (const d of terms) {
      const [a, b] = out[out.length - 1];
      const t = (b - a) / 3;
      out.push(d === 0 ? [a, a + t] : [b - t, b]);
    }
    return out;
  });
  const flip = (j) => (terms = terms.map((d, i) => (i === j ? 1 - d : d)));
</script>

<figure class="anim path">
  <svg viewBox="0 0 640 276" role="img" aria-label="The rows T0 to T5 of the Cantor construction; the terms of a sequence of 0s and 1s choose one interval in each row, and a line joins the chosen intervals">
    {#each rows as list, r}
      <text class="row" x="30" y={TOP + r * STEP}>T<tspan dy="5" font-size="12" font-style="normal">{r}</tspan></text>
      {#each list as [a, b]}
        <line class="piece" x1={px(a)} y1={TOP + r * STEP} x2={Math.max(px(b), px(a) + 1.5)} y2={TOP + r * STEP} />
      {/each}
    {/each}
    <polyline class="route" points={chosen.map(([a, b], r) => `${px((a + b) / 2)},${TOP + r * STEP}`).join(' ')} />
    {#each chosen as [a, b], r}
      <line class="pick" x1={px(a)} y1={TOP + r * STEP} x2={Math.max(px(b), px(a) + 3)} y2={TOP + r * STEP} />
      {#if r > 0}
        <text class="digit" x={px((a + b) / 2) + (terms[r - 1] === 0 ? -16 : 16)} y={TOP + r * STEP - 16}>{terms[r - 1]}</text>
      {/if}
    {/each}
  </svg>
  <p class="line">({terms.join(', ')}, …)</p>
  <div class="anim-controls">
    {#each terms as d, j}
      <button type="button" class="anim-toggle" aria-label="Change f({j}), now {d}" onclick={() => flip(j)}>f({j}) = {d}</button>
    {/each}
  </div>
</figure>

<style>
  .path { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .piece { stroke: var(--anim-muted); stroke-width: 4; stroke-opacity: 0.55; }
  .pick { stroke: var(--anim-accent); stroke-width: 7; }
  .route { fill: none; stroke: var(--anim-accent); stroke-width: 1.6; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .row { font-style: italic; }
  .digit { fill: var(--anim-accent); }
  .line { margin: 0.3rem 0 0; text-align: center; color: var(--anim-ink); font-variant-numeric: tabular-nums; }
  .anim-toggle { color: var(--anim-ink); }
</style>
