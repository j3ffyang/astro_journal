---
author: Jeff Yang
pubDatetime: 2026-05-03T07:58:52.737Z
modDatetime: 2026-05-03T07:25:46.734Z
title: How to Install a Custom Hermes Skill from GitHub
tags:
  - linux
  - opensource
  - ai
  - hermes
  - skill
  - skills
description: How to Install a Custom Hermes Skill from GitHub
featured: false
draft: false
---

![hermes-skill](../../../assets/images/260429-hermes-skill.png)

This guide walks through a tested end-to-end workflow: copy a custom `SKILL.md` from GitHub into `~/.hermes/skills`, confirm it shows up, run it, and optionally automate it. Hermes does not require a separate register or install command for that layout.

## Prerequisites

- Hermes with at least one channel configured
- An integrated model (this walkthrough uses Nvidia Nemotron **free** via OpenRouter; any compatible model works)

## Background

I published a custom `SKILL.md` on GitHub and wanted a dependable installation path for Hermes. After reading several docs without finding a single operational narrative, I ran through the procedure with an AI assistant and captured the result here.

This article is the cleaned-up version of that session so you can repeat the same steps with less trial and error.

Shell examples below were validated in a real environment; substitute your repo, path, branch, and local skill slug where indicated.

## Conversation Context (Why This Guide Exists)

Original ask to the assistant:

> i've written a custom SKILL.md that has been published at my Github account. Please guide me how to install it either through chat here or in command line

What the session covered:

- Clarified inputs: repository URL, skill name, and path to `SKILL.md`.
- Example URL: `https://github.com/j3ffyang/ai-custom-skills/tree/main/hermes/ai-newsletter-prompt`.
- Fetched and reviewed the raw `SKILL.md`, then copied it under `~/.hermes/skills`.
- Installed the skill as `ai-newsletter-daily` and confirmed it with `hermes skills list`.
- Confirmed outputs: `newsletter_items`, `markdown_newsletter`, and `json_newsletter`; persistence and delivery stay in your workflow (`write_file`, `send_message`, cron, etc.).

The source repo: https://github.com/j3ffyang/ai-custom-skills

---

## 1. Obtain the Custom SKILL.md from GitHub

You need two things before copying into `~/.hermes/skills`:

1. **Raw URL** for `SKILL.md`. Easiest: on GitHub open `SKILL.md`, click **Raw**, copy the address bar. Alternatively build  
   `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path-to-SKILL.md>`  
   (`<ref>` is usually `main` or `master`; use a tag or commit SHA if you pin a version).

2. **Local skill slug** — lowercase identifier (hyphens or underscores) for `~/.hermes/skills/<slug>/SKILL.md`. The slug is **your choice** and need not match the repo folder name; this walkthrough uses repo path `hermes/ai-newsletter-prompt/` but installs as `ai-newsletter-daily`.

The example below uses one of my own custom `SKILL.md` files.

| Item | Example (this guide) |
|------|----------------------|
| Owner / repo | `j3ffyang/ai-custom-skills` |
| Path to `SKILL.md` in repo | `hermes/ai-newsletter-prompt/SKILL.md` |
| Branch / tag / commit | `main` (implicit default) |
| Local slug | `ai-newsletter-daily` |

Download to a staging directory, then install (§2):

```sh
mkdir -p /tmp/hermes-skill
curl -sL -o /tmp/hermes-skill/SKILL.md \
  "https://raw.githubusercontent.com/j3ffyang/ai-custom-skills/main/hermes/ai-newsletter-prompt/SKILL.md"
```

**Clone alternative:** If you use `git clone`, copy `SKILL.md` from the working tree with `cp` instead of `curl` — handy for private repos or when you want sibling files next to the skill.

## 2. Install the Skill Locally

