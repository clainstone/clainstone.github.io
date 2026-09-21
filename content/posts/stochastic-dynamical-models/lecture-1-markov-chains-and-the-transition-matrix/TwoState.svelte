<script>
  // The two-state chain of Example 1.4 for the chosen α and β, and the values
  // p11^(n) for n = 0, ..., 30 against the level β/(α + β).
  import Canvas from '@toolkit/Canvas.svelte';
  import Slider from '@toolkit/Slider.svelte';
  import { withAlpha } from '@toolkit/loop.js';

  const N = 30;
  let alpha = $state(0.3);
  let beta = $state(0.2);

  function draw(ctx, t, { w, h, p, narrow }) {
    ctx.clearRect(0, 0, w, h);
    if (w < 60) return;
    const a = alpha;
    const b = beta;
    ctx.font = p.font;
    ctx.textBaseline = 'middle';

    // The diagram: two states, the jumps α and β, the loops 1 - α and 1 - β.
    const dh = p.px * 5;
    const cy = dh * 0.62;
    const r = p.px * 0.95;
    const c1 = w / 2 - Math.min(w * 0.22, 130);
    const c2 = w / 2 + Math.min(w * 0.22, 130);
    ctx.strokeStyle = p.muted;
    ctx.fillStyle = p.muted;
    ctx.lineWidth = 1.4;
    for (const [x, dir] of [[c1, -1], [c2, 1]]) {
      ctx.beginPath(); ctx.arc(x + dir * r * 1.95, cy, r * 0.95, 0, 2 * Math.PI); ctx.stroke();
    }
    for (const [y, from, to] of [[cy - r * 0.45, c1, c2], [cy + r * 0.45, c2, c1]]) {
      const s = Math.sign(to - from);
      ctx.beginPath(); ctx.moveTo(from + s * r, y); ctx.lineTo(to - s * r, y); ctx.stroke();
      const mx = (from + to) / 2 + s * 5;
      ctx.beginPath(); ctx.moveTo(mx, y); ctx.lineTo(mx - s * 8, y - 4); ctx.lineTo(mx - s * 8, y + 4); ctx.fill();
    }
    ctx.textAlign = 'center';
    ctx.fillStyle = p.accent;
    ctx.fillText(`α = ${a.toFixed(2)}`, w / 2, cy - r * 0.45 - p.px * 0.8);
    ctx.fillText(`β = ${b.toFixed(2)}`, w / 2, cy + r * 0.45 + p.px * 0.8);
    ctx.fillText(`1 − α`, c1 - r * 1.9, cy - r * 2.1);
    ctx.fillText(`1 − β`, c2 + r * 1.9, cy - r * 2.1);
    for (const [x, name] of [[c1, '1'], [c2, '2']]) {
      ctx.beginPath(); ctx.arc(x, cy, r, 0, 2 * Math.PI);
      ctx.strokeStyle = p.ink; ctx.stroke();
      ctx.fillStyle = p.ink; ctx.fillText(name, x, cy + 1);
    }

    // The plot of p11^(n), computed by the recurrence p11^(n) = β + (1 - α - β) p11^(n-1).
    const left = p.px * 2.6;
    const top = dh + p.px * 1.2;
    const bottom = h - p.px * 2.2;
    const right = w - 8;
    const X = (n) => left + ((right - left) * n) / N;
    const Y = (v) => bottom - (bottom - top) * v;
    ctx.strokeStyle = p.rule;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, bottom); ctx.lineTo(right, bottom); ctx.stroke();
    ctx.fillStyle = p.muted;
    ctx.font = p.smallFont;
    ctx.textAlign = 'right';
    for (const v of [0, 0.5, 1]) ctx.fillText(String(v), left - 6, Y(v));
    ctx.textAlign = 'center';
    for (let n = 0; n <= N; n += narrow ? 10 : 5) ctx.fillText(String(n), X(n), bottom + p.px * 0.9);
    ctx.fillText('n', right - 4, bottom + p.px * 1.8);

    if (a + b === 0) {
      ctx.textAlign = 'right';
      ctx.fillStyle = p.muted;
      ctx.fillText('α + β = 0 is excluded: P is the identity matrix', right, Y(0.5));
    }
    if (a + b > 0) {
      const lim = b / (a + b);
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = p.muted;
      ctx.beginPath(); ctx.moveTo(left, Y(lim)); ctx.lineTo(right, Y(lim)); ctx.stroke();
      ctx.setLineDash([]);
      ctx.textAlign = 'right';
      ctx.fillStyle = p.muted;
      ctx.fillText(`β/(α + β) = ${lim.toFixed(3)}`, right, Y(lim) + (lim > 0.85 ? p.px : -p.px * 0.8));
    }
    let v = 1;
    const pts = [];
    for (let n = 0; n <= N; n++) { pts.push([X(n), Y(v)]); v = b + (1 - a - b) * v; }
    ctx.strokeStyle = withAlpha(p.accent, 0.35);
    ctx.lineWidth = 1;
    ctx.beginPath(); pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.stroke();
    ctx.fillStyle = p.accent;
    for (const [x, y] of pts) { ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 2 * Math.PI); ctx.fill(); }
    ctx.textAlign = 'left';
    ctx.font = p.font;
    ctx.fillText(`p₁₁⁽ⁿ⁾,  1 − α − β = ${(1 - a - b).toFixed(2)}`, left + 6, top + p.px * 0.2);
  }
</script>

<Canvas {draw} ratio={1.7} narrowRatio={1.05} controls={false} autoplay={false} label="The two-state chain with the chosen α and β, and the probabilities p11 after n steps for n from 0 to 30, with the level β over α plus β" deps={[alpha, beta]}>
  <Slider label="α" min={0} max={1} step={0.01} bind:value={alpha} format={(v) => v.toFixed(2)} />
  <Slider label="β" min={0} max={1} step={0.01} bind:value={beta} format={(v) => v.toFixed(2)} />
</Canvas>
