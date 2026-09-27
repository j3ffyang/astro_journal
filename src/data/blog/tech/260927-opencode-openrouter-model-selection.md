---
author: Jeff Yang
pubDatetime: 2026-09-27T00:00:00.000Z
title: "Choosing a Model for OpenCode via OpenRouter: Privacy, Price, and Performance"
tags:
  - opencode
  - openrouter
  - llm
  - ai
  - privacy
description: "Picking a model and provider for OpenCode via OpenRouter — separating model origin from serving jurisdiction, tiering data-privacy risk, comparing DeepSeek/Qwen/GLM/Kimi/Gemini/OpenAI prices, and reproducing live rates with curl and Python."
featured: false
draft: false
---

Practical guide for picking a model and provider when driving OpenCode through OpenRouter, balancing data-privacy risk against price and performance. Prices are as of 2026-09-27 and are OpenRouter's listed rates.

*Disclosure: I'm not affiliated with any of the model developers or service providers mentioned here.*

![Infographic: choosing a model for OpenCode via OpenRouter — model ≠ service, the privacy ladder, the price landscape, the decision, and the config](../../../assets/images/260927-openrouter-model-selection.png)

## 1. Provider list vs model routing

OpenCode's `/connect` connects **providers**; OpenRouter is one of them. Entries like "DeepSeek" and "DeepSeek (China)" are distinct serving endpoints — the suffix denotes the host's jurisdiction, not a different model. To use OpenRouter as the payment gateway, connect **OpenRouter** once, then choose models with `/models` (for example `deepseek/deepseek-v4-flash`); the upstream host is then selected by OpenRouter's routing, which you can constrain (see §5).

The distinction that matters throughout this note is between the **model** and the **serving provider**. An open-weight model (DeepSeek, Qwen, Kimi, GLM) is a set of downloadable files; it carries no inherent data risk. The risk lives in the **service that hosts it and the law that governs that service**.

## 2. Data privacy: model origin vs serving jurisdiction

A Chinese *model* is not the same as a Chinese *service*. The open weights can run anywhere — a non-Chinese host, your own GPU, or a laptop. What changes the privacy calculus is who operates the endpoint.

| Tier | Setup | Exposure |
|---|---|---|
| Highest | China-jurisdiction API endpoint (DeepSeek direct, Alibaba, Moonshot, `.cn`) receiving your code or secrets | Chinese law (National Intelligence Law, Data Security Law, PIPL) can compel disclosure and may bar disclosing the request |
| Medium | Non-China aggregator routing to a China endpoint without retention or training controls | Same legal exposure, but constrainable |
| Lower | Non-China host (Together, Fireworks, DeepInfra, Baseten, GMI) running the same open weights under no-retention terms | Contractual risk, not state compulsion |
| Lowest | Self-host (Ollama, llama.cpp, vLLM) or BYOC | No third-party exposure |

This is a **jurisdiction and compulsion** risk, not a claim that any vendor abuses data. It matters most for proprietary code and secrets; for public or open-source work the risk is low.

**Assessment checklist per provider:** (a) legal jurisdiction of the serving entity; (b) retention policy and whether Zero Data Retention is available; (c) training-on-inputs policy; (d) whether you can pin or exclude providers; (e) DPA availability; (f) whether self-host or BYOC is possible. In an agentic coding session, what you send is high-sensitivity — source, file contents, and sometimes secrets.

## 3. Pricing comparison

OpenRouter's listed price is the **cheapest endpoint** for a model, and endpoints differ in quantization (fp4 vs fp8 weight precision — fewer bits is cheaper but lossy), so treat these as a floor, not a like-for-like quality figure.

*Table generated 2026-09-27 from the OpenRouter API. Model prices change frequently — treat this as a snapshot and re-run the scripts in §4 before relying on any number.*

