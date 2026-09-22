---
author: Jeff Yang
pubDatetime: 2026-09-19T08:00:00.000Z
modDatetime: 2026-09-21T02:09:42.000Z
title: Extracting PowerPoint to Markdown Without Losing a Byte
tags:
  - python
  - markdown
  - pptx
  - ooxml
  - data-extraction
description: "Engineering deep-dive: extracting PowerPoint decks into full-data Markdown — OOXML shape walking, content vs layout chrome vs unrenderable objects, a 5-point losslessness audit, and why the pipeline stays local instead of running in CI."
featured: true
draft: false
---

A small side project called `joey` had a plain requirement: take a folder of old PowerPoint decks and turn each one into a single Markdown file — *all* of it, not a summary. Every bullet, every table cell, every speaker note, every image. The decks are large and some are sensitive, so the whole thing had to run locally, with nothing uploaded. This is the story of the pipeline, but mostly of the audit that makes it trustworthy — and of the design decisions that came *after* the code already worked.

![Blueprint-style infographic of the lossless PPTX-to-Markdown pipeline: the source → extract → audit flow, the three content classes, the five-point audit, and why the work stays local](../../../assets/images/260919-lossless-pptx-extraction.png)

## "All data" is the hard requirement

The easy half of "convert a slide deck to Markdown" is the text. The hard half is everything the word *data* quietly hides: tables with merged cells, speaker notes that never appear on the slide, hyperlinks stored in a sidecar relationship file, embedded images, and the occasional object that has no Markdown equivalent at all. A summarizer would drop all of it without blinking. The requirement forbade that, which meant the first real question was never "how do I convert?" but "how will I *prove* I didn't lose anything?". A conversation about fidelity matters more than a conversation about parsing.

## A .pptx is a zip of XML

A modern `.pptx` is not a binary blob; it is a zip archive of XML parts. Unzip it and you get `ppt/slides/slide1.xml`, `slide2.xml`, and so on, plus `ppt/notesSlides/`, `ppt/media/`, and `_rels/` files that hold the hyperlinks and image references. The extractor walks each slide's shape tree in document order, recursing into groups, and maps OOXML onto Markdown: text runs keep bold, italic, and strike-through; bullet nesting comes from the paragraph indent level; a real `a:tbl` becomes a real Markdown table; speaker notes are copied verbatim. One deck becomes one file, split at a stable, grep-able delimiter that is invisible when rendered:

```markdown
<!-- slide: 07 -->

## Slide 07
```

That delimiter is the page model. Splitting, searching, and diffing all hang off it, so it had to be boring and exact.

None of that XML is parsed by hand. The extractor is built on `python-pptx`, a library that turns the OOXML parts into Python objects — shapes, tables, notes, pictures, hyperlinks — and that library does the reading. What this project adds is the layer above it: the definition of what counts as content, the policy for what is excluded and how that exclusion is disclosed, a deterministic output format, and the audit that proves the result. The parsing is `python-pptx`; the workflow and its guarantees are the work.

## Content, chrome, and the unrenderable

Not everything in a deck deserves to survive into the Markdown, and the interesting engineering is in knowing the difference. There are three classes:

- **Content** — text, tables, notes, content images: extracted.
- **Chrome** — master and layout backgrounds, logos, placeholder text inherited from a layout: shared design furniture rather than slide content, so it is excluded by design. Extracting it would copy the same template across every slide.
- **Unrenderable** — the things Markdown simply cannot represent. One deck carried a 13.2 MB vector diagram, a Windows metafile that no Markdown viewer can render.

Embedding that diagram would have produced a broken image; dropping it silently would have been a lie. So the rule became: skip it, do not embed it, and *always say so in a visible note on that slide*, naming the tag, the type, and the size. A silent exclusion is indistinguishable from data that never existed; an honest note is not.

## The shape of the project: one folder, one skill

The whole project lives in one self-contained folder that can be zipped and handed to someone else, and its layout encodes one rule: regeneration is the normal path. `source/` holds the decks and is never modified; `extracted/` holds the generated Markdown and images; `tools/` holds the scripts. Nothing inside `extracted/` is hand-edited — if something is wrong, you change the source or the tool and regenerate. Output is deterministic: the same input produces byte-identical results, which is exactly what makes a future drift check possible.

```text
joey/
├── source/                     # inputs: the decks (read-only, never modified)
├── extracted/                  # outputs, one unit per deck
│   ├── <deck>.md               #   full-data Markdown
│   ├── <deck>.pdf              #   hand-exported reference (exempt)
│   └── assets/<deck>/sNN-MM.*  #   extracted images
├── tools/
│   ├── extract_pptx.py         #   .pptx → Markdown + images
│   └── audit_pptx.py           #   the five-point losslessness audit
├── .opencode/skills/pptx-extract/SKILL.md   # the procedure + audit
├── AGENTS.md                   # the project's rules
└── README.md
```

There is one deliberate exception, documented rather than hidden. A PDF of a deck was exported by hand from an editor plugin and kept beside its Markdown. It is *not* produced by the tools, so regenerate and rollback do not cover it, and pretending otherwise would have broken the rule that regeneration covers everything. It is allowed, explicitly, as an author-supplied artifact — and nothing else may be hand-placed.

