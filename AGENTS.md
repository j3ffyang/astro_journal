# AGENTS.md

Personal blog — "My Personal View to the World" (https://everbox.io) by Jeff Yang. Built on the AstroPaper theme with Astro 5 + TypeScript + Tailwind 4. Deployed from GitHub (`main`) to Cloudflare Pages.

## Commands

- Dev server: `pnpm run dev` (port 4321). If `pnpm` is not on PATH locally, `npm run astro -- dev` works.
- Production build: `pnpm run build` → `astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/`.
- Type check: `pnpm run astro -- check`; Lint: `pnpm run lint`; Format: `pnpm run format`.

## Content conventions

- Posts live in `src/data/blog/<category>/` (`tech`, `travel`, `photo`, `philosophy`) — NOT `src/content/`. Loaded by a glob loader in `src/content.config.ts` (`BLOG_PATH`).
- **Filenames**: `yymmdd-lowercase-slug.md` — 6-digit date prefix, lowercase, hyphens. No underscores, camelCase, 10-digit timestamps, or `.md.md`.
- **URLs derive from the filename** (`getPath` in `src/utils/getPath.ts`): `/posts/<category>/<lowercase-filename-without-ext>/`. Renaming a file changes its URL.
- When renaming a **published** post, preserve the old URL by adding a redirect to `postRedirects` in `astro.config.ts` (old URL → new URL).
- Frontmatter: `draft: true` hides a post from the build; a missing `draft` means published. `featured: true` shows on the homepage.
- Internal links (prev/next, cards, tags) are auto-generated — never hardcode `/posts/...` URLs.
- `.orig` files (`src/pages/_index.astro.orig`, `src/layouts/PostDetails.astro.orig`, `src/data/blog/predefined-color-schemes.md.orig`) are intentional references — **never modify or delete them**.

## Images

- Images live in `src/assets/images/`, referenced by literal relative path from markdown (e.g. `../../../assets/images/260526-msgtips.png`).
- **Filenames**: lowercase, hyphens only (no underscores/camelCase); date prefixes use 6-digit `yymmdd`. ISO (`YYYY-MM-DD`) and 10-digit (`yymmddhhmm`) prefixes have been normalized away.
- Renaming an image requires updating every reference, then rebuild and verify links.

## Gotchas

- **OG images**: `src/pages/posts/[...slug]/index.png.ts` renders per-post `index.png` via satori. It downloads IBM Plex Mono from Google Fonts at build time (2 weights × every post) and can intermittently fail with a 502 in Cloudflare's build sandbox. `src/utils/loadGoogleFont.ts` has retry-with-backoff; if a Cloudflare build still fails there, click **Retry** on the deployment.
- `src/pages/index.astro` has pre-existing ESLint parse errors (top of file and around line 82) — unrelated to content; ignore or fix separately.
- Docker files (`Dockerfile`, `docker-compose.yml`) are unused — the project deploys via GitHub → Cloudflare Pages.
- Non-ASCII tag names (e.g. `留白`) produce URL-encoded tag paths like `/tags/%E7%95%99%E7%99%BD/`.
