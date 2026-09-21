<script>
  // Example 2.1: the chain on three states with its transition probabilities;
  // the loops are the probabilities of staying.
  import Chain from './Chain.svelte';
  const nodes = [{ id: 1, x: 170, y: 40 }, { id: 2, x: 270, y: 200 }, { id: 3, x: 70, y: 200 }];
  const edges = [
    { from: 1, to: 2, label: '1' },
    { from: 2, to: 3, label: '½' },
    { from: 3, to: 1, label: '½' },
  ];
  const loops = [{ at: 2, angle: 0, label: '½' }, { at: 3, angle: 180, label: '½' }];
</script>

<Chain width={340} height={240} {nodes} {edges} {loops} maxWidth="22rem"
  label="The chain of Example 2.1: 1 goes to 2 with probability 1; 2 goes to 3 with probability 1/2 and stays with probability 1/2; 3 goes to 1 with probability 1/2 and stays with probability 1/2" />
