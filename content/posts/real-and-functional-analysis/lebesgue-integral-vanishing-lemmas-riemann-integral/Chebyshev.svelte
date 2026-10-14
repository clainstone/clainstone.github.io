<script>
  // Proposition 9, an instance with X an interval and μ = λ: the region under
  // f (the integral over X), the region under f over {f > c} and, inside it,
  // the rectangles of height c over {f > c} (c·λ({f > c})), hatched. The
  // slider sets c.
  import Slider from '@toolkit/Slider.svelte';
  import { graph, under, intervals } from './plot.js';
  const uid = $props.id();

  const OX = 60, OY = 262, UX = 570, UY = 300;
  const sx = (t) => OX + t * UX;
  const sy = (v) => OY - v * UY;
  const f = (t) => 0.12 + 0.62 * Math.exp(-(((t - 0.3) / 0.14) ** 2)) + 0.45 * Math.exp(-(((t - 0.74) / 0.11) ** 2));
  const fLine = graph(f, 0, 1, sx, sy, 400);
  const whole = under(f, 0, 1, sx, sy, 400);

  let c = $state(0.35);
  const sets = $derived(intervals((t) => f(t) > c, 0, 1, 1500));
  const widest = $derived(sets.reduce((a, b) => (b[1] - b[0] > a[1] - a[0] ? b : a), [0, 0]));
</script>

<figure class="anim chebyshev">
  <svg viewBox="0 0 690 320" role="img" aria-label="A positive function f on an interval, the region under it, the set where f exceeds the level c marked on the axis, the region under f over that set, and the rectangles of height c over that set, hatched">
    <defs>
      <pattern id="{uid}-h" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="7" />
      </pattern>
    </defs>
    <path class="whole" d={whole} />
    {#each sets as [a, b]}
      <path class="over" d={under(f, a, b, sx, sy, 160)} />
      <rect class="rect" x={sx(a)} y={sy(c)} width={sx(b) - sx(a)} height={c * UY} />
      <rect x={sx(a)} y={sy(c)} width={sx(b) - sx(a)} height={c * UY} fill="url(#{uid}-h)" />
    {/each}
    <line class="level" x1={OX} y1={sy(c)} x2={sx(1)} y2={sy(c)} />
    <polyline class="curve" points={fLine} />
    <line class="axis" x1={OX} y1={OY} x2={sx(1) + 24} y2={OY} />
    <line class="axis" x1={OX} y1={OY} x2={OX} y2={sy(0.82)} />
    {#each sets as [a, b]}
      <line class="set" x1={sx(a)} y1={OY} x2={sx(b)} y2={OY} />
    {/each}
    <text class="lab it" x={OX - 18} y={sy(c)}>c</text>
    <text class="lab it" x={sx(0.3) + 26} y={sy(f(0.3)) - 14}>f</text>
    <text class="lab it muted" x={sx(1) + 34} y={OY}>X</text>
    {#if widest[1] > widest[0]}
      <text class="lab accent" x={(sx(widest[0]) + sx(widest[1])) / 2} y={OY + 24}>{`{f > c}`}</text>
    {/if}
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="c" min={0.05} max={0.7} step={0.01} bind:value={c} format={(v) => v.toFixed(2)} />
    </div>
  </div>
</figure>

<style>
  .chebyshev { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .whole { fill: var(--anim-ink); fill-opacity: 0.06; }
  .over { fill: var(--anim-accent); fill-opacity: 0.16; }
  .rect { fill: none; stroke: var(--anim-accent); stroke-width: 1.4; }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.4; }
  .level { stroke: var(--anim-muted); stroke-width: 1.2; stroke-dasharray: 6 5; }
  .curve { fill: none; stroke: var(--anim-ink); stroke-width: 2.2; stroke-linejoin: round; }
  .set { stroke: var(--anim-accent); stroke-width: 5; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); font-style: italic; }
  .muted { fill: var(--anim-muted); }
</style>
