<script>
  // The random walk on a square: from each corner to each of its two
  // neighbours with probability 1/2.
  import Chain from './Chain.svelte';
  const nodes = [{ id: 1, x: 290, y: 50 }, { id: 2, x: 70, y: 50 }, { id: 3, x: 70, y: 230 }, { id: 4, x: 290, y: 230 }];
  const pairs = [[1, 2], [2, 3], [3, 4], [4, 1]];
  const edges = pairs.flatMap(([a, b]) => [{ from: a, to: b, bend: 16, label: '½' }, { from: b, to: a, bend: 16, label: '½' }]);
</script>

<Chain width={360} height={280} {nodes} {edges} maxWidth="22rem"
  label="Four states at the corners of a square, 1 and 2 on top, 3 and 4 below; each state jumps to each of its two neighbours with probability 1/2" />
