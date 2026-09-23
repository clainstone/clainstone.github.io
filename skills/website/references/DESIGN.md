# Design

The default design is a page of a well-set book: a text serif on cream
paper, larger type, generous leading, one calm column. Colours, type sizes
and measures are tokens on `:root` in `src/styles/global.css`: change the
token, not the rule that uses it. The page and ink colours are repeated in
`Base.astro` (`theme-color`) and in `cards.ts`.

## 1. Tokens

| Token | Light | Dark |
|---|---|---|
| `--page` | `#fbf8f2` | `#1c1a17` |
| `--ink` | `#221f1c` | `#e9e3d8` |
| `--muted` | `#6f6a63` | `#a39b8e` |
| `--rule` | `#e5dfd4` | `#38332d` |
| `--link` | `#2f4f8f` | `#9fb7e6` |
| `--link-hover` | `#1f3766` | `#c6d5f2` |
| `--control-bg` | `#ebe5d9` | `#312d28` |
| `--code-bg` | `#f3efe6` | `#262320` |

The dark values are written twice, under `:root[data-theme='dark']` and under
`@media (prefers-color-scheme: dark)` for pages read without JavaScript.
Change both. The animation palette (`--anim-ink`, `--anim-muted`,
`--anim-rule`, `--anim-accent`, `--anim-font`) points at these tokens.

## 2. Type

1. One text face (a serif, 400, 400 italic, 600) and one monospace face,
   self-hosted, with sized fallbacks so the swap does not move text.
2. Body 19 px on desktop through `clamp()`, leading 1.55.
3. A small scale: small text 0.9375rem, section headings 1.125rem, page
   headings 1.5rem, post title 2rem, name 1.75rem. Weight 600 for headings.
4. Lining figures; proportional in prose, tabular in counts, dates and tables.
5. `text-wrap: balance` on headings and row titles, `pretty` on paragraphs.

## 3. Layout

1. One centred column: 62ch on pages, 40rem (760 px) on posts, so that a
   proof's displays keep their lines. A figure may take a wide track of
   48rem with `<div class="wide">`.
2. The bar and the footer have the post width on every page, so nothing
   moves when a post opens. A hairline under the bar and over the footer.
3. Rows (latest posts, threads, a thread's posts) are separated by hairlines,
   with the title at the left and quiet muted metadata at the right on the
   same baseline. No numbering, no markers.
4. The post header: thread name in muted italic, title, meta line (words,
   date, published, updated). The post ends with the thread link, its
   position and the previous and next posts.

## 4. The post body

1. Paragraph spacing 1em, no indent. `h2` 1.375rem, `h3` 1.125rem, with
   more space above than below; a hover `#` anchor on each.
2. Links in running text underlined at 40 percent opacity, full on hover.
3. Inline code on the code background; blocks with both Shiki themes and the
   site's own background.
4. A caption is the `**Figure n.** ...` paragraph right after a visual: the
   CSS sets it small and muted.
5. A bold run-in label after other content gets more space above it than
   inside the statement it opens.
6. Tables in small type with hairlines; blockquotes with a thin rule.

## 5. Mathematics

1. KaTeX at 1.05em. Inline formulas never break across lines
   (`white-space: nowrap`): a formula too long for a line is displayed.
2. Displays keep the column; a display that would scroll shows faint shadows
   at its clipped edges, which the check reports as an error.

## 6. Dark mode

The switch sits at the right of the bar. A thin sun turns into a crescent
over 0.6 s; nothing animates under `prefers-reduced-motion`. A saved choice
equal to the system's is cleared, so the page follows the system again.
Canvases repaint when the theme changes; SVG figures follow through CSS
variables; code switches Shiki theme through `--shiki-dark`. Preview cards
stay light.

## 7. Details that are part of the design

1. Focus rings visible and designed (2 px, link colour, offset).
2. A skip link to the content.
3. `scrollbar-gutter: stable`, so the bar does not shift between pages.
4. Text contrast at least 4.5 to 1 in both themes.
5. A print style: no bar, footer, switch or post navigation; black on white;
   link addresses after external links.

## 8. What never appears

Bullets or markers of any kind, arrows, em dashes and double hyphens, icon
sets, emoji, badges, stock images, decorative gradients, glass or blur,
large shadows, animated backgrounds, pop-ups, "read more" chevrons.

## 9. Judging a visual change

Compare screenshots before and after, at 1280 px, in light and dark. Look at
the rhythm of the rows, the alignment of baselines, the weight of the muted
text, the figures in both themes, and that nothing moved that should not.
