#!/usr/bin/env node
// Check the whole built site the way GitHub Pages serves it.
//
//   make check-site [ONLY=/,/threads] [FIGURES=1] [PREVIEWS=0]
//   node skills/website/scripts/check_site.mjs [--no-build] [--no-browser] [--only /,/threads] [--figures] [--no-previews] [--site DIR]
//
// 1. Build with `make build`, unless --no-build.
// 2. Every page in dist/: visible text (code and mathematics excluded) with no
//    bullet character, arrow, em dash or double hyphen; no KaTeX error; a
//    title and a description without TeX; every root-relative link, image and
//    script resolves; every cross-reference resolves to an id that exists;
//    every data-xref-part and data-xref-lead names an id of the page; a post
//    with cross-references loads the preview script (the module script that
//    contains "xref-card"), at most 7168 bytes gzipped with the chunks it
//    imports; every published post is built and no sample post is.
// 3. A headless browser at 1280 px, in light and in dark: console errors and
//    [xref-preview] warnings, horizontal overflow, islands that did not mount,
//    canvases of zero size, displays that scroll, inline formulas split across
//    two lines, the theme the page chose, SVG labels outside 15.5 to 20 px (a
//    warning), a full-page screenshot, and with --figures one capture per
//    figure. Then, unless --no-previews, the previews of cross-references of
//    each post (xref_checks.mjs): the first link of each kind opens a card of
//    the right scale, measure, place, paper and content, with the page's line
//    breaks, no duplicate id and live figures, captured; in light also
//    leaving, nesting, keyboard and the jump on click; once per run, with
//    reduced motion, a card without animation whose click still lands.
//
// Screenshots go to <site>/.astro/site-check/, which the site's git ignores.
// Exit status: 0 clean, 1 errors found, 2 the check could not run.

