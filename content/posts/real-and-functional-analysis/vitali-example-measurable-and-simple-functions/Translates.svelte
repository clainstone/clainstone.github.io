<script>
  // Theorem 1, Step 2: the interval [0, 1], which contains E and F₀, and its
  // translate q + [0, 1], which contains F_q. The slider sets the rational q
  // among the multiples of 1/8 in [−1, 1]; the translate stays in [−2, 2].
  import Slider from '@toolkit/Slider.svelte';

  const X0 = 50, X1 = 690, LO = -2.5, HI = 2.5;
  const px = (x) => X0 + ((x - LO) / (HI - LO)) * (X1 - X0);
  const AXIS = 196;
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  function frac(value) {
    const n = Math.round(value * 8);
    if (n === 0) return '0';
    const g = gcd(Math.abs(n), 8);
    const [p, d] = [n / g, 8 / g];
    return d === 1 ? String(p).replace('-', '−') : `${p < 0 ? '−' : ''}${Math.abs(p)}/${d}`;
  }

  let q = $state(0.5);
</script>

<figure class="anim translates">
  <svg viewBox="0 0 740 250" role="img" aria-label="On a number line from −2 to 2, the interval [0, 1] and its translate q + [0, 1] for the rational q set by the slider">
    {#each [-2, 2] as x}
      <line class="bound" x1={px(x)} y1="24" x2={px(x)} y2={AXIS} />
    {/each}
    <line class="seg base" x1={px(0)} y1="62" x2={px(1)} y2="62" />
    <text class="lab" x={px(0.5)} y="38">[0, 1]</text>
    <line class="shift" x1={px(0)} y1="96" x2={px(q)} y2="96" />
    {#if q !== 0}
      <path class="head" d="M{px(q)},96 l{q > 0 ? -9 : 9},-5 l0,10 z" />
    {/if}
    <line class="seg moved" x1={px(q)} y1="134" x2={px(q + 1)} y2="134" />
    <text class="lab accent" x={px(q + 0.5)} y="160"><tspan class="it">q</tspan> + [0, 1]</text>
    <line class="axis" x1={X0} y1={AXIS} x2={X1} y2={AXIS} />
    {#each [-2, -1, 0, 1, 2] as x}
      <line class="tick" x1={px(x)} y1={AXIS - 6} x2={px(x)} y2={AXIS + 6} />
      <text class="num" x={px(x)} y={AXIS + 26}>{x < 0 ? `−${-x}` : x}</text>
    {/each}
    <line class="tick accent-tick" x1={px(q)} y1={AXIS - 9} x2={px(q)} y2={AXIS + 9} />
  </svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="q" min={-1} max={1} step={0.125} bind:value={q} format={frac} />
    </div>
  </div>
</figure>

<style>
  .translates { margin: 1.5rem auto; max-width: 39rem; }
  svg { font-family: var(--anim-font); }
  .bound { stroke: var(--anim-rule); stroke-width: 1.4; stroke-dasharray: 5 4; }
  .seg { stroke-width: 7; stroke-linecap: butt; }
  .base { stroke: var(--anim-muted); }
  .moved { stroke: var(--anim-accent); }
  .shift { stroke: var(--anim-accent); stroke-width: 1.4; }
  .head { fill: var(--anim-accent); }
  .axis, .tick { stroke: var(--anim-ink); stroke-width: 1.3; }
  .accent-tick { stroke: var(--anim-accent); stroke-width: 2.2; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { fill: var(--anim-muted); }
  .accent { fill: var(--anim-accent); }
  .it { font-style: italic; }
  .num { fill: var(--anim-muted); font-size: 16px; }
</style>
