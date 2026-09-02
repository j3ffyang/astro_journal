import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import remarkToc from "remark-toc";
import remarkCollapse from "remark-collapse";
import {
  transformerNotationDiff,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from "@shikijs/transformers";
import { transformerFileName } from "./src/utils/transformers/fileName";
import { SITE } from "./src/config";

// https://astro.build/config
const postRedirects = {
  "/posts/tech/250424_hermes_nvidia_nemotron":
    "/posts/tech/250424-hermes-nvidia-nemotron",
  "/posts/tech/250813_update2lizi": "/posts/tech/250813-update2lizi",
  "/posts/tech/250816_compare_perplexity_gemini":
    "/posts/tech/250816-compare-perplexity-gemini",
  "/posts/tech/250820_releasemybook": "/posts/tech/250820-releasemybook",
  "/posts/tech/250829_rsync": "/posts/tech/250829-rsync",
  "/posts/tech/250906_gpg": "/posts/tech/250906-gpg",
  "/posts/tech/250909_designphilosophy": "/posts/tech/250909-designphilosophy",
  "/posts/tech/250925_archhypr": "/posts/tech/250925-archhypr",
  "/posts/tech/251017_astrogiscus": "/posts/tech/251017-astrogiscus",
  "/posts/tech/260126_arch_on_dell": "/posts/tech/260126-arch-on-dell",
  "/posts/tech/260205_nvim": "/posts/tech/260205-nvim",
  "/posts/tech/260320_openclawactivity": "/posts/tech/260320-openclawactivity",
  "/posts/tech/2603271113_openclaw-security_eng":
    "/posts/tech/2603271113-openclaw-security-eng",
  "/posts/tech/260406_openclaw-custom-skills":
    "/posts/tech/260406-openclaw-custom-skills",
  "/posts/tech/260414_hermes_openroutermd":
    "/posts/tech/260414-hermes-openrouter",
  "/posts/tech/260513-choosecc_opencode":
    "/posts/tech/260513-choosecc-opencode",
  "/posts/tech/2603271113-openclaw-security-eng":
    "/posts/tech/260327-openclaw-security-eng",
  "/posts/travel/2603231032-the-timeless-allure-of-motorcycle-riding":
    "/posts/travel/260323-the-timeless-allure-of-motorcycle-riding",
  "/posts/philosophy/260722-unknownunknowns2":
    "/posts/philosophy/260722-unknown-unknowns",
  "/posts/tech/260807-amd": "/posts/tech/260807-gpd-dual-amd-gpu",
} as const;

export default defineConfig({
  site: SITE.website,
  redirects: postRedirects,
  integrations: [
    sitemap({
      filter: page => SITE.showArchives || !page.endsWith("/archives"),
    }),
  ],
  markdown: {
    remarkPlugins: [remarkToc, [remarkCollapse, { test: "Table of contents" }]],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "min-light", dark: "night-owl" },
      defaultColor: false,
      wrap: false,
      transformers: [
        transformerFileName({ style: "v2", hideDot: false }),
        transformerNotationHighlight(),
        transformerNotationWordHighlight(),
        transformerNotationDiff({ matchAlgorithm: "v3" }),
      ],
    },
  },
  vite: {
    // eslint-disable-next-line
    // @ts-ignore
    // This will be fixed in Astro 6 with Vite 7 support
    // See: https://github.com/withastro/astro/issues/14030
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
  },
  image: {
    responsiveStyles: true,
    layout: "constrained",
  },
  env: {
    schema: {
      PUBLIC_GOOGLE_SITE_VERIFICATION: envField.string({
        access: "public",
        context: "client",
        optional: true,
      }),
    },
  },
  experimental: {
    preserveScriptOrder: true,
  },
});
