<script>
  // Two states and P = [[0, 1], [1, 0]]: the distribution flips at every
  // step while the stationary (1/2, 1/2) sits still. A self-loop probability
  // eps above zero makes the chain aperiodic and the bars settle.
  import Canvas from '@toolkit/Canvas.svelte';
  import Slider from '@toolkit/Slider.svelte';
  import { withAlpha } from '@toolkit/loop.js';

  const PERIOD = 0.9, HOP = 0.45, KEEP = 24;

  let eps = $state(0);
  let n = $state(0);
  let mu = [1, 0];
  let history = [1];
  let at = 0, from = 0, stayed = false, clock = 0;
  let P;

  function step() {
    const p = eps;
    mu = [mu[0] * p + mu[1] * (1 - p), mu[0] * (1 - p) + mu[1] * p];
    from = at;
    stayed = Math.random() < p;
    if (!stayed) at = 1 - at;
    history = [...history.slice(1 - KEEP), mu[0]];
    clock = 0;
    n += 1;
  }

  const ease = (s) => s * s * (3 - 2 * s);
  const bez = (Q, e) => [0, 1].map((i) => (1 - e) ** 2 * Q[0][i] + 2 * (1 - e) * e * Q[1][i] + e * e * Q[2][i]);

  function text(ctx, s, x, y, align = 'center', color = P.muted, halo = false) {
    if (halo) {
      const m = ctx.measureText(s).width;
      ctx.clearRect(x - (align === 'left' ? 3 : align === 'right' ? m + 3 : m / 2 + 3), y - P.px + 1, m + 6, P.px + 3);
    }
    ctx.fillStyle = color; ctx.textAlign = align; ctx.fillText(s, x, y);
  }

  // Wide: the chain, the bars and the history side by side. Narrow: the
  // chain above the bars at full width, and no history.
  function layout(w, h, narrow) {
    if (narrow) return { r: Math.min(w, h) * 0.09, X: [w * 0.3, w * 0.7], cy: h * 0.27, bx: w * 0.325, bw: w * 0.14, y0: h * 0.94, y1: h * 0.6, hx: 0, hw: 0 };
    return { r: Math.min(w * 0.05, h * 0.14), X: [w * 0.1, w * 0.29], cy: h * 0.56, bx: w * 0.42, bw: w * 0.07, y0: h * 0.86, y1: h * 0.24, hx: w * 0.66, hw: w * 0.31 };
  }

  function draw(ctx, t, { w, h, dt, p, narrow }) {
    P = p;
    if (dt > 0) { clock += dt; if (clock >= PERIOD) step(); }
    ctx.clearRect(0, 0, w, h);
    ctx.font = p.font;
    ctx.lineWidth = 1;
    const { r, X, cy, bx, bw, y0, y1, hx, hw } = layout(w, h, narrow), mid = (X[0] + X[1]) / 2, top = p.px + 2;
    // The chain: a curve each way with a dot at its end, and self-loops that darken with eps.
    for (const [a, b] of [[0, 1], [1, 0]]) {
      const d = b > a ? 1 : -1;
      const Q = [[X[a] + d * 0.6 * r, cy - d * 0.8 * r], [mid, cy - d * 2.4 * r], [X[b] - d * 0.6 * r, cy - d * 0.8 * r]];
      ctx.strokeStyle = p.muted; ctx.beginPath(); ctx.moveTo(...Q[0]); ctx.quadraticCurveTo(...Q[1], ...Q[2]); ctx.stroke();
      ctx.fillStyle = p.muted; ctx.beginPath(); ctx.arc(...Q[2], 2.5, 0, 7); ctx.fill();
    }
    text(ctx, (1 - eps).toFixed(2), mid, cy - 1.6 * r - 5);
    text(ctx, (1 - eps).toFixed(2), mid, cy + 1.6 * r + top);
    const loop = withAlpha(p.ink, Math.min(1, 0.2 + 1.6 * eps));
    for (const x of X) {
      ctx.strokeStyle = loop; ctx.beginPath(); ctx.arc(x, cy - 1.5 * r, 0.5 * r, 0, 7); ctx.stroke();
      ctx.fillStyle = loop; ctx.beginPath(); ctx.arc(x + 0.5 * r, cy - 1.5 * r, 2.5, 0, 7); ctx.fill();
      text(ctx, eps.toFixed(2), x, cy - 2 * r - 5);
      ctx.strokeStyle = p.ink; ctx.beginPath(); ctx.arc(x, cy, r, 0, 7); ctx.stroke();
    }
    text(ctx, '1', X[0] - r - 6, cy + 4, 'right', p.ink);
    text(ctx, '2', X[1] + r + 6, cy + 4, 'left', p.ink);
    // The walker: along the curve for a swap, around the loop for a stay.
    const e = ease(Math.min(1, clock / HOP));
    let pos = [X[at], cy];
    if (clock < HOP && stayed) {
      const th = Math.PI / 2 - 2 * Math.PI * e, s = Math.sin(Math.PI * e) ** 0.3;
      pos = [X[at] + s * 0.5 * r * Math.cos(th), cy - s * (1.5 * r - 0.5 * r * Math.sin(th))];
    } else if (clock < HOP && from !== at) {
      const d = at > from ? 1 : -1;
      pos = bez([[X[from], cy], [mid, cy - d * 3.2 * r], [X[at], cy]], e);
    }
    ctx.fillStyle = p.accent; ctx.beginPath(); ctx.arc(pos[0], pos[1], 0.3 * r, 0, 7); ctx.fill();
    text(ctx, `step ${n}`, w * 0.03, top, 'left', p.accent);
    // The distribution now, as two bars, and (wide only) its first entry over the last steps.
    const Y = (v) => y0 - v * (y0 - y1), xe = hw ? hx + hw : bx + 2.5 * bw + 4;
    ctx.strokeStyle = p.rule; ctx.beginPath(); ctx.moveTo(bx - 4, y0); ctx.lineTo(xe, y0); ctx.stroke();
    ctx.fillStyle = p.accent; ctx.fillRect(bx, Y(mu[0]), bw, Math.max(1.5, y0 - Y(mu[0])));
    ctx.fillStyle = withAlpha(p.accent, 0.55); ctx.fillRect(bx + 1.5 * bw, Y(mu[1]), bw, Math.max(1.5, y0 - Y(mu[1])));
    text(ctx, mu[0].toFixed(2), bx + bw / 2, Y(mu[0]) - 5, 'center', p.accent);
    text(ctx, mu[1].toFixed(2), bx + 2 * bw, Y(mu[1]) - 5, 'center', p.accent);
    text(ctx, '1', bx + bw / 2, y0 + top + 1); text(ctx, '2', bx + 2 * bw, y0 + top + 1);
    text(ctx, 'now', bx + 1.25 * bw, hw ? top : y1 - 22);
    if (hw) {
      const hb = hw / KEEP;
      history.forEach((v, i) => {
        const j = i + KEEP - history.length;
        ctx.fillStyle = withAlpha(p.accent, 0.2 + 0.8 * (j + 1) / KEEP);
        ctx.fillRect(hx + j * hb + 0.5, Y(v), Math.max(1, hb - 1), Math.max(1.5, y0 - Y(v)));
      });
      text(ctx, `μ(1), last ${KEEP} steps`, hx + hw, top, 'right');
    }
    ctx.setLineDash([4, 4]); ctx.strokeStyle = p.muted;
    ctx.beginPath(); ctx.moveTo(bx - 4, Y(0.5)); ctx.lineTo(xe, Y(0.5)); ctx.stroke(); ctx.setLineDash([]);
    if (hw) text(ctx, 'stationary ½', hx + 2, Y(0.5) - 5, 'left', p.muted, true);
    else text(ctx, 'stationary ½', xe + 6, Y(0.5) + 4, 'left');
  }
</script>

<Canvas {draw} ratio={1.8} narrowRatio={1} label="A walker hopping between two states while the distribution flips between the two states and the stationary level stays at one half" deps={[eps]}>
  <Slider label="ε" min={0} max={0.5} step={0.01} bind:value={eps} format={(v) => v.toFixed(2)} />
</Canvas>
