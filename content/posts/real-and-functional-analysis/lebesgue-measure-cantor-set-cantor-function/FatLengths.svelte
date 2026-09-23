<script>
  // Example 7: the lengths 2α/2^(m+2) of the intervals that form A, placed end
  // to end along a segment of length 1, the lengths for m ≥ 14 as one piece,
  // whose length is their sum α/2^14. Together they measure α, marked below;
  // the rest of the segment measures 1 − α. The slider sets α.
  import Slider from '@toolkit/Slider.svelte';

  const X0 = 40, X1 = 600, Y = 78;
  const px = (x) => X0 + x * (X1 - X0);
  const COUNT = 14;
  let alpha = $state(0.5);
  const pieces = $derived.by(() => {
    let at = 0;
    return Array.from({ length: COUNT }, (_, m) => {
      const len = (2 * alpha) / 2 ** (m + 2);
      const piece = { m, a: at, b: at + len };
      at += len;
      return piece;
    }).concat([{ m: COUNT, a: at, b: alpha }]);
  });
</script>

<figure class="anim fat-lengths">
  <svg viewBox="0 0 640 176" role="img" aria-label="A segment of length 1; from its left end, the lengths of the intervals that form A placed one after the other fill a part of length alpha, and the rest has length 1 minus alpha">
    <rect class="unit" x={X0} y={Y - 14} width={X1 - X0} height="28" />
    {#each pieces as p}
      <rect class="piece" class:odd={p.m % 2 === 1} x={px(p.a)} y={Y - 14} width={Math.max(px(p.b) - px(p.a), 0.5)} height="28" />
    {/each}
    {#each pieces.slice(0, 3) as p}
      {#if px(p.b) - px(p.a) > 58}
        <text class="num" x={(px(p.a) + px(p.b)) / 2} y={Y - 32}>m = {p.m}</text>
      {/if}
    {/each}
    <path class="brace accent" d="M{px(0)},{Y + 24} v10 H{px(alpha)} v-10" />
    <text class="lab accent" x={(px(0) + px(alpha)) / 2} y={Y + 54}>α</text>
    {#if alpha < 0.93}
      <path class="brace" d="M{px(alpha)},{Y + 24} v10 H{px(1)} v-10" />
      <text class="lab" x={(px(alpha) + px(1)) / 2} y={Y + 54}>1 − α</text>
    {/if}
    <text class="num" x={px(0)} y={Y + 80}>0</text>
    <text class="num" x={px(1)} y={Y + 80}>1</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="α" min={0.05} max={0.95} step={0.01} bind:value={alpha} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .fat-lengths { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .unit { fill: none; stroke: var(--anim-muted); stroke-width: 1.4; }
  .piece { fill: var(--anim-accent); fill-opacity: 0.55; stroke: var(--anim-accent); stroke-width: 0.8; }
  .piece.odd { fill-opacity: 0.28; }
  .brace { fill: none; stroke: var(--anim-muted); stroke-width: 1.4; }
  .brace.accent { stroke: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; fill: var(--anim-muted); }
  .lab.accent { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
