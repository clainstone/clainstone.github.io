#!/usr/bin/env node
// Compile figure files without building the site, so that a subagent can
// check its own component while other agents share the same dist/.
//
//   node skills/website/scripts/compile_check.mjs <file.svelte | file.js> [...]
//
// A .svelte file is compiled by Svelte (errors, and warnings such as missing
// accessibility attributes or unused state); its relative imports must exist.
// A .js file is parsed by Node. An .astro file is not compiled here: the build
// checks it. Exit status 1 when any file fails.

import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname, join, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { compile } from 'svelte/compiler';

const files = process.argv.slice(2);
if (!files.length) {
  console.error('usage: node skills/website/scripts/compile_check.mjs <file.svelte | file.js> [...]');
  process.exit(2);
}

let failed = 0;
for (const arg of files) {
  const file = resolve(arg);
  if (!existsSync(file)) {
    console.log(`error: ${arg} does not exist`);
    failed++;
    continue;
  }
  const source = readFileSync(file, 'utf8');
  const ext = extname(file);
  if (ext === '.svelte') {
    try {
      const { warnings } = compile(source, { filename: file, generate: 'client' });
      for (const w of warnings) console.log(`warning: ${arg}:${w.start?.line ?? '?'}: ${w.message.split('\n')[0]}`);
    } catch (e) {
      console.log(`error: ${arg}:${e.start?.line ?? '?'}: ${String(e.message).split('\n')[0]}`);
      failed++;
    }
  } else if (ext === '.js' || ext === '.mjs') {
    const r = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (r.status !== 0) {
      console.log(`error: ${arg}: ${(r.stderr || r.stdout).trim().split('\n').slice(0, 6).join(' | ')}`);
      failed++;
    }
  } else if (ext === '.astro') {
    console.log(`note: ${arg}: .astro files are checked by the build`);
  } else {
    console.log(`note: ${arg}: not a component, skipped`);
  }
  // Relative imports of a component or helper must exist next to it.
  for (const m of source.matchAll(/^\s*import\s+(?:[\s\S]*?\s+from\s+)?['"](\.{1,2}\/[^'"?]+)(?:\?[^'"]*)?['"]/gm)) {
    if (!existsSync(join(dirname(file), m[1]))) {
      console.log(`error: ${arg}: import ${m[1]} does not exist`);
      failed++;
    }
  }
}
console.log(failed ? `\n${failed} file(s) failed` : `\nok, ${files.length} file(s)`);
process.exit(failed ? 1 : 0);
