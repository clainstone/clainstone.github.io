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
| `src/components/XrefPreview.astro` | the tag of the preview script, rendered by the post page |
| `src/scripts/xref-preview/` | previews of cross-references: `index.js` (intent, nested cards, events), `source.js` (a target's blocks, fetches of other posts, their styles), `card.js` (the card, its scale and place), `jump.js` (the wash and the flight on click) |
| `src/plugins/cross-refs.mjs` | ids for numbered statements, figures and tagged displays; links from every mention of them, across the posts of a thread |
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
switch and keeps `theme-color` in step. No other script is in the shell;
a post page adds the preview script of Cross-references.

**Cards.** Satori draws each page's card in the site's fonts, one family
name per subset (the weights and styles of a subset share it). A character
no font draws stops the build with its code point: change the title rather
than the fonts.

**Cross-references.** `cross-refs.mjs` runs after KaTeX. It reads the MDX
of every non-sample post of the thread to know which ids each defines
(`**Kind n.**` labels, `\tag{n}`), in thread order (date, then id). It gives
each statement's paragraph the id `kind-n` (dots become hyphens), each
figure an empty `.xref-anchor` just before its visual (so the caption stays
the visual's next sibling), each tagged display `eq-n`. A mention in prose
resolves in its own post, then in the post a qualifier names ("of the
previous post"), then in the only other post that has it; figures only in
their own post, equations without a dot in their number too. An unresolved
mention stays text in `<span data-xref-missing>`. Links carry `class="xref"`:
text colour with an underline, and a brief wash on the target. After
editing the plugin, restart the dev server: it caches plugins.

The plugin also marks what a preview shows. The blocks after a statement's
paragraph that belong to it carry `data-xref-part="<id>"`: displays,
tables, lists, code, quotations and plain paragraphs, items such as
`**(ii)**` included, up to the first heading, rule, figure or component,
paragraph that opens with a bold label (a proof, a caption, the next
statement) or paragraph that cites the statement itself. A figure's caption
carries `data-xref-part`, the paragraph that leads into a tagged display
`data-xref-lead`. The preview script shows these blocks when the pointer
rests on a link for 0.4 s or the link takes keyboard focus: a card on the
page's paper holds them, cloned, laid out at the column's 760 px and scaled
to 0.75, so every line breaks as on the page. A target in another post comes
from that post's HTML, fetched once, with its styles. An island in a card
is a second, live instance, hydrated from the server's markup. A link in a
card opens a card above it. A click on a link whose card is open sends the
card's blocks to their places with a view transition, and the whole passage
is washed on arrival.

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
8. **A figure component** may be mounted twice at once, on the page and in a
   preview: ids from `$props.id()`, no mutable state at module level, sizes
   from the layout box (`clientWidth`, `getComputedStyle`), never from
   `getBoundingClientRect` or the window.

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
| `make check-site` | every change | banned characters in visible text, KaTeX errors, TeX in titles and descriptions, broken internal links and assets, cross-references with no target or leading to a missing id, published samples, then at 1280 px in light and dark: the theme the page chose, console errors, horizontal overflow, unmounted islands, empty canvases, displays that scroll, inline formulas split across lines; full-page screenshots. A warning, not an error: SVG labels outside 15.5 to 20 px (light theme, first 12); then, on every post, the previews: a statement, an equation, a figure and a target in another post, rested on in both themes (the card holds exactly the target's blocks with the page's line breaks, fits the window, mounts its figures, nests, closes on leave and on Escape, and a click lands on the target), and the preview script under 7 KB gzipped |
| `make check-site PREVIEWS=0` | a quick run | all but the previews |
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
6. Astro puts an inline style and the island scripts just before the first
   island of a page: code that looks for the element after a figure's anchor
   skips `script` and `style`.
7. A preview's sheet has the class `body`: checks that query the page use
   `article .body`.
