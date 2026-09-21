#!/usr/bin/env node
// Verify one lecture post against its sources with Codex (GPT-5.6 Sol, high).
//
//   make verify-post POST=<thread>/<slug> SRC=<file>[,<file>...] [PAGES=1-4]
//   node skills/lecture-post/scripts/verify_post.mjs <thread>/<slug> --source <file> [--source <file>] [--pages 1-4,7]
//
// The verifier has one task: say where what the post writes diverges from the
// sources Alessandro sent. It sees the rendered source pages as images and the
// post (MDX and the files of its figures) with line numbers. Codex runs with
// --dangerously-bypass-approvals-and-sandbox ("yolo", Alessandro's choice),
// so the script checksums the site before and after and fails if anything
// changed. Style, English and layout are not the verifier's business.
//
// A source is a PDF (rendered page by page with ~/tools/pdfrender, `--pages`
// selects the lecture's pages) or an image. The report goes to
// <site>/.astro/verify/<slug>.md, which git ignores.
// Exit status: 0 VERDICT OK, 1 divergences found, 2 the check could not run.

import { existsSync, readFileSync, readdirSync, mkdirSync, writeFileSync, statSync, rmSync } from 'node:fs';
import { join, dirname, extname, basename, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

const MODEL = 'gpt-5.6-sol';
const EFFORT = 'high';
const HOME = homedir();
const RENDER = join(HOME, 'tools/pdfrender/render.mjs');
const SITE = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const fail = (msg) => { console.error(`error: ${msg}`); process.exit(2); };
const args = process.argv.slice(2);
const id = args.find((a) => !a.startsWith('--') && !['--source', '--pages'].includes(args[args.indexOf(a) - 1]));
const sources = args.flatMap((a, i) => (a === '--source' ? args[i + 1].split(',').map((s) => s.trim()).filter(Boolean) : []));
const pagesArg = args.includes('--pages') ? args[args.indexOf('--pages') + 1] ?? '' : '';
if (!id || !sources.length) fail('usage: verify_post.mjs <thread>/<slug> --source <file> [--source <file>] [--pages 1-4]');
const [thread, slug] = id.split('/');
const postDir = join(SITE, 'content/posts', thread, slug);
if (!existsSync(join(postDir, 'index.mdx'))) fail(`no post at ${relative(SITE, postDir)}/index.mdx`);

// ---- source pages as images ------------------------------------------------
function pageSet(spec) {
  const set = new Set();
  for (const part of spec.split(',').map((s) => s.trim()).filter(Boolean)) {
    const [a, b] = part.split('-').map(Number);
    for (let p = a; p <= (b || a); p++) set.add(p);
  }
  return set;
}
const wanted = pageSet(pagesArg);
const work = join(SITE, '.astro/verify', slug);
rmSync(work, { recursive: true, force: true });
mkdirSync(work, { recursive: true });
const images = []; // { file, label }
for (const [k, src] of sources.entries()) {
  if (!existsSync(src)) fail(`source not found: ${src}`);
  if (extname(src).toLowerCase() === '.pdf') {
    if (!existsSync(RENDER)) fail(`${RENDER} is missing: it renders PDF pages`);
    const out = join(work, `src${k + 1}`);
    mkdirSync(out, { recursive: true });
    // 2.4 is about 200 dpi: at lower scales small print gets misread (100 for 1000).
    const r = spawnSync(process.execPath, [RENDER, src, out, '2.4'], { cwd: dirname(RENDER), encoding: 'utf8' });
    if (r.status !== 0) fail(`rendering ${src} failed: ${r.stderr.slice(0, 300)}`);
    for (const f of readdirSync(out).sort()) {
      const n = Number(f.match(/^p(\d+)\.png$/)?.[1]);
      if (n && (!wanted.size || wanted.has(n))) images.push({ file: join(out, f), label: `${basename(src)}, page ${n}` });
    }
  } else {
    images.push({ file: src, label: basename(src) });
  }
}
if (!images.length) fail('no source page selected');
if (images.length > 60) fail(`${images.length} source pages: pass --pages with the lecture's pages only`);

// ---- the post, with line numbers ------------------------------------------
const numbered = (file) => readFileSync(file, 'utf8').split('\n').map((l, i) => `${String(i + 1).padStart(4)}  ${l}`).join('\n');
const postFiles = ['index.mdx', ...readdirSync(postDir).filter((f) => f !== 'index.mdx' && /\.(svelte|js|ts|mjs)$/.test(f)).sort()];
const postText = postFiles.map((f) => `===== FILE ${f} =====\n${numbered(join(postDir, f))}`).join('\n\n');

const prompt = `You are a mathematical verifier. Your only task is to decide whether a lecture post diverges from its sources.

SOURCES: the ${images.length} attached images, in this order:
${images.map((im, i) => `  image ${i + 1}: ${im.label}`).join('\n')}
They are the only sources. Handwritten notes may use shorthand; red or blue annotations are part of the source.

POST: an MDX file (Markdown with LaTeX between $ and $$) and the files of its figures, given below with line numbers.

Check every item of the post against the sources:
1. Every formula, inline or displayed: the same mathematics as the source (symbols, indices, subscripts and superscripts, signs, exponents, fractions, domains and ranges, strict or non-strict inequalities, set operations). A change of notation that keeps the mathematics (\\subset for a "contained or equal" the source declares, \\colon for ":", spacing, a line break) is not a divergence.
2. Every definition, theorem, proposition, lemma, remark, example: the same hypotheses, the same conclusion, the same quantifiers in the same order.
3. Every number and datum: matrices, sequences, parameters, answers, counts, names, dates.
4. Every figure: the data in its component code and the claims of its caption agree with the source.
5. Content with no counterpart in the sources. The post is allowed to add: a hypothesis without which a source statement is false; an explicit step of an argument the source gives; paragraphs that start with **Details.**; sentences that start with "Indeed", "To see this" or "In detail"; instances of a source construction in a figure that its caption calls an instance. Report such an allowed addition only if it is mathematically wrong or changes the meaning of the source. Report every other addition (a result, example, number, name, date, application or claim not in the sources) as ADDED.
6. Where the post corrects an apparent slip of the source, report it as CORRECTION and say whether the correction is right. A wrong correction is DIVERGENT.

Do not judge style, English, layout, headings, numbering of statements or the choice of figures. Ignore the frontmatter fields title and date (page metadata set by the author), import lines, and code that only draws (layout, colours, sizes); do check the frontmatter summary. Do not suggest improvements. Do not modify, create or delete any file: everything you need is in this message and in the images, and you may only read. If a passage of the source is unreadable, report it as UNREADABLE instead of guessing.

Answer in this format and nothing else. One block per finding:

### <n>. <KIND>: <file> line <L>, source image <k>
Post: <what the post says, verbatim>
Source: <what the source says>
Why: <one or two sentences>

KIND is DIVERGENT (the post contradicts or changes the source), ADDED, CORRECTION or UNREADABLE.
The last line is exactly "VERDICT: OK" when there is no DIVERGENT and no ADDED finding, otherwise "VERDICT: DIVERGENT <number of DIVERGENT and ADDED findings>".

${postText}
`;
writeFileSync(join(work, 'prompt.md'), prompt);

// ---- run Codex, and make sure it touched nothing --------------------------
function snapshot() {
  const h = createHash('sha256');
  const walk = (d) => {
    for (const f of readdirSync(d).sort()) {
      if (['node_modules', '.astro', 'dist', '.git'].includes(f)) continue;
      const p = join(d, f);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else h.update(`${relative(SITE, p)}\0`).update(readFileSync(p));
    }
  };
  walk(SITE);
  return h.digest('hex');
}
const before = snapshot();
const last = join(work, 'answer.md');
console.log(`verifying ${id} against ${images.length} source page(s) with ${MODEL} (${EFFORT})...`);
const r = spawnSync('codex', [
  'exec', '-m', MODEL, '-c', `model_reasoning_effort="${EFFORT}"`, '--dangerously-bypass-approvals-and-sandbox',
  '--skip-git-repo-check', '--ephemeral', '--color', 'never', '-C', work,
  ...images.flatMap((im) => ['-i', im.file]), '-o', last, '-',
], { input: prompt, encoding: 'utf8', timeout: 45 * 60 * 1000, maxBuffer: 64 * 1024 * 1024 });
writeFileSync(join(work, 'codex.log'), `${r.stdout ?? ''}\n${r.stderr ?? ''}`);
if (snapshot() !== before) fail('the site changed while the verifier ran: inspect `git status` before anything else');
if (r.status !== 0 || !existsSync(last)) fail(`codex exited with ${r.status ?? r.signal}; log in ${relative(SITE, join(work, 'codex.log'))}`);

const answer = readFileSync(last, 'utf8').trim();
const report = join(SITE, '.astro/verify', `${slug}.md`);
writeFileSync(report, `# Verification of ${id}\n\nModel ${MODEL} (${EFFORT}), ${new Date().toISOString()}\nSources: ${images.map((im) => im.label).join('; ')}\n\n${answer}\n`);
console.log(answer);
console.log(`\nreport: ${relative(SITE, report)}`);
const verdict = answer.split('\n').filter(Boolean).pop()?.trim() ?? '';
if (verdict === 'VERDICT: OK') process.exit(0);
if (/^VERDICT: DIVERGENT \d+$/.test(verdict)) process.exit(1);
fail(`the verifier gave no verdict line (last line: "${verdict.slice(0, 80)}")`);
