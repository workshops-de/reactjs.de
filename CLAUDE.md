# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ReactJS.DE is a German-language React community website built with Jekyll (Ruby-based static site generator). The site features blog posts, tutorials, event listings, and course information for the German React community.

## Development Commands

### Initial Setup
```bash
# Install Ruby dependencies
gem install bundler
bundle install

# Update git submodules (shared assets)
git pull --recurse-submodules
```

### Running Development Server
```bash
# Start Jekyll development server at http://localhost:4000
bundle exec jekyll serve --incremental

# The --incremental flag speeds up rebuilds by only processing changed files
```

### Building for Production
Jekyll builds are handled automatically via GitHub Actions on push to master. Manual builds are rarely needed, but would use:
```bash
JEKYLL_ENV=production bundle exec jekyll build
```

## Architecture

### Content Structure

**Blog Posts**: Located in `_posts/` with directory structure `_posts/YYYY-MM-DD-slug/YYYY-MM-DD-slug.md`
- Each post has its own directory containing the markdown file and associated assets (images, code samples)
- Front matter includes: `title`, `description`, `author`, `published_at`, `categories`, `header_image`
- Posts use Jekyll's postfiles plugin to co-locate assets with content

**Pages**: Located in `_pages/` as a Jekyll collection with custom permalinks

**Layouts**: Located in `_layouts/`
- `base.html` - main template with shared structure
- `post.html` - blog post template
- `page.html` - generic page template
- `autopage_category.html` - auto-generated category pages

**Data Files**: Located in `_data/`
- `course.json`, `trainers.json` - imported from external sources
- `events`, `related_events` - meetup and event information
- These are populated by Ruby plugins during build

### Custom Jekyll Plugins

Located in `_plugins/`, these run during Jekyll build:

- **filter_opengraph.rb**: Generates Open Graph images for blog posts using Node.js Canvas
  - Creates unique OG images from post metadata (title, author, date, header image)
  - Only runs in production (`JEKYLL_ENV=production`)
  - Uses `opengraph.js` Node script with Canvas library

- **fetch_meetups.rb**: Fetches React meetup data using Meetup API (requires API credentials)
- **fetch_current_events.rb**: Fetches upcoming events from external API
- **fetch_current_trainers.rb**: Fetches trainer information
- **fetch_course_reviews.rb**: Fetches course review data
- **jekyll-extlinks.rb**: Adds `rel` and `target` attributes to external links

### Open Graph Image Generation

The site automatically generates social media preview images:
1. Jekyll plugin (`filter_opengraph.rb`) invokes Node.js script during build
2. `opengraph.js` uses Canvas to composite: background image + gradient overlay + title + author + logo
3. Images cached in `opengraph/` directory to avoid regeneration
4. Font files required from `shared/assets/fonts/` (git submodule)

### Shared Assets Submodule

The `shared/` directory is a git submodule containing reusable assets across multiple workshops.de portals (reactjs.de, angular.de, vuejs.de):
- Shared layouts, plugins, images, fonts, themes
- Update with: `git pull --recurse-submodules`
- Note: The submodule may be empty in some checkouts - shared assets are referenced via `shared/` path in configs

### Configuration

**_config.yml** key settings:
- `plugins_dir: ["_plugins/", "shared/plugins/"]` - loads plugins from both local and shared locations
- `og_generator_enabled: true` - enables Open Graph image generation
- Pagination: 5 posts per page
- Auto-generated category pages
- External link handling with `rel` attributes

### Deployment

- **CI/CD**: GitHub Actions workflow (`.github/workflows/`) builds on push to master
- **Hosting**: Firebase Hosting (config in `firebase.json`)
- **Build triggers**: Push to master, PRs, daily scheduled builds (2 AM UTC)
- **Environment**: Requires secrets for API integrations (YouTube, Meetup)

### Firebase Configuration

`firebase.json` defines:
- Public directory: `_site` (Jekyll output)
- Extensive redirects for SEO (old URL patterns to new structure)
- Cache headers for static assets (7 days for images/CSS)
- Special headers for RSS feed and code examples

## Content Authoring

### Creating a New Blog Post

1. Create directory: `_posts/YYYY-MM-DD-slug/`
2. Create markdown file: `_posts/YYYY-MM-DD-slug/YYYY-MM-DD-slug.md`
3. Add front matter:
```yaml
---
title: "Your Post Title"
description: "SEO description"
author: "Author Name"
published_at: YYYY-MM-DD HH:MM:SS.SSSSSSZ
categories: "react javascript typescript"
header_image: "./images/header.jpg"
---
```
4. Place images in same directory (`./images/header.jpg` is relative to post directory)
5. Images are automatically copied to `_site` by jekyll-postfiles plugin

### Image Lazy Loading Pattern

The site uses a lazy loading pattern for images:
```html
<img src="/shared/assets/img/placeholder-image.svg"
     alt="Description"
     class="lazy img-fluid img-rounded"
     data-src="actual-image.png"
     data-srcset="actual-image.png" />
```

## Technology Stack

- **Jekyll 4.4+**: Static site generator
- **Ruby**: Runtime for Jekyll and plugins
- **Node.js**: Required for Open Graph image generation (Canvas library)
- **Firebase**: Hosting platform
- **GitHub Actions**: CI/CD pipeline

## Ruby Version

Requires Ruby 2.5+ (specified in `.ruby-version` and Gemfile)

## Common Gotchas

- Open Graph images only generate in production mode (`JEKYLL_ENV=production`)
- Shared submodule must be initialized for builds to work properly
- API credentials required for fetching external data (meetups, events, reviews)
- Post assets must be in same directory as markdown file for postfiles plugin to work
- The `shared/` submodule may appear empty - this is normal for local development
