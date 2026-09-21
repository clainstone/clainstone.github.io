#!/usr/bin/env node
// Check one lecture post of Alessandro's site.
//
//   make check-post POST=<thread>/<slug>
//   node skills/lecture-post/scripts/check_post.mjs <thread>/<slug> [--no-build] [--no-browser] [--site DIR]
//
// 1. Frontmatter: title (the subject, no lecture number), slug, date, summary,
//    thread, no second post with the same title.
// 2. Prose of the MDX source, mathematics and code removed: no lists, no
//    arrows, em dashes or double hyphens, no first person singular, no
//    sentence about the professor, the exam or the notes. Leftover shorthand,
//    evaluative words and logic symbols in prose are warnings.
// 3. Build of the whole site with `make build`.
// 4. The built page: visible text without KaTeX, KaTeX errors.
// 5. A headless browser at 1280 px (the site is desktop only): console errors,
//    horizontal overflow, displays that scroll, inline formulas split across
//    two lines, a screenshot after every client:visible component has mounted.
//
// Exit status 1 when any error is found. Screenshots go to
// <site>/.astro/lecture-check/, which the site's git ignores.

import { existsSync, readFileSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';

const THREADS = ['real-and-functional-analysis', 'stochastic-dynamical-models'];
const HOME = homedir();

// ---- arguments ------------------------------------------------------------

const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--')));
const siteIndex = argv.indexOf('--site');
// The site root is three levels above this file: skills/lecture-post/scripts.
const SITE = siteIndex >= 0 ? argv[siteIndex + 1] : fileURLToPath(new URL('../../../', import.meta.url));
const id = argv.find((a, i) => !a.startsWith('--') && argv[i - 1] !== '--site');
if (!id || !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(id)) {
  console.error('usage: node skills/lecture-post/scripts/check_post.mjs <thread>/<slug> [--no-build] [--no-browser] [--site DIR]');
  process.exit(2);
}
const [thread, slug] = id.split('/');
const postDir = join(SITE, 'content/posts', thread, slug);
const mdxPath = join(postDir, 'index.mdx');

const errors = [];
const warnings = [];
const error = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

function finish(extra = []) {
  for (const line of extra) console.log(line);
  for (const m of warnings) console.log(`warning: ${m}`);
  for (const m of errors) console.log(`error: ${m}`);
  console.log(errors.length ? `\n${errors.length} error(s), ${warnings.length} warning(s)` : `\nok, ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}

if (!existsSync(mdxPath)) {
  error(`${mdxPath} does not exist`);
  finish();
}

// ---- 1. frontmatter ---------------------------------------------------------

function frontmatter(source) {
  const m = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { data: null, raw: {}, length: 0 };
  const data = {};
  const raw = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    raw[key] = value;
    if (value.startsWith("'") && value.endsWith("'")) data[key] = value.slice(1, -1).replace(/''/g, "'");
    else if (value.startsWith('"') && value.endsWith('"')) data[key] = value.slice(1, -1);
    else data[key] = value;
  }
  return { data, raw, length: m[0].length };
}

const source = readFileSync(mdxPath, 'utf8');
const { data: fm, raw, length: fmLength } = frontmatter(source);

if (!THREADS.includes(thread)) error(`thread "${thread}" is not one of ${THREADS.join(', ')}`);
if (!fm) {
  error('the file has no frontmatter block');
} else {
  // The title is the subject alone, without a lecture number (21 September 2026).
  const title = (fm.title ?? '').trim();
  if (!title) error('title is missing');
  else if (/^Lecture\s*\d/i.test(title)) error(`title "${title}" carries a lecture number: the title is the subject alone`);
  else if (/^[a-z]/.test(title)) warn('the title should start with a capital letter');
  // Published slugs keep their old "lecture-<n>-" prefix; new ones are the subject.
  if (!/^[a-z0-9]+(-[a-z0-9]+){0,7}$/.test(slug)) error(`slug "${slug}" should be at most six lowercase ASCII words of the subject, joined by hyphens`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fm.date ?? '') || Number.isNaN(Date.parse(fm.date))) error(`date "${fm.date ?? ''}" is not YYYY-MM-DD`);
  if (!(fm.summary ?? '').trim()) error('summary is missing');
  for (const [key, value] of Object.entries(raw)) {
    if (value.startsWith('"') && value.includes('\\')) error(`frontmatter ${key}: a backslash inside double quotes breaks YAML, use single quotes`);
  }
  // Another post of the thread with the same title.
  const threadDir = join(SITE, 'content/posts', thread);
  for (const other of existsSync(threadDir) ? readdirSync(threadDir) : []) {
    if (other === slug) continue;
    const p = join(threadDir, other, 'index.mdx');
    if (!existsSync(p)) continue;
    const otherTitle = frontmatter(readFileSync(p, 'utf8')).data?.title ?? '';
    if (otherTitle && otherTitle === (fm.title ?? '').trim()) error(`the title already exists in ${thread}/${other}`);
  }
}

// ---- 2. prose -------------------------------------------------------------------

// Blank out everything that is not prose, keeping line numbers.
const blank = (s) => s.replace(/[^\n]/g, ' ');
let prose = blank(source.slice(0, fmLength)) + source.slice(fmLength);
prose = prose
  .replace(/```[\s\S]*?```/g, blank)
  .replace(/\$\$[\s\S]*?\$\$/g, blank)
  .replace(/\$[^$\n]+\$/g, blank)
  .replace(/^import .*$/gm, blank)
  .replace(/^export .*$/gm, blank)
  .replace(/<[A-Za-z][^>]*\/>/g, blank)
  .replace(/<\/?[A-Za-z][^>]*>/g, blank)
  .replace(/\]\([^)]*\)/g, (m) => ']' + blank(m.slice(1)))
  .replace(/`[^`\n]*`/g, blank);

const lines = prose.split('\n');
const near = (line, index) => line.slice(Math.max(0, index - 25), index + 25).trim();

const ERROR_RULES = [
  [/^\s*[-*+]\s+\S/, 'a bullet list item'],
  [/^\s*\d+[.)]\s+\S/, 'a numbered list item'],
  [/[•]/, 'a bullet character'],
  [/[→←⇒⇐⟹⟸⟺↔➜►▸]/, 'an arrow in prose'],
  [/—/, 'an em dash'],
  [/(^|[^-])--(?!-)/, 'a double hyphen'],
  [/(^|[^(\w])I('m|'ve|'d|'ll)?\s+[a-z]/, 'first person singular'],
  [/\b(my|mine|myself)\b/i, 'first person singular'],
  [/(^|[^'\w])me\b/, 'first person singular'],
  [/\b(professor|prof\.|lecturer|teacher|exam|exams|homework|in class|the notes|my notes|lecture notes|blackboard)\b/i, 'a sentence about the course, not the mathematics'],
  [/\*\*Proof(?! \((complete|sketch)\)\.\*\*)/, 'a proof label other than **Proof (complete).** or **Proof (sketch).**'],
];
const WARNING_RULES = [
  [/\b(beautiful|elegant|nice|interesting|surprising|surprisingly|remarkable|amazing|powerful|clever|neat|magical?)\b/i, 'an evaluative word'],
  [/\b(clearly|obviously|trivially|of course)\b/i, 'a word that hides a step'],
  [/(^|\s)(a\.e\.|a\.s\.|s\.t\.|w\.r\.t\.|iff|wlog|w\.l\.o\.g\.|r\.v\.|q\.o\.|q\.c\.|t\.c\.|sse|ssg|c\.v\.d\.|cfr\.|TFAE|WTS|LHS|RHS|DCT|MCT|TCD|TCM|DTMC|CTMC|thm|prop\.|lem\.|cor\.|def\.|oss\.|dim\.)(?=[\s,.;:)]|$)/, 'shorthand to expand'],
  [/[∀∃∈∉⊂⊆⊃⊇∪∩≤≥≠≈∞∑∫√]/, 'a mathematical symbol outside $...$'],
];

lines.forEach((line, i) => {
  for (const [re, label] of ERROR_RULES) {
    const m = line.match(re);
    if (m) error(`index.mdx:${i + 1}: ${label} near "${near(line, m.index)}"`);
  }
  for (const [re, label] of WARNING_RULES) {
    const m = line.match(re);
    if (m) warn(`index.mdx:${i + 1}: ${label} near "${near(line, m.index)}"`);
  }
});

// Local imports resolve.
for (const m of source.matchAll(/^import\s+\w+\s+from\s+'(\.\/[^']+)';?$/gm)) {
  if (!existsSync(join(postDir, m[1]))) error(`import ${m[1]} does not exist in the post folder`);
}

// ---- 3. build ---------------------------------------------------------------

const env = { ...process.env, PATH: `${HOME}/.local/node/bin:${process.env.PATH ?? ''}` };
if (!flags.has('--no-build')) {
  const r = spawnSync('make', ['build'], { cwd: SITE, env, encoding: 'utf8' });
  const out = `${r.stdout ?? ''}${r.stderr ?? ''}`;
  if (r.status !== 0) {
    error(`make build failed:\n${out.split('\n').slice(-25).join('\n')}`);
    finish();
  }
  for (const line of out.split('\n')) {
    if (/WARN|warning/i.test(line) && line.includes(slug)) warn(`build: ${line.trim()}`);
  }
}

// ---- 4. built page -------------------------------------------------------------

const dist = join(SITE, 'dist');
const pageFile = join(dist, 'threads', thread, `${slug}.html`);
if (!existsSync(pageFile)) {
  error(`${pageFile} was not built${flags.has('--no-build') ? ' (run without --no-build)' : ''}`);
  finish();
}
const html = readFileSync(pageFile, 'utf8');

function visibleText(s) {
  s = s.replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<math[\s\S]*?<\/math>/g, ' ');
  let i;
  while ((i = s.search(/<span class="katex(?:[ "])/)) !== -1) {
    let depth = 0;
    let j = -1;
    const re = /<span\b|<\/span>/g;
    re.lastIndex = i;
    let m;
    while ((m = re.exec(s))) {
      depth += m[0] === '</span>' ? -1 : 1;
      if (depth === 0) { j = m.index + m[0].length; break; }
    }
    if (j < 0) break;
    s = s.slice(0, i) + ' ' + s.slice(j);
  }
  return s.replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ');
}
const text = visibleText(html);
for (const [re, label] of [[/•/, 'a bullet character'], [/[→←⇒⇐⟹⟸⟺➜►▸]/, 'an arrow'], [/—/, 'an em dash'], [/(^|[^-])--(?!-)/, 'a double hyphen']]) {
  const m = text.match(re);
  if (m) error(`page text: ${label} near "${near(text, m.index)}"`);
}
const katexErrors = (html.match(/class="katex-error"/g) ?? []).length;
if (katexErrors) error(`${katexErrors} formula(s) failed to render, look for katex-error in the page`);

// ---- 5. browser --------------------------------------------------------------------

const extra = [`page: http://localhost:4300/threads/${id}`];

async function loadPlaywright() {
  try {
    const pkg = createRequire(join(SITE, 'package.json')).resolve('playwright/package.json');
    return await import(pathToFileURL(join(dirname(pkg), 'index.mjs')).href);
  } catch {
    return null;
  }
}

function serve(root) {
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.xml': 'application/xml', '.json': 'application/json' };
  const server = createServer((req, res) => {
    let p = join(root, decodeURIComponent(req.url.split('?')[0]));
    if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
    if (!existsSync(p) && existsSync(`${p}.html`)) p = `${p}.html`;
    if (!existsSync(p)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': types[extname(p)] ?? 'application/octet-stream' });
    res.end(readFileSync(p));
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

if (!flags.has('--no-browser')) {
  const pw = await loadPlaywright();
  if (!pw) {
    warn('playwright is not installed, screenshots and console checks skipped');
  } else {
    const libs = join(HOME, '.local/chrome-libs');
    const browserEnv = { ...process.env };
    if (existsSync(libs)) {
      browserEnv.LD_LIBRARY_PATH = [`${libs}/usr/lib/x86_64-linux-gnu`, `${libs}/lib/x86_64-linux-gnu`, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':');
      if (existsSync(`${libs}/etc/fonts/fonts.conf`)) browserEnv.FONTCONFIG_FILE = `${libs}/etc/fonts/fonts.conf`;
    }
    const server = await serve(dist);
    const url = `http://127.0.0.1:${server.address().port}/threads/${id}`;
    const out = join(SITE, '.astro', 'lecture-check');
    mkdirSync(out, { recursive: true });
    let browser;
    try {
      browser = await pw.chromium.launch({ env: browserEnv, args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
      for (const width of [1280]) {
        const ctx = await browser.newContext({ viewport: { width, height: 800 }, deviceScaleFactor: 1, colorScheme: 'light' });
        const page = await ctx.newPage();
        const problems = [];
        page.on('console', (m) => { if (m.type() === 'error') problems.push(m.text()); });
        page.on('pageerror', (e) => problems.push(String(e)));
        const response = await page.goto(url, { waitUntil: 'networkidle' });
        if (!response || response.status() !== 200) error(`${width} px: the page answered ${response?.status()}`);
        // Scroll through the page so that every client:visible island mounts.
        await page.evaluate(async () => {
          const step = window.innerHeight * 0.8;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 250));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(800);
        const state = await page.evaluate(() => ({
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          islands: document.querySelectorAll('astro-island').length,
          unmounted: document.querySelectorAll('astro-island[ssr]').length,
          emptyCanvases: [...document.querySelectorAll('canvas')].filter((c) => c.width === 0 || c.height === 0).length,
          // A display must fit the column (STYLE.md 5.5).
          scrolling: [...document.querySelectorAll('.body .katex-display')].filter((d) => d.scrollWidth > d.clientWidth + 1)
            .map((d) => (d.querySelector('annotation')?.textContent ?? '').replace(/\s+/g, ' ').slice(0, 60)),
          // An inline formula never breaks across lines (STYLE.md 5.2).
          split: [...document.querySelectorAll('.body p .katex')].filter((k) => !k.closest('.katex-display'))
            .filter((k) => new Set([...k.querySelector('.katex-html').getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.bottom / 8))).size > 1)
            .map((k) => (k.querySelector('annotation')?.textContent ?? '').slice(0, 60)),
        }));
        if (state.overflow > 1) error(`${width} px: the page scrolls horizontally by ${state.overflow} px`);
        if (state.unmounted) error(`${width} px: ${state.unmounted} of ${state.islands} component(s) did not mount`);
        if (state.emptyCanvases) error(`${width} px: ${state.emptyCanvases} canvas(es) have zero size`);
        for (const t of state.scrolling) error(`${width} px: a display scrolls horizontally: ${t}`);
        for (const t of state.split) error(`${width} px: an inline formula breaks across lines: ${t}`);
        for (const p of problems) error(`${width} px console: ${p.slice(0, 300)}`);
        const shot = join(out, `${slug}-${width}.png`);
        await page.screenshot({ path: shot, fullPage: true });
        extra.push(`screenshot: ${shot}`);
        await ctx.close();
      }
    } catch (e) {
      error(`browser check failed: ${String(e).split('\n')[0]}`);
    } finally {
      await browser?.close();
      server.close();
    }
  }
}

finish(extra);
