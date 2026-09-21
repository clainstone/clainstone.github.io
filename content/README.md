# Content

Everything the site says lives here, apart from the code, so that writing a
post never touches a component or a layout.

## Files

- `site.json`: name, email, photo file, the one-line description under the
  name, the bio paragraphs and the contacts.
- `photo.jpg`: the portrait, square, at least 400 px. To change it, put a new image
  here and set `photo` in `site.json` to its file name.
- `threads/<slug>.md`: one thread. Frontmatter: `title`, `status`
  (`active` or `closed`). No body.
- `posts/<thread-slug>/<post-slug>/index.mdx`: one post. Frontmatter:
  `title`, `date`, optional `updated`, optional `summary` (meta description
  and feed only), optional `sample: true` for a demonstration post that the
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
