---
name: website
description: Create, implement, extend, check and publish a static website of threads and posts with mathematics, code and interactive figures (Astro, MDX, Svelte, KaTeX, deployed as static files). Covers the site's architecture, its implementation, the rules for setting up animations and figures, the writing style of posts and interface, and which subagents to spawn for each kind of work. Use it for any task on such a site, even a small one: a new site or a redesign, a page or feature, a CSS fix, a figure or animation, the prose of a post, a review or audit, or a publish.
---

# Website

A skill for building and maintaining a static site made of **threads** (one
subject each) and **posts** (MDX with mathematics, code, images and
interactive figures). Paths are relative to the repository root.

## What to read

| Task | Read |
|---|---|
| A new site, a redesign, a new section, hosting | [references/ARCHITECTURE.md](references/ARCHITECTURE.md) |
| Code: pages, layout, library, cards, feed, build, checks, publishing | [references/IMPLEMENTATION.md](references/IMPLEMENTATION.md) |
| Anything visible: CSS, type, colour, spacing, dark mode, print | [references/DESIGN.md](references/DESIGN.md) |
| An animation, a figure, an image, a video | [references/ANIMATIONS.md](references/ANIMATIONS.md) |
| Any text: a post, a caption, a title, a summary, interface words | [references/WRITING.md](references/WRITING.md) |
| Work split among subagents, reviews, audits | [references/SUBAGENTS.md](references/SUBAGENTS.md) |

Read the repository's `AGENTS.md` and `README.md` first. What the user says
wins over this skill, and a more specific skill of the repository wins over
it for its own task.

## How to work

1. **Understand the request.** A choice that belongs to the user (a design
   direction, what goes public, which of two options) is asked before
   building. Everything else takes the defaults of these files.
2. **Read** the references the task needs and the files you will change.
3. **Plan the files.** Name every file you will touch. One writer per file.
4. **Build.** Small work you do yourself; work with independent parts goes
   to subagents as SUBAGENTS.md prescribes.
5. **Check.** `make check-site` after any change: it builds, then checks
   every page at 1280 px in light and dark. Add `FIGURES=1` when a figure
   changed. A change to dependencies or configuration also builds in a
   clean clone with `CI=true`.
6. **Look** at the screenshots in `.astro/site-check/` yourself, light and
   dark. Checks do not see ugliness, overlaps or a figure that says the
   wrong thing.
7. **Review.** New text, and any visible change to more than one file, goes
   past at least one reviewer subagent; a one-file fix you review yourself
   from the screenshots. Verify each finding before acting on it.
8. **Report** in the user's language: what changed, the local address, what
   the checks and reviewers said, what is open, what needs a decision.

## Rules that are never bent

1. **Desktop reading.** Pages are designed and judged at 1280 px. Formulas,
   figures and paragraphs are never split or shortened for narrow screens.
2. **No bullets, no arrows, no em dashes, no double hyphens** in anything the
   site shows. Lists become sentences or paragraphs with bold run-in labels.
   Arrows inside mathematics are mathematics and are fine.
3. **Minimal.** Nothing that was not asked for: no search, newsletter,
   comments, cookie banner, icon set, emoji, badge, stock image, decorative
   gradient, large shadow or animated background.
4. **No JavaScript in the shell** beyond the inline theme scripts and the
   404 page's trailing-slash redirect. Otherwise JavaScript reaches a page
   only through the islands a post mounts.
5. **Content and code stay apart.** Posts, threads and the site's own data
   live in `content/`; only interface words live in the code. While writing
   a post, do not touch layouts, styles, the toolkit or other posts; build
   what is missing inside the post folder.
6. **Sample posts stay.** Posts marked `sample: true` are examples: never
   delete them, never publish them unless asked.
7. **Nothing leaves without a request.** No commit, push or deploy unless
   the user asks; a push to the published branch is a publication. Never
   discard alternatives before the user has confirmed the pick by name.
8. **No invented numbers.** A measurement in a post comes from a run the
   user did. A missing one is marked `{/* NEEDS RUN: ... */}` and the post
   stays `sample: true`.
9. **Model names** in files and prompts use aliases (`opus` for the latest
   Opus model), never version numbers.

## Subagents at a glance

| Role | When | How |
|---|---|---|
| Scout | a sweep across many files | `Explore`, read only |
| Planner | a feature across several parts of the code | `Plan`, read only |
| Implementer | a bounded code change with a precise spec | `general-purpose`; worktree when beside another writer |
| Figure builder | each figure of a post with two or more new figures | `general-purpose`, one per figure, no build |
| Prose reviewer | every new or rewritten text | read only, reports defects, never rewrites |
| Visual reviewer | every visible change, from screenshots | read only |
| Code reviewer | every code change beyond one file | read only, on the diff |
| Independent auditor | a round of changes before publishing | fresh `claude -p --model opus --effort max`, writes only its report |
| Style judge | a redesign | fresh `claude -p`, authority over the designs |

Details, commands and prompt templates: [references/SUBAGENTS.md](references/SUBAGENTS.md).