Copy `SKILL.md` into `~/.hermes/skills/<skill-name>/SKILL.md`. That is the whole install: Hermes loads skills from this directory and does not need an extra CLI step to register a local custom skill. In this example the slug is `ai-newsletter-daily`, so the path is `~/.hermes/skills/ai-newsletter-daily/SKILL.md`.

## 3. Verify the Installation

Run:

```sh
hermes skills list
```

The custom skill should appear in the output.

```sh
hermes skills list
                                   Installed Skills                                   
┏━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┳━━━━━━━━━┓
┃ Name                    ┃ Category             ┃ Source  ┃ Trust   ┃ Status  ┃
┡━━━━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━╇━━━━━━━━━┩
│ ai-newsletter-daily     │                      │ local   │ local   │ enabled │
```

## 4. Environment Variables (Example: ai-newsletter-daily)

If you install a skill only by copying it under `~/.hermes/skills`, `hermes skills inspect` does not cover that local skill, so you cannot use inspect to verify `required_environment_variables` or related metadata.

The example `SKILL.md` used here does not define `required_environment_variables` in the file. Runtime keys still depend on what the skill actually calls; set them from the prose in `SKILL.md`, your README, or your own notes.

For `ai-newsletter-daily` you need:

| Variable | Purpose | How to set |
|----------|---------|------------|
| `BRAVE_API_KEY` | Web search via Brave | `export BRAVE_API_KEY=your_brave_key` |
| `FIRECRAWL_API_KEY` | Page fetching via Firecrawl | `export FIRECRAWL_API_KEY=your_firecrawl_key` |

Persist these in your shell profile (`~/.bashrc`, `~/.zshrc`, etc.) or export them in the session where Hermes runs.

```bash
export BRAVE_API_KEY=xxxxxxxxxxxxxxxxxxxx
export FIRECRAWL_API_KEY=yyyyyyyyyyyyyyyyyyyy
```

## 5. Using the Skill

Hermes routes user intent to skills from both the terminal UI and bridged chat apps. You do not need a special syntax unless your deployment or bridge defines one.

**Hermes TUI**

- Describe the task in natural language (for example: “Review the code in my current directory” if the skill is named around code review).
- If `SKILL.md` defines activation phrases or keywords, use those so routing matches the skill’s triggers.
- File- or context-aware skills often respond when you ask about the open buffer or path you care about.

**Messaging channels (e.g. WhatsApp, Telegram)**

- In groups, bridges sometimes require a mention (for example `@Hermes …`) so the agent sees the message.
- In direct messages, plain text that matches the skill’s purpose is usually enough.
- Some bridges use command prefixes (`!`, `/`, etc.); confirm in your bridge and Hermes channel settings.

**If the skill does not run**

- Compare your wording to the **Triggers** (or equivalent) section in `SKILL.md`.
- Watch Hermes logs for incoming text and intent routing while you send a test message.

## 6. Automate with a Cron Job (Optional)

To generate and deliver output on a schedule (for example a daily newsletter), wire a Hermes cron job or an external scheduler that invokes the same workflow you use interactively. Exact flags depend on your Hermes version and channel setup; use `hermes --help` and your install docs for cron-specific syntax.

## 7. Updating the Skill Later

Re-fetch the raw `SKILL.md` (§1), replace the file under `~/.hermes/skills/<skill-name>/SKILL.md`, then confirm with `hermes skills list`.

## 8. Quick Reference Cheat Sheet

| Step | Action |
|------|--------|
| 1 | Raw URL (GitHub **Raw** or `raw.githubusercontent.com`…) + pick local `<slug>`; `mkdir` + `curl` or copy from `git clone` |
| 2 | Copy into `~/.hermes/skills/<slug>/SKILL.md` |
| 3 | `hermes skills list` to verify |
| 4 | Export env vars the skill needs (from `SKILL.md` / docs; not via `inspect` for local copies) |
| 5 | Invoke via TUI or channel; align text with triggers |
| 6 | Optional: cron or scheduler |
| 7 | Updates: repeat §1 download + replace file |
