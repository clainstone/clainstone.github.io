# Style sheet for lecture posts

Binding for every lecture post. MUST and NEVER are literal. Where this file
differs from `WRITING.md`, `VISUALS.md` or the body of `SKILL.md`, **this file
wins**; section 9 lists the differences. Read it after `WRITING.md` and before
writing a line.

"The source" means the file or files Alessandro named for the task, including
his own annotations on them, and nothing else.

## 1. Fidelity to the source

This section outranks every other rule in this file and in the skill.

1. Every statement, example, number, name, date, application, historical remark
   and claim in the post MUST be traceable to a page of the source. The working
   map records the page for each item of the post.
2. NEVER add from your own knowledge: a result, an example, a counterexample, a
   special case, an application, a name, a date, a fact "everyone knows", an
   opinion. If the slide says "near the centre", the post does not say "the
   sixteen central squares".
3. NEVER replace the data of a source example (a sequence, a matrix, a
   parameter) with your own. If the source's data looks wrong, rule 7 applies.
4. Expansion is allowed only to make the source's own argument explicit:
   a. words for shorthand;
   b. a step the source's proof uses silently;
   c. a hypothesis without which a source statement is false (add it inside
      the statement, list it in the report);
   d. a check the source announces ("one checks that…").
5. Every sentence of added reasoning is marked (section 7.4) and rationed:
   at most **2 marked sentences per step of the source**. A verification that
   needs more goes in the report, not in the post: NEVER a `**Details.**`
   paragraph unless the user asks for one for that proof. A claim the source
   states without proof gets no proof: at most the 2 marked sentences.
   Write an added sentence only when a careful reader would stop at that step
   without it. NEVER write one that:
   a. restates the step, the display above it or the plan of the proof;
   b. checks a hypothesis of a cited result that the reader sees at once
      (measurable because continuous, integrable because bounded on a set of
      finite measure);
   c. covers only part of the claim (one case of two, finite values when the
      claim also allows $+\infty$): a partial reason misleads;
   d. proves a fact the source calls obvious, clear or easy to show.
6. Keep the source's order, its section headings, its kinds of label (a Remark
   stays a Remark, a Note a Note; an unlabelled paragraph gets no label), its
   numbering and its notation. A bibliographic pointer in the source ("[Folland]")
   is kept, in parentheses, in the first sentence of its part. The only
   reordering allowed moves a notation or a definition before its first use.
7. A slip in the source (wrong index, wrong year, impossible value) is corrected
   only when the source itself or plain arithmetic proves it, and EVERY
   correction is listed in the report with page and original text. Anything
   else that looks wrong stays out and goes in the report.
8. Use only the pages that belong to the lecture. Name them in the working map
   (for example "slides p01–p04, §1.1–§1.6") and NEVER draw on later pages.
9. Visuals obey rules 1–3 without exception: section 6.2.

## 2. Page and width

1. The site is desktop only; phones are not supported (Alessandro,
   21 September 2026). NEVER split, shorten or rearrange a formula, a figure
   or a paragraph for a narrow screen.
   A post's text column is 40rem (760 px) of 19 px Source Serif 4 at leading
   1.55, about 80 characters of prose per line. NEVER try to change these
   values, and NEVER edit a style, layout or toolkit file.
2. Character counts taken from `textContent` are wrong on this site (KaTeX
   writes each formula twice). Judge the measure from the screenshots.
3. Display mathematics stays in the 760 px text column.
4. A visual MAY use the wide track (48rem, 912 px) when it sets two
   representations side by side (graph and matrix) or carries seven or more
   labels on one axis: wrap it as
   `<div class="wide"><Name client:visible /></div>`. Everything else stays in
   the column. `narrowRatio` is not needed.

## 3. Paragraphs and line breaks

