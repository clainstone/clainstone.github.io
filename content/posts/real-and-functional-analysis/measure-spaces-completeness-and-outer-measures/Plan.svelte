<script>
  // The plan of the outer measures part: from a function f on a family 𝓕 of
  // subsets of X, through outer measures, to a measure μ on a σ-algebra 𝓜 that
  // contains 𝓕. The direct way from the start to the end is crossed out.
</script>

<figure class="anim plan">
  <svg viewBox="0 0 640 250" role="img" aria-label="Start: a function f from F to [0, +infinity], with F a family of subsets of X. An arrow to outer measures, then an arrow to the end: a measure mu from M to [0, +infinity] with F contained in M. A direct arrow from start to end is crossed out.">
    <defs>
      <marker id="plan-head" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path class="head" d="M0,0 L10,5 L0,10 Z" />
      </marker>
      <marker id="plan-tip" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path class="tip" d="M0,0 L10,5 L0,10 Z" />
      </marker>
    </defs>
    <text class="title" x="100" y="40">Start</text>
    <text x="100" y="82">function</text>
    <text class="end" x="84" y="112"><tspan class="it">f</tspan> : <tspan class="it">F</tspan></text>
    <path class="map" d="M90,112 L112,112" marker-end="url(#plan-tip)" />
    <text class="start" x="120" y="112">[0, +∞]</text>
    <text x="100" y="142"><tspan class="it">F</tspan> ⊂ <tspan class="it">P</tspan>(<tspan class="it">X</tspan>)</text>
    <text class="title accent" x="320" y="82">outer measures</text>
    <text class="title" x="540" y="40">End</text>
    <text x="540" y="82">measure</text>
    <text class="end" x="522" y="112"><tspan class="it">μ</tspan> : <tspan class="it">M</tspan></text>
    <path class="map" d="M528,112 L550,112" marker-end="url(#plan-tip)" />
    <text class="start" x="558" y="112">[0, +∞]</text>
    <text x="540" y="142"><tspan class="it">F</tspan> ⊂ <tspan class="it">M</tspan></text>
    <path class="arc accent-line" d="M170,70 Q215,40 255,68" marker-end="url(#plan-head)" />
    <path class="arc accent-line" d="M385,68 Q425,40 470,70" marker-end="url(#plan-head)" />
    <path class="arc" d="M110,165 Q320,265 530,160" marker-end="url(#plan-head)" />
    <path class="cross" d="M305,197 L335,227 M335,197 L305,227" />
  </svg>
</figure>

<style>
  .plan { margin: 1.5rem auto; max-width: 36rem; }
  svg { font-family: var(--anim-font); }
  text { fill: var(--anim-ink); font-size: 20px; text-anchor: middle; dominant-baseline: central; }
  .title { font-size: 21px; font-weight: 600; }
  .it { font-style: italic; }
  .accent { fill: var(--anim-accent); }
  .arc { fill: none; stroke: var(--anim-muted); stroke-width: 1.5; }
  .accent-line { stroke: var(--anim-accent); }
  .head { fill: var(--anim-muted); }
  .end { text-anchor: end; }
  .start { text-anchor: start; }
  .map { stroke: var(--anim-ink); stroke-width: 1.3; }
  .tip { fill: var(--anim-ink); }
  .cross { stroke: var(--anim-ink); stroke-width: 2.4; stroke-linecap: round; }
</style>
