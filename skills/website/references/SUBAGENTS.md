# Subagents

Which subagents to spawn, when, with what brief, and how to use what they
return.

## 1. Principles

1. **Spawn for parallel, independent work or for fresh eyes.** Several
   figures, a review, an audit. Do not spawn a builder for a one-file edit or
   a scout for a file whose path you know; when a review is due, SKILL.md
   step 7 decides.
2. **One writer per file.** Two agents never edit the same file at the same
   time. Parallel writers on shared files (`global.css`, `Base.astro`,
   `site.ts`) each get `isolation: "worktree"`, and you merge.
3. **One build at a time.** Builds share `dist/`. Subagents that write do
   not run `make build` or `make check-site` while others run; they use
   `compile_check.mjs`, and you build once for all.
4. **Briefs stand alone.** A subagent does not see the conversation. Give
   it the paths, the reference files to read, the exact deliverable, the
   files it may touch and the form of its answer.
5. **Limits in every brief.** No commit, push or deploy. No starting or
   stopping servers. No files outside the brief. No commands beyond the
   repository's build and check commands and those the brief names.
6. **Launch together.** Independent subagents go in one message. Keep a
   task under ten of them.
7. **Findings are claims.** Check each one against the code or the
   screenshot before acting. A wrong finding is rejected with its reason in
   the report, never obeyed to please the reviewer.
8. **Rounds are capped.** Review, fix, review again: at most three rounds,
   unless the user asked to loop until approval. The judge rounds of a
   redesign are not capped.
9. **Models by alias.** `opus` (the latest Opus model) for builders and
   reviewers; the Explore agent's default for sweeps.

## 2. Roster

### Scout

`subagent_type: "Explore"`, read only, breadth "medium" or "very thorough".
For a question across many files: every component that sets its own
colour, every post that imports a toolkit file. It returns paths and lines,
not file contents.

### Planner

`subagent_type: "Plan"`, read only. For a feature that crosses the library,
pages, styles and checks: it returns steps, files and risks. You decide.

### Implementer

`subagent_type: "general-purpose"`, `model: "opus"`. One bounded change with
a precise spec. Alone, it may build and run `make check-site`; beside another
writer it works in a worktree and does not build.

### Figure builder

`subagent_type: "general-purpose"`, `model: "opus"`, one per figure (or per
group of figures sharing a helper). It writes only its component and helper
files inside the post folder, never `index.mdx`, the toolkit or styles. It
reads ANIMATIONS.md, checks with `compile_check.mjs` and returns the files
written, the mount line and the check's result. After your build, send each builder
(with `SendMessage`, so it keeps its context) its own captures to fix what
they show.

### Prose reviewer

`subagent_type: "general-purpose"`, told to write nothing. It reads
WRITING.md and the MDX and returns numbered defects: line, rule, problem. It
never rewrites.

### Visual reviewer

`subagent_type: "general-purpose"`, told to write nothing. It reads DESIGN.md
and ANIMATIONS.md and looks at the screenshots and figure captures, light and
dark. It returns numbered defects: page or figure, element, problem, rule.

### Code reviewer

`subagent_type: "general-purpose"`, told to write nothing, on a diff saved to
a file. Correctness first (ordering, addresses, build hooks, both themes),
then simplicity.

### Independent auditor

A fresh process with no context of the work, at maximum effort, that writes
only its report, for a round of changes before publishing or a full audit:

```
claude -p --model opus --effort max \
  --add-dir <repo> --add-dir <evidence dir> \
  --allowedTools Read,Glob,Grep,Write --permission-mode acceptEdits \
  < <evidence dir>/prompt.md
```

It cannot run Node or a browser, so give it evidence in `<evidence dir>`: the
output of `make check-site FIGURES=1`, the path of the screenshots, the diff,
the log of a clean-clone build. It writes `audit-<n>.md` ending with
`VERDICT: APPROVED` or `VERDICT: CHANGES <count>`. Run it in the background;
it takes minutes.

### Style judge

For a redesign (ARCHITECTURE.md, section 7): a fresh `claude -p` with a
model other than the implementers' (for example `--model fable`), with
authority. It reads the brief, the user's words, the specifications and the
screenshots, and writes `REVIEW-<n>.md`: per design ACCEPT, REDO with
concrete demands, or REPLACE, then a round verdict. Its demands are carried
out.

## 3. Playbooks

**A. A post with figures.** You write the prose. Figure builders in
parallel, one per figure. You mount them, build once, run
`make check-site FIGURES=1`, send each builder its captures. Then a prose
reviewer and a visual reviewer in parallel. Fix, check, report.

**B. A feature or a style change.** Optional scout and planner. You or one
implementer build it. `make check-site`. Visual and code reviewers in
parallel. Fix. An independent auditor when the change is large or about to
be published.

**C. An audit of the whole site.** Evidence pack, auditor, a plan from its
findings (checked by you), implementation as in B, auditor again until
approved or the round cap.

**D. A redesign.** Specifications, implementers in separate copies and
ports, screenshots, judge rounds, the user's pick, archive, merge.

## 4. Brief templates

**Figure builder**

```
You build one figure of a post in <repo>. Read
skills/website/references/ANIMATIONS.md first.

Figure <n>: <what it shows, in one sentence>.
Data: <exact values, parameters, labels, notation>.
Kind: <static | interactive: controls and ranges | animation: what moves>.
Width: <column | wide>. Accessible label: <sentence>.

Write only <post folder>/<Name>.svelte (and <helper>.js if needed).
Do not edit index.mdx, the toolkit, styles or any other file. Do not build,
commit or start servers. Check with
node skills/website/scripts/compile_check.mjs <your files>.
Answer with: the files written, the mount line, compile_check's result.
```

**Reviewer (prose, visual or code)**

```
You review <what> in <repo>. Write nothing. Read <reference files>.
Look at <files, screenshots, diff>.
Return numbered defects only: <location>, the rule broken, the problem in
one sentence. No replacement text, no praise. End with "DEFECTS: <n>".
```

**Independent auditor**

```
You audit <scope> of the site in <repo>. You have no other context.
Rules: skills/website/SKILL.md and its references. Evidence: <evidence dir>
(check output, screenshots, diff, clean build log). You cannot run code.
Write <evidence dir>/audit-<n>.md: numbered findings, each with location,
evidence and the change required, most severe first. Last line:
"VERDICT: APPROVED" or "VERDICT: CHANGES <count>".
```