| Family | Cheapest capable (input / output per M) | Frontier flagship (input / output per M) |
|---|---|---|
| **DeepSeek** | V4 Flash \$0.047 / \$0.094 | V4 Pro \$0.348 / \$0.696 |
| **Qwen** | Qwen3.8 Flash \$0.15 / \$0.47 | Qwen3.8 Max Prime \$4 / \$12 |
| **GLM** | GLM-5.3 Flash \$0.04 / \$0.50 | GLM-5.3 \$0.24 / \$0.75 |
| **Kimi** | K2.5 \$0.45 / \$2.25 | K3 \$3 / \$15 |
| **Gemini** | 2.5 Flash-Lite \$0.10 / \$0.40 | 3.1 Pro Preview \$2 / \$12 |
| **OpenAI** | gpt-5.1-codex-mini \$0.25 / \$2 | GPT-5.2 \$1.75 / \$14 |

**Price winners: DeepSeek, with Qwen and GLM close.** The open-weight families are far cheaper, especially on output tokens. DeepSeek V4 Pro is frontier-capable at roughly a twentieth of Gemini 3.1 Pro Preview's and GPT-5.2's output cost. **Kimi is not a price leader** — K3 sits at GPT and Claude frontier pricing. OpenAI is the priciest frontier; Gemini sits mid.

## 4. Reproducing the numbers

List every model's price, per million tokens, with `curl` and `jq`:

```bash
curl -s https://openrouter.ai/api/v1/models \
  | jq -r '.data[] | [.id, (.pricing.prompt|tonumber*1e6), (.pricing.completion|tonumber*1e6)] | @tsv' \
  | sort -t$'\t' -k3 -n | head -30
```

Print the cheapest models per family with Python:

```python
#!/usr/bin/env python3
"""Cheapest OpenRouter models per family, per million tokens."""
import json
import urllib.request

FAMILIES = {
    "deepseek": "deepseek",
    "qwen": "qwen",
    "moonshotai": "kimi",
    "google": "gemini",
    "openai": "openai",
    "z-ai": "glm",
}


def per_million(x):
    try:
        return float(x) * 1_000_000
    except (TypeError, ValueError):
        return None


with urllib.request.urlopen("https://openrouter.ai/api/v1/models") as resp:
    models = json.load(resp)["data"]

for author, label in FAMILIES.items():
    rows = [m for m in models if m["id"].startswith(author + "/")]
    rows.sort(key=lambda m: per_million(m["pricing"].get("completion")) or 9e9)
    print(f"=== {label} ({author}) — {len(rows)} models ===")
    for m in rows[:5]:
        p = m["pricing"]
        inp = per_million(p.get("prompt"))
        out = per_million(p.get("completion"))
        print(f"  {m['id']:<52} in ${inp:.3f}/M  out ${out:.3f}/M")
```

Inspect one model's per-provider endpoints — price, quantization, context — the check that reveals the price floor:

```bash
curl -s "https://openrouter.ai/api/v1/models/deepseek/deepseek-v4-flash-0731/endpoints" \
  | jq -r '.data.endpoints[] | [.provider_name, .quantization, (.pricing.prompt|tonumber*1e6), (.pricing.completion|tonumber*1e6)] | @tsv'
```

## 5. Balanced recommendation

| If your data is… | Use |
|---|---|
| Proprietary or contains secrets | Self-host open weights, or a non-China host with Zero Data Retention via OpenRouter, or a Western frontier model. Avoid China-jurisdiction endpoints. |
| Open-source / non-sensitive | DeepSeek V4 Flash or Qwen3.8 Flash via OpenRouter — best price/performance for coding. |
| A balanced default | DeepSeek V4 Pro on a non-China host (cheap and non-China jurisdiction), with a cheap small model for routine steps. |

## 6. OpenCode configuration

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
  "model": "openrouter/deepseek/deepseek-v4-pro",
  "small_model": "openrouter/deepseek/deepseek-v4-flash"
}
```

Controls to set on OpenRouter: **enforce Zero Data Retention**, **opt out of training**, and pin or exclude providers by jurisdiction. For agentic tool-calling reliability prefer the `:exacto` routing variant; avoid `:floor`, which often routes to **fp4** and can degrade tool calls.

## Sources

- openrouter.ai — `/api/v1/models`, `/api/v1/models/{author}/{slug}/endpoints`, `/docs/faq`, `/docs/guides/features/zdr`
- opencode.ai — `/docs/providers`, `/docs/models`
- Prices and model lists retrieved 2026-09-27.

btw, i use arch
