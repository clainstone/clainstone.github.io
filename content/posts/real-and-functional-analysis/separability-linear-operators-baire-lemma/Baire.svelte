<script>
  // The drawing of the proof of Theorem 19 (1), in three steps: the open set O;
  // then U_1 and the closed ball B̄_{r_1}(x_1) ⊂ O ∩ U_1, with O ∩ U_1 shaded;
  // then U_2 and the closed ball B̄_{r_2}(x_2) ⊂ B_{r_1}(x_1) ∩ U_2, with
  // B_{r_1}(x_1) ∩ U_2 shaded. The shapes follow the lecture's drawing: O an
  // oval, U_1 a tall set, U_2 a large set below, whose edge crosses B_{r_1}(x_1).
  const uid = $props.id();
  const O = { cx: 400, cy: 215, rx: 200, ry: 165 };
  const U1 = { cx: 390, cy: 240, rx: 90, ry: 200 };
  const U2 = { cx: 300, cy: 335, rx: 285, ry: 145 };
  const B1 = { cx: 395, cy: 215, r: 60 };
  const B2 = { cx: 400, cy: 240, r: 17 };
  const steps = ['the open set O', 'step (i)', 'step (ii)'];
  let k = $state(2);
</script>

<figure class="anim baire">
  <svg viewBox="0 0 760 480" role="img" aria-label="An oval open set O; a tall open set U 1 and a closed ball inside both; a large open set U 2 whose edge crosses that ball, and a smaller closed ball inside the ball and U 2">
    <defs>
      <clipPath id="{uid}-o"><ellipse cx={O.cx} cy={O.cy} rx={O.rx} ry={O.ry} /></clipPath>
      <clipPath id="{uid}-u2"><ellipse cx={U2.cx} cy={U2.cy} rx={U2.rx} ry={U2.ry} /></clipPath>
    </defs>
    {#if k >= 1}
      <ellipse class={k === 1 ? 'shade' : 'shade faint'} cx={U1.cx} cy={U1.cy} rx={U1.rx} ry={U1.ry} clip-path="url(#{uid}-o)" />
    {/if}
    {#if k >= 2}
      <circle class="shade strong" cx={B1.cx} cy={B1.cy} r={B1.r} clip-path="url(#{uid}-u2)" />
      <ellipse class="set two" cx={U2.cx} cy={U2.cy} rx={U2.rx} ry={U2.ry} />
      <text class="it" x="548" y="434">U<tspan class="sub" dy="5">2</tspan></text>
    {/if}
    <ellipse class="set" cx={O.cx} cy={O.cy} rx={O.rx} ry={O.ry} />
    <text class="it" x="592" y="126">O</text>
    {#if k >= 1}
      <ellipse class="set" cx={U1.cx} cy={U1.cy} rx={U1.rx} ry={U1.ry} />
      <text class="it" x="420" y="26">U<tspan class="sub" dy="5">1</tspan></text>
      <circle class="ball" cx={B1.cx} cy={B1.cy} r={B1.r} />
      <line class="lead" x1="440" y1="255" x2="476" y2="292" />
      <line class="bar" x1="484" y1="288" x2="494" y2="288" />
      <text class="it acc start halo" x="482" y="301">B<tspan class="sub" dy="5">r</tspan><tspan class="subsub" dy="4">1</tspan><tspan dy="-9">(x</tspan><tspan class="sub" dy="5">1</tspan><tspan dy="-5">)</tspan></text>
    {/if}
    {#if k >= 2}
      <circle class="ball small" cx={B2.cx} cy={B2.cy} r={B2.r} />
      <line class="lead" x1="418" y1="243" x2="512" y2="250" />
      <line class="bar" x1="520" y1="238" x2="530" y2="238" />
      <text class="it acc start halo" x="518" y="251">B<tspan class="sub" dy="5">r</tspan><tspan class="subsub" dy="4">2</tspan><tspan dy="-9">(x</tspan><tspan class="sub" dy="5">2</tspan><tspan dy="-5">)</tspan></text>
    {/if}
  </svg>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => (k = (k + 1) % steps.length)}>Next step ({k + 1} of {steps.length})</button>
    <span class="now">{steps[k]}</span>
  </div>
</figure>

<style>
  .baire { margin: 1.5rem auto; max-width: 690px; }
  svg { font-family: var(--anim-font); }
  .set { fill: none; stroke: var(--anim-ink); stroke-width: 1.6; }
  .set.two { stroke-dasharray: 9 5; }
  .shade { fill: var(--anim-accent); fill-opacity: 0.16; }
  .shade.faint { fill-opacity: 0.07; }
  .shade.strong { fill-opacity: 0.3; }
  .ball { fill: var(--anim-accent); fill-opacity: 0.12; stroke: var(--anim-accent); stroke-width: 2.2; }
  .ball.small { fill-opacity: 0.45; }
  .bar { stroke: var(--anim-accent); stroke-width: 1.3; }
  .lead { stroke: var(--anim-muted); stroke-width: 1; stroke-dasharray: 2 3; }
  .halo { paint-order: stroke; stroke: var(--page, #fff); stroke-width: 5px; stroke-linejoin: round; }
  text { fill: var(--anim-ink); font-size: 19px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .acc { fill: var(--anim-accent); }
  .start { text-anchor: start; }
  .sub { font-size: 14px; }
  .subsub { font-size: 11px; }
  .now { align-self: center; font-size: 0.8125rem; color: var(--anim-muted); }
</style>
