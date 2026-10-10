<script>
  // Theorem 13: the graph of f(x) = x + v(x), the open intervals (a_m, b_m)
  // removed up to the step k of the construction of the Cantor set, on the
  // horizontal axis, and their images (f(a_m), f(b_m)), on the vertical axis.
  // Over each removed interval v is constant and f rises with slope 1, so the
  // image has the same length. The dashed lines mark a, b, f(a), f(b) for
  // the middle third (a, b) = (1/3, 2/3), as in the drawing of the lecture.
  import Slider from '@toolkit/Slider.svelte';
  import { f, removed } from './cantor.js';

  const KMAX = 6;
  const OX = 70, OY = 350, UX = 400, UY = 150;
  const sx = (x) => OX + x * UX;
  const sy = (y) => OY - y * UY;
  const N = 3 ** 6;
  const curve = Array.from({ length: N + 1 }, (_, j) => `${sx(j / N).toFixed(1)},${sy(f(j / N)).toFixed(1)}`).join(' ');
  const all = removed(KMAX).map(([a, b, step]) => ({ a, b, step, fa: f(a), fb: f(b) }));
  for (const r of all) if (Math.abs(r.fb - r.fa - (r.b - r.a)) > 1e-9) throw new Error('f(b) − f(a) must equal b − a');
  const [A, B] = [1 / 3, 2 / 3];

  let k = $state(2);
  const shown = $derived(all.filter((r) => r.step <= k));
</script>

<figure class="anim images">
  <svg viewBox="0 0 540 400" role="img" aria-label="The graph of f; the intervals removed up to step k of the Cantor construction on the horizontal axis and their images under f on the vertical axis">
    <line class="axis" x1={OX} y1={OY} x2={sx(1) + 34} y2={OY} />
    <line class="axis" x1={OX} y1={OY} x2={OX} y2={sy(2) - 24} />
    {#each [A, B] as x}
      <line class="guide" x1={sx(x)} y1={OY} x2={sx(x)} y2={sy(f(x))} />
      <line class="guide" x1={OX} y1={sy(f(x))} x2={sx(x)} y2={sy(f(x))} />
    {/each}
    <polyline class="curve" points={curve} />
    {#each shown as r}
      <line class="piece" x1={sx(r.a)} y1={sy(r.fa)} x2={sx(r.b)} y2={sy(r.fb)} />
      <line class="mark" x1={sx(r.a)} y1={OY} x2={sx(r.b)} y2={OY} />
      <line class="mark" x1={OX} y1={sy(r.fa)} x2={OX} y2={sy(r.fb)} />
    {/each}
    <text class="num it" x={sx(A)} y={OY + 22}>a</text>
    <text class="num it" x={sx(B)} y={OY + 22}>b</text>
    <text class="num" x={sx(1)} y={OY + 22}>1</text>
    <text class="num" x={OX - 14} y={OY + 16}>0</text>
    <text class="num" x={OX - 18} y={sy(2)}>2</text>
    <text class="num" x={OX - 36} y={sy(f(A))}><tspan class="it">f</tspan>(<tspan class="it">a</tspan>)</text>
    <text class="num" x={OX - 36} y={sy(f(B))}><tspan class="it">f</tspan>(<tspan class="it">b</tspan>)</text>
    <text class="lab" x={sx(0.9) + 18} y={sy(f(0.9)) + 8}>f</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="k" min={1} max={KMAX} step={1} bind:value={k} />
    </div>
  </div>
</figure>

<style>
  .images { margin: 1.5rem auto; max-width: 28.5rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-muted); stroke-width: 1.1; stroke-dasharray: 5 4; }
  .curve { fill: none; stroke: var(--anim-muted); stroke-width: 1.6; stroke-linejoin: round; }
  .piece { stroke: var(--anim-accent); stroke-width: 2.6; }
  .mark { stroke: var(--anim-accent); stroke-width: 7; stroke-linecap: butt; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; fill: var(--anim-muted); font-size: 18px; }
  .it { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
