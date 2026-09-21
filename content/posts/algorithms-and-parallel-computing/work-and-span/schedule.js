// The task graph of the tree sum over n leaves, and a greedy scheduler that
// runs it on p workers with one unit of time per task.

// Leaves are level 0. Each addition takes two tasks of the level below. The
// x of a task, between 0 and 1, places it over its subtree when drawn.
export function buildGraph(leaves = 16) {
  const tasks = [];
  let level = [];
  for (let i = 0; i < leaves; i++) {
    tasks.push({ id: i, level: 0, deps: [], x: (i + 0.5) / leaves });
    level.push(i);
  }
  let depth = 1;
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const a = tasks[level[i]];
      const b = tasks[level[i + 1]];
      tasks.push({ id: tasks.length, level: depth, deps: [a.id, b.id], x: (a.x + b.x) / 2 });
      next.push(tasks.length - 1);
    }
    level = next;
    depth++;
  }
  return { tasks, levels: depth, work: tasks.length, span: depth };
}

// Greedy list scheduling. At every unit of time each ready task goes to a
// free worker, the tasks farthest from the root first. Returns the slots
// (task, worker, start), the start time of every task, and the makespan T_p.
export function schedule(graph, p) {
  const { tasks } = graph;
  const done = new Uint8Array(tasks.length);
  const start = new Int32Array(tasks.length);
  let pending = tasks.map((t) => t.id);
  const slots = [];
  let time = 0;
  while (pending.length) {
    const ready = pending
      .filter((id) => tasks[id].deps.every((d) => done[d]))
      .sort((a, b) => tasks[a].level - tasks[b].level || a - b);
    const run = ready.slice(0, p);
    run.forEach((id, worker) => {
      slots.push({ id, worker, start: time });
      start[id] = time;
    });
    for (const id of run) done[id] = 1;
    pending = pending.filter((id) => !done[id]);
    time++;
  }
  return { slots, start, makespan: time };
}