1. One paragraph is one line of MDX source. NEVER hard-wrap prose. The only
   newline inside a paragraph is a hard break (`\` at the end of the line)
   before an item label.
2. Paragraphs of prose have 2 to 6 sentences and at most 8 lines at 1280 px. A sentence has at most 40 words and at most 3 inline
   formulas that contain a relation.
3. A one-sentence paragraph is allowed only as a labelled statement, a lead-in
   to a display, or a caption. At 1280 px at most 10 % of paragraphs are one
   line long.
4. A label NEVER stands alone on a line. When the source gives no stem
   sentence, item (i) follows the label on the same line.
5. The items of a statement are lines of the same paragraph as the statement,
   joined by hard breaks:

   ```
   **Definition 10 (Topology).** Let $X$ be a set. A *topology* on $X$ is … with the following properties.\
   **(i)** The sets $\emptyset$ and $X$ belong to $\tau.$\
   **(ii)** …
   ```

   An item that contains a display is its own paragraph.
6. Three or more parallel equations in running text (rules of arithmetic, a
   list of generators) MUST become one `aligned` display.

## 4. Statements and numbering

1. Labels are bold run-in, in this exact form: `**Kind n (Name).**`,
   `**Kind n.**`, `**Kind (Name).**`. Kinds: Definition, Theorem, Proposition,
   Lemma, Corollary, Remark, Note, Example, Notation. The kind is the source's.
2. When the source numbers its statements, keep its numbers; its unnumbered
   items stay unnumbered and MUST carry a name. When the source numbers
   nothing, ONE counter runs through every Definition, Theorem, Proposition,
   Lemma, Corollary, Remark, Note and Example of the post. Notation, Proof,
   Details and Figure do not take it. Figures have their own counter.
   In a thread with an index (its file in `content/threads/` has
   `index: true`, as Real and Functional Analysis), the thread has one
   numbering: every number of the post of lecture N is `N.k`, with N the
   post's `lecture` field (the number on the notes, "XVI" is 16) and k the
   counter above: `**Theorem 16.5 (Name).**`, `**Figure 16.2.**`,
   `\tag{16.1}`. The counters still start at 1 in every post.
3. A name in parentheses is given when the source names the statement or the
   statement defines a named term; otherwise none. The name is the source's
   own words ("Obvious implications" stays whole), NEVER a name of yours.
4. Item labels `**(i)**`, `**(ii)**` are bold only inside a statement. In
   proofs and references they are plain: "by (ii)". "Case 1." is plain.
5. Bold is used for labels and for nothing else. Italics are used once per
   term, where the term is defined, and for nothing else. A defined term is
   NEVER a link. Notation is mathematics: `$\mathrm{Markov}(\lambda, P)$`, not
   `*Markov*$(\lambda, P)$`.
6. A definition is NEVER placed inside the statement of a theorem or lemma.
7. An example or remark longer than one paragraph owns its section, and the
   heading names it. Otherwise it is one paragraph.
8. Proofs: `**Proof (complete).**` or `**Proof (sketch).**`, as in
   `WRITING.md`, with no `**Details.**` paragraph (1.5). The end mark is a separate
   `$\blacksquare$` after a normal space at the end of the last sentence,
   NEVER inside another formula. After a final display: `\tag*{$\blacksquare$}`.
9. Headings: `##` for the parts the source itself marks, in the source's words,
   sentence case; `###` inside them; NEVER more `##` than the source has
   parts. A heading NEVER begins with mathematics and holds at most one
   formula.
10. Links: only to Wikipedia, only for a named result the source states
    without proof or a named concept the source uses without defining, once,
    at first appearance, never inside a label. Nothing else is linked by
    hand: cross-references (4.11) are made by the build.
11. Cross-references. Every mention of a numbered statement, figure or
    equation becomes, at build time, a link to the place that states it, in
    the same post or in another post of the thread. The writer only names it
    in the canonical form:
    a. a statement by its kind and number as in its label: "Theorem 3.5",
       "Remark 5 (ii)", "Examples 2.1 and 2.5", "Corollaries 3.7 and 3.8";
    b. a figure as "Figure n", only in its own post;
    c. an equation by its tag in parentheses, "(6)" or `${(6),}$`, and only a
       display with `\tag{6}` can be cited so;
    d. in a thread with an index (4.2), an item of another post by its number
       alone, which names its lecture: "Theorem 13.19", "Remark 15.13 (i)",
       with no qualifier. In any other thread, an item of another post ALWAYS
       with a qualifier right after the mention (or after a list of
       mentions, which it then qualifies as a whole): "of the previous post",
       "of the next post", "of the first post" … "of the tenth post". An
       unqualified mention that resolves today because only one other post
       has that number breaks when a later post adds the same number. The
       build knows the ordinals up to "tenth" only: for a later post use
       "previous" or "next", or reword so that no number is cited.
    The mention resolves in this post first, then in the post the qualifier
    names, then in the only other post of the thread that has it. NEVER write
    a cross-reference as a Markdown link. A mention with no target (a removed
    theorem, a wrong number) fails `make check-post`: correct the number or
    the qualifier, or reword so that no number is cited.
    f. Cite an earlier statement only where the source uses or recalls it
       ("by Thm", "recall", "as we saw", "Ex last week"), or inside an added
       sentence that 1.5 allows. NEVER add a sentence, a clause or an "in the
       sense of Definition n" only to place a link: a mention is not a reason
       to keep a sentence.
    e. Resting the pointer on a mention shows a preview of its target: the
       statement from its label to the first heading, figure, paragraph with
       a bold label (the proof, a caption, the next statement) or paragraph
       that names the statement; a figure with its caption; a display with
       the last two lines of the paragraph that leads into it. The proof is
       never shown. So the items and continuation paragraphs of a statement
       follow its label directly, with no figure between them, and a
       paragraph of commentary right after a statement opens by naming it
       ("By Definition 3.1, ..."). `make check-post` prints where each
       preview ends. Removing or moving a figure can let a preview run on
       into the next paragraphs: end it again with a heading or by naming
       the statement in the paragraph that follows, never with an added
       figure.

12. Index descriptions. In a thread with an index, the panel of the thread
    lists every statement with its name, and a statement without a name with
    a short description from the frontmatter field `index`, keyed by its
    label, in single quotes:

    ```
    index:
      Remark 16.4: 'For $\alpha = 0$ the hyperplane is $\operatorname{Ker} T$'
      Example 16.18: 'Indicators of $[m, m+1]$ converge weakly but not strongly to $0$ in $L^2$'
    ```

    One line for each statement without a name and none for a named one.
    The line says what the statement establishes, defines or shows, from the
    post alone: at most about 12 words (the check stops at 95 characters as
    read), sentence case, no full stop, no evaluative word, no bullet, arrow
    outside mathematics, em dash or double hyphen. Mathematics between `$`,
    in the post's notation, no Markdown (links, emphasis). A single quote
    inside is doubled: `$f''$`. `make check-post` reports a missing, extra,
    long or malformed description and a name in a label that holds Markdown.

## 5. Mathematics

1. Punctuation that follows inline mathematics goes INSIDE the dollars:
   `${\#X \le \#Y,}$` or `$\tau.$`. Always, single symbols included. (Outside,
   the browser can start the next line with the comma.) A colon is written
   `{:}` (`$\overline{\mathbb{R}}{:}$`), otherwise it is spaced as a relation.
2. An inline formula NEVER breaks across lines. If it contains a relation or a
   binary operator, wrap its body in one brace group: `${j \neq i}$`.
3. Inline budget: at most about 45 rendered characters (the site's CSS never
   breaks an inline formula, so a longer one leaves a hole at the end of the
   line), no big operator with limits, no stacked fraction with symbols (write
   `\beta/(\alpha+\beta)`; numeric `\frac12` is fine). Over budget means
   display. A long expression needed repeatedly is displayed once, tagged, and
   referred to by its tag.
4. Maps are `f \colon X \to Y`. Conditioning is `\mid`. Set-builder is
   `\{ x \in X \colon \dots \}` or ` : ` consistently within a thread.
5. Every display fits the 760 px column without scrolling, and is laid out
   as in the source: a formula the source writes on one line stays on one
   line, a chain the source writes on several lines keeps its lines. Break a
   formula only when it does not fit 760 px.
6. Breaking a display, when it must: `aligned`; break BEFORE a relation and
   align relations with `&`, or put the left-hand side alone on the first line
   and start each following line with `\quad =`; break before a binary
   operator and indent `\quad`; one implication per line; NEVER break inside a
   conditional probability, a fraction, a subscript, or between a function and
   its argument. At most 6 rows.
7. `\tag` only on displays cited later. Displays end with their punctuation.
8. In a canvas, variables are italic and use the source's letters.
9. Sentences added by you use the thread's declared symbols (`\subset` in Real
   and Functional Analysis), never a variant.
