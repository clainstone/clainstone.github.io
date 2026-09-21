<script>
  // The random walk on Z: X_{n+1} = X_n + Y_{n+1} with Y_n = 1 with
  // probability p and -1 with probability 1 - p. Above, the jumps between
  // neighbouring states. Below, one path started at X_0 = 0: X_n / n for
  // n = 1, ..., 400 against the level E[Y_1] = 2p - 1.
  import Canvas from '@toolkit/Canvas.svelte';
  import Slider from '@toolkit/Slider.svelte';
  import { edge, mulberry32 } from './draw.js';

  const S = [['i − 1', 90], ['i', 270], ['i + 1', 450], ['i + 2', 630]].map(([name, x]) => ({ name, x, y: 70 }));
  const at = (k) => [S[k].x, S[k].y];
  const E = [
    { a: 1, b: 2, t: 'p', bend: -30 }, { a: 2, b: 3, t: 'p', bend: -30 },
    { a: 1, b: 0, t: '1 − p', bend: -30 }, { a: 2, b: 1, t: '1 − p', bend: -30 }, { a: 3, b: 2, t: '1 − p', bend: -30 },
  ].map((e) => ({ ...e, ...edge(at(e.a), at(e.b), { r: 24, bend: e.bend, gap: 14 }) }));

  const STEPS = 400;
  let p = $state(0.7);
  let seed = $state(7);
  // One path of uniforms, reused for every p, so the slider moves the same path.
  const U = $derived.by(() => { const g = mulberry32(seed); return Array.from({ length: STEPS }, () => g()); });

  function draw(ctx, t, { w, h, p: pal }) {
    ctx.clearRect(0, 0, w, h);
    if (w < 60) return;
    const L = 46, R = w - 12, T = 12, B = h - 30;
    const X = (n) => L + ((R - L) * n) / STEPS;
    const Y = (v) => T + ((B - T) * (1 - v)) / 2; // v in [-1, 1]
    ctx.strokeStyle = pal.rule; ctx.lineWidth = 1;
    for (const v of [-1, 0, 1]) { ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(R, Y(v)); ctx.stroke(); }
    ctx.fillStyle = pal.muted; ctx.font = pal.smallFont; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    for (const v of [-1, 0, 1]) ctx.fillText(String(v), L - 8, Y(v));
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    for (const n of [0, 100, 200, 300, 400]) ctx.fillText(String(n), X(n), B + 8);
    ctx.strokeStyle = pal.muted; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(L, Y(2 * p - 1)); ctx.lineTo(R, Y(2 * p - 1)); ctx.stroke(); ctx.setLineDash([]);
    ctx.textAlign = 'right'; ctx.textBaseline = 'top'; ctx.fillStyle = pal.muted;
    ctx.fillText(`2p − 1 = ${(2 * p - 1).toFixed(2)}`, R - 4, Y(2 * p - 1) + 6);
    ctx.strokeStyle = pal.accent; ctx.lineWidth = 1.6; ctx.beginPath();
    let x = 0;
    for (let n = 1; n <= STEPS; n++) {
      x += U[n - 1] < p ? 1 : -1;
      n === 1 ? ctx.moveTo(X(n), Y(x / n)) : ctx.lineTo(X(n), Y(x / n));
    }
    ctx.stroke();
  }
</script>

<figure class="anim walk-z">
  <svg viewBox="0 0 720 140" role="img" aria-label="States i − 1, i, i + 1, i + 2 on a line; each jumps to the right with probability p and to the left with probability 1 − p">
    {#each E as e}
      <path class="edge" d={e.d} />
      <polygon class="head" points={e.head} />
      <text class="prob" x={e.lx} y={e.ly}>{e.t}</text>
    {/each}
    {#each S as s}
      <circle class="node" cx={s.x} cy={s.y} r="24" />
      <text class="name" x={s.x} y={s.y}>{s.name}</text>
    {/each}
  </svg>
  <Canvas {draw} ratio={2.6} controls={false} autoplay={false} deps={[p, U]} label="X_n / n for one path of the walk started at 0, n from 1 to 400, with the level 2p − 1">
    {#snippet buttons()}
      <button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New path</button>
    {/snippet}
    <Slider label="p" min={0.5} max={1} step={0.01} bind:value={p} format={(v) => v.toFixed(2)} />
  </Canvas>
</figure>

<style>
  .walk-z { margin: 1.5rem 0; }
  svg { display: block; width: 100%; height: auto; font-family: var(--anim-font); }
  .edge { fill: none; stroke: var(--anim-muted); stroke-width: 1.5; }
  .head { fill: var(--anim-muted); }
  .node { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 1.5; }
  .name { fill: var(--anim-ink); font-size: 16px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .prob { fill: var(--anim-accent); font-size: 16px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .walk-z :global(.anim-slider-label) { font-style: italic; }
</style>
