# Writing style

Rules for every text the site shows: posts, captions, titles, summaries,
descriptions and interface words. English, one spelling convention (the
site's `language`) throughout.

## 1. Two kinds of post

**Expository posts** present a subject (a course, a chapter, a theory):
definitions, results, proofs, examples. Impersonal, "we" for the argument,
present tense, no opinion, no commentary, nothing outside the subject.

**Project posts** report what the author built and measured, in the first
person. Every claim is something the author did or observed; every number
arrives with its conditions (input, configuration, machine, command) or does
not arrive.

## 2. Rules for every text

1. No bullet points, no numbered lists, no arrows, no em dashes, no double
   hyphens. A list becomes sentences, or paragraphs that open with a bold
   run-in label such as `**Current.**`.
2. No evaluative words (beautiful, elegant, surprising, interesting,
   powerful) and no words that hide a step (clearly, obviously, trivially,
   of course).
3. No meta-commentary ("it is worth noting", "the key point is"), no empty
   intensifiers (crucially, fundamentally, remarkably), no slogans or
   closing maxims, no artificial contrast ("not X, but Y") unless the
   comparison is the content.
4. One main claim per sentence, at most 40 words. Paragraphs of 2 to 6
   sentences.
5. A complex concept may link to Wikipedia once, at its first appearance.
   Nothing else is linked except the sources and code a project post cites.
6. Abbreviations are written out at first use.

## 3. Metadata

1. **Title**: the subject in a few words, sentence case, no numbering.
   Mathematics between `$` signs; every character must be drawable by the
   card fonts.
2. **Summary**: one or two sentences on what the post establishes or
   reports, no opinion. It feeds the meta description and the feed.
3. **Thread description**: one sentence on what the thread is.
4. **Slug**: at most six lowercase ASCII words of the subject.
5. YAML strings with a backslash in single quotes.

## 4. Page form

1. One paragraph is one line of MDX. No hard wrapping inside a paragraph;
   the one exception is the items of a statement (rule 4).
2. **Opening**: one to three sentences that state the object or the
   question. Not "In this post", not a summary.
3. **Headings**: `##` for the main parts, `###` inside them, sentence case,
   naming the content. A heading does not begin with mathematics and holds
   at most one formula.
4. **Statements** open with a bold run-in label: `**Definition 3 (Name).**`,
   `**Theorem 4.**`, `**Example 5.**`. One counter runs through the post
   unless the subject has its own numbering. Items of a statement are lines
   of the same paragraph, joined by `\` hard breaks, each opening with
   `**(i)**`.
5. **Proofs** open with `**Proof (complete).**` or, when steps are left
   out, `**Proof (sketch).**`. The end mark is
   `$\blacksquare$` after the last sentence, or `\tag*{$\blacksquare$}` after
   a final display.
6. **Bold** only for labels. **Italics** once per term, where it is defined.
7. **Figures**: each is followed by `**Figure n.**` and at most three
   sentences: what is drawn, what the controls change. The text refers to
   "Figure n", never to "the figure below".
8. **Code**: fenced with its language; pseudocode as `text`; short excerpts,
   not dumps.
9. **Ending**: the last item of the subject. No summary, no look ahead.

## 5. Mathematics

1. Inline between `$`, displays between `$$` lines with blank lines around.
2. Punctuation after inline mathematics goes inside the dollars: `$\tau.$`,
   `${x \le y,}$`. A colon is written `{:}`.
3. Inline budget: about 45 rendered characters, no big operator with limits,
   no stacked fraction with symbols. Beyond that, display it.
4. Every display fits the 760 px column. Break only when it does not fit,
   with `aligned`, before a relation, at most six rows.
5. Maps as `f \colon X \to Y`, conditioning with `\mid`. No macros.
6. `\tag` only on displays cited later. Counts of objects are numerals.
7. Logic symbols in prose become words: for every, there exists, implies.

## 6. Interface text

Short, sentence case, no punctuation at the end of labels. Dates as
"16 September 2026", counts as "1,435 words", "3 posts".

## 7. Review of prose

One writer owns the text. Reviewers report defects with line numbers and
the rule broken; they do not supply replacement prose. The writer fixes and
returns the whole text. Never chain several agents polishing the same
sentences.

## 8. Final check

1. `grep -nE '^\s*[-*+] |^\s*[0-9]+[.)] |—|(^|[^-])--([^-]|$)|→|⇒'` on the
   MDX, outside code and mathematics: no hits.
2. `grep -nE '\$[,.;:]'` : no hits (punctuation inside the dollars).
3. Every visual has its numbered caption; every proof its label.
4. `make check-site` passes; the screenshot shows no line that begins with
   punctuation, no label alone on a line, no paragraph longer than eight
   lines.
