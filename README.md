# ReactJS.DE - Astro Migration

This is the Astro-based version of ReactJS.DE, migrated from Jekyll.

## Quick Start

```bash
npm install
npm run migrate   # Run once to migrate content from Jekyll
npm run dev       # Start development server
npm run build     # Build for production
npm run preview   # Preview production build
```

## Project Structure

```
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable Astro components
│   ├── config/          # Site configuration
│   ├── content/         # Content collections (posts, users)
│   ├── data/            # JSON data files
│   ├── layouts/         # Page layouts
│   ├── pages/           # File-based routing
│   ├── plugins/         # Remark plugins
│   ├── styles/          # Global styles (Tailwind CSS)
│   └── utils/           # Utility functions
├── scripts/             # Build & migration scripts
├── astro.config.mjs
├── firebase.json        # Firebase hosting (dist/)
└── package.json
```

## Migration from Jekyll

The migration script (`scripts/migrate-content.js`) copies:

| Source (Jekyll)     | Destination (Astro)          |
|---------------------|------------------------------|
| `_posts/`           | `src/content/posts/de/`      |
| `_data/users/`      | `src/content/users/`         |
| `assets/img/`       | `public/assets/img/`         |
| `shared/assets/`    | `public/shared/assets/`      |
| `_data/*.json`      | `src/data/`                  |

Run migration: `npm run migrate`

## Features

- Astro 5 with Content Collections & Zod schemas
- Tailwind CSS v4 with dark mode support
- SEO: meta tags, sitemap, RSS feed, JSON-LD
- Pagefind search
- OG image generation (Node.js Canvas)
- Firebase Hosting with GitHub Actions CI/CD

## Content Management

Posts: `src/content/posts/de/YYYY-MM-DD-slug/index.md`
Authors: `src/content/users/*.yaml`

## Deployment

Firebase Hosting via GitHub Actions on push to master.

```bash
npm run build          # Build site
firebase deploy        # Deploy manually
```
