# Writing a lecture post

The reader is a student who did not attend the lecture. After reading the post
they know exactly what was defined, stated and proved, and they could
reconstruct every argument. Nothing in the post tells them what anyone thinks
about it.

## Shape

**Opening.** One to three sentences that state the question or the object the
lecture is about, in mathematical terms. When the lecture continues an earlier
one, link to the earlier post at its first mention, with a root-absolute
address such as `/threads/real-and-functional-analysis/lecture-3-outer-measure`.
Do not open with "In this lecture" or "Today".

**Body.** Follow the order of the lecture. Use `##` headings for its main parts
and `###` only when a part is long. A heading names the mathematics, for
example "Carathéodory's criterion", never "Part 2".

**Statements.** Each definition, result, proof, example and remark starts its
own paragraph with a bold run-in label:

```
**Definition 2.3 (Outer measure).** For $A \subseteq \mathbb{R}$ ...

**Theorem 2.5.** Let $(f_n)$ be ...

**Proof (complete).** ... which is the claim. $\blacksquare$

**Remark.** ...

**Example.** ...
```

Keep the professor's numbering. When the notes number nothing, use one counter
for all numbered statements in the post: Definition 1, Lemma 2, Theorem 3.

**Proof labels.** Every proof says what the lecture gave.

1. `**Proof (complete).**` when the lecture gives the whole argument. Implicit
   steps made explicit stay inside it.
2. `**Proof (sketch).**` when the lecture marks the proof as a sketch or gives
   only its key step. It contains the lecture's steps and nothing else. The
   verifications that complete the argument follow in a paragraph that starts
   with `**Details.**` and ends with $\blacksquare$, so the reader sees which
   part is the lecture's sketch and which part completes it.
3. A statement the lecture gives without any argument gets no proof label.
   A one-sentence check may follow it, starting with "Indeed".
4. A justification the post adds, including a reason for a claim inside a
   statement or a step inside a complete proof, goes in its own sentence
   starting with "Indeed", never in a "since" clause of the lecture's sentence.
   Keep the lecture's order of steps and put the added sentence right after
   the step it justifies. The reader then tells the lecture's words from the
   added reasoning.

**No lists.** The site does not use bullet or numbered lists. Write properties
as sentences, as a displayed formula with `aligned`, or as consecutive
paragraphs with run-in labels such as `**(i)**`, `**(ii)**`.

**Ending.** The post ends with the last item of the lecture. No summary, no
conclusion, no look ahead to the next lecture.

## Expanding the shorthand

Professors compress. The post decompresses without changing the mathematics.

1. **Abbreviations become words.** Write "almost everywhere", not "a.e." or
   "q.o.". A long name used many times, such as "continuous-time Markov
   chain", may get an acronym in parentheses at its first use.
2. **Logic symbols in prose become words.** For every, there exists, implies,
   hence, if and only if, such that, with respect to. Quantifiers may stay
   inside a displayed formal statement. A sentence never begins with a symbol.
3. **Named results are named in full, and their hypotheses are checked.** "By
   DCT" becomes "by the dominated convergence theorem. Indeed, $|f_n| \le g$
   for every $n$ and $g \in L^1$." The check is added reasoning, so it takes
   its own "Indeed" sentence, as the proof labels below require.
4. **Implicit steps become explicit** when a careful reader would stop there:
   a change of variables, an inequality used silently, the case that "is
   similar". Do not add steps that change the proof's strategy.
5. **Ambiguous shorthand is resolved from context or left out.** "MC" may mean
   Markov chain or Monte Carlo, "SD" standard deviation or stationary
   distribution. When the context does not decide, the passage goes into the
   report, not into the post.

Common shorthand in the two courses, English and Italian:

