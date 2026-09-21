<script>
  // A labelled range input. `bind:value` from the post's component; `oninput`
  // fires on every drag, `onchange` when the drag ends.
  let { label, min = 0, max = 1, step = 0.01, value = $bindable(0), format = (v) => String(v), oninput, onchange } = $props();
  const id = `slider-${Math.random().toString(36).slice(2, 8)}`;
</script>

<label class="anim-slider" for={id}>
  <span class="anim-slider-label">{label}</span>
  <input {id} type="range" {min} {max} {step} bind:value {oninput} {onchange} />
  <output for={id}>{format(value)}</output>
</label>
