<script>
  // Amdahl's law: the speed-up S(p) against p on logarithmic axes, the ceiling
  // 1 / (1 - f) as a dashed line, and f on a slider. Nothing moves on its own;
  // the curve slides to its new place when the reader changes f.
  import { onMount } from 'svelte';
  import { select, scaleLog, axisBottom, axisLeft, line, range, format, easeCubicOut } from 'd3';
  import Slider from '@toolkit/Slider.svelte';
  import { palette } from '@toolkit/loop.js';

  const S = (p, f) => 1 / (1 - f + f / p);
  const ps = range(0, 129).map((i) => 2 ** ((10 * i) / 128));
  let f = $state(0.9);
  let svg;
  let draw = () => {};
  let D = 0;

  onMount(() => {
    D = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 500;
    const m = { l: 44, r: 52, t: 28, b: 40 };
    const root = select(svg);
    const gx = root.append('g');
    const gy = root.append('g');
    const xTitle = root.append('text').attr('text-anchor', 'middle').text('processors p');
    const yTitle = root.append('text').text('speed-up S(p)');
    const ideal = root.append('path').attr('fill', 'none').attr('stroke-dasharray', '1 4').attr('stroke-linecap', 'round');
    const idealLabel = root.append('text').attr('dy', '0.35em').text('S = p');
    const cap = root.append('line').attr('stroke-dasharray', '6 4');
    const capLabel = root.append('text').attr('dy', '0.35em');
    const curve = root.append('path').attr('fill', 'none').attr('stroke-width', 2);
    const fLabel = root.append('text');
    let x;
    let y;
    let px = 0;

    // Every stroke, fill and label from the page palette, re-read at each layout.
    function paint(p) {
      px = p.px;
      root.attr('font-family', p.fontFamily).attr('font-size', p.px);
      for (const g of [gx, gy]) {
        g.attr('font-size', p.px).attr('font-family', p.fontFamily);
        g.select('.domain').attr('stroke', p.rule);
        g.selectAll('.tick line').attr('stroke', p.rule);
        g.selectAll('text').attr('fill', p.muted);
      }
      xTitle.attr('fill', p.muted);
      yTitle.attr('fill', p.muted);
      ideal.attr('stroke', p.muted);
      idealLabel.attr('fill', p.muted);
      cap.attr('stroke', p.muted);
      capLabel.attr('fill', p.accent);
      curve.attr('stroke', p.accent);
      fLabel.attr('fill', p.accent);
    }
    function layout(w, h) {
      root.attr('viewBox', `0 0 ${w} ${h}`);
      x = scaleLog().domain([1, 1024]).range([m.l, w - m.r]);
      y = scaleLog().domain([1, 1024]).range([h - m.b, m.t]);
      gx.attr('transform', `translate(0,${h - m.b})`)
        .call(axisBottom(x).tickValues([1, 4, 16, 64, 256, 1024]).tickFormat(format('d')).tickSize(4).tickPadding(6));
      gy.attr('transform', `translate(${m.l},0)`)
        .call(axisLeft(y).tickValues([1, 10, 100, 1000]).tickFormat(format('d')).tickSize(4).tickPadding(6));
      paint(palette(svg));
      xTitle.attr('x', (m.l + w - m.r) / 2).attr('y', h - 6);
      yTitle.attr('x', m.l - 30).attr('y', m.t - 12);
      ideal.attr('d', line().x((p) => x(p)).y((p) => y(p))(ps));
      idealLabel.attr('x', x(1024) + 6);
      cap.attr('x1', x(1)).attr('x2', x(1024));
      capLabel.attr('x', x(1024) + 6);
      fLabel.attr('x', m.l + 10).attr('y', m.t + 16);
      draw(0);
    }
    draw = (dur) => {
      if (!x) return;
      const fv = f;
      const c = 1 / (1 - fv);
      const t = (sel) => (dur ? sel.transition().duration(dur).ease(easeCubicOut) : sel.interrupt());
      t(curve).attr('d', line().x((p) => x(p)).y((p) => y(S(p, fv)))(ps));
      t(cap).attr('y1', y(c)).attr('y2', y(c));
      t(capLabel).attr('y', y(c));
      // "S = p" sits at the right of the diagonal's end like the ceiling value,
      // and steps up when the ceiling comes within a line of the top.
      t(idealLabel).attr('y', Math.min(y(1024), y(c) - 1.2 * px));
      capLabel.text(c >= 100 ? c.toFixed(0) : c.toFixed(1));
      fLabel.text(`f = ${fv.toFixed(3)}`);
    };
    const ro = new ResizeObserver(([e]) => { if (e.contentRect.width) layout(e.contentRect.width, e.contentRect.height); });
    ro.observe(svg);
    return () => {
      ro.disconnect();
      root.selectAll('*').interrupt();
    };
  });

  $effect(() => {
    f;
    draw(D);
  });
</script>

<div class="anim">
  <svg bind:this={svg} viewBox="0 0 640 360" role="img" aria-label="The speed-up of Amdahl's law against the number of processors, with its ceiling"></svg>
  <div class="anim-controls">
    <div class="anim-sliders">
      <Slider label="f" min={0.5} max={0.999} step={0.001} bind:value={f} format={(v) => Number(v).toFixed(3)} />
    </div>
  </div>
</div>

<style>
  svg { aspect-ratio: 16 / 9; }
</style>
