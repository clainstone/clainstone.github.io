<script>
  // Example 5 with N = 2, the fourth drawing of the lecture: the ball B_1(0)
  // for ‖·‖_p, the set |v_1|^p + |v_2|^p < 1, for the p of the slider, and,
  // dashed, the balls for ‖·‖_1 and ‖·‖_∞. The boundary is drawn through
  // (sgn cos θ |cos θ|^(2/p), sgn sin θ |sin θ|^(2/p)).
  import Slider from '@toolkit/Slider.svelte';

  const C = [210, 170];
  const U = 118;
  const px = (v) => C[0] + v * U;
  const py = (v) => C[1] - v * U;
  const pts = (list) => list.map(([a, b]) => `${px(a)},${py(b)}`).join(' ');
  const square = pts([[-1, 1], [1, 1], [1, -1], [-1, -1]]);
  const diamond = pts([[0, 1], [1, 0], [0, -1], [-1, 0]]);
  const pow = (c, e) => Math.sign(c) * Math.abs(c) ** e;
  // Arrowheads at the ends of the two axes.
  const headX = `${C[0] + U + 52},${C[1]} ${C[0] + U + 41},${C[1] - 5} ${C[0] + U + 41},${C[1] + 5}`;
  const headY = `${C[0]},${C[1] - U - 38} ${C[0] - 5},${C[1] - U - 27} ${C[0] + 5},${C[1] - U - 27}`;

  let p = $state(3);
  const ball = $derived.by(() => {
    const out = [];
    for (let j = 0; j < 480; j++) {
      const th = (2 * Math.PI * j) / 480;
      const x = px(pow(Math.cos(th), 2 / p));
      const y = py(pow(Math.sin(th), 2 / p));
      out.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return out.join(' ');
  });
</script>

<figure class="anim ballp">
  <svg viewBox="0 0 420 340" role="img" aria-label="The unit ball of the norm p in the plane for the chosen p, between the dashed unit balls of the norm one and of the maximum norm">
    <line class="axis" x1={C[0] - U - 46} y1={C[1]} x2={C[0] + U + 44} y2={C[1]} />
    <polygon class="head" points={headX} />
    <line class="axis" x1={C[0]} y1={C[1] + U + 30} x2={C[0]} y2={C[1] - U - 30} />
    <polygon class="head" points={headY} />
    <polygon class="ref" points={square} />
    <polygon class="ref" points={diamond} />
    <polygon class="ball" points={ball} />
    <text class="start" x="12" y="22"><tspan class="it">B</tspan><tspan class="sub" dy="5">1</tspan><tspan dy="-5">(0) for ‖·‖</tspan><tspan class="sub it" dy="5">p</tspan></text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="p" min={1} max={12} step={0.1} bind:value={p} format={(v) => v.toFixed(1)} />
    </div>
  </div>
</figure>

<style>
  .ballp { margin: 1.5rem auto; max-width: 24rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.2; }
  .head { fill: var(--anim-ink); }
  .ref { fill: none; stroke: var(--anim-muted); stroke-width: 1.5; stroke-dasharray: 6 5; }
  .ball { fill: var(--anim-accent); fill-opacity: 0.14; stroke: var(--anim-accent); stroke-width: 2.4; stroke-linejoin: round; }
  text { fill: var(--anim-accent); font-size: 18px; dominant-baseline: central; }
  .start { text-anchor: start; }
  .it { font-style: italic; }
  .sub { font-size: 13px; }
</style>
