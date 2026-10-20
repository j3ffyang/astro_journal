---
author: Jeff Yang
pubDatetime: 2026-10-20T13:46:18.000Z
title: "The Rules, Not the Words: ASD-STE100 for Agent Instructions"
tags:
  - asd-ste100
  - technical-writing
  - ai-agents
  - agents-md
  - prompting
  - opencode
description: "ASD-STE100 is a controlled language for aircraft maintenance manuals. Its rules — not its dictionary — are what make agent instructions checkable."
featured: true
draft: false
---

*ASD-STE100 is a controlled language for aircraft maintenance manuals. It has 53 writing rules and an 875-word dictionary.*

**Source:** Andrej Karpathy, X thread, 1 October 2026, 17:37 PDT (2 October 2026, 00:37 UTC) — [x.com/karpathy/status/2105819303471976479](https://x.com/karpathy/status/2105819303471976479)

**Thesis:** For AI work, the value is in the rules, not the dictionary. Those rules are: **one action per sentence, imperative mood, condition first, and one name for one thing.** They attack the exact failure mode of agent instructions — a compound sentence that cannot be checked off.

**Verdict:** apply the rules to instructions only, never to essays. Keep the high-value substitutions. Treat Karpathy's tip as a starting point, not a standard: he himself asks for "80% of the way to ASD-STE100".

![Infographic: ASD-STE100 for agent instructions — the standard's two parts, the four rules that carry the work, a compound prompt split into two steps, the measured before-and-after counts, rule versus skill versus linter, and the four things the standard cannot buy](../../../assets/images/261019-ste100-agent-instructions.png)

## Where the tip came from

The thread is about reading model output, not about prompting tricks in general. Karpathy's first suggestion is to ask the model to explain something in ASD-STE100 — "a controlled language specification", originally developed for aircraft maintenance manuals. He reports that models know the standard well, and that its "heavy constraints on clean writing style" produce text he finds "a lot more readable". He also admits the spec is "quite stringent", and that he sometimes softens the request to "80% of the way to ASD-STE100".

The rest of the thread moves away from writing: diagrams, then HTML pages, then 3Blue1Brown-style explainer videos, each described as "even better". So the post is really about output formats that are easier to verify. The STE tip is the only language constraint of the four, and the least work to try.

One leap is worth naming. Karpathy asks a model to write *for a human*. This article asks a human to write *for an agent*. The two directions are not symmetric. A human who hits an ambiguous sentence can ask a follow-up question. An agent that loads `AGENTS.md` unattended will usually not ask. It will pick a reading, and it will act on it. That asymmetry is why the rules transfer while the evidence does not. The failure mode below is visible in the text itself.

Two things to keep honest. First, this is an anecdote ("I've had success"), not a benchmark. Second, my own custom **`asd-ste100` SKILL.md** is the worked example:

[https://github.com/j3ffyang/ai-thoughts/blob/main/.opencode/skills/asd-ste100/SKILL.md](https://github.com/j3ffyang/ai-thoughts/blob/main/.opencode/skills/asd-ste100/SKILL.md)

That file leaves out the standard's dictionary. ASD restricts reproduction to authorized organizations.

## What ASD-STE100 actually is

ASD traces the work to the late 1970s: an AECMA project for European airlines, with the US AIA invited. The first guide came in 1986. The current edition, Issue 9, arrived in January 2025, when the document became an international standard. It is free to read: start at [asd-ste100.org](https://www.asd-ste100.org/), where the [Issue 9 PDF](https://www.asd-ste100.org/assets/files/ASD-STE100_ISSUE9.pdf) is the source for every rule and example below.

The reason for its existence is narrow and useful: maintenance documentation read by non-native English speakers, where a misread instruction can kill someone. That origin explains both its strength and its limit. It is excellent at procedures with one correct action. It is not a general prose style.

The scope is two parts, and only one of them is a word list:

- **Part 1 — 53 writing rules.** Grammar, sentence length, verb forms, safety instructions, writing practices.
- **Part 2 — a controlled dictionary.** Issue 9 lists **875 approved words** and **1,274 non-approved words** with replacements. The FAQ rounds this to "about 900". For scale, `ensure (v)` is not approved. The replacement is `MAKE SURE (v)`. The non-approved list is this kind of substitution: the least interesting part of the standard, and the part people overestimate.

The dictionary is not a hard wall. Technical nouns and verbs are open by design (the standard's Rules 1.5–1.13): a company, industry, or subject field can add its own terms. What the rules forbid is using those terms loosely — as verbs, as different names for the same item, or as jargon.

The cheapest wins come first: a few substitutions and two structural rules, each with a small example. Three more structural rules come next.

- `make sure` — "Make sure that the valve is closed." Not "verify" or "ensure".
- `remove`, `install`, `set` — one verb per action: "Remove the four bolts." "Install the new O-ring." "Set the switch to ON."
- `do` — the generic action verb: "Do the pressure test." Not "perform" or "conduct".
- Condition first — "When the light comes on, set the switch to NORMAL."
- No semicolons — write two sentences: "Examine the removed parts for damage. Replace the damaged parts."

## Three examples from the standard

### 1. One instruction per sentence (Rule 5.2)

> Non-STE: `Set the TEST switch to the middle position and release the SHORT-CIRCUIT TEST switch.`
>
> STE: `A. Set the TEST switch to the middle position.` / `B. Release the SHORT-CIRCUIT TEST switch.`

The rule allows an exception: two actions that happen at the same time stay in one sentence ("Remove and discard the seal."). Sequential actions become separate steps. This is the rule I would pick first for prompts, because a numbered step can be checked and a compound sentence cannot.

The same works on a one-off prompt, with no file involved:

> Non-STE: `Review the diff and fix the failing test.`
>
> STE: `1. Review the diff. 2. Fix the failing test.`

Two steps an agent can mark done. The compound version has one checkbox and two jobs.

### 2. Short sentences split, not trim (Rule 5.1)

> Non-STE (25 words): `Put preservation oil into the unit through the vent hole until the oil level is approximately 6 mm below the surface of the flange cover.`
>
> STE: `Put preservation oil into the unit through the vent hole.` (10 words) `Continue until the oil level is approximately 6 mm below the surface of the flange cover.` (16 words)

Procedures cap at 20 words per sentence. Descriptions cap at 25. The standard is explicit that you divide the sentence. You do not delete the condition to fit the limit. That distinction matters: most "keep it short" advice produces telegraphic text, which STE rejects.

### 3. One name for one thing (Rule 1.11)

> Non-STE: `1. Make sure that the servo control unit is in the open position. 2. Do the operational test of the actuator. 3. Disconnect the control unit from the test rig.`
>
> STE: `1. Make sure that the actuator is in the open position. 2. Do the operational test of the actuator. 3. Disconnect the actuator from the test rig.`

Synonyms read as variety in prose and as ambiguity in procedures. The reader — or the agent — cannot tell whether "control unit" and "actuator" are the same object.

## What it means for instructions

### The measurement

I measured the standard against the files I actually load in every session: a global rules file (`AGENTS.md`), and a project one. Both had just been rewritten, so each row pair is a before and after of the same text, not a comparison between two styles.

Run `python scripts/ste_lint.py --stats <file>` from the skill folder. The tool strips bold markers, excludes code fences, headings, and table rows, and counts a code span as one word. It prints six figures per file: sentences, over 20 words, over 25 words, semicolons, errors, and warnings.

| Rules file | Sentences | Over 20 words | Over 25 words | Semicolons | Errors |
|---|---|---|---|---|---|
| Global (before) | 98 | **21 (21%)** | 11 | 7 | 18 |
| Global (after) | 147 | **0** | 0 | 0 | 0 |
| Project (before) | 77 | **17 (22%)** | 6 | 9 | 15 |
| Project (after) | 116 | **0** | 0 | 0 | 0 |

Before the pass, about a fifth of the sentences in both files broke the 20-word limit. Both are now at zero on every count. Neither file changed length much: the sentences were split, not deleted.

The full before/after record, with the unified diffs, is in the [rewrite log](https://github.com/j3ffyang/ai-thoughts/blob/main/docs/261019-ste100-rewrite-log.md).

### The worst offender

The safety rule in my global rules file ran almost 60 words before the pilot, with the trigger buried after three imperatives:

> "**STOP and RAISE HANDS immediately** — halt the run, do not continue, report to the user at once with what was attempted — if executed code reads the filesystem outside `/tmp`…"

The sentence continued with four more triggers: credentials, data exfiltration, child processes or network connections, and deceptive behavior. I applied Rule 5.4 (condition first) and Rule 5.2 (one action per sentence):

```
If executed code does any of these things, stop:
- reads files outside /tmp
- touches process.env, keys, tokens, or credentials
- collects or sends local data off the machine
- starts child processes, or opens unauthorized network connections
- shows malicious, harmful, deceptive, cheating, or stealing behavior
Do not continue the run. Report to the user now. Say what was attempted.
```

Same policy, no dropped condition, four checkable actions, five flat triggers. The rewrite is not shorter than the original, either: that rule grew from 59 to 62 words. STE trades brevity for checkability, and the pilot shows it — the file went from 18 linter errors to zero.

### What changes in a SKILL.md

A skill is read once, when the agent decides it is relevant. That puts the rules on the description, the body, and the files it names.

- **The `description` is the trigger.** Write it as a condition the agent can match: "Use when auditing an `AGENTS.md` or a prompt." Not a topic label like "STE compliance helper".
- **The body is a procedure.** One action per numbered step, no compound steps, and no reasoning inside a step. Exclusions go in a flat list or a scope table: "Never rewrite essays." is one checkable line.
- **Name supporting files by path.** Then the agent can open them without guessing.

The `asd-ste100` skill follows that shape. Its description states when to load it, its workflow is a numbered procedure, and its scope table names what it must not touch.

### What the constraint buys

- **Checkability.** One action per sentence means each rule can be marked done or not done.
- **Policy vs description.** Rule 5.3 (imperative) forces "Run the linter." over "the linter should be run" — the second is advice, not a rule.
- **Condition-first ordering.** Rule 5.4 maps directly onto permission and safety rules, where the trigger must be read before the action.
- **No synonym drift.** Rule 1.11 names the same item the same way in every rule. Pick one name for the config file and keep it, never `config` in one rule and `settings` in the next.
- **Fewer silent ambiguities.** Keeping articles and using the active voice (Rules 4.5 and 3.6) prevent the telegraphic style that makes short rules unparseable. Rule 4.5 is new in Issue 9.

### What it does not buy

**It does not fix correctness.** One public experiment with the STE prompt ([Mysore, Oct 2026](https://medium.com/@visrow/karpathy-says-make-your-llm-write-like-an-aircraft-manual-i-built-a-browser-tool-to-measure-it-17f0aaeb86b4)) found that the formatted answer still dropped a safety-critical detail. It said "connect cables to both battery terminals" without saying which cable goes where. Form constraints do not make facts true. Any article claiming otherwise is overselling.

**Policy is not procedure.** `AGENTS.md` carries priorities, exceptions, and rationale: *prefer X unless Y. Ask if unsure.* STE was designed for procedures with exactly one correct action, and it has no vocabulary for tradeoffs. Flattening conditional policy into imperatives can make an agent more literal and less correct. Rewrite the actions. Leave the reasoning as descriptive text under the 25-word limit.

**The dictionary is not a reliable control.** Model familiarity with STE is plausible but unmeasured, and the 875-word list cannot simply be bundled. ASD owns the copyright and grants free reproduction only to a named list of organizations. The list covers ASD and AIA members, their customers, defence ministries, airworthiness authorities, and universities for education. Everyone else needs written authority from ASD. If determinism matters, a linter plus your own short banned-words list is the only honest route, not a prompt that names the standard.

**Word counts break on identifiers.** A config filename, a path, or an API name is one word for a human and several for a counter. Any lint must exclude code spans and identifiers, or every technical rule fails.

**The linter grades my own homework.** I wrote the rewrite and the check, and the thresholds come from the standard I am arguing for. A linter can measure form. It cannot tell you that a rewritten rule still means what it meant.

**Voice loss.** The articles in `docs/` are essays. Applying STE there would flatten the register that makes them readable. The constraint belongs to instructions, not prose. This article is itself an essay, so it keeps its long sentences. Judging it by Rule 5.1 would be a category error.

## AGENTS.md rule or SKILL.md?

The two options are not exclusive. A short rule in the always-loaded file plus a skill with the procedure keeps both cheap. The rule costs a few lines of context every session, and the skill costs nothing until it loads.

| Piece | Where | Why |
|---|---|---|
| Short scope rule | Always-loaded rules file → Writing conventions, **not added yet** | Always loaded. Small enough to obey |
| Full rule set and rewrite procedure | `.opencode/skills/asd-ste100/` | On demand. 53 rules must not sit in always-on context |
| Deterministic check | `.opencode/skills/asd-ste100/scripts/ste_lint.py` | A model judging its own sentence length is unreliable |

A rule alone would be too vague to act on. A skill alone may not load during ordinary edits. The rule states the scope. The skill carries the detail. The script settles arguments.

Install it where OpenCode already looks: `~/.config/opencode/skills/asd-ste100/SKILL.md` for every session, or `.opencode/skills/asd-ste100/SKILL.md` for one project. For a shared folder, add its absolute path to the `skills` array in `opencode.jsonc`. Nothing else is needed, and no per-repo copy either.

A candidate `AGENTS.md` rule follows, kept short enough to obey itself. Neither rules file carries it yet: the pass above rewrote existing wording, and the skill is the only enforcement today.

```md
**Instruction writing (STE-lite).** Applies to prompts, AGENTS.md, SKILL.md, and checklists — never to articles, essays, or translations.
- Write one action per sentence. Split compound steps.
- Write instructions in the imperative: "Run the linter." Not "the linter should be run".
- Put the condition first, then a comma: "If the check fails, read the log."
- Use one name for one thing. Do not rotate synonyms for a file, command, or concept.
- Keep instructions to 20 words and descriptions to 25. Do not count code spans or identifiers.
- Keep the reason for a rule as description. Do not delete a condition or exception to meet the limit.
- Keep technical names verbatim: paths, commands, identifiers.
For the full standard, load the `asd-ste100` skill.
```

The skill lives at `.opencode/skills/asd-ste100/`. Its files:

| File | Purpose |
|---|---|
| [`SKILL.md`](https://github.com/j3ffyang/ai-thoughts/blob/main/.opencode/skills/asd-ste100/SKILL.md) | Scope, the 10 core rules, the write and audit procedures, the linter, and verification |
| [`references/rules.md`](https://github.com/j3ffyang/ai-thoughts/blob/main/.opencode/skills/asd-ste100/references/rules.md) | Condensed 53 rules by section |
| [`scripts/ste_lint.py`](https://github.com/j3ffyang/ai-thoughts/blob/main/.opencode/skills/asd-ste100/scripts/ste_lint.py) | Length, semicolons, banned words, passive, phrasal verbs |

The linter is the part that makes this more than a style preference. Useful checks: sentence length over 20 or 25 words, semicolons outside code, and banned words. The banned-word list starts with `ensure`, `utilize`, `leverage`, `facilitate`, `commence`, `prior to`, and `in order to`. It also flags passive voice (`be` plus a past participle) and phrasal verbs. It does not check meaning, one action per sentence, or synonym drift.

## How to apply it

1. **Pilot on one file.** The pilot ran on the global rules file and measured before and after with `.opencode/skills/asd-ste100/scripts/ste_lint.py --stats`. The project file followed once the numbers justified it.
2. **Rewrite rules, not rationale.** Keep the "why" sentences as descriptions under the 25-word limit. Deleting reasoning to meet a word count is a net loss.
3. **Start with `STOP and RAISE HANDS`.** It is the highest-stakes rule and the longest sentence. The pilot started there and ended at zero errors.
4. **Use the skill.** Copy the folder to `~/.config/opencode/skills/asd-ste100/` for every session, or `.opencode/skills/asd-ste100/` for one project. The publish step is a workflow file, [`.github/workflows/clawhub-skill-sync.yml`](https://github.com/j3ffyang/ai-thoughts/blob/main/.github/workflows/clawhub-skill-sync.yml), and it runs on push. Review before the merge, not after.
5. **Leave the articles alone.** If STE helps an article, it helps by removing ambiguity in technical steps, not by flattening the voice.

## What is still not done

The pass covered both rule files. I read both diffs in the [rewrite log](https://github.com/j3ffyang/ai-thoughts/blob/main/docs/261019-ste100-rewrite-log.md) line by line: no rule, condition, or exception is missing. The [`asd-ste100`](https://github.com/j3ffyang/ai-thoughts/blob/main/.opencode/skills/asd-ste100/SKILL.md) skill summarizes the rules and omits the dictionary. It is not the standard. The open question is no longer whether the limits survive real rules. It is whether the rewritten files read as clearly to a human as they do to the linter.

The next step is to use the rewritten rules for a week, then wire the linter into review. A rule that cannot be checked will drift back to its original shape within a month.

The takeaway is not the standard. It is the custom `SKILL.md` above: copy it, run the linter on your rules, and fix your longest rule first.

btw, i use arch
