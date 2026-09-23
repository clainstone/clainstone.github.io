<script>
  // The proof of Theorem 4 (4) (ii), an instance: E is an open ellipse, so the
  // closure of E minus E is its boundary, dashed. The open set U, hatched, is a
  // band around it, and K, the closure of E minus U, is shaded.
  const C = [230, 122];
  const RX = 170, RY = 84;
  const IN = 0.86, OUT = 1.14;
  const at = (s, t) => [C[0] + s * RX * Math.cos(t), C[1] + s * RY * Math.sin(t)];
  const ring = (s) => `M${at(s, 0).join(',')} A${s * RX},${s * RY} 0 1,1 ${at(s, Math.PI).join(',')} A${s * RX},${s * RY} 0 1,1 ${at(s, 0).join(',')}Z`;
  const eLeader = [at(1, 0.5), [404, 204]];
  const uLeader = [at(1.1, 3.75), [52, 40]];
</script>

<figure class="anim inner">
  <svg viewBox="0 0 460 250" role="img" aria-label="An open ellipse E with dashed boundary, a hatched band U around the boundary, and the shaded compact set K enclosed by the band">
    <defs>
      <pattern id="lm-inner-hatch" patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="9" />
      </pattern>
    </defs>
    <path class="band" d="{ring(OUT)} {ring(IN)}" fill="url(#lm-inner-hatch)" fill-rule="evenodd" />
    <path class="band-edge" d={ring(OUT)} />
    <path class="band-edge" d={ring(IN)} />
    <path class="compact" d={ring(IN)} />
    <path class="set" d={ring(1)} />
    <line class="leader" x1={eLeader[0][0]} y1={eLeader[0][1]} x2={eLeader[1][0]} y2={eLeader[1][1]} />
    <text class="lab" x="416" y="214">E</text>
    <line class="leader accent-line" x1={uLeader[0][0]} y1={uLeader[0][1]} x2={uLeader[1][0]} y2={uLeader[1][1]} />
    <text class="lab accent" x="40" y="30">U</text>
    <text class="lab muted" x={C[0]} y={C[1]}>K</text>
  </svg>
</figure>

<style>
  .inner { margin: 1.5rem auto; max-width: 25rem; }
  svg { font-family: var(--anim-font); }
  .hatch { stroke: var(--anim-accent); stroke-width: 1.6; stroke-opacity: 0.8; }
  .band-edge { fill: none; stroke: var(--anim-accent); stroke-width: 1.2; stroke-dasharray: 5 4; }
  .compact { fill: var(--anim-muted); fill-opacity: 0.22; stroke: var(--anim-muted); stroke-width: 1.8; }
  .set { fill: none; stroke: var(--anim-ink); stroke-width: 1.8; stroke-dasharray: 7 5; }
  .leader { stroke: var(--anim-ink); stroke-width: 1; }
  .accent-line { stroke: var(--anim-accent); }
  text { fill: var(--anim-ink); font-size: 17px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .accent { fill: var(--anim-accent); }
  .muted { fill: var(--anim-muted); }
</style>
