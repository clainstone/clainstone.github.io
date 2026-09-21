<script>
  // A walker on a three-state chain, the matrix it samples from, and the row
  // of P^k it is distributed by, converging to the stationary distribution.
  // Everything inside the svg is drawn and moved with d3, in the page palette.
  import { onMount } from 'svelte';
  import { select, easeCubicInOut } from 'd3';
  import { palette, NARROW } from '@toolkit/loop.js';
  import { P, multiply, stationary, sample, nodePositions, edgePath } from './chain.js';

  let svg;
  let playing = $state(false);
  let ctl = { step() {}, toggle() {} };

  onMount(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const D = reduced ? 0 : 420;
    const pi = stationary(P);
    let p = palette(svg);
    let state = 0;
    let mu = [1, 0, 0];
    let k = 0;
    let pos = [];
    let barX = 0;
    let barMax = 1;

    const root = select(svg);
    const edges = [];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) edges.push({ i, j, p: P[i][j] });
    const paths = root.selectAll('path').data(edges).join('path')
      .attr('fill', 'none').attr('stroke-linecap', 'round').attr('stroke-width', (d) => 0.5 + 7 * d.p);
    const dots = root.selectAll('circle.chain-dot').data(edges).join('circle').attr('class', 'chain-dot').attr('r', (d) => 1.5 + 2.5 * d.p);
    const nodes = root.selectAll('g.chain-node').data([0, 1, 2]).join('g').attr('class', 'chain-node');
    nodes.append('circle').attr('fill', 'none').attr('stroke-width', 1.2);
    nodes.append('text').text((d) => d + 1).attr('text-anchor', 'middle').attr('dy', '0.35em');
    // The current state wears a ring outside its node, so the label stays
    // readable; at each step a dot travels along the transition taken.
    const ring = root.append('circle').attr('fill', 'none').attr('stroke-width', 2.5);
    const walker = root.append('circle').attr('r', 5).attr('opacity', 0);
    const matrixLabel = root.append('text').attr('text-anchor', 'end').text('P =');
    const rows = root.selectAll('text.chain-row').data(P).join('text').attr('class', 'chain-row');
    rows.selectAll('tspan').data((d) => d).join('tspan').text((v) => v.toFixed(1)).attr('text-anchor', 'middle');
    const title = root.append('text');
    title.append('tspan').text('row 1 of P');
    const sup = title.append('tspan').attr('dy', -5).text('k');
    title.append('tspan').attr('dy', 5).text(', marks at the stationary π');
    const kLabel = root.append('text').attr('text-anchor', 'end');
    const bars = root.selectAll('g.chain-bar').data([0, 1, 2]).join('g').attr('class', 'chain-bar');
    bars.append('text').attr('class', 'chain-name').text((d) => d + 1).attr('dy', '0.35em');
    bars.append('rect').attr('opacity', 0.85);
    bars.append('line').attr('stroke-width', 1);
    bars.append('text').attr('class', 'chain-value').attr('dy', '0.35em');

    // Every stroke, fill and label from the page palette, re-read at each layout.
    function paint() {
      p = palette(svg);
      root.attr('font-family', p.fontFamily).attr('font-size', p.px);
      paths.attr('stroke', p.rule);
      dots.attr('fill', p.muted);
      nodes.select('circle').attr('stroke', p.ink);
      nodes.select('text').attr('fill', p.ink);
      ring.attr('stroke', p.accent);
      walker.attr('fill', p.accent);
      matrixLabel.attr('fill', p.muted).attr('font-size', Math.max(12, p.px));
      rows.attr('font-size', Math.max(12, p.px));
      title.attr('fill', p.muted);
      sup.attr('font-size', Math.round(p.px * 0.75));
      kLabel.attr('fill', p.accent);
      bars.select('.chain-name').attr('fill', p.muted);
      bars.select('rect').attr('fill', p.accent);
      bars.select('line').attr('stroke', p.ink);
      bars.select('.chain-value').attr('fill', p.muted);
    }
    // Wide: the graph with the matrix under it at the left, the bars at the
    // right. Narrow: graph, matrix and bars stacked, the bars at the bottom.
    function layout(w, h) {
      paint();
      root.attr('viewBox', `0 0 ${w} ${h}`);
      const stacked = window.matchMedia(NARROW).matches;
      const fs = Math.max(12, p.px);
      const lh = Math.round(fs * 1.35);
      const R = stacked ? 16 : 20;
      const rad = stacked ? Math.round(w * 0.18) : Math.round(Math.min(h * 0.25, w * 0.15));
      const gw = stacked ? w : w / 2;
      const cx = gw / 2;
      // Room for the top loop, the nodes, the bottom loops, a gap and the matrix.
      const block = 50 + 1.5 * rad + 24 + 14 + 3 * lh;
      const cy = (stacked ? 6 : (h - block) / 2) + 50 + rad;
      pos = nodePositions(cx, cy, rad);
      paths.attr('d', (d) => edgePath(pos[d.i], pos[d.j], R, { x: cx, y: cy }));
      dots.each(function (d, i) {
        const el = paths.nodes()[i];
        const q = el.getPointAtLength(Math.max(0, el.getTotalLength() - 5 - 2 * d.p));
        select(this).attr('cx', q.x).attr('cy', q.y);
      });
      nodes.attr('transform', (d) => `translate(${pos[d].x},${pos[d].y})`).select('circle').attr('r', R);
      ring.interrupt().attr('r', R + 4).attr('cx', pos[state].x).attr('cy', pos[state].y);
      walker.interrupt().attr('opacity', 0);
      const mY = cy + 0.5 * rad + 24 + 14 + fs;
      const colW = fs * 3.2;
      matrixLabel.attr('x', cx - 1.5 * colW - 4).attr('y', mY);
      rows.attr('y', (d, i) => mY + lh * i).selectAll('tspan').attr('x', (v, j) => cx + (j - 1) * colW);
      const x0 = stacked ? 8 : gw + 24;
      const bH = stacked ? 18 : 26;
      const bS = stacked ? 30 : 56;
      const barTop = stacked ? h - 8 - bH - 2 * bS : (h - 2 * bS - bH) / 2 + 14;
      const tY = barTop - (stacked ? 14 : 18);
      barX = x0 + 18;
      barMax = w - 8 - barX - 46;
      title.attr('x', x0).attr('y', tY);
      kLabel.attr('x', w - 8).attr('y', tY);
      bars.attr('transform', (d) => `translate(0,${barTop + bS * d})`);
      bars.select('.chain-name').attr('x', x0).attr('y', bH / 2);
      bars.select('rect').attr('x', barX).attr('height', bH);
      bars.select('line').attr('y1', -3).attr('y2', bH + 3).attr('x1', (d) => barX + barMax * pi[d]).attr('x2', (d) => barX + barMax * pi[d]);
      bars.select('.chain-value').attr('y', bH / 2);
      update(0);
    }
    function update(dur) {
      const t = (sel) => (dur ? sel.transition().duration(dur) : sel.interrupt());
      t(bars.select('rect')).attr('width', (d) => barMax * mu[d]);
      t(bars.select('.chain-value')).attr('x', (d) => barX + barMax * mu[d] + 6);
      bars.select('.chain-value').text((d) => mu[d].toFixed(3));
      kLabel.text(`k = ${k}`);
      t(rows).attr('fill', (d, i) => (i === state ? p.accent : p.muted));
    }
    // The walker follows the transition's path; the ring moves when it arrives.
    function hop(i, j) {
      const el = paths.nodes()[i * 3 + j];
      const L = el.getTotalLength();
      walker.interrupt().attr('opacity', 1)
        .transition().duration(D).ease(easeCubicInOut)
        .attrTween('cx', () => (t) => el.getPointAtLength(t * L).x)
        .attrTween('cy', () => (t) => el.getPointAtLength(t * L).y)
        .transition().duration(0).attr('opacity', 0);
      ring.interrupt().transition().delay(D).duration(0).attr('cx', pos[j].x).attr('cy', pos[j].y);
    }
    const doStep = () => {
      const j = sample(P[state]);
      hop(state, j);
      state = j;
      k += 1;
      mu = multiply(mu, P);
      update(D);
    };
    let wanted = !reduced;
    let visible = false;
    let timer = 0;
    const tickLater = () => { timer = window.setTimeout(() => { doStep(); tickLater(); }, D + 700); };
    const sync = () => {
      const should = wanted && visible;
      if (should && !playing) { playing = true; tickLater(); }
      else if (!should && playing) { playing = false; clearTimeout(timer); }
    };
    const ro = new ResizeObserver(([e]) => { if (e.contentRect.width) layout(e.contentRect.width, e.contentRect.height); });
    ro.observe(svg);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; sync(); }, { threshold: 0.05 });
    io.observe(svg);
    ctl = { step: doStep, toggle() { wanted = !wanted; sync(); } };
    return () => {
      wanted = false;
      sync();
      ro.disconnect();
      io.disconnect();
      root.selectAll('*').interrupt();
    };
  });
</script>

<div class="anim">
  <svg bind:this={svg} viewBox="0 0 640 320" role="img" aria-label="A walker hopping on a three-state chain beside the row of the matrix power it follows"></svg>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => ctl.step()}>Step</button>
    <button type="button" class="anim-toggle" onclick={() => ctl.toggle()} aria-pressed={playing}>{playing ? 'Pause' : 'Play'}</button>
  </div>
</div>

<style>
  svg { aspect-ratio: 2 / 1; }
  @media (max-width: 500px) { svg { aspect-ratio: 20 / 21; } }
</style>
