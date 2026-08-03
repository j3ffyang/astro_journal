---
author: Jeff Yang
pubDatetime: 2026-04-14T07:58:52.737Z
modDatetime: 2026-04-14T07:25:46.734Z
title: Hermes integrates with Free OpenRouter's Elephant-Alpha Model
tags:
  - linux
  - opensource
  - openclaw
  - ai
  - llm
  - clawhub
  - hermes
  - agent
description: Hermes integrates with Free OpenRouter's Elephant-Alpha Model
featured: true
draft: false
---

# Hermes integrates with Free OpenRouter's Elephant-Alpha Model

### Takeaway
Use **Hermes** as a drop-in alternative to **OpenClaw**.  
Configure the free **Elephant-Alpha** model via **OpenRouter**.

![img](../../../assets/images/260414-hermes-openrouter2.png)
### Background
After using OpenClaw for several months, I grew curious about Hermes and decided to give it a try. This guide walks through integrating the free **Elephant-Alpha** model from OpenRouter.

### Register an Account on OpenRouter
1. Create an account on [OpenRouter](https://openrouter.ai/).  
2. Obtain your `API_KEY`.

### Set Up Hermes and Verify Status
Follow the official instructions to install Hermes and connect your preferred messaging platforms—**Telegram**, **Discord**, and **WhatsApp** are popular integrations supported by both Hermes and OpenClaw.

Verify the setup:

```bash
hermes status
```

Store your OpenRouter `API_KEY` in:

```bash
~/.hermes/.env
```

Treat this file like your **credit card**—keep it secure.

### Configure the Elephant-Alpha Model in Hermes
Run the following command to configure Hermes and set the primary model:

```bash
hermes model
```

Select **OpenRouter**, then manually enter the model name `elephant-alpha`.

Verify the configuration:

```bash
hermes config show
```

Expected output:
```text
◆ Model  
Model: {'default': 'elephant-alpha', 'provider': 'openrouter', 'base_url': 'https://openrouter.ai/api/v1', 'api_mode': 'chat_completions'}  
Max turns: 90
```

### Test Hermes and Have Fun
Start the WhatsApp integration:

```bash
hermes whatsapp
```

When prompted, select: **"Separate bot number (recommended)"**

Enter the phone number authorized to message the bot. Hermes will generate a **QR code**—scan it using WhatsApp on your phone.

Once connected, send a message to the bot's number in WhatsApp. The Hermes Agent will immediately reply with a **pairing code**.

Return to your Hermes terminal and approve the pairing:

```bash
hermes pairing approve whatsapp <PAIRING_CODE>
```

### Allow More Than Two Users to Access the Agent on WhatsApp
In my case, I have only two users being able to interact with the Hermes Agent.  
If additional users are unable to receive messages (e.g., pairing codes) when sending a DM, update your configuration manually:

```yaml
whatsapp:
  unauthorized_dm_behavior: pair
  require_mention: true
```

Save the file at:

```bash
~/.hermes/config.json
```

Then restart the gateway:

```bash
hermes gateway restart
```

This change also enables **@mention** the Hermes Agent in WhatsApp groups once the bot has been added.

**Happy Hermes—explore, customize, and enjoy!**
