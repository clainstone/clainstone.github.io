<script>
  // Example 2.5: the diagram of P with its communicating classes {1, 2, 3},
  // {4} and {5, 6}; only {5, 6} is closed.
  import Chain from './Chain.svelte';
  const nodes = [
    { id: 1, x: 100, y: 80 }, { id: 2, x: 100, y: 250 }, { id: 3, x: 250, y: 165 },
    { id: 4, x: 400, y: 80 }, { id: 5, x: 400, y: 250 }, { id: 6, x: 570, y: 250 },
  ];
  const edges = [
    { from: 1, to: 2, label: '½', side: -1 }, { from: 2, to: 3, label: '1', side: -1 }, { from: 3, to: 1, label: '⅓', side: -1 },
    { from: 3, to: 4, label: '⅓', side: -1 }, { from: 3, to: 5, label: '⅓', side: 1 }, { from: 4, to: 5, label: '½', side: -1 },
    { from: 5, to: 6, label: '1', bend: -22 }, { from: 6, to: 5, label: '1', bend: -22 },
  ];
  const loops = [{ at: 1, angle: 180, label: '½' }, { at: 4, angle: -20, label: '½' }];
  const groups = [
    { x: 14, y: 20, w: 280, h: 278, label: 'open' },
    { x: 350, y: 20, w: 120, h: 100, label: 'open' },
    { x: 350, y: 200, w: 260, h: 98, label: 'closed', closed: true },
  ];
</script>

<Chain width={630} height={310} {nodes} {edges} {loops} {groups} maxWidth="36rem"
  label="The chain of Example 2.5 with its classes: {1, 2, 3} open, {4} open, {5, 6} closed" />
