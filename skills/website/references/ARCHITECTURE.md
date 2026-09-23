# Architecture

Read this before work at the level of the site: a new site, a page type, a
section, a redesign, a change of host.

## 1. Structure

| Page | Shows |
|---|---|
| Main (`/`) | portrait, name, one line under it, a short bio, the ten latest posts (title, thread, date), contacts |
| Threads (`/threads`) | threads with post count and optional one-sentence description; closed threads last |
| A thread (`/threads/<thread>`) | its posts, oldest first, with word count and date |
| A post (`/threads/<thread>/<post>`) | thread, title, word count and dates, body, previous and next post |
| Not found (`/404`) | one line and links back; `noindex` |

The bar holds the name (to the main page), Threads and the theme switch,
nothing else. The footer holds the contacts and the feed. The site also
generates `/feed.xml`, `/sitemap.xml`, `/robots.txt`, a 1200 by 630 preview
card per page (`/og/<path>.png`) and its icons. None of these is committed.

## 2. Stack

| Layer | Choice |
|---|---|
| Generator | Astro, static output in `dist/` |
| Posts | MDX |
| Islands | Svelte 5 with runes |
| Mathematics | `remark-math` and `rehype-katex` at build time |
| Code | Shiki with a light and a dark theme in the same HTML |
| Fonts | Fontsource packages, self-hosted |
| Cards and icons | satori and resvg at build time |
| Drawing | d3, three, p5, available to any figure |
| Checks | Playwright (headless Chromium) |

No CSS framework, UI kit, client router or analytics.

## 3. Content model

Posts, threads and the site's own data live in `content/`:

| File | Holds |
|---|---|
| `site.json` | name, email, a flag that stops a CI build while the email is a placeholder, photo file, line, description, bio paragraphs, contacts, language, social handle for link previews |
| `photo.*` | the portrait, square |
| `threads/<slug>.md` | frontmatter only: `title`, optional `description`, `status` (`active` or `closed`) |
| `posts/<thread>/<slug>/index.mdx` | one post, with its components and assets in the same folder |
| `toolkit/` | the animation helpers, imported as `@toolkit/...` |

Post frontmatter: `title` (`$...$` allowed); `date`, the date of the subject,
which orders a thread; optional `published`, the day it went online, which
orders the latest posts and the feed; optional `updated`; optional `summary`,
for meta tags and the feed only; optional `sample: true`, shown by the dev
server and left out of the build. A thread with no published post does not
appear.

## 4. Addresses

Links are root-absolute, so the site lives at the root of its domain.
`build.format: 'file'` with `trailingSlash: 'never'` writes `threads.html`
and links to `/threads`; static hosts serve the one at the other. Canonical
addresses carry no `.html`. The 404 page removes a trailing slash.

## 5. Hosting

A workflow on every push to the published branch: checkout, Node with npm
cache, `npm ci`, `npm run build`, upload `dist`, deploy. The configuration
refuses to build in CI while a placeholder (site address, email) is left.
A custom domain points at the host with DNS records only, HTTPS enforced.

## 6. Building a site from nothing

Each step ends with a passing build.

1. **Scaffold** the project and its configuration: MDX, Svelte, the KaTeX
   pipeline, both Shiki themes, the address settings of section 4,
   `compressHTML`, a fixed dev port with `strictPort`, the `@toolkit` alias,
   the CI placeholder guard, a hook that fails the build when a page's
   og:image is missing.
2. **Content model** of section 3, with the sample filter.
3. **Library**: queries and ordering, addresses, word count, dates, titles
   with mathematics, TeX to plain text with self-tests.
4. **Shell**: meta tags, theme scripts, bar, footer.
5. **Pages** of section 1, then feed, sitemap, robots, cards, icons.
6. **Design** from DESIGN.md: tokens of both themes first.
7. **Toolkit** from ANIMATIONS.md.
8. **Checks**: Makefile, `check-site`.
9. **Deploy**, then check the live site.

The site is shown to the user from screenshots before the first publish.

## 7. A redesign

A design changes typography, colour, spacing and layout, never what the site
says, how it is organised or its addresses.

1. **Brief**: the structure above, the bans of SKILL.md, fonts self-hosted,
   tokens on `:root`, both themes, text contrast of at least 4.5 to 1,
   visible focus rings, print style, zero build warnings. Keep the user's
   own words beside it.
2. **Specifications**: one short `DESIGN.md` per candidate (concept in two
   sentences, typefaces, scale, colours, spacing, one distinctive detail).
   Concept designs (terminal, newspaper, cards) are out.
3. **Implementation**: one implementer per candidate, each in its own copy
   and port.
4. **Screenshots** of every page of every candidate, light and dark.
5. **Judge** rounds (SUBAGENTS.md) until every remaining candidate is
   accepted or the user stops them; the three-round cap does not apply.
6. **The user picks.** Name the pick and wait for a yes; archive the
   alternatives, check the archive, then merge the pick and run every check.