import { existsSync, readFileSync, readdirSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { homedir } from 'node:os';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { BUDGET, marksProblems, previewScript, checkPreviews, checkReducedMotion } from './xref_checks.mjs';

const HOME = homedir();
const argv = process.argv.slice(2);
const flags = new Set(argv.filter((a) => a.startsWith('--')));
const value = (name) => (argv.includes(name) ? argv[argv.indexOf(name) + 1] : undefined);
// The site root is three levels above this file: skills/website/scripts.
const SITE = value('--site') ?? fileURLToPath(new URL('../../../', import.meta.url));
const ONLY = (value('--only') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
const DIST = join(SITE, 'dist');
const OUT = join(SITE, '.astro', 'site-check');

const errors = [];
const warnings = [];
const error = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const extra = [];

function finish() {
  for (const line of extra) console.log(line);
  for (const m of warnings) console.log(`warning: ${m}`);
  for (const m of errors) console.log(`error: ${m}`);
  console.log(errors.length ? `\n${errors.length} error(s), ${warnings.length} warning(s)` : `\nok, ${warnings.length} warning(s)`);
  process.exit(errors.length ? 1 : 0);
}

// ---- 1. build ------------------------------------------------------------------

if (!flags.has('--no-build')) {
  const r = spawnSync('make', ['build'], { cwd: SITE, encoding: 'utf8' });
  if (r.status !== 0) {
    error(`make build failed:\n${`${r.stdout ?? ''}${r.stderr ?? ''}`.split('\n').slice(-25).join('\n')}`);
    finish();
  }
}
if (!existsSync(join(DIST, 'index.html'))) {
  console.error(`error: ${DIST}/index.html is missing: build the site first`);
  process.exit(2);
}

// ---- 2. pages in dist ------------------------------------------------------------

// dist/threads/x.html is served at /threads/x, dist/index.html at /.
const pages = readdirSync(DIST, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.html'))
  .map((file) => ({ file, path: `/${file.replace(/\.html$/, '')}`.replace(/^\/index$/, '/') }))
  .filter((p) => !ONLY.length || ONLY.includes(p.path))
  .sort((a, b) => a.path.localeCompare(b.path));
if (!pages.length) {
  console.error(`error: no page matches ${ONLY.join(', ')}`);
  process.exit(2);
}

const near = (s, i) => s.slice(Math.max(0, i - 30), i + 30).replace(/\s+/g, ' ').trim();

// Text a reader sees in the page: no head (the title may hold a formula as
// plain text, arrows included), scripts, styles, code, or KaTeX (which writes
// each formula twice, once as MathML).
function visibleText(s) {
  s = s
    .replace(/<head\b[\s\S]*?<\/head>/, ' ')
    .replace(/<(style|script|pre|code|math|svg)\b[\s\S]*?<\/\1>/g, ' ');
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
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&[a-z]+;|&#\d+;/g, ' ').replace(/\s+/g, ' ');
}

const BANNED = [
  [/[•◦▪▸►]/, 'a bullet character'],
  [/[→←⇒⇐⟹⟸⟺↔➜]/, 'an arrow'],
  [/—/, 'an em dash'],
  [/(^|[^-])--(?!-)/, 'a double hyphen'],
];

// The site's own address, from the canonical link of the main page: absolute
// links to it are checked like root-relative ones.
const canonical = (readFileSync(join(DIST, 'index.html'), 'utf8').match(/<link rel="canonical" href="([^"]+)"/) ?? [])[1];
const siteUrl = canonical ? new URL(canonical).origin : undefined;

// A root-relative address resolves as GitHub Pages resolves it.
function resolves(path) {
  const p = decodeURIComponent(path.split(/[?#]/)[0]);
  if (p === '/' || p === '') return existsSync(join(DIST, 'index.html'));
  const f = join(DIST, p);
  return (existsSync(f) && statSync(f).isFile()) || existsSync(`${f}.html`) || existsSync(join(f, 'index.html'));
}

// A post page: /threads/<thread>/<post>.
const POST = /^\/threads\/[^/]+\/[^/]+$/;
const budgets = new Map(); // preview script: gzipped bytes, reported once
const statementPosts = []; // posts that link to a statement of their own, for the reduced-motion check

for (const { file, path } of pages) {
  const html = readFileSync(join(DIST, file), 'utf8');
  const text = visibleText(html);
  for (const [re, label] of BANNED) {
    const m = text.match(re);
    if (m) error(`${path}: ${label} in the text near "${near(text, m.index)}"`);
  }
  const katexErrors = (html.match(/class="katex-error"/g) ?? []).length;
  if (katexErrors) error(`${path}: ${katexErrors} formula(s) failed to render (katex-error)`);
  const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1];
  const description = (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1];
  if (!title) error(`${path}: no <title>`);
  if (description === undefined) error(`${path}: no meta description`);
  for (const [name, s] of [['title', title], ['description', description]]) {
    if (s && /[$\\]/.test(s)) error(`${path}: TeX left in the ${name}: "${s.slice(0, 80)}"`);
  }
  const seen = new Set();
  for (const m of html.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    let target = m[1].replace(/&amp;/g, '&');
    if (siteUrl && target.startsWith(siteUrl)) target = target.slice(siteUrl.length) || '/';
    if (!target.startsWith('/') || target.startsWith('//') || seen.has(target)) continue;
    seen.add(target);
    if (!resolves(target)) error(`${path}: link or asset ${target} does not resolve`);
  }
  // Cross-references (src/plugins/cross-refs.mjs) resolve, and their ids exist.
  for (const m of new Set([...html.matchAll(/data-xref-missing="([^"]*)"/g)].map((x) => x[1]))) error(`${path}: cross-reference "${m}" has no target`);
  for (const [, href] of html.matchAll(/<a href="([^"]*)" class="xref"/g)) {
    const [to, frag] = href.split('#');
    const target = to ? join(DIST, `${to}.html`) : join(DIST, file);
    if (!existsSync(target) || !readFileSync(target, 'utf8').includes(`id="${frag}"`)) error(`${path}: cross-reference ${href} leads nowhere`);
  }
  // Previews of cross-references (src/scripts/xref-preview): the build's marks
  // name ids of the page, and a post with cross-references loads the script,
  // found by what it contains, within its budget.
  for (const m of marksProblems(html)) error(`${path}: ${m}`);
  if (POST.test(path) && html.includes('class="xref"')) {
    const script = previewScript(html, DIST);
    if (!script) error(`${path}: the page has cross-references but loads no preview script (a module script containing "xref-card")`);
    else if (!budgets.has(script.name)) {
      budgets.set(script.name, script.bytes);
      if (script.bytes > BUDGET) error(`preview script ${script.name}: ${script.bytes} bytes gzipped with its ${script.modules - 1} import(s), above the budget of ${BUDGET}`);
      extra.push(`preview script: ${script.bytes} bytes gzipped (budget ${BUDGET})`);
    }
  }
  if (POST.test(path) && /<a href="#(?!figure-|eq-)[^"]+" class="xref"/.test(html)) statementPosts.push(path);
}

// Published posts are built; sample posts are not.
const postsDir = join(SITE, 'content', 'posts');
for (const file of readdirSync(postsDir, { recursive: true }).map(String).filter((f) => f.endsWith('/index.mdx'))) {
  const id = file.replace(/\/index\.mdx$/, '');
  const head = readFileSync(join(postsDir, file), 'utf8').split(/^---\s*$/m)[1] ?? '';
  const sample = /^sample:\s*true\s*$/m.test(head);
  const built = existsSync(join(DIST, 'threads', `${id}.html`));
  if (sample && built) error(`sample post ${id} is in the build: it would be published`);
  if (!sample && !built && !ONLY.length) error(`post ${id} is not in the build`);
}

// ---- 3. browser ----------------------------------------------------------------------

async function loadPlaywright() {
  try {
    const pkg = createRequire(join(SITE, 'package.json')).resolve('playwright/package.json');
    return await import(pathToFileURL(join(dirname(pkg), 'index.mjs')).href);
  } catch {
    return null;
  }
}

function serve(root) {
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.ico': 'image/x-icon', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.xml': 'application/xml', '.json': 'application/json', '.txt': 'text/plain' };
  const server = createServer((req, res) => {
    let p = join(root, decodeURIComponent(req.url.split('?')[0]));
    // As GitHub Pages: /threads is threads.html even though a threads/ folder exists.
    if (existsSync(`${p}.html`)) p = `${p}.html`;
    else if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
    if (!existsSync(p)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': types[extname(p)] ?? 'application/octet-stream' });
    res.end(readFileSync(p));
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

const shotName = (path) => (path === '/' ? 'index' : path.slice(1).replace(/\//g, '__'));

if (!flags.has('--no-browser')) {
  const pw = await loadPlaywright();
  if (!pw) {
    warn('playwright is not installed: the browser checks were skipped');
    finish();
  }
  // Without fonts Chromium measures text at zero width and every page looks
  // broken. FONTCONFIG_FILE and LD_LIBRARY_PATH come from the environment;
  // when they are unset, a local bundle under ~/.local/chrome-libs is used if
  // there is one.
  const libs = join(HOME, '.local/chrome-libs');
  const browserEnv = { ...process.env };
  if (!process.env.FONTCONFIG_FILE && existsSync(`${libs}/etc/fonts/fonts.conf`)) {
    browserEnv.FONTCONFIG_FILE = `${libs}/etc/fonts/fonts.conf`;
    browserEnv.LD_LIBRARY_PATH = [`${libs}/usr/lib/x86_64-linux-gnu`, `${libs}/lib/x86_64-linux-gnu`, process.env.LD_LIBRARY_PATH].filter(Boolean).join(':');
  }
  if (!ONLY.length) rmSync(OUT, { recursive: true, force: true });
  mkdirSync(OUT, { recursive: true });
  const server = await serve(DIST);
  const base = `http://127.0.0.1:${server.address().port}`;
  let browser;
  try {
    browser = await pw.chromium.launch({ env: browserEnv, args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
    for (const theme of ['light', 'dark']) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, colorScheme: theme });
      for (const { path } of pages) {
        const page = await ctx.newPage();
        const problems = [];
        page.on('console', (m) => { if (m.type() === 'error' || (m.type() === 'warning' && m.text().startsWith('[xref-preview]'))) problems.push(m.text()); });
        page.on('pageerror', (e) => problems.push(String(e)));
        const where = `${path} (${theme})`;
        const response = await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
        if (!response || response.status() !== 200) error(`${where}: the page answered ${response?.status()}`);
        // Scroll through the page so that every client:visible island mounts.
        await page.evaluate(async () => {
          const step = window.innerHeight * 0.8;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 200));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(600);
        const state = await page.evaluate(() => ({
          theme: document.documentElement.dataset.theme,
          overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          islands: document.querySelectorAll('astro-island').length,
          unmounted: document.querySelectorAll('astro-island[ssr]').length,
          emptyCanvases: [...document.querySelectorAll('canvas')].filter((c) => c.width === 0 || c.height === 0).length,
          // `article .body`: the sheet of a preview card has the class body too.
          scrolling: [...document.querySelectorAll('article .body .katex-display')].filter((d) => d.scrollWidth > d.clientWidth + 1)
            .map((d) => (d.querySelector('annotation')?.textContent ?? '').replace(/\s+/g, ' ').slice(0, 60)),
          split: [...document.querySelectorAll('article .body p .katex')].filter((k) => !k.closest('.katex-display'))
            .filter((k) => new Set([...k.querySelector('.katex-html').getClientRects()].filter((r) => r.width > 0).map((r) => Math.round(r.bottom / 8))).size > 1)
            .map((k) => (k.querySelector('annotation')?.textContent ?? '').slice(0, 60)),
          labels: [...document.querySelectorAll('article .body svg text')].map((t) => {
            const ctm = t.getScreenCTM();
            return { size: ctm ? parseFloat(getComputedStyle(t).fontSize) * Math.hypot(ctm.a, ctm.b) : 0, text: t.textContent.trim().slice(0, 30) };
          }).filter((l) => l.size && l.text && (l.size < 15.5 || l.size > 20)),
        }));
        if (state.theme !== theme) error(`${where}: the page chose the ${state.theme} theme`);
        if (state.overflow > 1) error(`${where}: the page scrolls horizontally by ${state.overflow} px`);
        if (state.unmounted) error(`${where}: ${state.unmounted} of ${state.islands} component(s) did not mount`);
        if (state.emptyCanvases) error(`${where}: ${state.emptyCanvases} canvas(es) have zero size`);
        for (const t of state.scrolling) error(`${where}: a display scrolls horizontally: ${t}`);
        for (const t of state.split) error(`${where}: an inline formula breaks across lines: ${t}`);
        if (theme === 'light') for (const l of state.labels.slice(0, 12)) warn(`${path}: figure label "${l.text}" is ${l.size.toFixed(1)} px, outside 15.5 to 20`);
        const name = shotName(path);
        await page.screenshot({ path: join(OUT, `${name}-${theme}.png`), fullPage: true });
        if (flags.has('--figures')) {
          // The outermost figure elements of the post body, in page order.
          const figures = await page.$$('article .body .anim, article .body .anim-figure, article .body > figure, article .body > .wide');
          let k = 0;
          for (const el of figures) {
            const nested = await el.evaluate((node) => !!node.parentElement?.closest('article .body .anim, article .body .anim-figure, article .body > figure, article .body > .wide'));
            if (nested) continue;
            k += 1;
            await el.scrollIntoViewIfNeeded();
            await page.waitForTimeout(150);
            await el.screenshot({ path: join(OUT, `${name}__fig${String(k).padStart(2, '0')}-${theme}.png`) });
          }
        }
        // Previews of cross-references, after the captures so that no card is in them.
        if (!flags.has('--no-previews') && POST.test(path)) {
          try {
            await checkPreviews(page, {
              context: ctx, base, where, error, warn,
              full: theme === 'light',
              shot: (kind) => join(OUT, `${name}__${kind}-${theme}.png`),
            });
          } catch (e) {
            error(`${where}: the check of the previews failed: ${String(e).split('\n')[0]}`);
          }
        }
        for (const p of problems) error(`${where} console: ${p.slice(0, 300)}`);
        await page.close();
      }
      await ctx.close();
    }
    // Reduced motion, once: the first post that links to one of its statements.
    if (!flags.has('--no-previews') && statementPosts.length) {
      const path = statementPosts[0];
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce' });
      const page = await ctx.newPage();
      const problems = [];
      page.on('console', (m) => { if (m.type() === 'error' || (m.type() === 'warning' && m.text().startsWith('[xref-preview]'))) problems.push(m.text()); });
      page.on('pageerror', (e) => problems.push(String(e)));
      const where = `${path} (reduced motion)`;
      await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
      await checkReducedMotion(page, { where, error, warn });
      for (const p of problems) error(`${where} console: ${p.slice(0, 300)}`);
      await ctx.close();
    }
    extra.push(`screenshots: ${OUT}`);
  } catch (e) {
    error(`browser check failed: ${String(e).split('\n')[0]}`);
  } finally {
    await browser?.close();
    server.close();
  }
}

finish();
