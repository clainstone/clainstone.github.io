<script>
  // Remark 6, the drawing of the lecture: a function f on ℕ as the sequence of
  // its values f₀, f₁, f₂, f₃, …, one bar over each natural number.
  const uid = $props.id();
  const BASE = 150;
  const bars = [
    { m: 0, x: 80, h: 42 },
    { m: 1, x: 180, h: 98 },
    { m: 2, x: 280, h: 58 },
    { m: 3, x: 380, h: 46 },
  ];
</script>

<figure class="anim counting">
  <svg viewBox="0 0 600 200" role="img" aria-label="Bars of different heights f0, f1, f2, f3 over the points 0, 1, 2, 3 of a horizontal axis, followed by dots">
    <defs>
      <marker id="{uid}-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto">
        <path class="head" d="M0,0 L8,4 L0,8 z" />
      </marker>
    </defs>
    <line class="axis" x1="40" y1={BASE} x2="572" y2={BASE} marker-end="url(#{uid}-head)" />
    {#each bars as b}
      <line class="bar" x1={b.x} y1={BASE} x2={b.x} y2={BASE - b.h} />
      <circle class="top" cx={b.x} cy={BASE - b.h} r="4.5" />
      <circle class="point" cx={b.x} cy={BASE} r="3.5" />
      <text class="lab" x={b.x + 22} y={BASE - b.h - 12}>f<tspan class="sub" dy="5">{b.m}</tspan></text>
      <text class="num" x={b.x} y={BASE + 24}>{b.m}</text>
    {/each}
    <circle class="point" cx="470" cy={BASE} r="3.5" />
    <circle class="point" cx="530" cy={BASE} r="3.5" />
    <text class="num" x="500" y={BASE - 40}>…</text>
  </svg>
</figure>

<style>
  .counting { margin: 1.5rem auto; max-width: 32rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.4; }
  .head { fill: var(--anim-ink); }
  .bar { stroke: var(--anim-accent); stroke-width: 4; }
  .top { fill: var(--anim-accent); }
  .point { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .lab { font-style: italic; fill: var(--anim-accent); }
  .sub { font-size: 13px; font-style: normal; }
  .num { fill: var(--anim-muted); font-size: 17px; }
</style>
