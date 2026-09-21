<script>
  // An open set U in the plane, its boundary dashed. A point x moves inside U
  // and carries a ball B_r(x) ⊂ U, whose radius shrinks near the boundary.
  import Canvas from '@toolkit/Canvas.svelte';
  import { withAlpha } from '@toolkit/loop.js';

  const SAMPLES = 360;
  const shape = (th) => 1 + 0.16 * Math.sin(3 * th + 0.4) + 0.08 * Math.cos(5 * th);

  function draw(ctx, t, { w, h, p }) {
    ctx.clearRect(0, 0, w, h);
    if (w < 60 || h < 60) return; // the canvas has not been laid out yet
    const sx = 1.4;
    const sy = 0.9;
    const R = Math.min((0.46 * w) / (1.24 * sx), (0.42 * h) / (1.24 * sy));
    const cx = w / 2;
    const cy = h / 2 + p.px * 0.4;
    const at = (th, s) => [cx + s * R * shape(th) * sx * Math.cos(th), cy + s * R * shape(th) * sy * Math.sin(th)];

    const boundary = Array.from({ length: SAMPLES }, (_, k) => at((2 * Math.PI * k) / SAMPLES, 1));
    ctx.beginPath();
    boundary.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
    ctx.fillStyle = withAlpha(p.accent, 0.05);
    ctx.fill();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = p.muted;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.setLineDash([]);

    const [px, py] = at(0.37 * t + 0.6, 0.5 + 0.42 * Math.sin(0.83 * t));
    let dist = Infinity;
    for (let k = 0; k < SAMPLES; k++) {
      const [ax, ay] = boundary[k];
      const [bx, by] = boundary[(k + 1) % SAMPLES];
      const vx = bx - ax, vy = by - ay;
      const u = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy)));
      dist = Math.min(dist, Math.hypot(px - ax - u * vx, py - ay - u * vy));
    }
    const r = 0.85 * dist;

    ctx.beginPath();
    ctx.arc(px, py, r, 0, 2 * Math.PI);
    ctx.fillStyle = withAlpha(p.accent, 0.16);
    ctx.fill();
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + r, py);
    ctx.stroke();
    ctx.fillStyle = p.ink;
    ctx.beginPath();
    ctx.arc(px, py, 2.5, 0, 2 * Math.PI);
    ctx.fill();

    // Labels sit on the side of x that faces the centre of U, away from the boundary.
    ctx.font = p.font;
    const len = Math.hypot(cx - px, cy - py) || 1;
    const dx = (cx - px) / len;
    const dy = (cy - py) / len;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = p.accent;
    ctx.fillText('Bᵣ(x)', px + dx * (r + p.px * 1.8), py + dy * (r + p.px * 1.2));
    if (r > p.px * 1.4) {
      ctx.fillStyle = p.ink;
      ctx.fillText('x', px - p.px * 0.6, py - p.px * 0.6);
      ctx.fillStyle = p.accent;
      ctx.fillText('r', px + r / 2, py - p.px * 0.6);
    }
    ctx.textBaseline = 'alphabetic';
    const [ux, uy] = at(-0.9, 1);
    ctx.fillStyle = p.muted;
    ctx.textAlign = 'left';
    ctx.fillText('U', ux + 8, uy);
  }
</script>

<Canvas {draw} ratio={2} narrowRatio={1.25} label="An open set U with a dashed boundary, a point x moving inside it and an open ball around x contained in U" />
