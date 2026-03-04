# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ReactJS.DE is a German-language React community website built with Astro 5.x. The site features blog posts, tutorials, event listings, and course information for the German React community. It supports both German and English content.

## Development Commands

### Initial Setup
```bash
npm install
git pull --recurse-submodules
```

### Running Development Server
```bash
# Start Astro dev server at http://localhost:4321
npm run dev

# Skip API fetch (for offline/local development)
npm run dev:local
```

### Building for Production
```bash
npm run build
```

### Other Commands
```bash
npm run preview          # Preview production build locally
npm run generate:og      # Generate Open Graph images
npm run generate:og:force # Regenerate all OG images
npm run fetch:all        # Fetch all external data (trainers, events, course)
npm run lint             # Run astro check
```

## Architecture

### Content Structure

**Blog Posts (German)**: Located in `src/content/posts/de/` with structure `YYYY-MM-DD-slug/index.md`
- Each post has its own directory containing the markdown file and associated assets (images, code samples)
- Front matter includes: `title`, `description`, `author`, `published_at`, `categories`, `header_image`
- Collection name: `posts`

**Blog Posts (English)**: Located in `src/content/posts/en/` with structure `slug/index.md`
- Same front matter as German posts, with `language: "en"`
- Use `translation_slug` to link German ↔ English translations
- Collection name: `posts-en`

**Users/Authors**: Located in `src/content/users/` as YAML files

**Content Config**: `src/content/config.ts` defines Zod schemas for all collections

### Pages and Routing

Located in `src/pages/`:
- `index.astro` - German homepage
- `artikel/` - German article listing and detail pages
- `en/` - English pages (index, articles, tutorials)
- `tutorials/` - Tutorial listing page
- `kategorie/` - Category pages
- `meetups/` - Meetup information
- `schulungen/` - Training courses
- `team/` - Team member pages
- `suche/` - Search (powered by Pagefind)
- `feed.xml.ts` - RSS feed

### Layouts
- `BaseLayout.astro` - main template with shared structure
- `PostLayout.astro` - blog post template (supports `lang` prop for i18n)

### Components

Located in `src/components/`:
- `Navigation.astro` - main navigation with mobile menu
- `NavigationBanner.astro` - top banner (multilingual, configured in `src/config/site.ts`)
- `LanguagePicker.astro` - language switcher (DE/EN)
- `PostCard.astro` - article preview card (supports `lang` prop)
- `RelatedPosts.astro` - related articles section
- `Footer.astro`, `Newsletter.astro`, `Pagination.astro`
- Various JSON-LD structured data components

### Internationalization (i18n)

- `src/i18n/ui.ts` - translation strings
- `src/i18n/utils.ts` - language detection and translation helpers
- `src/config/site.ts` - site-wide config including multilingual banner text
- German is the default locale; English pages live under `/en/`

### Custom Plugins

- `src/plugins/remark-workshop-hint.mjs` - transforms `[[cta:training-top]]` and `[[cta:training-bottom]]` shortcodes into styled training call-to-action HTML blocks with i18n support

### Build Scripts

Located in `scripts/`:
- `prebuild.js` - runs all data fetches before build
- `generate-og-images.js` - generates Open Graph social images using Node.js Canvas
- `fetch-trainers.js`, `fetch-events.js`, `fetch-course.js` - fetch external API data
- `fetch-gravatars.js` - download author avatar images
- `migrate-content.js` - one-time migration script from Jekyll

### Open Graph Image Generation

The site generates social media preview images via `scripts/generate-og-images.js`:
1. Reads posts from `src/content/posts/de/`
2. Uses Node.js Canvas to composite: background image + gradient overlay + title + author + logo
3. Images cached in `public/og/` to avoid regeneration
4. Font files from `public/shared/assets/fonts/`
5. Run manually with `npm run generate:og` or `npm run generate:og:force`

### Shared Assets

The `shared/` directory is a git submodule containing reusable assets across workshops.de portals (reactjs.de, angular.de, vuejs.de). Contents are copied/linked into `public/shared/`:
- Shared images, fonts, themes
- Update with: `git pull --recurse-submodules`

### Configuration

- `astro.config.mjs` - Astro config (sitemap, Pagefind, Tailwind CSS, remark plugins, Shiki)
- `src/config/site.ts` - site metadata, navigation structure, banner config
- `firebase.json` - Firebase Hosting config (public dir: `dist`)

### Deployment

- **CI/CD**: GitHub Actions workflow (`.github/workflows/`)
- **Hosting**: Firebase Hosting (config in `firebase.json`, public dir: `dist`)
- **Build triggers**: Push to master, PRs, daily scheduled builds

## Content Authoring

### Creating a New Blog Post

1. Create directory: `src/content/posts/de/YYYY-MM-DD-slug/`
2. Create markdown file: `src/content/posts/de/YYYY-MM-DD-slug/index.md`
3. Add front matter:
```yaml
---
title: "Your Post Title"
description: "SEO description"
author: "Author Name"
published_at: YYYY-MM-DD HH:MM:SS.SSSSSSZ
categories: "react javascript typescript"
header_image: "./header.jpg"
---
```
4. Place images in the same directory (paths are relative to `index.md`)
5. Use standard Markdown image syntax: `![Alt text](image.png)`

### Workshop CTA Shortcodes

Use shortcodes instead of raw HTML for training call-to-actions:
```markdown
[[cta:training-top]]

...article content...

[[cta:training-bottom]]
```
These are transformed by the `remark-workshop-hint` plugin into styled, language-aware HTML blocks.

### Creating English Content

1. Create directory: `src/content/posts/en/slug/`
2. Create `index.md` with `language: "en"` in front matter
3. Link translations using `translation_slug` in both German and English posts

## Technology Stack

- **Astro 5.x**: Static site generator
- **Tailwind CSS 4.x**: Styling (via Vite plugin)
- **TypeScript**: Type checking
- **Node.js**: Runtime, OG image generation (Canvas)
- **Pagefind**: Client-side search
- **Firebase**: Hosting platform
- **GitHub Actions**: CI/CD pipeline

## Automated Article Generation

The repository includes a Claude-powered workflow for generating articles from GitHub issues.

### How to Use

1. Create a GitHub issue with the article topic and relevant information
2. Add the `article` label to the issue
3. The workflow will:
   - Analyze the issue content for quality and relevance
   - Post an analysis report with a recommendation
   - If approved, generate a complete German article (5-10 min read)
   - Create a pull request with the new article in `src/content/posts/de/`

### Requirements

- Issue creator must be a repository OWNER, MEMBER, or COLLABORATOR
- Issue should include:
  - Clear React-related topic
  - Sufficient context or external links
  - Relevance to German React community

### Article Quality Standards

Generated articles follow these guidelines:
- Length: 1500-2500 words (5-10 minute read)
- Language: German
- Style: Informative, friendly, practical
- Code examples in JSX/TypeScript where relevant
- Proper markdown structure with headers
- Front matter with all required fields

## Common Gotchas

- Shared submodule must be initialized for full builds (`git pull --recurse-submodules`)
- API credentials required for fetching external data (events, trainers)
- Post assets must be in the same directory as `index.md`
- OG images are generated separately via `npm run generate:og`, not during `astro build`
- English posts use the `posts-en` collection, German posts use `posts`
- Use `[[cta:...]]` shortcodes instead of raw HTML for workshop hints
- Article generation workflow only runs for repository members/collaborators
