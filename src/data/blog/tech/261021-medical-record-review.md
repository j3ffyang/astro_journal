---
author: Jeff Yang
pubDatetime: 2026-10-27T07:54:55.000Z
title: "Health Records an Agent Can Audit"
tags:
  - ai
  - medical
  - health-records
  - skill
  - agent
description: "A two-layer skill for AI-assisted review of personal and family medical records: a generic procedure, project-local facts, and no clinical authority."
featured: false
draft: false
---

*A two-layer skill for AI-assisted review of personal and family medical records: a generic procedure, project-local facts, and no clinical authority.*

**Source:** the [`medical-record-review`](https://github.com/j3ffyang/ai-thoughts/blob/main/.opencode/skills/medical-record-review/SKILL.md) skill, first extracted on 21 October 2026 and updated to version 1.5.3 on 27 October 2026, from a private record set that had accumulated several years of lab rounds, prescriptions, imaging, and conflicts. The skill is the how; this article is the why.

**Thesis:** the value of an agent in this domain is not cleverer analysis. It is a procedure that **refuses to guess** — one that stops on conflict, cites what it used, separates record from inference, and cannot silently rewrite a data row.

**Verdict:** the evidence discipline transfers, the clinical judgement does not. The clinician's judgement wins; the skill only structures the evidence. Ship the procedure, keep the facts local, and label the output loudly enough that nobody mistakes it for a doctor.

> ⚠️ **Disclaimer.** This is a practice of AI × medical combination, not a medical device and not official medical advice, diagnosis, prescription, or treatment decision. The author assumes no liability for consequences of use or misuse. Read the full statement at the top of the skill before adopting it.

![Infographic: a two-layer medical-record review skill — the AGENTS.md → project-layer skill → generic skill authority chain, the ten rules, the four phases with their safety rails, what the skill refuses to do, and the verdict that the evidence discipline transfers while the clinical judgement does not](../../../assets/images/261021-medical-record-review.png)

## Why a procedure, not a prompt

Medical records do not arrive as a clean dataset. They arrive as a pile of PDFs from several institutions over many years, many of them scans, with the same metric printed under three abbreviations and two units. The interesting failures are not "the model did not know LDL matters". They are: the model read the wrong row, averaged two institutions that report different reference ranges, or quietly "corrected" a number that looked wrong.

Each of those failure modes has a fix, and none of the fixes is a better prompt. They are a conflict protocol, an append-only rule, a change gate, and evidence grading. That is what this skill is.

There is a second constraint. These records are the most sensitive files a person owns, and a hosted model means every file read is a file transmitted, irreversibly. So before the first record is read, an egress pre-check decides whether to work at all — not an analysis technique.

## Two layers, one authority chain

The skill is split because the procedure and the local facts change at different rates.

```
AGENTS.md (AUTHORITY)         ← project constitution: privacy, egress, evidence standard
  └─ project-layer skill      ← configuration, precedent table, language conventions
       └─ generic skill       ← procedure only, no patient data, no patient paths
```

- **The generic layer** holds the workflow: intake, profile, registry, comparison, conflict protocol, evidence grading, output skeleton, merge and rename, compression, and a Traditional Chinese Medicine (TCM) sub-flow. It carries no patient values, no patient paths, no names — that is what makes it publishable.
- **The project layer** holds what is true only for one record set: the nine config keys, whether in the project layer or in the `AGENTS.md` section that `AUTHORITY` names; the language conventions; and a **precedent table** of real mistakes and their rulings.
- **`AGENTS.md` outranks both.** It is whatever rules file `AUTHORITY` names — usually the adopting project's own `AGENTS.md`, and never an active authority file this procedure ships. A patient-free starter ships beside the skill as [`references/AGENTS.example.md`](https://github.com/j3ffyang/ai-thoughts/blob/main/.opencode/skills/medical-record-review/references/AGENTS.example.md); copy it, or point `AUTHORITY` at a rules file your agent already loads. The generic layer points at it for privacy and egress instead of restating them, because a restated rule drifts from its source.

The split was also forced by a concrete failure. Before it, the generic skill, once specialized for the project, had patient demographics hard-coded into an analysis rule — violating its own "no patient data" clause. Genericising a rule forced the anchor out of the procedure and into configuration, which is where it belonged.

## The rules that carry the weight

Ten rules do most of the work. Each one is anchored to an incident or a review finding, not to good taste. Two of them arrived during the review of this skill: one when an old analysis line could no longer be traced back to the model that wrote it, and one when a derived score could not be reproduced.

| Rule | What it forbids |
|---|---|
| **Append-only data rows** | Editing a historical value in place. A wrong row goes through the conflict protocol instead |
| **Conflict protocol** | Silently picking one of two versions. Stop, name both, classify, hand it to the user |
| **Change gate** | Any change to an existing data row without "old value → new value + basis" and a human yes |
| **Exemption scope** | A user waiver covering data rows. It covers process notes and analysis lines only |
| **Evidence five** | Claims that fail safety, factuality, verifiability, specificity, or credibility. They drop to `low-confidence` and route to clinician review |
| **Applicability** | Borrowing a general-population range as a target for someone with long-standing disease |
| **Attribution timeline** | Blaming a new drug for a symptom that started during a gap in medication |
| **Single copy** | A second copy of a derived view, or the same fact restated in prose, a table, and a matrix. Copies drift, and drift is how two values for the same day entered the record |
| **Derived-value arithmetic** | A calculated eGFR or index shown without its formula, inputs, and unit — a silent miscalculation is harder to catch than a wrong measurement |
| **Provenance stamp** | An analysis block with no `model · date · skill version` line, which makes it impossible to re-judge years later |

Two of these are unusual enough to spell out. **Exemption scope** exists because "let me clean this up" and "let me fix this number" arrive in the same sentence and deserve different answers. **Attribution timeline** exists because the most convincing wrong conclusion in the whole record was a symptom attributed to a new treatment that began weeks after the patient had already stopped the previous one.

The workflow itself is mapped in four phases — ingest, analyse, output, maintain — with a fast-path table beside it. A thirty-second answer may skip ASCII trends, re-reading the entire registry, and optional modules. It may never skip the egress check, the conflict gate, the evidence grading, the one-folder-per-person rule, or the ban on editing a data row.

## What the skill refuses to do

- Diagnose, assign a disease subtype, prescribe, or adjust a dose.
- Complete a gap by inference. Missing means missing, and it is named.
- Subtract across institutions, or merge their trends.
- Bulk-replace a filename string across files. A bulk replace once rewrote a historical log line, which is precisely what logs exist to prevent.
- Cite a line number as a location. Section heading plus item name only; line numbers drift. Finding a line with `grep -n` is a different act.
- Claim the analysis is official, or claim a review that did not happen. Every output is a draft that may be confidently wrong, and no "verified" or "approved" label attaches without a named clinician who read it.

## Adopting it

You need two things before you start: an agent that loads skills from a directory and can read and write files on the machine, and a rules file for it to read. The procedure assumes little beyond that.

**Start in a folder that holds nothing else.** No code, no unrelated notes, no second project — apart from the agent's own skills directory, which is infrastructure, not project content. Put the rules file at its root and the records under it. A mixed folder fails three ways: the agent reads files it should never see, the registry absorbs documents that are not records, and another project's instructions compete with the privacy rules you just wrote. Keep the folder out of any repository that pushes, or ignore the record directories and the profile directory in git.

1. **Copy the generic skill** unchanged into the directory your agent loads skills from — for OpenCode, `<project>/.opencode/skills/medical-record-review/SKILL.md`. Do not edit the procedure to fit your records; that is what the project layer is for.
2. **Start from the rules template.** Copy [`references/AGENTS.example.md`](https://github.com/j3ffyang/ai-thoughts/blob/main/.opencode/skills/medical-record-review/references/AGENTS.example.md), which ships beside `SKILL.md`, to `<project>/AGENTS.md` if none exists; otherwise add the missing sections to the existing file. Fill it in this order:
   - **Set the nine keys first.** `AUTHORITY` points at this file. `PROFILE` names the profile file. `DOCS_DIR` and `IMGS_DIR` name the record folder and the scan folder. `REGISTRY` names the trend registry, created on the first run. `INDEX` / `INDEX_CMD` name the index and its generator; with no generator, mark the index `hand-maintained: true`. `LANG` sets the writing language. `MODULES` enables analysis modules; start with `western`. `UNWRAP_CMD` is optional. A required key left unresolved means stop, not default; set the optional keys explicitly too, because the skill's table defaults `DOCS_DIR` to `docs/`, which may be a mixed folder.
   - **Point the profile away from the rules.** The template carries rules and configuration only. Age, sex, diagnosis and duration, medication with dosing times, and measurement conditions go in the file that `PROFILE` names.
   - **Keep the five rule sections intact.** Privacy, egress, evidence, measurement conditions, and data-change are the reason the skill can run at all. Do not trim them to save space.
   - **Run the completeness check.** The template ends with five items. Fix any failure before the first record is read.
   - **Never create a second rules file.** If the project already has `AGENTS.md` or a `CLAUDE.md` equivalent, point `AUTHORITY` at it and add the missing sections instead. Two rule files drift, and drift is what this skill exists to prevent.
3. **Write a profile.** Age, sex, diagnosis and duration, medication with dosing times, measurement conditions for weight, and two or three things this person actually cares about. Cite a source record for every value. Keep it free of names.
4. **Start a precedent table.** Three columns: what happened, what to do next time, where it came from. Check for an existing rule first; fold the precedent into that rule rather than duplicate it. This is the part that compounds.
5. **Run it once and let it stop.** The first real conflict is the test: if the agent reports it instead of resolving it, the skill is working.

For a family, the rule is one folder per person. Configuration and profile are injected per folder, and folders never reference each other. Cross-person comparison is out of scope for this procedure and leaks context between folders.

## What the review changed, and what still strains

The first version of this skill was reviewed against its own standards. Four gaps closed: two became rules in the table above, one tightened the index contract, and one became a schema in the registry section:

- **The index could be hand-maintained**, which reintroduced the second-copy risk the skill forbids elsewhere. Now a hand-maintained index must declare `hand-maintained: true`, and readers re-verify every field against the file.
- **Non-metric series had no schema.** Symptoms, formulas, and imaging now get minimal columns — onset, attribution status; herb count, doses; modality, follow-up — instead of living wherever the last editor left them.
- **Derived scores could be silently miscalculated.** Formula, inputs, and unit are now mandatory, and an incomplete one drops to `low-confidence`.
- **Model drift was unrecorded.** Every analysis block now ends with `provenance: model · date · skill version`.

Three things still strain, and probably always will:

- **A disclaimer is not legal advice.** Jurisdiction-specific terms are missing, and no lawyer has read the liability language.
- **The rules are prose, not a linter.** Nothing enforces the provenance stamp or the derived-value triple; both depend on the agent remembering, which is exactly what a skill is supposed to fix.
- **The output skeleton carries no mandatory disclaimer.** The disclaimer sits at the top of the skill, not in the output skeleton's seven blocks. A generated review can omit it, so "label the output" remains advice, not an enforced step.

## What would make the approach not worth using

Three structural conditions would make it not worth using.

If the records are too sparse, the evidence discipline has nothing to stand on and the honest output is "insufficient data" — which users will read as a failure of the tool. If a hosted model is unacceptable, the workflow must run locally or by dictation; either way, throughput and quality drop. And if a clinician never sees the output, the skill's careful separation of record from inference buys nothing.

The procedure is worth keeping only while someone acts on its output with a professional in the loop.

## Files

- [`medical-record-review/SKILL.md`](https://github.com/j3ffyang/ai-thoughts/blob/main/.opencode/skills/medical-record-review/SKILL.md) — the generic procedure: config keys, workflow, evidence grading, appendices for trends, frontmatter, precedents, boundaries, locale profiles, and companion-article alignment. The article explains why, the skill defines how.
- [`references/AGENTS.example.md`](https://github.com/j3ffyang/ai-thoughts/blob/main/.opencode/skills/medical-record-review/references/AGENTS.example.md) — the patient-free `AUTHORITY` starter: privacy red lines, egress policy, evidence standard, data-change rules, measurement conditions, and the nine keys, with placeholders only.
- the project layer — not published. It is a small skill that supplies, or points to, the nine keys, the language conventions, the precedent table, and one profile per person.
- [`LICENSE`](https://github.com/j3ffyang/ai-thoughts/blob/main/LICENSE) — MIT. Copy the procedure, keep the copyright notice.

btw, i use arch
