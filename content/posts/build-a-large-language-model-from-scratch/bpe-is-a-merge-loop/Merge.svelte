<script>
  // BPE training on one sentence of the post: count the adjacent pairs
  // inside each word, merge the most frequent pair into one token, record
  // it, repeat. A tie goes to the pair met first. The loop stops here when
  // no pair occurs twice; a real run continues to the vocabulary size.
  import { onMount } from 'svelte';

  const TEXT = 'merge the most frequent pair into a new token record the merge and repeat';
  const PAUSE = 700;
  let uid = 0;
  const fresh = () => TEXT.split(' ').map((word) => [...word].map((s) => ({ id: uid++, s, born: false })));

  function best(ws) {
    const count = new Map();
    for (const w of ws) for (let i = 0; i + 1 < w.length; i++) {
      const key = `${w[i].s} ${w[i + 1].s}`;
      count.set(key, (count.get(key) ?? 0) + 1);
    }
    let top = null;
    for (const [key, c] of count) if (c > 1 && (!top || c > top.count)) top = { pair: key.split(' '), count: c };
    return top;
  }
  function apply(ws, [a, b]) {
    return ws.map((w) => {
      const out = [];
      for (let i = 0; i < w.length; i++) {
        if (i + 1 < w.length && w[i].s === a && w[i + 1].s === b) { out.push({ id: uid++, s: a + b, born: true }); i++; }
        else out.push(w[i]);
      }
      return out;
    });
  }
  // How many merges the sentence yields: the table keeps room for them all, so the page never jumps.
  const TOTAL = (() => { let ws = fresh(), n = 0; for (let p; (p = best(ws)); n++) ws = apply(ws, p.pair); return n; })();

  let words = $state(fresh());
  let merges = $state([]);
  let pick = $state(null);
  let playing = $state(false);
  let root;
  let timer = 0;

  const done = $derived(!pick && !best(words));
  const status = $derived(
    pick ? `the most frequent pair is ${pick.pair[0]} ${pick.pair[1]}, seen ${pick.count} times`
    : done ? 'no pair occurs twice any more, the loop stops'
    : merges.length ? `${merges.length} merge${merges.length === 1 ? '' : 's'} recorded, counting pairs again`
    : 'count every adjacent pair inside a word'
  );
  const picked = (w, i) => !!pick && ((w[i].s === pick.pair[0] && w[i + 1]?.s === pick.pair[1]) || (i > 0 && w[i - 1].s === pick.pair[0] && w[i].s === pick.pair[1]));

  function step() {
    clearTimeout(timer);
    if (pick) return merge();
    const top = best(words);
    if (!top) { playing = false; return; }
    pick = top;
    timer = setTimeout(merge, PAUSE);
  }
  function merge() {
    clearTimeout(timer);
    if (!pick) return;
    words = apply(words, pick.pair);
    merges = [...merges, pick];
    pick = null;
    if (playing) timer = setTimeout(step, PAUSE);
  }
  function play() {
    playing = !playing;
    clearTimeout(timer);
    if (playing) step();
  }
  function reset() { clearTimeout(timer); playing = false; pick = null; merges = []; words = fresh(); }

  // Plays on its own like the canvases: from the start unless motion is
  // reduced, parked while off screen.
  onMount(() => {
    let parked = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting && playing) { play(); parked = true; }
      else if (e.isIntersecting && parked) { parked = false; play(); }
    }, { threshold: 0.05 });
    io.observe(root);
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) play();
    return () => { clearTimeout(timer); io.disconnect(); };
  });
</script>

<div class="anim bpe" bind:this={root}>
  <div class="status">{status}</div>
  <div class="tokens">
    {#each words as w, wi (wi)}<span class="word">{#each w as tok, i (tok.id)}<span class="tok" class:pick={picked(w, i)} class:fresh={tok.born}>{tok.s}</span>{/each}</span>{/each}
  </div>
  <div class="merges" style:min-height={`calc(${TOTAL + 1} * 1.6em)`}>
    <table>
      <thead><tr><th>pair</th><th>token</th></tr></thead>
      <tbody>
        {#each merges as m, i (i)}<tr><td>{m.pair.join(' ')}</td><td>{m.pair.join('')}</td></tr>{/each}
      </tbody>
    </table>
  </div>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" aria-pressed={playing} onclick={play} disabled={done}>{playing ? 'Pause' : 'Play'}</button>
    <button type="button" class="anim-toggle" onclick={step} disabled={done}>Step</button>
    <button type="button" class="anim-toggle" onclick={reset}>Reset</button>
  </div>
</div>

<style>
  /* One column on phones: the status, the tokens, the buttons, then the
     table, so that its reserved height falls at the foot of the figure. Two
     columns above 40 rem: the buttons directly under the tokens at the left,
     the table at its content width at the right spanning both rows, so that
     its reserved height sits beside them. */
  .bpe { display: grid; grid-template-columns: minmax(0, 1fr); gap: 0.5rem 1.5rem; align-items: start; color: var(--anim-ink); font-family: var(--anim-font); }
  .status { grid-row: 1; grid-column: 1 / -1; font-size: 0.9375em; color: var(--anim-muted); min-height: 1.5em; }
  .tokens { grid-row: 2; line-height: 2.2; }
  .word { display: inline-block; white-space: nowrap; margin-right: 0.6em; }
  .tok {
    display: inline-block; padding: 0 0.3em; margin: 0 1px; line-height: 1.6;
    border: 1px solid var(--anim-rule); border-radius: 2px; font-size: 0.875em;
    transition: border-color 0.3s, color 0.3s, background-color 0.3s;
  }
  .tok.pick { border-color: var(--anim-accent); color: var(--anim-accent); }
  .tok.fresh { animation: fresh 0.8s ease-out; }
  @keyframes fresh { from { background-color: color-mix(in srgb, var(--anim-accent) 35%, transparent); } to { background-color: transparent; } }
  .merges { grid-row: 4; justify-self: start; font-size: 0.875em; line-height: 1.6; }
  .merges table { margin: 0; width: auto; border-collapse: collapse; }
  .merges th, .merges td { padding: 0 1.25em 0 0; height: 1.6em; text-align: left; border: 0; font-weight: normal; white-space: nowrap; }
  .merges th, .merges td:first-child { color: var(--anim-muted); }
  .anim-controls { grid-row: 3; grid-column: 1; }
  .anim-toggle:disabled { opacity: 0.3; cursor: default; }
  @media (min-width: 40rem) {
    .bpe { grid-template-columns: minmax(0, 1fr) max-content; grid-template-rows: auto auto 1fr; }
    .merges { grid-row: 2 / 4; grid-column: 2; }
  }
  @media (prefers-reduced-motion: reduce) { .tok, .tok.fresh { transition: none; animation: none; } }
</style>
