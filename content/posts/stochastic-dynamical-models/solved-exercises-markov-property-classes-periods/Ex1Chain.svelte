<script>
  // Exercise 1: the chain on {1, 2, 3} with its transition probabilities.
  import Chain from './Chain.svelte';
  const nodes = [{ id: 1, x: 250, y: 55 }, { id: 2, x: 120, y: 250 }, { id: 3, x: 380, y: 250 }];
  const edges = [
    { from: 1, to: 2, label: '2/3', bend: 22 }, { from: 2, to: 1, label: '1/3', bend: 22 },
    { from: 1, to: 3, label: '1/3', bend: 22 }, { from: 3, to: 1, label: '2/3', bend: 22 },
    { from: 2, to: 3, label: '2/3', bend: 22 }, { from: 3, to: 2, label: '1/3', bend: 22 },
  ];
</script>

<Chain width={500} height={300} {nodes} {edges} maxWidth="27rem" r={18}
  label="The chain of Exercise 1: from 1 to 2 with probability 2/3 and to 3 with 1/3, from 2 to 1 with 1/3 and to 3 with 2/3, from 3 to 1 with 2/3 and to 2 with 1/3" />
