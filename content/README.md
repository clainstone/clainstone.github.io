# Content

Everything the site says lives here, apart from the code, so that writing a
post never touches a component or a layout.

## Files

- `site.json`: name, email, photo file, `line` (the sentence under the name),
  `description` (the site in one sentence: search results, link previews and
  the feed), the bio paragraphs, the contacts, `language` (`en-GB`) and `x`
  (the X handle for link previews). `emailIsPlaceholder` stops a CI build
  while the email is still a placeholder.
- `photo.jpg`: the portrait, square, at least 400 px. To change it, put a new image
  here and set `photo` in `site.json` to its file name.
- `threads/<slug>.md`: one thread. Frontmatter: `title`, optional
  `description` (one sentence, shown under the title and in link previews),
  `status` (`active` or `closed`; a closed thread keeps its page and is
  listed after the active ones). No body.
- `posts/<thread-slug>/<post-slug>/index.mdx`: one post. Frontmatter:
  `title`, `date` (the date of the subject, a lecture's date: it orders the
  posts of a thread), optional `published` (the day the post went online,
  when later than `date`: it orders Latest posts and the feed), optional
  `updated`, optional `summary` (meta description and feed only), optional
  `sample: true` for a demonstration post that the
  dev server shows and the published site leaves out. A thread with no
  published post does not appear. Body: Markdown with mathematics (`$…$`, `$$…$$`), fenced
  code, images, and MDX imports for animations. The post's own components and
  assets sit in the same folder.
- `toolkit/`: the animation helpers every post can import as `@toolkit/…`.

## Writing rules

- No bullet points, no arrows, no double hyphens or em dashes. Write
  sentences and paragraphs. A run-in bold label at the start of a paragraph
  replaces a list item.
- A complex concept may link to Wikipedia once, at its first appearance.
- Name a numbered statement, figure or equation exactly as its label reads
  ("Theorem 3.5", "Figure 2", "(6)", "Theorem 10 of the previous post"): the
  build links it to its place, in the same post or another post of the
  thread. Never link it by hand. Resting the pointer on such a link shows
  its target in a preview: a statement runs from its label to the next
  heading, figure, bold label or paragraph that names it.
- A number arrives with its conditions or it does not arrive.

## Animations

Write a Svelte component next to the post and mount it:

```mdx
import Ramps from './Ramps.svelte';

<Ramps client:visible />
```

`@toolkit/Canvas.svelte` gives a canvas with a render loop that handles pixel
density, resizing, pausing off screen and reduced motion; pass it a
`draw(ctx, t, size)` function. `@toolkit/Slider.svelte` is a labelled range
input. `d3`, `three` and `p5` are installed and importable from any component.
CSS and SVG animations need no JavaScript and go inline in the MDX.
