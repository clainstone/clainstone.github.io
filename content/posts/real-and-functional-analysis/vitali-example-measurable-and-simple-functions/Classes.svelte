<script>
  // Theorem 1, the drawing of the proof: a set E split into its equivalence
  // classes, drawn schematically, and one element picked from each class,
  // darker. The picked elements form the set F₀.
  import { blob } from './shapes.js';

  const uid = $props.id();
  const CX = 255, CY = 165, RX = 215, RY = 118;
  const WOBBLE = [[0.05, 3, 0.4], [0.03, 5, 1.3]];
  const outline = blob(CX, CY, RX, RY, WOBBLE);
  // The boundaries between the classes, clipped to E.
  const walls = [
    'M148,20 C140,120 156,200 146,320',
    'M250,20 C262,120 240,210 252,320',
    'M342,20 C332,120 352,210 340,320',
    'M147,162 C180,148 215,172 251,160',
    'M343,170 C380,155 420,180 490,168',
  ];
  // The points of each class; the first one is the element picked.
  const classes = [
    [[112, 150], [100, 175], [126, 117], [128, 197]],
    [[200, 112], [176, 98], [226, 130], [182, 138]],
    [[196, 202], [170, 186], [222, 222], [186, 226]],
    [[298, 160], [286, 108], [320, 204], [280, 216], [310, 88]],
    [[384, 132], [372, 108], [406, 148], [370, 150]],
    [[392, 206], [370, 222], [410, 192], [386, 186]],
  ];
  // Every point must lie well inside E.
  for (const cls of classes) for (const [x, y] of cls) {
    if (((x - CX) / RX) ** 2 + ((y - CY) / RY) ** 2 > 0.72) throw new Error(`point ${x},${y} is too close to the edge of E`);
  }
</script>

<figure class="anim classes">
  <svg viewBox="0 0 520 360" role="img" aria-label="A set E divided into six equivalence classes, each holding a few points, with one point of each class picked and darker; the picked points form F0">
    <defs>
      <clipPath id="{uid}-e"><path d={outline} /></clipPath>
    </defs>
    <path class="set" d={outline} />
    <g clip-path="url(#{uid}-e)">
      {#each walls as d}<path class="wall" {d} />{/each}
    </g>
    {#each classes as cls}
      {#each cls as [x, y], i}
        <circle class={i === 0 ? 'picked' : 'pt'} cx={x} cy={y} r={i === 0 ? 6.5 : 4} />
      {/each}
    {/each}
    <text class="lab it" x="44" y="40">E</text>
    <circle class="picked" cx="40" cy="336" r="6.5" />
    <text class="note" x="56" y="336">picked elements, which form <tspan class="it">F</tspan><tspan class="sub" dy="5">0</tspan></text>
    <circle class="pt" cx="330" cy="336" r="4" />
    <text class="note" x="344" y="336">other elements</text>
  </svg>
</figure>

<style>
  .classes { margin: 1.5rem auto; max-width: 27.5rem; }
  svg { font-family: var(--anim-font); }
  .set { fill: var(--anim-accent); fill-opacity: 0.05; stroke: var(--anim-ink); stroke-width: 1.6; }
  .wall { fill: none; stroke: var(--anim-muted); stroke-width: 1.3; }
  .pt { fill: var(--anim-muted); }
  .picked { fill: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; dominant-baseline: central; }
  .lab { font-size: 18px; }
  .it { font-style: italic; }
  .sub { font-size: 12px; }
  .note { fill: var(--anim-muted); }
</style>
