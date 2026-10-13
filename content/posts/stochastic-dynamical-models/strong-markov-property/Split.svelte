<script>
  // Theorem 6.4 and Definition 6.5 on an instance: a path of the chain of
  // Example 2.1 started at X_0 = 1, with T = T_3, the first entrance in 3.
  // Top, the path X_n, coloured up to T; middle, the stopped chain
  // X^|T_n = X_(T∧n); bottom, Y_n = X_(T+n). The slider sets n and joins
  // X^|T_n and Y_n to the times T∧n and T+n of the path.
  import Slider from '@toolkit/Slider.svelte';
  import { path, entrance } from './chain.js';

  const LEN = 24, X0 = 104, X1 = 724, STEP = 22;
  const px = (n) => X0 + (n * (X1 - X0)) / LEN;
  const rows = (top) => ({ 3: top, 2: top + STEP, 1: top + 2 * STEP });
  const A = rows(44), B = rows(150), C = rows(256);
  let seed = $state(3);
  let n = $state(7);
  // A path long enough for Y up to time LEN; another seed if T_3 is late.
  const drawn = $derived.by(() => {
    let xs = [];
    for (let s = seed; s < seed + 1000; s++) {
      xs = path(s, 1, 2 * LEN + 2);
      const t = entrance(xs, 3);
      if (t <= LEN / 2) return { xs, t };
    }
    return { xs, t: 2 };
  });
  const xs = $derived(drawn.xs);
  const T = $derived(drawn.t);
  const nmax = $derived(LEN - T);
  $effect(() => { if (n > nmax) n = nmax; });
  const line = (pts, rows) => pts.map((x, k) => `${k ? 'L' : 'M'}${px(k)},${rows[x]}`).join(' ');
  const X = $derived(xs.slice(0, LEN + 1));
  const stopped = $derived(X.map((_, k) => xs[Math.min(T, k)]));
  const Y = $derived(xs.slice(T, T + LEN + 1));
</script>

<figure class="anim split">
  <svg viewBox="0 0 760 376" role="img" aria-label="Three rows of paths on the states 1 to 3 over 24 steps: a path of the chain, the same path stopped at the first entrance T in state 3, and the path restarted at T, with the time n of the slider joined to the times T and T plus n of the path">
    {#each [[A, 'X', ''], [B, 'X', '|T'], [C, 'Y', '']] as [r, name, sup]}
      {#each [1, 2, 3] as s}
        <line class="grid" x1={X0} y1={r[s]} x2={X1} y2={r[s]} />
        <text class="state" x={X0 - 22} y={r[s]}>{s}</text>
      {/each}
      <text class="name" x="34" y={r[2]}>{name}{#if sup}<tspan class="sup" dy="-8">{sup}</tspan>{/if}</text>
    {/each}
    <line class="mark" x1={px(T)} y1={A[3] - 16} x2={px(T)} y2={B[1] + 10} />
    <text class="it" x={px(T)} y={A[3] - 28}>T</text>
    <path class="walk" d={line(X, A)} />
    <path class="walk early" d={line(X.slice(0, T + 1), A)} />
    <path class="walk early" d={line(stopped, B)} />
    <path class="walk" d={line(Y, C)} />
    <line class="join" x1={px(Math.min(T, n))} y1={A[X[Math.min(T, n)]]} x2={px(n)} y2={B[stopped[n]]} />
    <line class="join" x1={px(T + n)} y1={A[X[T + n]]} x2={px(n)} y2={C[Y[n]]} />
    <circle class="pick early" cx={px(Math.min(T, n))} cy={A[X[Math.min(T, n)]]} r="6" />
    <circle class="pick" cx={px(T + n)} cy={A[X[T + n]]} r="6" />
    <circle class="pick early" cx={px(n)} cy={B[stopped[n]]} r="6" />
    <circle class="pick" cx={px(n)} cy={C[Y[n]]} r="6" />
    {#each [0, 4, 8, 12, 16, 20, 24] as k}
      <text class="num" x={px(k)} y={C[1] + 26}>{k}</text>
    {/each}
    <text class="it num" x={X1 + 22} y={C[1] + 26}>n</text>
    <text class="status" x={(X0 + X1) / 2} y="356"><tspan class="i">n</tspan>{` = ${n}: `}<tspan class="i">X</tspan><tspan class="sup" dy="-8">|T</tspan><tspan class="sub" dy="14">{n}</tspan><tspan dy="-6">{' = '}</tspan><tspan class="i">X</tspan><tspan class="sub" dy="6">{Math.min(T, n)}</tspan><tspan dy="-6">{` = ${stopped[n]} and `}</tspan><tspan class="i">Y</tspan><tspan class="sub" dy="6">{n}</tspan><tspan dy="-6">{' = '}</tspan><tspan class="i">X</tspan><tspan class="sub" dy="6">{T + n}</tspan><tspan dy="-6">{` = ${Y[n]}`}</tspan></text>
  </svg>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => (seed += 1)}>New path</button>
    <div class="anim-sliders">
      <Slider label="n" min={0} max={nmax} step={1} bind:value={n} />
    </div>
  </div>
</figure>

<style>
  .split { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .grid { stroke: var(--anim-rule); stroke-width: 1; }
  .walk { fill: none; stroke: var(--anim-ink); stroke-width: 1.5; stroke-linejoin: round; }
  .walk.early { stroke: var(--anim-accent); stroke-width: 2.4; }
  .mark { stroke: var(--anim-accent); stroke-width: 1.2; stroke-dasharray: 4 3; }
  .join { stroke: var(--anim-muted); stroke-width: 1; stroke-dasharray: 3 3; }
  .pick { fill: var(--anim-ink); }
  .pick.early { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .state { fill: var(--anim-muted); font-size: 16px; }
  .name { font-style: italic; }
  .sup { font-size: 13px; font-style: normal; }
  .sub { font-size: 13px; }
  .i { font-style: italic; }
  .status { font-size: 17px; }
  .it { font-style: italic; fill: var(--anim-accent); }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .it.num { fill: var(--anim-muted); }
  .split :global(.anim-slider-label) { font-style: italic; }
</style>
