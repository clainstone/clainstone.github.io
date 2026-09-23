# Implementation

How the code is organised, how its parts work, how to change it and how to
check it.

## 1. Files

| File | Role |
|---|---|
| `astro.config.mjs` | integrations, KaTeX and Shiki, addresses, dev port, `@toolkit` alias, CI guard, og:image hook |
| `src/content.config.ts` | collections `threads` and `posts`, schemas, sample filter (in a build, sample posts are excluded from the loader, so their islands are not bundled) |
| `src/lib/site.ts` | `SITE`, `PHOTO`, `publishedOf`, `getPosts`, `getRecentPosts`, `getThreads`, `postsOf`, `threadOf`, `threadIdOf`, `postUrl`, `threadUrl`, `wordCount`, `formatWords`, `formatDate`, `isoDate`, `mathHtml`, `plain` |
| `src/lib/cards.ts` | preview cards and icons with satori and resvg |
| `src/components/M.astro` | a frontmatter string with its `$...$` typeset |
| `src/layouts/Base.astro` | head and meta tags, theme scripts, bar, footer |
| `src/pages/` | the pages and generated files of ARCHITECTURE.md |
| `src/plugins/heading-anchors.mjs` | ids and hover `#` links for `h2` and `h3` of posts |
| `src/styles/global.css` | every style and token |
| `content/toolkit/` | `Canvas.svelte`, `Slider.svelte`, `Figure.astro`, `Video.astro`, `loop.js`, `toolkit.css` |
| `Makefile` | `help`, `start`, `stop`, `status`, `logs`, `dev`, `preview`, `build`, `check-site` |

## 2. How the parts work

**Ordering.** `getPosts` sorts by `date`, `getRecentPosts` by `published`
(else `date`). Threads sort closed last, then by their latest publication.

**Mathematics in strings.** Titles and descriptions go through `M.astro`
(`mathHtml`) on pages and through `plain()` everywhere HTML cannot go:
`<title>`, meta tags, cards, feed. `plain()` turns TeX into Unicode and
throws on a command it does not know, which stops the build; add the
command to its symbol table. Its self-tests run on every build.

**Shell.** One inline script in the head sets `data-theme` before the first
paint from the saved choice or the system; one after the bar runs the
switch and keeps `theme-color` in step. No other script is in the shell.

**Cards.** Satori draws each page's card in the site's fonts, one family
name per subset (the weights and styles of a subset share it). A character
no font draws stops the build with its code point: change the title rather
than the fonts.

**Build hooks.** After the build, every og:image must exist in `dist/`. A new
page type therefore needs its card path in `src/pages/og/[...slug].png.ts`,
and its address in the sitemap.

## 3. Recipes

1. **A thread**: `content/threads/<slug>.md` with `title`, `description`,
   `status`.
2. **A post**: `content/posts/<thread>/<slug>/index.mdx`; slug of at most six
   lowercase ASCII words; `sample: true` until it is meant to go public.
3. **A page type**: the page, its card path, its sitemap entry, a title and
   description through `plain()`.
4. **A colour**: the token in the three blocks of `global.css` (light `:root`,
   `[data-theme='dark']`, the dark media query), the matching
   constant in `cards.ts` when the card uses it, `theme-color` in `Base.astro`
   for the page background.
5. **A font**: its imports in `Base.astro`, the sized fallback in
   `global.css`, the card fonts in `cards.ts`.
6. **A toolkit change**: keep the API compatible and check every post that
   imports it (`grep -rl '@toolkit/' content/posts`).
7. **A dependency**: only when nothing installed does the job; update the
   lock file with `npm install` and build in a clean clone.

## 4. Conventions

1. Comments are full sentences that say why, at the density of the
   surrounding code.
2. Tokens as custom properties on `:root`; hand-written CSS; component styles
   scoped.
3. Build time over run time: what can be computed while building is not
   shipped as JavaScript.
4. Few dependencies, no framework on top of the stack.
5. Interface text follows WRITING.md.
6. Commit messages: a subject naming the area and the change, then prose
   paragraphs on what and why. No lists.

## 5. Running it

`make start` runs the dev server in the background on the fixed port
(`strictPort`: it fails rather than move); `make stop`, `make status`,
`make logs`. `make preview` serves the built site exactly as published:
sample posts appear only in the dev server.

## 6. Checks

| Check | When | Catches |
|---|---|---|
| `make build` | every change | type, MDX, KaTeX, `plain()`, card and og:image errors |
| `make check-site` | every change | banned characters in visible text, KaTeX errors, TeX in titles and descriptions, broken internal links and assets, published samples, then at 1280 px in light and dark: the theme the page chose, console errors, horizontal overflow, unmounted islands, empty canvases, displays that scroll, inline formulas split across lines; full-page screenshots. A warning, not an error: SVG labels outside 15.5 to 20 px (light theme, first 12) |
| `make check-site FIGURES=1` | a figure changed | also one capture per figure |
| `make check-site ONLY=/,/threads` | a quick look | only those pages |
| `node skills/website/scripts/compile_check.mjs <files>` | a subagent's own component | Svelte compile errors and warnings, JS syntax, missing relative imports |
| clean clone | dependencies, configuration, workflow | a build as CI runs it |

A clean clone: `git clone <repo> <dir>`, then `export CI=true; npm ci &&
npm run build` in it, so that the build itself runs under CI. Use a
directory where files may be executed; a `noexec` temporary directory makes
the build fail.

Headless Chromium needs fonts. Without system fonts, set `FONTCONFIG_FILE`
(and `LD_LIBRARY_PATH` for missing libraries) before running the check, or
every text measures zero width. `check_site.mjs` takes both from the
environment and falls back to `~/.local/chrome-libs` when that exists.

## 7. Publishing

Only when the user asks. Commit with the message of section 4, push, then
follow the workflow (`gh run watch`) and check the live pages with `curl`.
When the local branch holds commits the user has not asked to publish, put
the requested ones on the published branch by cherry-picking in a worktree.

## 8. Gotchas

1. MDX reads `{`, `}`, `<`, `>` outside mathematics as syntax.
2. A frontmatter string with a backslash goes in single quotes; an apostrophe
   inside is doubled.
3. `compressHTML` removes whitespace between inline elements: write `{' '}`
   where a space matters.
4. KaTeX writes each formula twice (HTML and MathML): character counts from
   `textContent` are wrong; judge from screenshots.
5. Two builds at once in the same repository overwrite each other's `dist/`.
