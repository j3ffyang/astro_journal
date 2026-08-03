---
author: Jeff Yang
pubDatetime: 2025-10-17T10:58:52.737Z
modDatetime: 2025-10-17T10:25:46.734Z
title: My Simple Way to Install Astro + TailwindCSS + Giscus
tags:
  - opensource
  - astro
  - tailwindcss
  - giscus
description: A practical guide to setting up AstroPaper with TailwindCSS for blogging and integrating Giscus comments for reader engagement.
featured: false
draft: false
---

## Why I Switched to Astro

After years of using Hugo, I finally made the jump to Astro. My setup is pretty straightforward - GitHub for hosting the source code and CloudFlare for deployment. The main reasons for the switch? Better performance and a cleaner development experience.

Here's what I wanted to achieve:

1. **Set up AstroPaper** - A beautiful Astro theme that comes with TailwindCSS built-in. Perfect for writing blogs and showcasing photos without the hassle of custom styling.

2. **Add Giscus comments** - Because what's a blog without reader interaction? Giscus integrates seamlessly with GitHub discussions.

I'm not gonna walk you through the initial setup (there are plenty of tutorials for that). Instead, I'll show you exactly what you need to configure and where to put your content to get everything working.

## Setting Up AstroPaper

I spent way too much time browsing through Astro themes, but AstroPaper stood out immediately. It's clean, responsive, and has everything you need for a personal blog.

### Key Files You'll Work With

Once you've got AstroPaper cloned and installed, here are the main files you'll be tweaking:

**Configuration:**
- `src/config.ts` - Your site metadata, social links, and theme settings
- `src/pages/index.astro` - Your homepage layout
- `src/pages/about.md` - Your about page (just a markdown file)

**Content Structure:**
- `src/data/blog/` - Drop your markdown files here
  - `tech/` - Technical posts
  - `travel/` - Travel posts  
  - `photo/` - Photo posts
- `src/assets/images/` - All your images go here

The beauty of AstroPaper is that it automatically handles routing, pagination, and SEO. Just drop your markdown files in the right folders and you're good to go.

## Adding Giscus Comments

Giscus is hands down the best commenting system for developer blogs. It uses GitHub Discussions under the hood, so your comments are stored in your repo. Pretty neat, right?

### Step 1: Enable GitHub Discussions

First, you need to enable Discussions in your GitHub repository:
1. Go to your repo → Settings → General
2. Scroll down to "Features" and check "Discussions"
3. Click "Set up discussions"

### Step 2: Install the Giscus App

1. Head over to [giscus.app](https://giscus.app)
2. Enter your repository name (format: `username/repo-name`)
3. Choose your preferences (theme, language, etc.)
4. Copy the generated script

### Step 3: Create the Giscus Component

Create `src/components/Giscus.astro`:

```astro
---
// src/components/Giscus.astro
---

<div class="giscus-container">
  <script 
    src="https://giscus.app/client.js"
    data-repo="your-username/your-repo"
    data-repo-id="your-repo-id"
    data-category="General"
    data-category-id="your-category-id"
    data-mapping="pathname"
    data-strict="0"
    data-reactions-enabled="1"
    data-emit-metadata="0"
    data-input-position="bottom"
    data-theme="preferred_color_scheme"
    data-lang="en"
    data-loading="lazy"
    crossorigin="anonymous"
    async>
  </script>
</div>

<style>
  .giscus-container {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
  }
</style>
```

### Step 4: Add to Your Post Layout

In `src/layouts/PostDetails.astro`, add the Giscus component:

```astro
---
// ... existing imports
import Giscus from "@/components/Giscus.astro";
---

<!-- ... existing content ... -->

<Giscus />
```

That's it! Your readers can now comment using their GitHub accounts, and all comments will appear in your repository's Discussions section.

## Wrapping Up

The whole setup took me maybe 30 minutes, and the result is a clean, fast blog with a commenting system that actually works. No more dealing with spam or managing user accounts - everything just works through GitHub.

If you're thinking about making the switch from Hugo (or any other static site generator), AstroPaper + Giscus is a solid combo. The performance is great, the developer experience is smooth, and your readers can actually engage with your content.

Happy blogging! 🚀

