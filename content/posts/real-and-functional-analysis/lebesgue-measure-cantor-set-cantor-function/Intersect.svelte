<script>
  // Remark 2 (i), an instance with N = 2: two overlapping rectangles and their
  // intersection, hatched, which is again a rectangle.
  const A = { x: 60, y: 70, w: 210, h: 110 };
  const B = { x: 195, y: 30, w: 170, h: 95 };
  const I = { x: B.x, y: A.y, w: A.x + A.w - B.x, h: B.y + B.h - A.y };
</script>

<figure class="anim intersect">
  <svg viewBox="0 0 420 210" role="img" aria-label="Two overlapping rectangles of the plane; their intersection, hatched, is again a rectangle">
    <defs>
      <pattern id="lm-intersect-hatch" patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(45)">
        <line class="hatch" x1="0" y1="0" x2="0" y2="9" />
      </pattern>
    </defs>
    <rect class="meet" x={I.x} y={I.y} width={I.w} height={I.h} fill="url(#lm-intersect-hatch)" />
    <rect class="rect" x={A.x} y={A.y} width={A.w} height={A.h} />
    <rect class="rect" x={B.x} y={B.y} width={B.w} height={B.h} />
    <rect class="edge" x={I.x} y={I.y} width={I.w} height={I.h} />
  </svg>
</figure>

<style>
  .intersect { margin: 1.5rem auto; max-width: 23rem; }
  .rect { fill: none; stroke: var(--anim-muted); stroke-width: 1.6; }
  .meet { stroke: none; }
  .hatch { stroke: var(--anim-accent); stroke-width: 2.2; }
  .edge { fill: none; stroke: var(--anim-accent); stroke-width: 2; }
</style>
