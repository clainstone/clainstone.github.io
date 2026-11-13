<script>
  // Definition 10.1 (iii), the drawing of the lecture, an instance in the plane:
  // the vectors x and y from a common origin, their sum x + y, the vector y
  // again from the end of x (accent), and, dashed, the segment from the end
  // of y to the end of x + y.
  const uid = $props.id();
  const O = [110, 255];
  const vx = [75, -140];
  const vy = [225, -55];
  const X = [O[0] + vx[0], O[1] + vx[1]];
  const Y = [O[0] + vy[0], O[1] + vy[1]];
  const S = [X[0] + vy[0], X[1] + vy[1]];

  // A segment from P to Q that stops short of Q, so that the arrowhead ends at Q.
  function shaft(P, Q, cut = 6) {
    const dx = Q[0] - P[0], dy = Q[1] - P[1];
    const len = Math.hypot(dx, dy);
    return [P[0], P[1], Q[0] - (dx / len) * cut, Q[1] - (dy / len) * cut];
  }
  const arrows = [
    { seg: shaft(O, X), cls: 'vec' },
    { seg: shaft(O, Y), cls: 'vec' },
    { seg: shaft(O, S), cls: 'vec' },
    { seg: shaft(X, S), cls: 'vec moved' },
  ];
</script>

<figure class="anim triangle">
  <svg viewBox="0 0 520 290" role="img" aria-label="Two vectors x and y from a common origin, their sum x plus y as the diagonal, the vector y drawn again from the end of x to the end of x plus y, and a dashed segment from the end of y to the end of x plus y">
    <defs>
      <marker id="{uid}-ink" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
        <path class="head" d="M0,0 L10,5 L0,10 z" />
      </marker>
      <marker id="{uid}-accent" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
        <path class="head accent" d="M0,0 L10,5 L0,10 z" />
      </marker>
    </defs>
    <line class="dash" x1={Y[0]} y1={Y[1]} x2={S[0]} y2={S[1]} />
    {#each arrows as a}
      <line class={a.cls} x1={a.seg[0]} y1={a.seg[1]} x2={a.seg[2]} y2={a.seg[3]}
        marker-end={a.cls.includes('moved') ? `url(#${uid}-accent)` : `url(#${uid}-ink)`} />
    {/each}
    <circle class="dot" cx={O[0]} cy={O[1]} r="3.5" />
    <text class="it" x="128" y="176">x</text>
    <text class="it" x="236" y="248">y</text>
    <text class="it" x="276" y="176">x + y</text>
    <text class="it accent" x="290" y="68">y</text>
  </svg>
</figure>

<style>
  .triangle { margin: 1.5rem auto; max-width: 27rem; }
  svg { font-family: var(--anim-font); }
  .vec { stroke: var(--anim-ink); stroke-width: 2; }
  .moved { stroke: var(--anim-accent); stroke-width: 3; }
  .dash { stroke: var(--anim-muted); stroke-width: 1.6; stroke-dasharray: 6 5; }
  .head { fill: var(--anim-ink); }
  .head.accent { fill: var(--anim-accent); }
  .dot { fill: var(--anim-ink); }
  text { fill: var(--anim-ink); font-size: 19px; text-anchor: middle; dominant-baseline: central; }
  .it { font-style: italic; }
  text.accent { fill: var(--anim-accent); }
</style>
