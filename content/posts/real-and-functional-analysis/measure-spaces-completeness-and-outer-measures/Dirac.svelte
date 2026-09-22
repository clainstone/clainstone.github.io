<script>
  // Example 4: the Dirac delta measure at x₀ on two intervals of ℝ, E around 0
  // and F around the starting x₀. The slider moves x₀; the value of δ at x₀ on
  // each interval is 1 when x₀ lies in it and 0 otherwise.
  import Slider from '@toolkit/Slider.svelte';

  const LO = -4, HI = 6, X0 = 40, X1 = 600, Y = 150;
  const px = (v) => X0 + ((v - LO) / (HI - LO)) * (X1 - X0);
  const sets = [
    { name: 'E', a: -1, b: 1 },
    { name: 'F', a: 2, b: 4 },
  ];
  let x0 = $state(3);
  const inside = (s) => s.a < x0 && x0 < s.b;
  const fmt = (v) => v.toFixed(2);
</script>

<figure class="anim dirac">
  <svg viewBox="0 0 640 210" role="img" aria-label="The real line with the intervals E around 0 and F, the point x0, and the values of the Dirac delta at x0 on E and on F">
    <line class="axis" x1={X0 - 10} y1={Y} x2={X1 + 10} y2={Y} />
    <path class="arrow" d="M{X1 + 10},{Y - 5} L{X1 + 20},{Y} L{X1 + 10},{Y + 5} Z" />
    {#each sets as s}
      <line class="set" class:hit={inside(s)} x1={px(s.a)} y1={Y} x2={px(s.b)} y2={Y} />
      <!-- Open ends drawn as parentheses: the endpoints do not belong to the interval. -->
      <path class="paren" class:hit={inside(s)} d="M{px(s.a) + 5},{Y - 15} Q{px(s.a) - 5},{Y} {px(s.a) + 5},{Y + 15}" />
      <path class="paren" class:hit={inside(s)} d="M{px(s.b) - 5},{Y - 15} Q{px(s.b) + 5},{Y} {px(s.b) - 5},{Y + 15}" />
      <text class="name" x={(px(s.a) + px(s.b)) / 2} y={Y - 32}>{s.name}</text>
      <text class="value" class:hit={inside(s)} x={(px(s.a) + px(s.b)) / 2} y={Y - 72}>δ<tspan dy="6" font-size="12" font-style="italic">x</tspan><tspan font-size="9">0</tspan><tspan dy="-6">(</tspan><tspan font-style="italic">{s.name}</tspan>) = {inside(s) ? 1 : 0}</text>
    {/each}
    <line class="tick" x1={px(0)} y1={Y + 8} x2={px(0)} y2={Y - 8} />
    <text class="num" x={px(0)} y={Y + 28}>0</text>
    <circle class="pt" cx={px(x0)} cy={Y} r="6" />
    <text class="num point" x={px(x0)} y={Y + 30}>x<tspan dy="5" font-size="0.72em" font-style="normal">0</tspan></text>
    <text class="num" x={X1 + 12} y={Y + 28}>ℝ</text>
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="x₀" min={-3.5} max={5.5} step={0.05} bind:value={x0} format={fmt} />
    </div>
  </div>
</figure>

<style>
  .dirac { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.4; }
  .arrow { fill: var(--anim-ink); }
  .set { stroke: var(--anim-muted); stroke-width: 5; stroke-linecap: butt; }
  .set.hit { stroke: var(--anim-accent); }
  .paren { fill: none; stroke: var(--anim-muted); stroke-width: 2.4; stroke-linecap: round; }
  .paren.hit { stroke: var(--anim-accent); }
  .tick { stroke: var(--anim-ink); stroke-width: 1.4; }
  .pt { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .name, .point { font-style: italic; }
  .value { fill: var(--anim-muted); }
  .value.hit { fill: var(--anim-accent); }
</style>
