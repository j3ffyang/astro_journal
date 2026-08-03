---
author: Jeff Yang
pubDatetime: 2025-09-08T20:58:52.737Z
modDatetime: 2025-09-09T09:25:46.734Z
title: Design Philosophy
tags:
  - ai
  - llm
  - langchain
  - linux
  - cloudnative
  - cncf
  - container
  - kubernetes
description: My whole design philosophy for IT, from the beginning to the future, boils down to just two things - standardization and automation. 
featured: true
---


My whole design philosophy for IT, from the beginning to the future, boils down to just two things: **standardization** and **automation**. The secret sauce is how we define the standard "unit" of computing power. The smaller and more precise that unit becomes, the more we can automate, and the more powerful everything gets.

### The Evolution of the "Standard Unit"

Think about the progression over the last 20 years. 📜

First, the standard was a **dedicated machine**. You owned the whole box: the OS, the data, the network—everything. It was a huge, clumsy unit.

Then, around 2010, **virtual machines (VMs)** became the standard. This was a big leap! We could finally slice up a physical machine into isolated virtual ones, sharing resources like CPU and disk. For a while, I thought this was the endgame.

But then **containers** came along and completely changed the game. This was the revolution. The standard unit of computing became incredibly small and well-defined: just the app and its essential dependencies.

### The "Aha!" Moment: Everything as Code

This is where it all clicked for me around 2019, especially looking at the Cloud Native Computing Foundation (CNCF) landscape. You see that term "App Definition" and realize what it truly means: **everything can be defined in a container**. A database, a web server, a specific process—you name it.

And how do you define it? With code, most often **YAML**. This is the core of **Infrastructure as Code (IaC)**. I can literally read a YAML file and understand how an entire data center is pieced together. Every single component in a Kubernetes architecture can be described and controlled this way.

Once I got that, I became obsessed. I dove into tools like Terraform, Ansible, and Kustomize, trying to automate absolutely everything. Because when your standard unit is just a text file (the YAML), automation becomes incredibly powerful. All the innovation we see in cloud-native tech stems from this simple idea.

### The Future: Applying the Philosophy to AI

So, where does this leave us for the future? I think this exact same philosophy applies to complex systems like AI. 🤖

I spent a couple of years working in AI, diving into Python, LangChain, and deploying open-source LLMs locally with tools like Ollama. When you look at an AI agent's workflow, you see the same pattern. Each step—retrieving data, calling a model, processing the output—is like a standardized piece of a much larger puzzle.

Frameworks are emerging that try to standardize these steps, like a "model context protocol." In my view, this makes AI **reachable and manageable**. You can break down a super complex AI system into smaller, standardized, and automatable pieces. You don't need a massive team to build powerful things anymore.

It all comes back to the core belief: if you can **define a standard** precisely enough, you can **automate it**. And that’s how you build anything, no matter how complex.