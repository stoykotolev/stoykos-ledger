import { defineConfig, sessionDrivers } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import rehypeExternalLinks from "rehype-external-links";

export default defineConfig({
  site: "https://stoykotolev.com",
  output: "static",
  // Fully static site, no astro:session usage — disable the Cloudflare
  // adapter's default Cloudflare KV session binding so it stops injecting
  // an unprovisioned "SESSION" kv_namespace into wrangler.json, which
  // Cloudflare Pages' build fails to validate (missing "id").
  session: {
    driver: sessionDrivers.null(),
  },
  adapter: cloudflare({
    imageService: "compile",
    prerenderEnvironment: "node",
  }),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
    ],
    shikiConfig: {
      theme: "github-dark",
      wrap: true,
    },
  },
});
