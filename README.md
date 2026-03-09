# stoykos-ledger

Personal blog and technical ledger built with [Astro](https://astro.build), deployed on [Cloudflare Pages](https://pages.cloudflare.com).

## Stack

- **Framework:** Astro 5 (static output)
- **Styling:** Tailwind CSS v4 + `@tailwindcss/typography`
- **Syntax highlighting:** Shiki with `github-light` / `github-dark` dual themes
- **Search:** Fuse.js (client-side)
- **Feeds:** RSS via `@astrojs/rss`, sitemap via `@astrojs/sitemap`
- **Deployment:** Cloudflare Pages (Wrangler)
- **Package manager:** pnpm

## Features

- Dark mode (class-based, persisted via `localStorage`)
- Tag-based post filtering
- RSS feed at `/rss.xml`
- Client-side search
- External links open in a new tab (`rehype-external-links`)

## Project Structure

```
src/
├── content/posts/    # Markdown blog posts
├── layouts/          # Base.astro, Post.astro
├── lib/              # Utility functions
├── pages/            # File-based routes (index, blog/[slug], tags/, search, rss.xml)
└── styles/           # global.css (Tailwind + Shiki overrides)
```

## Development

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build
pnpm preview
```

## Deployment

The site is deployed to Cloudflare Pages. CI runs on pull requests via GitHub Actions.
