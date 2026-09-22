<script>
  // Example 19, Step 1: on ℤ, the sets {−k, …, k} and {−k+1, …, k−1} of 𝓕
  // and their difference {−k, k}. The slider sets k.
  import Slider from '@toolkit/Slider.svelte';

  const M = 7;
  const xs = Array.from({ length: 2 * M + 1 }, (_, i) => i - M);
  const px = (x) => 320 + x * 38;
  let k = $state(3);
  const rows = $derived([
    { label: `{−${k}, …, ${k}}`, has: (x) => Math.abs(x) <= k, cls: 'big' },
    { label: k === 0 ? '∅' : `{−${k - 1}, …, ${k - 1}}`, has: (x) => Math.abs(x) <= k - 1, cls: 'small' },
    { label: k === 0 ? '{0}' : `{−${k}, ${k}}`, has: (x) => Math.abs(x) === k, cls: 'diff' },
  ]);
</script>

<figure class="anim pair">
  <svg viewBox="0 0 640 250" role="img" aria-label="Three rows of integers from -7 to 7: the set from -k to k, the set from -k+1 to k-1, and their difference, the two points -k and k">
    {#each rows as row, r}
      <line class="axis" x1={px(-M) - 16} y1={40 + r * 62} x2={px(M) + 16} y2={40 + r * 62} />
      {#each xs as x}
        <circle class="pt {row.cls}" class:on={row.has(x)} cx={px(x)} cy={40 + r * 62} r={row.has(x) ? 7 : 3} />
      {/each}
      <text class="row {row.cls}" x={px(0)} y={40 + r * 62 - 22}>{row.label}</text>
    {/each}
    {#each [-M, -k, 0, k, M] as x}
      <text class="num" x={px(x)} y="222">{x < 0 ? `−${-x}` : x}</text>
    {/each}
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="k" min={0} max={M - 1} step={1} bind:value={k} />
    </div>
  </div>
</figure>

<style>
  .pair { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-rule); stroke-width: 1.2; }
  .pt { fill: var(--anim-muted); }
  .pt.on.big { fill: var(--anim-ink); }
  .pt.on.small { fill: var(--anim-muted); }
  .pt.on.diff { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .row.small { fill: var(--anim-muted); }
  .row.diff { fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
