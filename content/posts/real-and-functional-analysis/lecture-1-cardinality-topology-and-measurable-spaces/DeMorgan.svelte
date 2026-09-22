<script>
  // The identity of the Remark on measurable spaces, term by term:
  // E ∩ F = X \ ((X \ E) ∪ (X \ F)). The steps shade X \ E, then X \ F, then
  // their union, then its complement, which is E ∩ F.
  const steps = [
    { label: 'X \\ E', e: false, f: false, mode: 'notE' },
    { label: 'X \\ F', mode: 'notF' },
    { label: '(X \\ E) ∪ (X \\ F)', mode: 'union' },
    { label: 'X \\ ((X \\ E) ∪ (X \\ F)) = E ∩ F', mode: 'result' },
  ];
  let k = $state(0);
  const mode = $derived(steps[k].mode);
</script>

<figure class="anim demorgan">
  <svg viewBox="0 0 400 230" role="img" aria-label="Venn diagram of two sets E and F inside X, shading {steps[k].label}">
    <defs>
      <clipPath id="dm-e"><circle cx="160" cy="112" r="72" /></clipPath>
      <clipPath id="dm-f"><circle cx="240" cy="112" r="72" /></clipPath>
      <mask id="dm-not-e"><rect x="10" y="10" width="380" height="204" fill="white" /><circle cx="160" cy="112" r="72" fill="black" /></mask>
      <mask id="dm-not-f"><rect x="10" y="10" width="380" height="204" fill="white" /><circle cx="240" cy="112" r="72" fill="black" /></mask>
    </defs>
    {#if mode === 'notE' || mode === 'union'}<rect class="shade" x="10" y="10" width="380" height="204" mask="url(#dm-not-e)" />{/if}
    {#if mode === 'notF' || mode === 'union'}<rect class="shade" x="10" y="10" width="380" height="204" mask="url(#dm-not-f)" />{/if}
    {#if mode === 'result'}<circle class="shade strong" cx="240" cy="112" r="72" clip-path="url(#dm-e)" />{/if}
    <rect class="outline" x="10" y="10" width="380" height="204" />
    <circle class="outline" cx="160" cy="112" r="72" />
    <circle class="outline" cx="240" cy="112" r="72" />
    <text x="120" y="112">E</text>
    <text x="280" y="112">F</text>
    <text x="30" y="36">X</text>
  </svg>
  <p class="step">{steps[k].label}</p>
  <div class="anim-controls">
    <button type="button" class="anim-toggle" onclick={() => (k = (k + 1) % steps.length)}>Next step ({k + 1} of {steps.length})</button>
  </div>
</figure>

<style>
  .demorgan { margin: 1.5rem auto; max-width: 28rem; }
  svg { font-family: var(--anim-font); }
  .outline { fill: none; stroke: var(--anim-ink); stroke-width: 1.4; }
  .shade { fill: var(--anim-accent); fill-opacity: 0.18; }
  .shade.strong { fill-opacity: 0.35; }
  text { fill: var(--anim-ink); font-size: 14px; font-style: italic; text-anchor: middle; dominant-baseline: central; }
  .step { margin: 0.3rem 0 0; text-align: center; font-size: 0.9375rem; font-style: italic; color: var(--anim-ink); }
</style>