| Shorthand | Expansion |
|---|---|
| a.e., q.o. | almost everywhere |
| a.s., q.c. | almost surely |
| s.t., t.c. | such that |
| w.r.t. | with respect to |
| iff, sse | if and only if |
| wlog, w.l.o.g., ssg | without loss of generality |
| TFAE | the following are equivalent |
| WTS | we want to show |
| LHS, RHS | left-hand side, right-hand side |
| MCT, TCM, Beppo Levi | monotone convergence theorem |
| DCT, TCD | dominated convergence theorem |
| FL | Fatou's lemma |
| u.i. | uniformly integrable |
| meas., mis. | measurable |
| σ-alg | σ-algebra |
| seq, succ. | sequence |
| subseq, sottosucc. | subsequence |
| pw, punt., ptw | pointwise |
| unif. | uniformly |
| cpt | compact |
| nbhd, int. | neighbourhood |
| lsc, usc | lower, upper semicontinuous |
| ONB, BON | orthonormal basis |
| r.v., v.a. | random variable |
| i.i.d. | independent and identically distributed |
| MC, CM | Markov chain, only when the context says so |
| DTMC, CTMC | discrete-time, continuous-time Markov chain |
| t.p.m., P | transition probability matrix |
| irr., aper. | irreducible, aperiodic |
| rec., trans., pos. rec. | recurrent, transient, positive recurrent |
| w.p., con prob. | with probability |
| CK | Chapman–Kolmogorov equations |
| SMP | strong Markov property |
| LLN, SLLN, CLT | law of large numbers, strong law, central limit theorem |
| PP | Poisson process |
| BM | Brownian motion |
| pdf, pmf, cdf | probability density, mass, distribution function |
| thm, prop, lem, cor | theorem, proposition, lemma, corollary |
| def, oss, es, dim | definition, remark, example, proof |
| cvd, qed, □ | end of proof, rendered as $\blacksquare$ |

The table is a starting point. Expand any other shorthand the same way.

## Rigour

1. Every symbol is introduced before it is used, with its domain: "Let
   $(X, \mathcal{A}, \mu)$ be a measure space", "Let $(X_n)_{n \ge 0}$ be a
   Markov chain on a countable state space $S$".
2. Every result states all its hypotheses: measurability, integrability,
   finiteness or σ-finiteness of the measure, homogeneity of the chain,
   countability of the state space, the range of $p$.
3. Every limit says its mode: pointwise, uniformly, almost everywhere, in
   $L^p$, in measure, almost surely, in probability, in distribution.
4. Index ranges and conventions are stated once when they matter, for example
   whether $\mathbb{N}$ contains $0$.
5. A counterexample in the notes is checked before it is written.

## Harmony

1. Prose carries the logic, displays carry the computation. Display a formula
   that is longer than about half a line or that is referred to later.
2. Connect steps with words: since, hence, therefore, so, it follows that.
   Vary them.
3. Write "we" for the argument: we show, we obtain. Never "I".
4. Do not write clearly, obviously, trivially or of course. They hide a step
   or judge it.
5. Present tense. Paragraphs of two to six sentences.
6. Put a defined term in italics where it is defined: `*outer measure*`.
7. Before a long proof one sentence may list its steps, when it only names
   what follows.

Shorthand copied as it is:

```
f_n → f q.o., |f_n| ≤ g ∈ L^1 ⟹ ∫f_n → ∫f (TCD)
```

The same content in the post:

```
Let $(f_n)$ be measurable functions with $f_n \to f$ almost everywhere, and
suppose there is $g \in L^1$ with $|f_n| \le g$ for every $n$. Then
$f \in L^1$ and $\int f_n \, d\mu \to \int f \, d\mu$ by the dominated
convergence theorem.
```

A sentence that never enters a post: "This beautiful result, which the
professor stressed several times, will be crucial for the exam."

## Site rules

From `content/README.md`: no bullet points, no arrows, no em
dashes and no double hyphens in prose. Arrows inside mathematics are fine, as
in $f_n \to f$. A complex concept may link to Wikipedia once, at its first
appearance.

## MDX and KaTeX

1. Inline mathematics between `$`, displayed mathematics between `$$` lines
   with a blank line before and after.
2. Outside mathematics, `{`, `}`, `<` and `>` are MDX syntax. Keep them inside
   mathematics.
3. In the frontmatter, write a string that contains a backslash between single
   quotes: `summary: 'For $1 \le p < \infty$ ...'`. A double-quoted YAML
   string breaks on `\l`. Double an apostrophe inside single quotes: `Fatou''s
   lemma`.
4. Use `aligned`, `cases`, `pmatrix` and `array` inside `$$`. `\tag{1}` works
   in a display. Cross references do not: write "by (1)" by hand.
5. Do not define macros. Write `\mathbf{1}_A` for an indicator.
6. Mathematics in a heading or in the title is fine.
