<script>
  // Section 2, an instance with two events: De Morgan's law in three steps.
  // A₁ and A₂; the union of their complements; its complement, which is A₁ ∩ A₂.
  const uid = $props.id();
  const W = 220, H = 150, R = 48;
  const panels = [0, 260, 520];
  const c1 = [80, 75], c2 = [140, 75];
</script>

<figure class="anim de-morgan">
  <svg viewBox="0 0 760 212" role="img" aria-label="Three panels: two events A1 and A2; the union of their complements shaded; its complement, the intersection of A1 and A2, shaded">
    <defs>
      <clipPath id="{uid}-c1"><circle cx={c1[0]} cy={c1[1]} r={R} /></clipPath>
      <mask id="{uid}-out">
        <rect x="0" y="0" width={W} height={H} fill="white" />
        <circle cx={c2[0]} cy={c2[1]} r={R} fill="black" clip-path="url(#{uid}-c1)" />
      </mask>
    </defs>
    {#each panels as x0, k}
      <g transform="translate({x0 + 10}, 10)">
        {#if k === 1}<rect class="fill" x="0" y="0" width={W} height={H} rx="10" mask="url(#{uid}-out)" />{/if}
        {#if k === 2}<circle class="fill" cx={c2[0]} cy={c2[1]} r={R} clip-path="url(#{uid}-c1)" />{/if}
        <rect class="omega" x="0" y="0" width={W} height={H} rx="10" />
        <circle class="set" cx={c1[0]} cy={c1[1]} r={R} />
        <circle class="set" cx={c2[0]} cy={c2[1]} r={R} />
        <text class="it" x="30" y="28">A<tspan class="sub" dy="5">1</tspan></text>
        <text class="it" x="190" y="28">A<tspan class="sub" dy="5">2</tspan></text>
        <text class="omega-lab" x={W - 16} y={H - 16}>Ω</text>
      </g>
    {/each}
    <text x={10 + W / 2} y="190"><tspan class="it">A</tspan><tspan class="sub" dy="5">1</tspan><tspan dy="-5">&nbsp;and&nbsp;</tspan><tspan class="it">A</tspan><tspan class="sub" dy="5">2</tspan></text>
    <text x={270 + W / 2} y="190"><tspan class="it">A</tspan><tspan class="sub" dy="5">1</tspan><tspan class="sup" dy="-12">c</tspan><tspan dy="7">&nbsp;∪&nbsp;</tspan><tspan class="it">A</tspan><tspan class="sub" dy="5">2</tspan><tspan class="sup" dy="-12">c</tspan></text>
    <text x={530 + W / 2} y="190">(<tspan class="it">A</tspan><tspan class="sub" dy="5">1</tspan><tspan class="sup" dy="-12">c</tspan><tspan dy="7">&nbsp;∪&nbsp;</tspan><tspan class="it">A</tspan><tspan class="sub" dy="5">2</tspan><tspan class="sup" dy="-12">c</tspan><tspan dy="7">)</tspan><tspan class="sup" dy="-9">c</tspan><tspan dy="9">&nbsp;=&nbsp;</tspan><tspan class="it">A</tspan><tspan class="sub" dy="5">1</tspan><tspan dy="-5">&nbsp;∩&nbsp;</tspan><tspan class="it">A</tspan><tspan class="sub" dy="5">2</tspan></text>
  </svg>
</figure>

<style>
  .de-morgan { margin: 1.5rem auto; max-width: 40rem; }
  svg { font-family: var(--anim-font); }
  .omega { fill: none; stroke: var(--anim-rule); stroke-width: 1.2; }
  .set { fill: none; stroke: var(--anim-ink); stroke-width: 1.4; }
  .fill { fill: var(--anim-accent); fill-opacity: 0.3; }
  text { fill: var(--anim-ink); font-size: 17px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  .sub, .sup { font-size: 12px; font-style: normal; }
  .omega-lab { fill: var(--anim-muted); font-size: 16px; }
</style>
