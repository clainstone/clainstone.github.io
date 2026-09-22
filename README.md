# Site

Alessandro Palliccia's personal website: Main and Threads, posts in MDX with
mathematics, code and in-page animations. Astro 7, Svelte 5, static output,
published on GitHub Pages by `.github/workflows/deploy.yml` on every push to
`main`.

## Write

Everything the site says is in `content/` (see `content/README.md`). A thread
is `content/threads/<slug>.md`; a post is
`content/posts/<thread>/<post>/index.mdx`, with its animation components in
the same folder.

## Run

On homelab, from this directory. The Makefile finds Node by itself.

```
make start     # dev server in the background on port 4300, reloads on save
make preview   # the built site in dist/, on Astro's preview server
make stop
make status
```

`make help` lists the rest. `npm run dev` and `npm run build` work too when
Node is on the PATH.

## View it from the laptop

The site runs in a container on homelab at 172.20.0.2. Open a tunnel from
the laptop and leave it open:

```
ssh -N -L 4300:172.20.0.2:4300 homelab
```

Then open http://localhost:4300. To get the tunnel with every `ssh homelab`,
add this to `~/.ssh/config` on the laptop, under `Host homelab`:

```
LocalForward 4300 172.20.0.2:4300
```

If the container is recreated and its address changes, the site prints the
new one under "Network" when it starts.

## Lecture posts

Posts for the Real and Functional Analysis and Stochastic Dynamical Models
threads are written from lecture notes with the skill in
`skills/lecture-post/SKILL.md`. `make check-post POST=<thread>/<slug>` builds
the site and checks one post.

## Publish

The workflow builds and deploys. It refuses to build while `SITE_URL` in
`astro.config.mjs` or the email in `content/site.json` is still a placeholder.
Posts marked `sample: true` are shown by the dev server only; `make preview`
shows exactly what gets published. The build also makes the link-preview card
of every page (`/og/…png`, `src/lib/cards.ts`), the icons, `robots.txt` and
`sitemap.xml`; none of them is a file in the repository.