The project also carries a skill, `pptx-extract`, that codifies the entire procedure — preflight, extract, audit, spot-check, report. One skill is the right count because there is exactly one procedure worth codifying; a second would only earn its place as a separate, independently-triggered workflow. It runs on `python-pptx` and encodes the project's specific requirements — full data, visible exclusions, deterministic output, machine-checked losslessness. The workflow becomes reproducible instead of tribal knowledge, and because the skill lives inside the folder, it travels with the project. In practice it is the procedure this folder follows: the same preflight, the same extract command, the same audit — so the workflow does not have to be re-derived each time.

It is available in two places:

- **Published (ClawHub):** [https://clawhub.ai/j3ffyang/skills/pptx-extract](https://clawhub.ai/j3ffyang/skills/pptx-extract)
- **Source (GitHub):** [https://github.com/j3ffyang/ai-thoughts/tree/main/.opencode/skills/pptx-extract](https://github.com/j3ffyang/ai-thoughts/tree/main/.opencode/skills/pptx-extract)

(The published copy is a genericized duplicate kept in the host repository, so its publish pipeline can see it.)

## The audit is the product

It is tempting to treat the converter as the deliverable and the checker as an afterthought. Here it was the opposite. The pipeline ships a five-point audit that runs against the original `.pptx` and the generated files; the first four are hard gates that exit non-zero on failure, and the fifth is reported for review:

1. The number of slide markers in the Markdown equals the slide count in the source.
2. Every media blob in the source is *explained* — either extracted, identified as layout chrome, or identified as a metafile. Anything unexplained fails the run.
3. Every image reference in the Markdown resolves to a real file on disk.
4. Every text string in the slide and notes XML appears in the Markdown.
5. The number of visible "unextractable" notes is reported — not a gate, but a check that none was unexpected.

The second check is the strongest guarantee in the whole system: no image can vanish without a named reason. Together these turn "it looks right" into "it is machine-checked for losslessness", which is a different and much stronger claim — and the only one worth making when the requirement is *all data*.

## Five bugs that only review caught

The output looked plausible long before the tool was trustworthy. Reading the code and the results critically surfaced five defects:

- Image links were written as `<stem>/file.png` instead of `assets/<stem>/file.png`. Every preview showed broken images; reading the generated file caught it, and the reference-resolution check in the audit now guards against a recurrence.
- The deck header carried today's date. Harmless-looking, but it made the output non-deterministic: regenerating the next day would produce a different file, which would quietly break any future "regenerate and diff" drift check. The date had to go.
- The Windows-metafile signature in the audit was wrong. The one real metafile in the corpus happened to be an EMF mislabeled as `.wmf`, so the check passed by luck; a genuine `.wmf` would have been misclassified and failed. Signatures are not a place for approximations.
- The text-completeness check is substring-based, so a very short string (like the digit "4" in a slide-number field) can match somewhere else in the document and pass for the wrong reason. It is a known limitation, and knowing it is better than trusting the check blindly.
- The chart and embedded-object branches reused a variable that only the picture branch defined, so a slide whose first graphic was a chart would have crashed the extractor. No deck in the corpus had charts, so it never fired — a latent crash waiting for the first one.

The lesson generalizes: review the tool, not just its output. The four latent ones hid behind output that otherwise looked right.

## The CI question: why the work stays local

The obvious next step was to automate this in GitHub Actions, and the decisive constraint appeared immediately: CI only sees what git sees, and the sources are roughly 80 MB of confidential binaries. Putting them into git — or making a hosted runner read them — buys a gate a single author processing an occasional batch does not need, at the cost of repository bloat and a real leak surface. So the work stays local, and the automation it calls for is planned, not built yet:

- a runner that extracts and audits every deck;
- a `--check` mode that regenerates into a temporary directory and diffs the result — the local equivalent of a CI verify job;
- an optional pre-commit hook.

The honest cost of no remote is backup: with nothing pushed anywhere, an encrypted copy on external media is the only protection against losing the disk. And there is a second hosting consequence worth naming: the project sits inside a larger host repository but works independently of it, and a skill stored inside it is *not* picked up by that host repository's publishing pipeline — so publishing it took its own deliberate path, a copy placed where that pipeline looks, rather than an assumption. Where knowledge lives determines whether it is useful and how much it costs to maintain.

## What I took away

- The specification did more work than the parser: "all data, no summary" decided the design and the acceptance test, while the OOXML walk itself was routine.
- A vague goal fails quietly: a clever converter with no precise target still produces output that looks right — it just drops notes, tables, and objects where nobody notices.
- The audit, not the converter, is the hard part. "Explain every missing byte or fail" is a far better contract than "it looks right".
- Review the tool, not just its output; latent bugs hide behind plausible results.
- Git is a poor home for large, confidential binaries. Local can be enough, provided backup is treated as part of the design.
- Every silent drop is a future bug. Make exclusions visible, in the document, where a reader will see them.

## A note on the name

`joey` is the first name of a close friend. We ride motorcycles together often — the same two-wheeled thread that runs through this blog — and this project exists because he asked me to take his old decks and do the work properly, with his encouragement along the way. The folder carries his name because the work is his.

![2 bikes](../../../assets/images/260919-2bikes.jpg)

*2 bikes*

btw, i use arch
