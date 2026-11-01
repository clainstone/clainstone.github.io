<script>
  // Remark 12 and Examples 15 and 16 on [0, 1]: the Lipschitz functions inside
  // AC([0, 1]), inside UC([0, 1]), which is the set of the continuous
  // functions on [0, 1] by the Heine–Cantor theorem; √x in AC([0, 1]) and not
  // Lipschitz (Example 16), the Cantor function v in UC([0, 1]) and not in
  // AC([0, 1]) (Example 15).
  const sets = [
    { cx: 345, cy: 160, rx: 325, ry: 138, label: 'UC([0, 1])', lx: 345, ly: 44, cls: 'outer' },
    { cx: 280, cy: 175, rx: 220, ry: 98, label: 'AC([0, 1])', lx: 280, ly: 100, cls: 'middle' },
    { cx: 205, cy: 192, rx: 110, ry: 52, label: 'Lipschitz', lx: 205, ly: 192, cls: 'inner' },
  ];
</script>

<figure class="anim classes">
  <svg viewBox="0 0 690 310" role="img" aria-label="Three nested regions: the Lipschitz functions inside the absolutely continuous functions on the unit interval, inside the uniformly continuous functions, which are the continuous ones; the square root lies between the inner two regions, the Cantor function between the outer two">
    {#each sets as s}
      <ellipse class={s.cls} cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} />
      <text class="lab" x={s.lx} y={s.ly}>{s.label}</text>
    {/each}
    <circle class="dot" cx="410" cy="196" r="5" />
    <text class="pt" x="446" y="196">√<tspan class="it">x</tspan></text>
    <circle class="dot" cx="566" cy="178" r="5" />
    <text class="pt it" x="590" y="178">v</text>
  </svg>
</figure>

<style>
  .classes { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  ellipse { stroke-width: 1.6; }
  .outer { fill: var(--anim-accent); fill-opacity: 0.05; stroke: var(--anim-muted); }
  .middle { fill: var(--anim-accent); fill-opacity: 0.08; stroke: var(--anim-accent); }
  .inner { fill: var(--anim-accent); fill-opacity: 0.12; stroke: var(--anim-accent); }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .lab { fill: var(--anim-ink); }
  .pt { fill: var(--anim-ink); }
  .it { font-style: italic; }
</style>
