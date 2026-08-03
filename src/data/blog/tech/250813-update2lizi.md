---
author: Jeff Yang
pubDatetime: 2024-09-08T20:58:52.737Z
modDatetime: 2025-08-13T09:25:46.734Z
title: A Summary about Recent AI Development Works with Cursor+ {Gemini,Claude,GPT5}
tags:
  - ai
  - llm
  - cursor
  - claude
  - gemini
  - figma
  - tech
  - technology
  - cursor
description: Currently AI won't be able to replace human developer in real project. I have contributed to an AI development project utilizing the Cursor editor, integrating multiple coding models. This is a summary of my experience and contributions that I am providing to project management.
featured: false
---

## Table of contents

## What I've Taken / Experienced Recently

AI in the community is evolving super fast. For example: A code API I wrote on **Vercel** about a month ago stopped working just last week. I updated it multiple times but faced issues, so I had to restart the project. This wastes computing resources (**tokens**).

Currently, AI’s capabilities (including my personal limits) cannot *fully* handle even seemingly simple development tasks, like:
1. Building a **React-Native** frontend.
2. Supporting **Android** (which requires installing and configuring **android-studio**, very annoying!).
3. Setting up the backend, including: Connecting with **AI models**, and connecting databases for **data persistence**.

I’ve tried several popular approaches:
- **Cursor + Claude/ Gemini/ GPT5** (currently, Gemini’s dev model feels easiest to use).
- **Vercel**, **v0.dev**.
- Using **Figma** for frontend design + backend connection via **Supabase** - (Love this **PostgreSQL** traditional SQL database which also supports vector databases.)  

Most of the time, I need to use several platforms simultaneously, which is quite challenging. However, Connecting all platforms - Cursor, v0.dev, Figma - to **DeepSeek** (DeepInfra) is very simple.

Using AI for development-designing, writing/ outputting documents (**markdown**), and drawing flowcharts (**plantUML**) flows smoothly and looks really polished, with all in plain text. Truly amazing!

The architecture is cloud-based and ready to use with a small monthly cost of about 200 Candian dollar during the design & dev phase. For production testing, base costs need further evaluation.


## Conclusions / Suggestions on Using AI for Design and Development

The design phase must not be ignored or overlooked.
  - If the framework, components, and boundaries between components aren’t clearly defined (e.g., frontend code path, environment variable config and pre-requisite software, like `nodejs`, `openjdk` etc),
  - Or if the granularity is inconsistent (e.g., frontend and backend at equal granularity but React-Native and Android are separate levels inside frontend), then development will likely fail and the app won’t run.
  - Worse, AI-generated code is basically impossible to debug.

Recommended design process:
  1. Start from **“initial ideas”** (brainstorming).
  2. Define as detailed a **specification/ product module description** as possible.
  3. Generate **blueprints** and technical module designs.

Modules should be as isolated as possible-frontend vs backend, database persistence setup, AI model integration, etc.

Have a clear **hierarchical** framework concept, from big picture to detailed level, **step by step**.

Consider **DevOps** workflow, as a team will possibly be needed for further development, operation, and maintenance (including code and data).

Security, encryption, and authentication are indispensable.

Regardless of scale, a team is necessary. Likely 2–3 people to handle:
  - Architecture & design coordination,
  - Frontend (Android, iOS, some art),
  - Backend (persistent databases, language models).

To fully leverage AI, an open and unrestricted internet environment is required. Otherwise, a lot of time can be wasted online. You know what I mean.

---

## Update to the Management in Chinese
將最近几週的工作，努力，學習，感受簡單彙報一下 (this text message has not been involved with any AI. They're all from my personal mind)

1. AI 從行業角度，變化飛速。1個月之前，在 Vercel 写的代码 API，从上周就不工作了。更新几次，都有问题。只好重来 New Project。这样浪费计算资源 (token)

2. 目前，AI 的能力 (也包括我个人能力限制) 无法"完全"胜任即使看起来很简单的开发工作，比如，(1) 一个 React-Native 的前端，(2) 支持 Android (需要安装配置 android-studio 等。麻烦!)，(3) 配置相应后端，包括与 (3.1) 模型对接，和 (3.2) 连接数据库作数据持久化处理

3. 我尝试利用目前业界最流行的几种方法：(1) Cursor+ Claude/ Gemini/ GPT5 (目前感觉 Gemini 的开发模型比较好用) (2) Vercel v0.dev (3) Figma 制作前端+ 建立对接后端 Supabase (特别喜欢这个 PostgreSQL 传统 SQL 数据库，同时支持 Vector 标准矢量数据库)。多数时候，需要同时利用几个平台完成。这个状态有些挑战

4. 在所有开发平台，Cursor，v0.dev，和 Figma，对接 DeepSeek (DeepInfra) 非常简单

5. 利用AI开发，设计/ 编写/ 输出文档 (markdown) 和构画流程图 (plantUML)，一气呵成，非常精美。真的太棒了

6. 现在设计架构是能利用 cloud，即使用。需要小量投入，每月约千元人民币左右 (在设计开发阶段。如果是测试生产，基础成本需要评估)

利用 AI 设计开发，一些结论/ 建议：

1. 设计阶段不能忽略，也不能忽视。如果设计中框架，component 和 component 之间的细节和边界定义不明确 (如，前端代码要放在指定路径，环境变量路径配置，等)，还有颗粒度不一致 (如，前端和后端是同等颗粒度。但是前端里面的 React-Native 和 Android 是一级颗粒度。混杂起来是无法工作的)，都有可能导致不成功的开发，结果即应用无法跑起来。更糟糕的是，AI 制作的代码基本无法 debug

2. 设计流程建议是：从“初始想法” (brainstorming)，在“初始想法”上，定义尽可能详尽的 specification/ 产品模块描述。然后生成 blueprint/ 技术模块设计。模块间需要尽可能的隔离，如前后端，持久化数据库配置，对接语言模型，等。**需要有非常清楚框架概念，从大到小，一步一步推进**。其实，还需要考虑开发 **DevOps** 流程，因为，未来需要一个团队合作 (进一步)开发，运维 (包括代码和数据的运维)。当然，安全加密认证等，也是不可或缺的

3. 实际无论多小，还是需要一个团队的。可能2～3个，分别负责架构统筹设计，前端 (Android, iOS 和部分 Art)，后端 (持久化数据库，语言模型)

4. 充分利用 AI，需要一个开放自由的网络环境。否则，很容易在网络上，浪费许多时间。你懂的

I spent 2 hours with YuanBao to show him how this worked today.