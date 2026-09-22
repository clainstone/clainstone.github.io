<script>
  // Remark 25 for N = 2: an open rectangle (a1, b1) × (a2, b2) of the plane,
  // its edges dashed because they do not belong to it.
</script>

<figure class="anim rectangle">
  <svg viewBox="0 0 420 260" role="img" aria-label="An open rectangle (a1, b1) × (a2, b2) in the plane with dashed edges">
    <line class="axis" x1="40" y1="220" x2="400" y2="220" />
    <line class="axis" x1="60" y1="240" x2="60" y2="20" />
    <rect class="rect" x="140" y="70" width="190" height="110" />
    <line class="guide" x1="140" y1="180" x2="140" y2="220" />
    <line class="guide" x1="330" y1="180" x2="330" y2="220" />
    <line class="guide" x1="60" y1="70" x2="140" y2="70" />
    <line class="guide" x1="60" y1="180" x2="140" y2="180" />
    <text x="140" y="240">a<tspan dy="5" font-size="0.72em">1</tspan></text>
    <text x="330" y="240">b<tspan dy="5" font-size="0.72em">1</tspan></text>
    <text x="42" y="180">a<tspan dy="5" font-size="0.72em">2</tspan></text>
    <text x="42" y="70">b<tspan dy="5" font-size="0.72em">2</tspan></text>
    <text class="name" x="235" y="125">(a<tspan dy="5" font-size="0.72em">1</tspan><tspan dy="-5">, b</tspan><tspan dy="5" font-size="0.72em">1</tspan><tspan dy="-5">) × (a</tspan><tspan dy="5" font-size="0.72em">2</tspan><tspan dy="-5">, b</tspan><tspan dy="5" font-size="0.72em">2</tspan><tspan dy="-5">)</tspan></text>
  </svg>
</figure>

<style>
  .rectangle { margin: 1.5rem auto; max-width: 26rem; }
  svg { font-family: var(--anim-font); }
  .axis { stroke: var(--anim-ink); stroke-width: 1.2; }
  .rect { fill: var(--anim-accent); fill-opacity: 0.12; stroke: var(--anim-accent); stroke-width: 1.6; stroke-dasharray: 6 4; }
  .guide { stroke: var(--anim-rule); stroke-width: 1; stroke-dasharray: 3 3; }
  text { fill: var(--anim-muted); font-size: 17px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .name { fill: var(--anim-accent); }
</style>
