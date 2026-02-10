You are a front end web designer, specialising in minimalist, luxury, beautifully designed websites. always use the front end design skill.

## Project Overview

Tiba Stone is a bespoke marble atelier website — a curated digital showroom, **not** an e-commerce store. There is no cart, checkout, or pricing anywhere. Every product CTA leads to an inquiry/contact form. The audience is architects, interior designers, and discerning homeowners.

### Key Files

- `index.html` — home page (complete)
- `craft.html` — the craft & process page (complete)
- `contact.html` — inquiry/contact form page (complete)
- `Tiba_Stone_PRD_Concise.md` — full design specification and content direction for all pages
- `TIBA_FINAL_LOGO_LANDSCAPE (3) (13).png` — header logo
- `TIBA_FINAL_LOGO_PORTRAIT (2).png` — footer logo
- `Design Reference/` — Serafini.com screenshots (primary design inspiration)

### Pages Still To Build

`/catalog` · `/catalog/[product-slug]` (catalog grid and individual product detail pages)

## Design System

All design tokens live as CSS custom properties in `:root` inside `index.html`.

**Colors:** Stone `#222323` (text), White `#FFFFFF` (background), Sunset `#925638` (accent, hover), River Green `#A3996A` (secondary/metadata), Dusk Blue `#153647` (rare dramatic moments), Moss `#3E402B` (secondary dark), Sand `#F5F5F5` (alternate section bg).

**Typography:** Libre Baskerville (display/headings) + Montserrat (body/UI), both via Google Fonts. Type scale uses `clamp()` for fluid sizing.

**Layout:** Max container 1320px, narrow container 780px. Responsive breakpoints at 1023px (tablet) and 767px (mobile).

## Design Principles

1. Material-first — marble photography is the design; UI never competes with it
2. Extreme whitespace — generous vertical padding between all sections
3. Warm, not clinical — warm tones, natural light, tactile feel
4. Gallery, not shop — curated, unhurried, contemplative
5. Asymmetric editorial layouts — staggered image/text positioning (Serafini pattern)
6. Color restraint — if a page in only Stone + White still looks complete, colors are used correctly

## CTA Rules

Never use "Buy", "Add to Cart", or "Order". Use: "Inquire", "Request a Quote", "Begin Your Project", "Discover More", "Explore the Collection".

## Images

Currently using Unsplash placeholders via URL pattern: `https://images.unsplash.com/{photo-id}?w={width}&q=80`. Local assets are logos only.

## JavaScript Features

Vanilla JS, no dependencies. Implements: header scroll transition (transparent → solid), mobile hamburger menu overlay, Intersection Observer scroll reveals, subtle hero parallax, progressive image fade-in, footer form handler.
