<script>
  // Lemma 18 (i), as drawn in the notes: a closed set V of the plane, its
  // boundary solid because it belongs to V, and a sequence (x_n) ⊂ V that
  // converges to a point x0 of the boundary. The terms appear one at a time;
  // their distance to x0 tends to 0 and the limit x0 lies in V.
  import Canvas from '@toolkit/Canvas.svelte';
  import { withAlpha } from '@toolkit/loop.js';
  import { subscript } from './random.js';

  const SAMPLES = 360;
  const TERMS = 14;
  const shape = (th) => 1 + 0.1 * Math.sin(2 * th + 0.7) + 0.05 * Math.cos(5 * th);
  const TH0 = -0.55; // angle of the limit point on the boundary

  function draw(ctx, t, { w, h, p }) {
    ctx.clearRect(0, 0, w, h);
    if (w < 60 || h < 60) return;
    const sx = 1.5, sy = 0.85;
    const R = Math.min((0.44 * w) / (1.15 * sx), (0.42 * h) / (1.15 * sy));
    const cx = w / 2, cy = h / 2 + p.px * 0.3;
    const at = (th, s) => [cx + s * R * shape(th) * sx * Math.cos(th), cy + s * R * shape(th) * sy * Math.sin(th)];

    ctx.beginPath();
    for (let k = 0; k <= SAMPLES; k++) {
      const [x, y] = at((2 * Math.PI * k) / SAMPLES, 1);
      k ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = withAlpha(p.accent, 0.06);
    ctx.fill();
    ctx.strokeStyle = p.ink;
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // x_n approaches x0 from inside V along a spiral: radius factor and angle
    // both converge, so d(x_n, x0) -> 0.
    const [x0, y0] = at(TH0, 1);
    const term = (n) => at(TH0 + 1.6 * Math.cos(1.3 * n) / (n + 1), 1 - 0.75 / (n + 1));
    const shown = Math.min(TERMS, Math.floor((t * 1.6) % (TERMS + 5)) + 1);
    for (let n = 1; n <= shown; n++) {
      const [x, y] = term(n);
      ctx.beginPath();
      ctx.arc(x, y, n === shown ? 3.5 : 2.5, 0, 2 * Math.PI);
      ctx.fillStyle = n === shown ? p.accent : withAlpha(p.accent, 0.55);
      ctx.fill();
      if (n <= 3) {
        ctx.font = p.smallFont;
        ctx.fillStyle = p.muted;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'bottom';
        ctx.fillText('x' + subscript(n), x + 5, y - 3);
      }
    }
    if (shown >= 2) {
      const [x, y] = term(shown);
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = p.muted;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x0, y0);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.beginPath();
    ctx.arc(x0, y0, 4, 0, 2 * Math.PI);
    ctx.fillStyle = p.ink;
    ctx.fill();
    ctx.font = p.font;
    ctx.fillStyle = p.ink;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('x₀ ∈ V', x0 + 9, y0 + 2);
    const [vx, vy] = at(3.6, 1);
    ctx.fillStyle = p.muted;
    ctx.textAlign = 'right';
    ctx.fillText('V', vx - 8, vy);
  }
</script>

<Canvas {draw} ratio={2} narrowRatio={1.3} label="A closed set V with a solid boundary and a sequence of points of V converging to a point x0 on the boundary, which belongs to V" />
