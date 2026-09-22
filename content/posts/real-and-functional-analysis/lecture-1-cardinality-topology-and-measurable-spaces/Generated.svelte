<script>
  // The proof of Theorem 26: every σ-algebra Q of the family W contains F and
  // is contained in P(X). Three members are drawn; σ0(F), the intersection of
  // all the members of W, lies inside each of them and contains F.
</script>

<figure class="anim generated">
  <svg viewBox="0 0 520 300" role="img" aria-label="P(X) as the outer box; three of the sigma-algebras of W, Q1, Q2, Q3, all containing F; inside their common part, sigma0(F), the intersection of all the members of W, which contains F">
    <rect class="outer" x="10" y="10" width="500" height="280" rx="6" />
    <text class="lab" x="30" y="38"><tspan font-style="italic">P</tspan>(<tspan font-style="italic">X</tspan>)</text>
    <ellipse class="q" cx="215" cy="160" rx="150" ry="100" />
    <ellipse class="q" cx="305" cy="160" rx="150" ry="100" />
    <ellipse class="q" cx="260" cy="120" rx="130" ry="95" />
    <text class="qlab" x="85" y="175"><tspan font-style="italic">Q</tspan><tspan dy="5" font-size="0.72em">1</tspan></text>
    <text class="qlab" x="440" y="175"><tspan font-style="italic">Q</tspan><tspan dy="5" font-size="0.72em">2</tspan></text>
    <text class="qlab" x="260" y="42"><tspan font-style="italic">Q</tspan><tspan dy="5" font-size="0.72em">3</tspan></text>
    <ellipse class="m" cx="260" cy="150" rx="78" ry="62" />
    <ellipse class="f" cx="260" cy="162" rx="36" ry="24" />
    <text class="flab" x="260" y="162"><tspan font-style="italic">F</tspan></text>
    <text class="mlab" x="260" y="113">σ<tspan dy="5" font-size="0.72em">0</tspan><tspan dy="-5">(</tspan><tspan font-style="italic">F</tspan>)</text>
  </svg>
</figure>

<style>
  .generated { margin: 1.5rem auto; max-width: 30rem; }
  svg { font-family: var(--anim-font); }
  .outer { fill: none; stroke: var(--anim-ink); stroke-width: 1.4; }
  .q { fill: var(--anim-accent); fill-opacity: 0.05; stroke: var(--anim-muted); stroke-width: 1.3; stroke-dasharray: 6 4; }
  .m { fill: var(--anim-accent); fill-opacity: 0.18; stroke: var(--anim-accent); stroke-width: 2; }
  .f { fill: var(--page, #fff); stroke: var(--anim-ink); stroke-width: 1.4; }
  text { text-anchor: middle; dominant-baseline: central; font-size: 18px; }
  .lab, .qlab { fill: var(--anim-muted); }
  .lab { text-anchor: start; }
  .flab { fill: var(--anim-ink); }
  .mlab { fill: var(--anim-accent); }
</style>
