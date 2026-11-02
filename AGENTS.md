# AGENTS.md

Personal blog — "My Personal View to the World" (https://everbox.io) by Jeff Yang. Built on the AstroPaper theme with Astro 5 + TypeScript + Tailwind 4. Deployed from GitHub (`main`) to Cloudflare Pages.

## Commands

- Dev server: `npx astro dev` (port 4321) — serves on <http://localhost:4321>.
- Production build: `npx astro build`. The full `build` script adds the rest: `astro check && astro build && pagefind --site dist && cp -r dist/pagefind public/`.
- Type check: `npx astro check`; Lint: `npx eslint .`; Format: `npx prettier --write .`.
- **Package manager:** `pnpm` is the project's recommended method — the repo carries `pnpm-lock.yaml` and `node_modules/.pnpm/`. On a machine that has it, `pnpm run <script>` is the correct invocation. This machine happens not to have the `pnpm` binary, so the `npx <tool>` forms above are the local equivalents; that is a property of this machine, not a change of recommendation.

## Content conventions

- Posts live in `src/data/blog/<category>/` — `tech`, `culture` (the second-largest), `travel`, `philosophy`, `photo` — NOT `src/content/`. Loaded by a glob loader in `src/content.config.ts` (`BLOG_PATH`, pattern `**/[^_]*.md`: a leading underscore keeps a file out of the build).
- **Filenames**: `yymmdd-lowercase-slug.md` — 6-digit date prefix, lowercase, hyphens. No underscores, camelCase, 10-digit timestamps, or `.md.md`.
- **URLs derive from the filename** (`getPath` in `src/utils/getPath.ts`): `/posts/<category>/<lowercase-filename-without-ext>/`. Renaming a file changes its URL.
- When renaming a **published** post, preserve the old URL by adding a redirect to `postRedirects` in `astro.config.ts` (old URL → new URL).
- Frontmatter: `draft: true` hides a post from the build; a missing `draft` means published. `featured: true` puts a post in the homepage block — see Featured posts below.
- **MUST quote any frontmatter value that contains YAML-special characters — especially `: ` (colon + space).** Unquoted, `description: Foo: bar` is parsed as a mapping and fails the build at content sync. Wrap the whole value in double quotes: `description: "Foo: bar"`. Applies to every field (`title`, `description`, …). This has bitten us several times. See Gotchas for the failure signature.
- Internal links (prev/next, cards, tags) are auto-generated — never hardcode `/posts/...` URLs.
- `.orig` files (`src/pages/_index.astro.orig`, `src/layouts/PostDetails.astro.orig`, `src/data/blog/predefined-color-schemes.md.orig`) are intentional references — **never modify or delete them**.

## Featured posts (`featured: true`)

`featured` is not a badge — it is the **top block of the homepage**: `src/pages/index.astro` splits posts into a "Featured" block (`data.featured`) and a "Recent posts" block (everything else). Keep it a small, curated front-door list, not a second full index.

- **Approval required.** Never flip `featured` (on or off), or add/remove a featured post, without the user's **explicit approval**. Propose the change — which posts to keep vs demote — and wait for a go-ahead before editing.
- **Cap:** `min(20% of published posts, 16)`. Hard ceiling — never exceed it.
- **Aim:** 10–12. Below 12, feature freely. At 12 or more, a new featured post must be paired with a demotion in the same edit (propose it per Rotation below). Being over the aim is not an emergency; it is a debt settled by the next feature.
- **Criteria** — a post earns featured only if it is at least one of: a **signature/opinion essay** that defines the blog's voice; a **deep, evergreen technical dive** (broadly useful, not a quick fix); or a **milestone/retrospective**. It must **not** be a how-to/quick note, a release/changelog, or a working/unfinished note.
- **Never feature a Chinese post.** Every `-zh-hans`, `-zh-hant`, or legacy `-chn` file is `featured: false` — translations included, however strong the original. The featured block is English-only.
- **Balance:** keep a mix across categories (`tech`, `culture`, `travel`, `philosophy`, `photo`) so the top block shows range.
- **Rotation:** when a new post earns featured, **propose** a demotion so the cap holds — never demote on your own; the approval rule above still applies. Propose in this order: (1) never demote the last post of a theme unless a replacement from that theme is promoted in the same edit; (2) weakest against the criteria above — a narrow feature note goes before an evergreen dive, a how-to shaped post goes first; (3) oldest breaks the tie; (4) flip only the `featured` bit — leave `modDatetime` alone, since this is metadata, not substantive change.

## Images

- Images live in `src/assets/images/`, referenced by literal relative path from markdown (e.g. `../../../assets/images/260526-msgtips.png`).
- **Filenames**: same rules as post filenames — lowercase, hyphens only, 6-digit `yymmdd` prefix, no underscores or camelCase. (ISO `YYYY-MM-DD` and 10-digit `yymmddhhmm` prefixes have been normalized away.)
- Renaming an image requires updating every reference, then rebuild and verify links.

## Gotchas

- **Unquoted colon** (rule in Content conventions). The build fails at content sync with `bad indentation of a mapping entry` / `mapping values are not allowed in this context`. Cloudflare then keeps serving the **previous** deployment, so the new post appears missing and search won't find it. `npx astro build` reproduces the exact error locally.
- **OG images**: `src/pages/posts/[...slug]/index.png.ts` renders per-post `index.png` via satori. It downloads IBM Plex Mono from Google Fonts at build time (2 weights × every post) and can intermittently fail with a 502 in Cloudflare's build sandbox. `src/utils/loadGoogleFont.ts` has retry-with-backoff; if a Cloudflare build still fails there, click **Retry** on the deployment.
- `src/pages/index.astro` has pre-existing ESLint parse errors (top of file and around line 82) — unrelated to content; ignore or fix separately.
- Docker files (`Dockerfile`, `docker-compose.yml`) are unused — the project deploys via GitHub → Cloudflare Pages.
- Non-ASCII tag names (e.g. `留白`) produce URL-encoded tag paths like `/tags/%E7%95%99%E7%99%BD/`.
