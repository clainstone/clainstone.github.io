<script>
  // Theorem 6.3, first claim, on an instance: for the p_jj set by the slider,
  // the bars are P_j{U_j = n} = (1 - p_jj) p_jj^(n-1) for n = 1, ..., 15 and
  // the dots are P_j{U_j > n} = p_jj^n for n = 0, ..., 15, the two displays
  // of the proof.
  const uid = $props.id();
  const NMAX = 15, BASE = 252, TOP = 46;
  const X0 = 84, X1 = 700, w = (X1 - X0) / (NMAX + 1);
  const cx = (n) => X0 + (n + 0.5) * w;
  const py = (v) => BASE - (BASE - TOP) * v;
  let pjj = $state(0.6);
  const ns = Array.from({ length: NMAX + 1 }, (_, n) => n);
  const tail = $derived(ns.map((n) => pjj ** n));
  const mass = $derived(ns.map((n) => (n === 0 ? 0 : (1 - pjj) * pjj ** (n - 1))));
  const dots = $derived(ns.map((n) => `${n ? 'L' : 'M'}${cx(n)},${py(tail[n])}`).join(' '));
</script>

<figure class="anim tail">
  <svg viewBox="0 0 760 296" role="img" aria-label="Bars of the probabilities that the first exit from j happens at time n, for n from 1 to 15, and dots of the probabilities that it happens after time n, for n from 0 to 15">
    <line class="axis" x1={X0} y1={BASE} x2={X1 + 8} y2={BASE} />
    {#each [0, 0.5, 1] as v}
      <line class="guide" x1={X0} y1={py(v)} x2={X1} y2={py(v)} />
      <text class="num" x={X0 - 30} y={py(v)}>{v.toFixed(1)}</text>
    {/each}
    {#each ns as n}
      {#if n > 0}<rect class="bar" x={cx(n) - w / 2 + 4} y={py(mass[n])} width={w - 8} height={BASE - py(mass[n])} />{/if}
    {/each}
    <path class="trend" d={dots} />
    {#each ns as n}
      <circle class="dot" cx={cx(n)} cy={py(tail[n])} r="4.5" />
    {/each}
    {#each [0, 1, 5, 10, 15] as n}
      <text class="num" x={cx(n)} y={BASE + 20}>{n}</text>
    {/each}
    <text class="lab it" x={X1 + 30} y={BASE + 20}>n</text>
    <rect class="bar" x="520" y="12" width="16" height="16" />
    <text class="key" x="546" y="20"><tspan class="it">U</tspan><tspan class="sub" dy="5">j</tspan><tspan dy="-5">{' = '}</tspan><tspan class="it">n</tspan></text>
    <circle class="dot" cx="628" cy="20" r="4.5" />
    <text class="key" x="642" y="20"><tspan class="it">U</tspan><tspan class="sub" dy="5">j</tspan><tspan dy="-5">{' > '}</tspan><tspan class="it">n</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <label class="anim-slider" for="{uid}-jj">
        <span class="anim-slider-label"><i>p</i><sub>jj</sub></span>
        <input id="{uid}-jj" type="range" min="0.05" max="0.95" step="0.05" bind:value={pjj} />
        <output for="{uid}-jj">{pjj.toFixed(2)}</output>
      </label>
    </div>
  </div>
</figure>

<style>
  .tail { margin: 1.5rem 0; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  .bar { fill: var(--anim-accent); fill-opacity: 0.55; stroke: var(--anim-accent); stroke-width: 1; }
  .trend { fill: none; stroke: var(--anim-ink); stroke-width: 1; stroke-dasharray: 2 3; }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .num { fill: var(--anim-muted); font-size: 16px; }
  .lab { fill: var(--anim-muted); }
  .it { font-style: italic; }
  .key { font-size: 17px; text-anchor: start; }
  .sub { font-size: 13px; }
  .anim-slider-label sub { font-size: 0.75em; font-style: italic; }
</style>
