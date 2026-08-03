---
author: Jeff Yang
pubDatetime: 2026-03-20T07:58:52.737Z
modDatetime: 2026-03-20T20:25:46.734Z
title: What I've Been Up to in OpenClaw
tags:
  - linux
  - opensource
  - openclaw
  - ai
  - llm
description: Setup and configure OpenClaw
featured: true
draft: false
---

# What I've Been Up To in OpenClaw 🦞 Lately

<!-- image prompt: a glowing red lobster sitting at a cloud server terminal, dark background, cyberpunk style, minimal flat illustration -->
![main title](../../../assets/images/260320-title.png)

[toc]

---

## Setup & Usage Stats

<!-- image prompt: flat illustration of a Linux terminal showing system specs and a bash history graph, dark theme, minimal -->
![section image](../../../assets/images/260320-sec1-env.png)

Heads up: my 🦞 OpenClaw runs in the cloud, not local! No GUI here — TUI only, baby.

item | spec
-- | --
OS | Arch Linux, kernel 6.18
🦞 `openclaw --version` | `OpenClaw 2026.3.13 (61d171a)`

`grep HISTSIZE ~/.bashrc` spits out `export HISTSIZE=10000`, meaning `~/.bash_history` holds up to `10000` lines. Based on the command below, I've typed `openclaw` about **1000** times and `clawhub` around **220** times in the past few weeks — dude, I live in this thing.

```sh
grep openclaw ~/.bash_history | wc
    997    3252   36777
```

---

## The Commands I Actually Use

<!-- image prompt: flat illustration of a terminal showing a ranked command list with frequency counts, monospace font, dark background -->
![section image](../../../assets/images/260320-sec2-commands.png)

This output is kinda hilarious — my most-used `openclaw` commands, ranked like a leaderboard:

```sh
history | sed 's/^[ ]*[0-9]\+[ ]*//' | grep '^openclaw' | sort | uniq -c | sort -rn
    158 openclaw gateway restart
     27 openclaw tui
     20 openclaw models list
     17 openclaw status
     15 openclaw models
     11 openclaw doctor
      9 openclaw models list --provider openai
      8 openclaw skills check
      7 openclaw skills list
      7 openclaw config get agents.defaults.models
      6 openclaw config get gateway.auth.token
      6 openclaw config get agents.defaults.model.primary
      5 openclaw configure --section web
      4 openclaw skills list --eligible
      4 openclaw plugins list
      4 openclaw models status
      4 openclaw models list --all | grep gemini
      4 openclaw channels list
      ...
```

All command line, all day. Let me break down the hit parade:

- `openclaw gateway restart`: restart the gateway
- `openclaw models list`: list configured models (used this a ton while wiring up `imageGenerationModel`)
- `openclaw skills check`: see which SKILLs are enabled
- `openclaw skills list`: see all available SKILLs
- `openclaw config get agents.defaults.models`: check which models the current project uses, including `imageGenerationModel` — you can set multiple to handle different tasks like text and image separately
- `openclaw config get agents.defaults.model.primary`: check the global Primary model
- `openclaw plugins list`: list installed Plugins, like authentication ones
- `openclaw channels list`: list configured channels, like Telegram, WhatsApp, Discord

---

## Managing SKILLs on Clawhub

<!-- image prompt: flat illustration of a package manager CLI with install/update/publish actions, lobster icon, minimal dark theme -->
![section image](../../../assets/images/260320-sec3-clawhub.png)

The stuff on clawhub.ai is a mixed bag, so I said screw it and write all my own `SKILL.md` files. Here's what I actually run on `clawhub`:

```sh
history | sed 's/^[ ]*[0-9]\+[ ]*//' | grep '^clawhub' | sort | uniq -c | sort -rn
     38 clawhub list
     10 clawhub login --token "clh_!@#$%^&..."
      9 clawhub sync --all
      8 clawhub update --all
      7 clawhub -h
      5 clawhub install blog-polish-zhcn-images --force
      4 clawhub update blog-image-embedder
      3 clawhub list --all
      2 clawhub whoami
      2 clawhub --version
      2 clawhub update blog-polish-zhcn-images
      2 clawhub update blog-polish-zhcn
      2 clawhub uninstall blog-writer
      2 clawhub search "search"
      2 clawhub publish ~/.openclaw/workspace/skills/blog-polish-zhcn/ --version 1.0.
      ...
```

`install`, `uninstall`, `update`, `list` — no lecture needed, you know the drill. The rest:

- `clawhub login --token "clh_..."`: log in without a browser — perfect for pure CLI environments. **Avoid passing tokens directly in hitory-enabled shells.**
- `clawhub search "search"`: hunt for SKILLs with specific functionality, like DuckDuckGo Search
- `clawhub publish ~/.openclaw/workspace/skills/blog-polish-zhcn/ --version 1.0.`: needs the full path when publishing, don't forget it

---

## Config Files & Backup Strategy

<!-- image prompt: flat illustration of a JSON config file with a shield and backup arrows, dark minimal style, lobster icon -->
![section image](../../../assets/images/260320-sec4-backup.png)

`~/.openclaw/openclaw.json` is the brain of OpenClaw — every config option lives here. Corrupt this file and your agent won't even wake up. Use commands to tweak things whenever possible; only crack open `nvim` as a last resort:

```sh
# set primary model
openclaw config set agents.defaults.model.primary "openai/gpt-5-mini"
# set project model
openclaw config set agents.defaults.models "openai/gpt-image-1-mini"
# set imageGenerationModel
openclaw config set agents.defaults.imagegenerationmodel "openai/gpt-image-1-mini"
```

Backup tips:

- Daily backup: `cp ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.0319`
- Sync from cloud to local (`--delete` keeps it in sync with remote):

```sh
echo "backup OpenClaw Entire Dir"; rsync REMOTE_SERVER:/home/user/.openclaw/ /home/user/Downloads/openClawBackup/ -P --archive --delete
```

- Always back up before making changes, then run `openclaw gateway restart` to verify things still work
- Go easy on `openclaw doctor --fix` — run `openclaw doctor` first to see what's actually broken. The `--fix` flag can nuke all configs tied to syntax errors, and that's a rough day

---

tag: #openclaw #lobster #opensource #linux #arch #ai #clawhub #community
