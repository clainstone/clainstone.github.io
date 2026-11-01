<script>
  // Definition 6 and Proposition 7, an instance in R^2 with the Euclidean norm:
  // x_n = 1.5 · 0.78^n (cos(1.15 n + 0.15), sin(1.15 n + 0.15)), placed end to
  // end from 0 up to the N of the slider, ending at the partial sum S_N; the
  // later partial sums faint and the limit S ringed. Below, the lengths ‖x_n‖
  // laid end to end along a segment: their sum is 1.5 / (1 − 0.78), dashed.
  import Slider from '@toolkit/Slider.svelte';

  const uid = $props.id();
  const C = 1.5, R = 0.78, TH = 1.15, PH = 0.15, NMAX = 40;
  const terms = Array.from({ length: NMAX + 1 }, (_, n) => [C * R ** n * Math.cos(TH * n + PH), C * R ** n * Math.sin(TH * n + PH)]);
  const sums = [];
  terms.reduce((acc, t) => { const s = [acc[0] + t[0], acc[1] + t[1]]; sums.push(s); return s; }, [0, 0]);
  const den = [1 - R * Math.cos(TH), -R * Math.sin(TH)];
  const d2 = den[0] ** 2 + den[1] ** 2;
  const num = [C * Math.cos(PH), C * Math.sin(PH)];
  const S = [(num[0] * den[0] + num[1] * den[1]) / d2, (num[1] * den[0] - num[0] * den[1]) / d2];
  const xs = [0, ...sums.map((s) => s[0])], ys = [0, ...sums.map((s) => s[1])];
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const K = Math.min(520 / (x1 - x0), 250 / (y1 - y0));
  const sx = (v) => 345 + (v - (x0 + x1) / 2) * K;
  const sy = (v) => 150 - (v - (y0 + y1) / 2) * K;
  const start = (n) => (n === 0 ? [0, 0] : sums[n - 1]);
  // Lengths ‖x_n‖ = 1.5 · 0.78^n end to end, total 1.5 / (1 − 0.78).
  const TOTAL = C / (1 - R);
  const lx = (v) => 70 + (v / TOTAL) * 560;
  const cum = (n) => (C * (1 - R ** n)) / (1 - R);
  const LY = 330;

  let N = $state(3);
</script>

<figure class="anim series">
  <svg viewBox="0 0 690 380" role="img" aria-label="Vectors placed end to end from the origin, spiralling towards the sum of the series, the partial sum for the chosen N marked, and below the lengths of the vectors laid end to end along a segment of finite length">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto">
        <path class="headfill" d="M0,0 L10,5 L0,10 z" />
      </marker>
    </defs>
    <polyline class="later" points={[[0, 0], ...sums].map((s) => `${sx(s[0]).toFixed(1)},${sy(s[1]).toFixed(1)}`).join(' ')} />
    {#each terms.slice(0, N + 1) as t, n}
      {@const a = start(n)}
      {@const b = sums[n]}
      <line class="vec" x1={sx(a[0])} y1={sy(a[1])} x2={sx(b[0])} y2={sy(b[1])}
        marker-end={Math.hypot(t[0], t[1]) * K > 16 ? `url(#${uid}-head)` : null} />
    {/each}
    <circle class="dot" cx={sx(0)} cy={sy(0)} r="3.5" />
    <text x={sx(0) - 14} y={sy(0) + 14}>0</text>
    <circle class="ring" cx={sx(S[0])} cy={sy(S[1])} r="7" />
    <text class="it" x={sx(S[0]) + 22} y={sy(S[1]) - 4}>S</text>
    <circle class="dot accent" cx={sx(sums[N][0])} cy={sy(sums[N][1])} r="5" />
    <text class="it lab" x={sx(sums[N][0]) - 26} y={sy(sums[N][1]) - 18}>S<tspan class="sub" dy="5">N</tspan></text>
    {#each terms as _, n}
      <line class={n <= N ? (n % 2 ? 'piece odd' : 'piece') : 'piece faint'} x1={lx(cum(n))} y1={LY} x2={lx(cum(n + 1))} y2={LY} />
    {/each}
    <line class="end" x1={lx(TOTAL)} y1={LY - 14} x2={lx(TOTAL)} y2={LY + 14} />
    <line class="tick" x1={lx(0)} y1={LY - 10} x2={lx(0)} y2={LY + 10} />
    <text class="it small" x={(lx(0) + lx(cum(1))) / 2} y={LY + 26}><tspan class="up">‖</tspan>x<tspan class="sub" dy="5">0</tspan><tspan class="up" dy="-5">‖</tspan></text>
    <text class="it small" x={(lx(cum(1)) + lx(cum(2))) / 2} y={LY + 26}><tspan class="up">‖</tspan>x<tspan class="sub" dy="5">1</tspan><tspan class="up" dy="-5">‖</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="N" min={0} max={25} step={1} bind:value={N} />
    </div>
  </div>
</figure>

<style>
  .series { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .later { fill: none; stroke: var(--anim-muted); stroke-opacity: 0.45; stroke-width: 1.2; }
  .vec { stroke: var(--anim-ink); stroke-width: 2; }
  .headfill { fill: var(--anim-ink); }
  .dot { fill: var(--anim-ink); }
  .dot.accent { fill: var(--anim-accent); }
  .ring { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; }
  .piece { stroke: var(--anim-accent); stroke-width: 9; }
  .piece.odd { stroke: var(--anim-ink); }
  .piece.faint { stroke: var(--anim-rule); }
  .end { stroke: var(--anim-accent); stroke-width: 1.6; stroke-dasharray: 4 3; }
  .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .up { font-style: normal; }
  .lab { fill: var(--anim-accent); }
  .small { font-size: 16px; }
  .sub { font-size: 13px; font-style: normal; }
</style>