10. Counts of mathematical objects are numerals: 7 states, 11 positions.
11. Nested bars and norms are written so that they read one way only:
    `\bigl|\, \|x\| - \|y\| \,\bigr|`, `\bigl\|\, |f_n| \,\bigr\|_p`, never
    `||x\| - \|y||` or `\big\| |f| \big\|`.
12. Delimiters are as tall as what they enclose: around a sum, an integral,
    a union or a fraction with limits or subscripts use `\left … \right` or
    `\biggl … \biggr`, and an outer pair is larger than the inner one.
13. No stacked fraction in a subscript or an exponent: `5^{-1/n}`,
    `B_{1/2}`, `\chi_{[0, 1/m]}`.
14. A thin space `\,` between factors that would touch: `m \, \chi_A`,
    `p_{ij} \, \mathbb{E}_j[V]`, `x^{a} \, x^{b}`. Absolute values of a named
    function are `\lvert \sin x \rvert`, which keeps the bar next to the
    function name. A minus that opens a cell of `aligned` is grouped,
    `{-\tfrac{1}{3}}`, or it is spaced as a binary operator.
15. Named operators are `\operatorname{card}`, never `\mathrm{card}`. A word
    that begins with a symbol and a hyphen ("σ-algebra") can break at the
    hyphen: when the screenshot shows a line that starts with "-", join it
    with a word joiner, `$\sigma$&#8288;-additivity`.

