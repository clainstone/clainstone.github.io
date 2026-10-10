<script>
  // Example 6, an instance with X = [0, 1]: a continuous function f, and the
  // functions f⁺ = max{f, 0}, f⁻ = −min{f, 0} and |f|, one panel each, on the
  // same scale.
  const f = (x) => 0.85 * Math.sin(2 * Math.PI * 1.3 * x + 0.6);
  const panels = [
    { name: 'f', sup: '', g: f },
    { name: 'f', sup: '+', g: (x) => Math.max(f(x), 0) },
    { name: 'f', sup: '−', g: (x) => -Math.min(f(x), 0) },
    { name: '|f|', sup: '', g: (x) => Math.abs(f(x)) },
  ];
  const PW = 300, PH = 110, GAP_X = 60, GAP_Y = 46, LEFT = 40, TOP = 34;
  const origin = (i) => [LEFT + (i % 2) * (PW + GAP_X), TOP + Math.floor(i / 2) * (PH + GAP_Y)];
  function curve(g, [ox, oy]) {
    const pts = [];
    for (let j = 0; j <= 240; j++) {
      const x = j / 240;
      pts.push(`${(ox + x * PW).toFixed(1)},${(oy + PH / 2 - g(x) * (PH / 2)).toFixed(1)}`);
    }
    return pts.join(' ');
  }
</script>

<figure class="anim parts">
  <svg viewBox="0 0 720 340" role="img" aria-label="Four panels on the interval from 0 to 1: a function f that changes sign, its positive part, its negative part and its absolute value">
    {#each panels as p, i}
      {@const [ox, oy] = origin(i)}
      <line class="axis" x1={ox} y1={oy + PH / 2} x2={ox + PW} y2={oy + PH / 2} />
      <line class="axis" x1={ox} y1={oy} x2={ox} y2={oy + PH} />
      <polyline class="curve" class:main={i === 0} points={curve(p.g, [ox, oy])} />
      <text class="name" x={ox - 14} y={oy + PH / 2}>0</text>
      <text class="name" x={ox + PW} y={oy + PH / 2 + 18}>1</text>
      <text class="lab" x={ox + PW / 2} y={oy - 16}>
        {#if p.name === '|f|'}|<tspan class="it" dx="3">f</tspan><tspan dx="4">|</tspan>{:else}<tspan class="it">f</tspan>{#if p.sup}<tspan class="sup" dx="5" dy="-7">{p.sup}</tspan>{/if}{/if}
      </text>
    {/each}
  </svg>
</figure>

<style>
  .parts { margin: 1.5rem auto; max-width: 38rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-rule); stroke-width: 1.3; }
  .curve { fill: none; stroke: var(--anim-accent); stroke-width: 2.2; stroke-linejoin: round; }
  .curve.main { stroke: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .name { fill: var(--anim-muted); font-size: 16px; }
  .it { font-style: italic; }
  .sup { font-size: 16px; }
</style>
