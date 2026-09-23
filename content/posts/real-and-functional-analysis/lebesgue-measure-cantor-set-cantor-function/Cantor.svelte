<script>
  // Definition 5: the sets T₀, T₁, …, T₆ of the construction of the Cantor
  // set, each obtained from the previous one by removing the open middle
  // third of every interval. The slider sets k and highlights T_k; the sets
  // after it are faint.
  import Slider from '@toolkit/Slider.svelte';

  const KMAX = 6;
  const X0 = 70, X1 = 610, TOP = 46, STEP = 38;
  const px = (x) => X0 + x * (X1 - X0);

  // The 2^k closed intervals of T_k, as pairs [left, right].
  function intervals(k) {
    let list = [[0, 1]];
    for (let j = 0; j < k; j++) {
      list = list.flatMap(([a, b]) => { const t = (b - a) / 3; return [[a, a + t], [b - t, b]]; });
    }
    return list;
  }
  const rows = Array.from({ length: KMAX + 1 }, (_, k) => intervals(k));
  // The points labelled on T₀ and on T₁ in the drawing of the lecture.
  const ticks = [
    [[0, '0'], [1 / 3, '1/3'], [2 / 3, '2/3'], [1, '1']],
    [[1 / 9, '1/9'], [2 / 9, '2/9'], [7 / 9, '7/9'], [8 / 9, '8/9']],
  ];

  let k = $state(2);
</script>

<figure class="anim cantor">
  <svg viewBox="0 0 640 330" role="img" aria-label="The sets T0 to T6 of the Cantor construction, one row each, with Tk highlighted and the later sets faint">
    {#each rows as list, r}
      <text class="row" class:later={r > k} x="30" y={TOP + r * STEP}>T<tspan dy="5" font-size="12" font-style="normal">{r}</tspan></text>
      {#each list as [a, b]}
        <line class="piece" class:last={r === k} class:later={r > k} x1={px(a)} y1={TOP + r * STEP} x2={Math.max(px(b), px(a) + 1)} y2={TOP + r * STEP} />
      {/each}
    {/each}
    {#each ticks as row, r}
      {#if r <= k}
        {#each row as [x, label]}
          <text class="num" x={px(x)} y={TOP + r * STEP - 19}>{label}</text>
        {/each}
      {/if}
    {/each}
    <text class="note" x="340" y="314">T<tspan dy="5" font-size="12" font-style="normal">{k}</tspan><tspan dy="-5" font-style="normal">: {2 ** k} closed {k === 0 ? 'interval' : 'intervals'} of length {k === 0 ? '1' : `1/${3 ** k}`}</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="k" min={0} max={KMAX} step={1} bind:value={k} />
    </div>
  </div>
</figure>

<style>
  .cantor { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .piece { stroke: var(--anim-muted); stroke-width: 6; stroke-linecap: butt; }
  .piece.last { stroke: var(--anim-accent); }
  .piece.later { stroke: var(--anim-rule); }
  .row.later { fill: var(--anim-rule); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .row { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .note { font-style: italic; }
</style>
