<script>
  // Proposition 3, Step 2: inside P(Y), the family F, the σ-algebra
  // M_Y = σ₀(F) that it generates, and the family N of the sets with
  // preimage in M_X, which contains F and, once a σ-algebra, contains M_Y.
</script>

<figure class="anim families">
  <svg viewBox="0 0 540 310" role="img" aria-label="P(Y) as the outer box; inside it the family N, dashed; inside N the sigma-algebra M_Y equal to sigma0(F); inside that the family F">
    <rect class="outer" x="10" y="10" width="520" height="290" rx="6" />
    <text class="lab muted" x="32" y="38" text-anchor="start"><tspan class="it">P</tspan>(<tspan class="it">Y</tspan>)</text>
    <ellipse class="n" cx="280" cy="165" rx="225" ry="122" />
    <text class="lab muted" x="280" y="68"><tspan class="it">N</tspan></text>
    <ellipse class="m" cx="280" cy="180" rx="150" ry="82" />
    <text class="lab accent" x="280" y="124"><tspan class="it">M</tspan><tspan class="sub" dy="5">Y</tspan><tspan dy="-5">&#160;=&#160;σ</tspan><tspan class="sub" dy="5">0</tspan><tspan dy="-5">(</tspan><tspan class="it">F</tspan>)</text>
    <ellipse class="f" cx="280" cy="196" rx="54" ry="34" />
    <text class="lab" x="280" y="196"><tspan class="it">F</tspan></text>
  </svg>
</figure>

<style>
  .families { margin: 1.5rem auto; max-width: 28.5rem; }
  svg { font-family: var(--anim-font); }
  .outer { fill: none; stroke: var(--anim-ink); stroke-width: 1.4; }
  .n { fill: none; stroke: var(--anim-muted); stroke-width: 1.5; stroke-dasharray: 7 5; }
  .m { fill: var(--anim-accent); fill-opacity: 0.16; stroke: var(--anim-accent); stroke-width: 2; }
  .f { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 1.4; }
  text { fill: var(--anim-ink); font-size: 18px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub { font-size: 12px; font-style: italic; }
  .muted { fill: var(--anim-muted); }
  .accent { fill: var(--anim-accent); }
</style>
