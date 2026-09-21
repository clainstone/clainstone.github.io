<script>
  // The n-step transition matrix P^n of the frog chain for the chosen n: each
  // cell is shaded by its value, and the entry p11 is given as an exact
  // fraction for n up to 12 and rounded beyond.
  import Canvas from '@toolkit/Canvas.svelte';
  import Slider from '@toolkit/Slider.svelte';
  import { withAlpha } from '@toolkit/loop.js';
  import { P, powers, superscript } from './frog.js';

  const NMAX = 60;
  const POW = powers(P, NMAX);
  // 4P has integer entries, so 4^n p11^(n) is an integer.
  const Q = P.map((row) => row.map((v) => 4 * v));
  const exact = [1];
  {
    let M = Q.map((row, i) => row.map((_, j) => (i === j ? 1 : 0)));
    for (let n = 1; n <= 12; n++) {
      M = M.map((row) => Q[0].map((_, j) => row.reduce((s, a, k) => s + a * Q[k][j], 0)));
      exact.push(M[0][0]);
    }
  }
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);
  // Exact fraction for n <= 12, where 4^n stays short enough to print; the
  // reduced denominator is a power of 2, so the decimal is exact up to 2^-6.
  function p11(n) {
    if (n > 12) return `≈ ${POW[n][0][0].toFixed(6)}`;
    const num = exact[n];
    const den = 4 ** n;
    const g = gcd(num, den);
    if (den / g === 1) return `= ${num / g}`;
    const sign = den / g <= 64 ? '=' : '≈';
    return `= ${num / g}/${den / g} ${sign} ${(num / den).toFixed(6).replace(/0+$/, '')}`;
  }

  let n = $state(3);

  function draw(ctx, t, { w, h, p, narrow }) {
    ctx.clearRect(0, 0, w, h);
    if (w < 60) return;
    const M = POW[n];
    const head = p.px * 3.4;
    const lab = p.px * 1.6;
    const cell = Math.min((w - lab - 4) / 7, (h - head - lab - 4) / 7);
    const x0 = (w - lab - cell * 7) / 2 + lab;
    const y0 = head + lab;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = p.smallFont;
    for (let k = 0; k < 7; k++) {
      ctx.fillStyle = p.muted;
      ctx.fillText(`j = ${k + 1}`, x0 + (k + 0.5) * cell, y0 - lab / 2);
      ctx.fillText(`i = ${k + 1}`, x0 - lab / 2 - (narrow ? 0 : 6), y0 + (k + 0.5) * cell);
    }
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const v = M[i][j];
        const x = x0 + j * cell;
        const y = y0 + i * cell;
        ctx.fillStyle = withAlpha(p.accent, 0.05 + 0.4 * v);
        ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        ctx.fillStyle = p.ink;
        ctx.fillText(v === 0 ? '0' : v < 0.0005 ? '0.000' : v.toFixed(3), x + cell / 2, y + cell / 2);
      }
    }
    ctx.strokeStyle = p.accent;
    ctx.lineWidth = 2;
    ctx.strokeRect(x0 + 1, y0 + 1, cell - 2, cell - 2);
    ctx.textAlign = 'left';
    ctx.font = p.font;
    ctx.fillStyle = p.ink;
    ctx.fillText(`P${superscript(n)}: the entry in row i, column j is pᵢⱼ⁽${superscript(n)}⁾`, 4, p.px * 0.8);
    ctx.fillStyle = p.accent;
    ctx.fillText(`p₁₁⁽${superscript(n)}⁾ ${p11(n)}`, 4, p.px * 2.3);
  }
</script>

<Canvas {draw} ratio={1.45} narrowRatio={1} controls={false} autoplay={false} label="The matrix P to the power n for the frog chain, each entry shaded by its value, with the entry in row 1 and column 1 given as an exact fraction for n up to 12 and rounded beyond" deps={[n]}>
  <Slider label="n" min={0} max={NMAX} step={1} bind:value={n} />
</Canvas>
