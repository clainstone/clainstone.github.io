<script>
  // Definition 11, the drawing of the lecture: the interval [a, b] with the
  // subintervals (a₁, b₁), (a₂, b₂), …, (a_m, b_m); above them the values
  // f(a₁), f(b₁), f(a₂), f(b₂) as dots, and at b₁ and b₂ the vertical
  // segments from the level of f(a_i) to f(b_i), of length |f(b_i) − f(a_i)|.
  const OY = 196, A = 60, B = 640;
  const spans = [
    { a: 140, b: 250, i: '1', fa: 132, fb: 62 },
    { a: 300, b: 410, i: '2', fa: 146, fb: 104 },
    { a: 530, b: 600, i: 'm' },
  ];
</script>

<figure class="anim intervals">
  <svg viewBox="0 0 700 244" role="img" aria-label="An interval from a to b with disjoint open subintervals from a1 to b1, from a2 to b2 and, after dots, from am to bm; above the first two, the values of f at their ends as dots and vertical segments measuring the differences of these values">
    <line class="axis" x1={A} y1={OY} x2={B} y2={OY} />
    <path class="bracket" d="M{A + 8},{OY - 15} L{A},{OY - 15} L{A},{OY + 15} L{A + 8},{OY + 15}" />
    <path class="bracket" d="M{B - 8},{OY - 15} L{B},{OY - 15} L{B},{OY + 15} L{B - 8},{OY + 15}" />
    <text class="it" x={A - 20} y={OY}>a</text>
    <text class="it" x={B + 20} y={OY}>b</text>
    <text class="dots" x="470" y={OY - 4}>…</text>

    {#each spans as s}
      <line class="span" x1={s.a} y1={OY} x2={s.b} y2={OY} />
      <path class="paren" d="M{s.a + 6},{OY - 14} Q{s.a - 5},{OY} {s.a + 6},{OY + 14}" />
      <path class="paren" d="M{s.b - 6},{OY - 14} Q{s.b + 5},{OY} {s.b - 6},{OY + 14}" />
      <text class="it" x={s.a} y={OY + 30}>a<tspan class="sub" dy="5">{s.i}</tspan></text>
      <text class="it" x={s.b} y={OY + 30}>b<tspan class="sub" dy="5">{s.i}</tspan></text>
      {#if s.fa}
        <line class="guide" x1={s.a} y1={s.fa} x2={s.b} y2={s.fa} />
        <line class="bar" x1={s.b} y1={s.fa} x2={s.b} y2={s.fb} />
        <line class="bar" x1={s.b - 7} y1={s.fa} x2={s.b + 7} y2={s.fa} />
        <line class="bar" x1={s.b - 7} y1={s.fb} x2={s.b + 7} y2={s.fb} />
        <circle class="dot" cx={s.a} cy={s.fa} r="4.5" />
        <circle class="dot" cx={s.b} cy={s.fb} r="4.5" />
        <text class="lab" x={s.a - 30} y={s.fa + 18}><tspan class="it">f</tspan>(<tspan class="it">a</tspan><tspan class="sub" dy="5">{s.i}</tspan><tspan dy="-5">)</tspan></text>
        <text class="lab" x={s.b + 36} y={s.fb - 12}><tspan class="it">f</tspan>(<tspan class="it">b</tspan><tspan class="sub" dy="5">{s.i}</tspan><tspan dy="-5">)</tspan></text>
      {/if}
    {/each}
  </svg>
</figure>

<style>
  .intervals { margin: 1.5rem auto; max-width: 37rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.3; }
  .bracket { fill: none; stroke: var(--anim-ink); stroke-width: 2; }
  .span { stroke: var(--anim-accent); stroke-width: 4; }
  .paren { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; stroke-linecap: round; }
  .guide { stroke: var(--anim-rule); stroke-width: 1.2; stroke-dasharray: 4 3; }
  .bar { stroke: var(--anim-accent); stroke-width: 2.4; }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 13px; font-style: italic; }
  .lab { fill: var(--anim-ink); }
  .dots { fill: var(--anim-muted); font-size: 19px; }
</style>
