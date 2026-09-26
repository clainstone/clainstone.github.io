<script>
  // Solution 3: the chain of Exercise 3 and its two communicating classes,
  // C₁ = {1, 2, 3, 4} and C₂ = {5}.
  import Chain from './Chain.svelte';
  const nodes = [
    { id: 1, x: 110, y: 150 }, { id: 2, x: 260, y: 60 }, { id: 3, x: 260, y: 240 },
    { id: 4, x: 410, y: 150 }, { id: 5, x: 570, y: 250 },
  ];
  const edges = [
    { from: 1, to: 2, label: '1/6', bend: 16 }, { from: 2, to: 1, label: '1/2', bend: 16 },
    { from: 1, to: 3, label: '1/3', bend: 16 }, { from: 3, to: 1, label: '1/2', bend: 16 },
    { from: 2, to: 4, label: '1/2', bend: 16 }, { from: 4, to: 2, label: '1/10', bend: 16 },
    { from: 3, to: 4, label: '1/2', bend: 16 }, { from: 4, to: 3, label: '4/5', bend: 16 },
    { from: 1, to: 5, label: '1/2', bend: 200 }, { from: 4, to: 5, label: '1/10', bend: 0, side: 1 },
  ];
  const loops = [{ at: 5, angle: 0, label: '1' }];
  const groups = [
    { x: 60, y: 14, w: 400, h: 272, label: 'C₁' },
    { x: 530, y: 210, w: 80, h: 80, label: 'C₂' },
  ];
</script>

<Chain width={660} height={345} {nodes} {edges} {loops} {groups} maxWidth="36rem" r={18}
  label="The chain of Exercise 3: states 1, 2, 3, 4 in the class C1 and state 5, absorbing, in the class C2" />
