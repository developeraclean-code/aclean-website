# AClean Website Guidelines

## Project Overview

Static HTML website for AClean Service — a local AC service business in Tangerang Selatan, Indonesia. No build system, just plain HTML/CSS.

## Code Style

- **HTML**: Semantic HTML5, Indonesian language (`lang="id"`)
- **CSS**: Custom CSS with CSS variables, no framework
- **Design System**: 
  - Primary color: `#1B3A7B` (dark blue)
  - Accent color: `#F59E0B` (amber)
  - Fonts: Plus Jakarta Sans (headings), DM Sans (body)
- **Animations**: CSS keyframes for fade-in effects

## Architecture

```
Root/
├── index.html              # Homepage
├── layanan/                # Service pages (implicit)
├── blog/                   # Blog posts (10 articles)
└── *.html                  # Static pages (faq, kontak, tentang-kami, etc.)
```

## Build and Test

- **No build process** — edit HTML files directly
- **Testing**: Open in browser to verify changes
- **SEO**: Each page has meta tags, Open Graph, Schema.org JSON-LD

## Conventions

- **Internal links**: Use relative paths (e.g., `blog/index.html`, `kontak.html`)
- **Images**: Inline base64 for favicon; external images referenced normally
- **Schema**: LocalBusiness schema on service pages
- **Language**: All content in Bahasa Indonesia

## Common Tasks

- Update service prices → Edit `index.html` price sections
- Add new blog post → Create in `blog/` folder, update blog index
- Update contact info → Check `kontak.html` and schema in each page

## Important Files

- [index.html](index.html) — Main landing page with services
- [blog/index.html](blog/index.html) — Blog listing page
- [kontak.html](kontak.html) — Contact information