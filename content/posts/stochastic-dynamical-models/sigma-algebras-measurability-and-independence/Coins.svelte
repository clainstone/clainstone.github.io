<script>
  // Section 9: the 4 equally likely outcomes of two fair coins, the first coin by
  // rows and the second by columns. A: the first shows heads (top row); B: the
  // second shows heads (left column); C: the two show the same face (diagonal).
  // Every intersection of two of them, and of all three, is the outcome of two heads.
  const X0 = 110, Y0 = 50, C = 78;
  const faces = ['heads', 'tails'];
</script>

<figure class="anim coins">
  <svg viewBox="0 0 760 262" role="img" aria-label="Four outcomes of two coins in a two by two grid, with the events A, B and C outlined, and their probabilities">
    {#each [0, 1] as r}
      <text class="lab" x={X0 - 52} y={Y0 + r * C + C / 2}>{faces[r]}</text>
      {#each [0, 1] as c}
        <rect class="cell" class:hh={r === 0 && c === 0} x={X0 + c * C} y={Y0 + r * C} width={C} height={C} />
        <text class="out" x={X0 + c * C + C / 2} y={Y0 + r * C + C / 2 + 1}>{faces[r][0].toUpperCase()}{faces[c][0].toUpperCase()}</text>
      {/each}
    {/each}
    {#each [0, 1] as c}<text class="lab" x={X0 + c * C + C / 2} y={Y0 - 18}>{faces[c]}</text>{/each}
    <text class="lab" x={X0 + C} y="12">second coin</text>
    <text class="lab" x="24" y={Y0 + C} transform="rotate(-90 24 {Y0 + C})">first coin</text>
    <rect class="ev a" x={X0 - 6} y={Y0 + 6} width={2 * C + 12} height={C - 12} rx="10" />
    <rect class="ev b" x={X0 + 6} y={Y0 - 6} width={C - 12} height={2 * C + 12} rx="10" />
    <rect class="ev c" x={X0 + 16} y={Y0 + 16} width={C - 32} height={C - 32} rx="8" />
    <rect class="ev c" x={X0 + C + 16} y={Y0 + C + 16} width={C - 32} height={C - 32} rx="8" />
    <text class="ev-lab" x={X0 + 2 * C + 26} y={Y0 + C / 2}>A</text>
    <text class="ev-lab" x={X0 + C / 2} y={Y0 + 2 * C + 24}>B</text>
    <text class="ev-lab" x={X0 + 2 * C + 26} y={Y0 + 1.5 * C}>C</text>
    <g transform="translate(400, 0)">
      <text class="row" y="70"><tspan class="it">P</tspan>(<tspan class="it">A</tspan>) = <tspan class="it">P</tspan>(<tspan class="it">B</tspan>) = <tspan class="it">P</tspan>(<tspan class="it">C</tspan>) = 1/2</text>
      <text class="row" y="112"><tspan class="it">P</tspan>(<tspan class="it">A</tspan> ∩ <tspan class="it">B</tspan>) = <tspan class="it">P</tspan>(<tspan class="it">A</tspan> ∩ <tspan class="it">C</tspan>) = <tspan class="it">P</tspan>(<tspan class="it">B</tspan> ∩ <tspan class="it">C</tspan>) = 1/4</text>
      <text class="row" y="154"><tspan class="it">P</tspan>(<tspan class="it">A</tspan> ∩ <tspan class="it">B</tspan> ∩ <tspan class="it">C</tspan>) = 1/4</text>
      <text class="row muted" y="186">while <tspan class="it">P</tspan>(<tspan class="it">A</tspan>) <tspan class="it">P</tspan>(<tspan class="it">B</tspan>) <tspan class="it">P</tspan>(<tspan class="it">C</tspan>) = 1/8</text>
    </g>
  </svg>
</figure>

<style>
  .coins { margin: 1.5rem auto; max-width: 40rem; }
  svg { font-family: var(--anim-font); }
  .cell { fill: none; stroke: var(--anim-rule); stroke-width: 1.2; }
  .cell.hh { fill: var(--anim-accent); fill-opacity: 0.18; }
  .ev { fill: none; stroke: var(--anim-accent); stroke-width: 2; }
  .ev.b { stroke: var(--anim-ink); stroke-dasharray: 6 4; }
  .ev.c { stroke: var(--anim-muted); stroke-width: 2.5; stroke-dasharray: 2 4; stroke-linecap: round; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .lab { fill: var(--anim-muted); font-size: 16px; }
  .out { font-size: 18px; }
  .ev-lab { font-style: italic; font-weight: 600; }
  .row { text-anchor: start; }
  .muted { fill: var(--anim-muted); }
  .it { font-style: italic; }
</style>