## 6. Visuals

### 6.1 Which figures (before writing)

A figure earns its place in one of two ways, and in no other:

1. **The source draws it.** Every drawing of the source is reproduced
   (never the scan itself): MANDATORY.
2. **It shows a non-trivial construction or step of the lecture** that the
   text alone makes hard to see: a set built by a limiting construction, a
   sequence of functions that converges in one sense and not in another, a
   simulation rule the lecture defines. Say in the working map why the text
   alone does not show it.

A figure is trivial, and NEVER built, when it:

1. shows what the reader sees at once from the formula: a vector sum for the
   triangle inequality, a ball, an interval on a line, two points on a number
   line, a rectangle, the graph of a standard function or distribution;
2. repeats a formula, an identity or a computed value as a picture: Venn
   diagrams of a set identity, bars of a closed formula, a plot of a limit
   the text states, a numerical check of a result;
3. draws an instance with invented data that adds nothing, or an example of
   another lecture (a chain, a matrix, a walk the source does not use here);
4. decorates: nested ovals for a chain of inclusions, arrows between sets.

Write the candidates in the working map: page, item, figure, built or reason
dropped. No figure is a valid outcome for a lecture that draws nothing.

### 6.2 Fidelity filter (in this order)

1. The object, example or construction is on a named page of the source.
2. Parameters, labels and numbers are the source's. When the source is general,
   use the smallest instance that draws, only if the source licenses such
   instances, and say "an instance" in the caption.
3. The visual asserts nothing the source does not assert and NEVER supplies a
   construction, enumeration, counterexample or proof the source omits.
   (If the notes say $\#\mathbb{N} = \#\mathbb{Q}$ with no bijection, there is
   no zig-zag picture.)
4. Interactive only when the reader's choice is the point: a parameter the
   lecture varies, a step of a construction, an $n$ that grows. Otherwise
   static SVG, no `client:` directive.

More visuals NEVER means more content, and there is no minimum number.

### 6.3 Files

Every `.svelte` and `.js` file in the post folder is reached from
`index.mdx` through its imports. A figure that is dropped takes its
component and the helpers only it used with it; `make check-post` warns
about a file the page does not reach.

### 6.4 Presentation

1. Each visual is followed immediately by a caption paragraph:
   `**Figure n.** What is drawn. What the controls change. (An instance, if so.)`
   At most 3 sentences, no claim beyond the source, no reasoning and no
   restatement of the statement it illustrates. The text before it refers
   to "Figure n", never to "the figure".
2. A sentence that only points at a figure ("Figure 2 draws these values.")
   is not written: the mention goes in a sentence the post needs anyway.
3. Build rules are those of `VISUALS.md` (toolkit, palette, seeded randomness,
   60–180 lines, accessibility label).

## 7. Flow

1. Opening: one sentence, the source's own opening line or a plain sentence
   that names the object of the lecture. It does not pre-state a definition
   the post gives later, it is not a summary of the parts, and it invents no
   question or motivation.
