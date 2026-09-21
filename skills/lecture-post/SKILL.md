---
name: lecture-post
description: Write one post on Alessandro's website for one lecture of Real and Functional Analysis or Stochastic Dynamical Models, starting from the notes file he names. Expand the professor's shorthand into rigorous, readable English, add animations or figures where they help, and verify the page. Use only when Alessandro asks for a lecture post from a specific notes file.
---

# Lecture post

Turn the notes of one lecture into one post on Alessandro's site. The post
presents what the professor set out to explain, completely and rigorously, in
prose that reads well. It carries no opinion, no commentary and nothing outside
the subject of the lecture.

Alessandro decided these rules on 17 September 2026. Paths below are relative
to the root of the site repository, `/workspace/site` on homelab.

## Where things are

| What | Where |
|---|---|
| The site, its own git repository | the repository root |
| Content rules of the site | `content/README.md` |
| Threads | `real-and-functional-analysis`, `stochastic-dynamical-models` |
| A post | `content/posts/<thread>/<slug>/index.mdx` |
| Animation toolkit | `content/toolkit/` |
| Writing rules for this skill | [references/WRITING.md](references/WRITING.md) |
| Animations and figures | [references/VISUALS.md](references/VISUALS.md) |
| Page check | [scripts/check_post.mjs](scripts/check_post.mjs) |

The notes file is whatever Alessandro names: Markdown, LaTeX, a PDF, or photos
of handwritten pages, usually in `/workspace/inbox`. Notes may be in English or
Italian. The post is always in English.

## Workflow

1. **Read the context.** Read this file, `references/WRITING.md`, the site's
   `content/README.md`, and every earlier lecture post of the same thread. The
   earlier posts fix the notation, the numbering and what has already been
   defined. Read `references/VISUALS.md` before building any animation or
   figure.
2. **Read the whole notes file first.** Read every page of a PDF or every
   image. Find the lecture number, the date, the main subject and the order of
   definitions, results, proofs, examples and remarks.
3. **Make a working map, not published.** For each item of the notes write what
   it becomes in the post. List every abbreviation with its expansion. List
   every passage you cannot read with certainty, every place where two readings
   give different mathematics, and every apparent slip.
4. **Set the frontmatter** as described below.
5. **Write the post** following `references/WRITING.md`.
6. **Add visuals** where they make an object, a construction or a step of a
   proof visible. Follow `references/VISUALS.md`.
7. **Check the page.** Run the check and fix every error:

   ```
   make check-post POST=<thread>/<slug>
   ```

   Then open both screenshots it writes and look at them yourself: the
   mathematics renders, every animation draws, nothing overflows at 390 px.
   Start the local server with `make start` when it is not running.
8. **Report to Alessandro** in Italian, briefly: the local address of the post,
   the visuals added, every passage left out because it was unreadable or
   ambiguous with its place in the notes, every slip corrected, and what was
   omitted as off topic in one sentence. Do not commit, push or publish unless
   he asks.

A notes file that covers several lectures gives one post per lecture.

## Frontmatter

```
---
title: 'Lecture 4, Completeness of $L^p$ spaces'
date: 2026-10-07
summary: 'The spaces $L^p$ with $1 \le p < \infty$ are complete. The proof extracts a fast subsequence and controls it with a telescoping series.'
---
```

**Title.** `Lecture <n>, <subject>`. The number is an Arabic numeral. The
subject is in sentence case and names the main topic in a few words.
Mathematics goes between `$` signs.

**Lecture number.** Take it from the notes, from a heading or the file name.
When the notes do not give it, use the highest lecture number already in the
thread plus one, and say so in the report. When a post with that number already
exists in the thread, stop and ask Alessandro.

**Date.** The date of the lecture when the notes give it. Otherwise the date
Alessandro gives. Otherwise today in Europe/Rome, and say so in the report.

**Summary.** One or two sentences on what the lecture establishes, with no
opinion. The site uses it as the page description and in the feed.

**Slug.** `lecture-<n>-` followed by at most six lowercase words of the
subject, joined by hyphens, ASCII only. Example:
`lecture-4-completeness-of-lp-spaces`.

## Rules that are never bent

1. **Only the lecture.** The post contains the definitions, results, proofs,
   examples and remarks of the lecture, in the lecture's order unless a small
   reordering makes a proof readable. Making an implicit step of the
   professor's argument explicit is expansion. Adding a result, an example, an
   application or a historical note that the lecture did not contain is
   invention, and invention is not allowed.
2. **No opinion and no commentary.** No first person singular. No evaluative
   words such as beautiful, elegant, surprising or interesting. No sentence
   about the course, the professor, the notes, the exam or the classroom.
   Present the mathematics directly.
3. **Nothing outside the subject.** Leave out logistics, exam information,
   homework, announcements, anecdotes and digressions. A result from another
   course enters only when the argument uses it, stated as a known result.
4. **Never publish a guess.** A passage that cannot be read with certainty, or
   that admits two readings with different mathematics, stays out of the post
   and goes into the report. An obvious slip, such as a wrong index or a
   dropped sign that the next line contradicts, is corrected and reported. A
   claim that is false as written and is not an obvious slip stays out and is
   reported.
5. **Rigour.** Every symbol is defined before use. Every result states all its
   hypotheses. Quantifiers are explicit. A proof that the notes give is
   complete in the post.
6. **Say whether each proof is complete or a sketch.** Label every proof
   `**Proof (complete).**` when the lecture gives the whole argument, or
   `**Proof (sketch).**` when the lecture marks it as a sketch or gives only
   its key step. A sketch holds only the lecture's steps. The verifications
   that complete it follow in a separate paragraph that starts with
   `**Details.**`. A bare `**Proof.**` is not allowed, and the check rejects
   it. `references/WRITING.md` gives the details.
7. **Notation.** Keep the professor's notation and numbering. Change them only
   to remove an inconsistency, and then use the change throughout.
8. **The notes stay private.** Never publish the notes file, a scan or a photo
   of it.
9. **Touch only the new post folder.** Do not edit other posts, thread files,
   the toolkit, layouts or styles. When the toolkit lacks something, build it
   inside the post folder.