2. Each part opens with the source's own motivation when the source has one
   (its "Idea:", its question heading), rewritten as a full sentence with a
   real verb. When the source has none, the part opens directly with its
   first item. No transition is invented, and no part (an Exercises part
   included) opens with a sentence that says what it will do or which
   results it uses.
3. Say each thing once. When the source repeats itself (slide text plus
   annotation), merge. A caveat or convention is stated once, where it first
   matters.
4. Markers for added reasoning: "Indeed,", "To see this,", "In detail,". At
   most one marker per paragraph; two consecutive paragraphs NEVER both open
   with a marker; at most 1 marker per 150 words over the post.
5. NEVER write about the text ("the questions below", "the following standard
   definitions", a forward pointer such as "its topology is given in Example
   16"). NEVER open a sentence with "But" or "So" twice in a section.
   NEVER remind the reader of the notation of earlier posts ("As in the
   previous posts, …") unless the post uses a symbol it never defines; then
   one sentence defines it.
6. A check that uses a result is placed after that result.
7. The post ends on the last item of the source, in the source's words made
   explicit, not on added reasoning.

## 8. Final checklist

Run every line; fix or justify in the report.

1. Working map lists the source pages used; every numbered statement, example,
   number, name and date of the post has a page. Nothing from later pages.
2. Report lists every added hypothesis, every corrected slip, every dropped
   visual candidate, every passage left out.
3. Search the MDX for `$,` `$.` `$;` `$:` : zero hits (5.1).
4. Search for ` : X`, `f :`, `F :` inside mathematics: zero hits (5.4).
5. Search for `*$(`, `**Proof.**`, `**Case`, a line that is only a bold label:
   zero hits.
6. Every `**Example` / `**Remark` follows 4.2; labels have the source's kind.
7. Count markers (7.4) and links (4.10).
8. `make check-post POST=<thread>/<slug>` passes. It fails on a display that
   scrolls, on an inline formula split across two lines, at 1280 px, and on
   a cross-reference with no target (4.11).
9. Look at the whole 1280 px screenshot: no line begins with a punctuation
   mark, no label alone, no paragraph over 8 lines, no display broken where the
   source keeps one line, no ambiguous bars or undersized delimiters (5.11,
   5.12), every visual drawn and captioned.
10. Every source drawing reproduced; every other figure passes 6.1; no file
    of the post folder left unused (6.3).
11. First and last paragraph reread against 7.1 and 7.7. Every marked
    sentence reread against 1.5: is the gap real, and does the sentence
    cover the whole claim?
12. In a thread with an index: `lecture` is set, every label reads `N.k`,
    and every statement without a name has its line in `index` (4.12);
    `make check-post` reports what is missing.
13. `make verify-post POST=<thread>/<slug> SRC=<source> PAGES=<pages>` ends
    with `VERDICT: OK`, or every open finding is in the report with the reason
    the post is right (`SKILL.md`, step 8).
14. The `preview` lines of `make check-post`: each statement's preview ends
    where the source's statement ends (4.11 e).

## 9. Precedence over the older rules

1. `VISUALS.md`: which figures to build is decided by 6.1 and 6.2 alone.
2. `VISUALS.md` rule 9, words "before or after": a numbered caption after (6.4).
3. `WRITING.md`, proof label 4 ("Indeed") and proof label 3 ("one-sentence
   check"): replaced by 1.5 and 7.4.
4. `WRITING.md` and `content/README.md`, Wikipedia links: restricted by 4.10.
5. `WRITING.md`, "`##` for main parts and `###` only when a part is long":
   replaced by 4.9. "Keep the professor's numbering… one counter": completed
   by 4.2 (examples and remarks take the counter).
6. `WRITING.md`, Harmony 1 ("display a formula longer than about half a
   line"): replaced by 5.3 and 5.5. MDX rule 1 is completed by 5.1 and 5.2.
7. `SKILL.md` rule 5 (Rigour): rigour NEVER licenses content. It is bounded by
   1.4 and 1.5; what exceeds them goes in the report.
8. `SKILL.md` rule 1, "unless a small reordering makes a proof readable":
   narrowed to 1.6.
9. Every mention of 390 px, of phones and of `narrowRatio` in `SKILL.md`,
   `VISUALS.md` and `WRITING.md` is void: the site is desktop only (2.1).
