# TIBA STONE — Website PRD

*v1.1 · February 2026 · Reference: [Serafini](https://serafini.com)*

---

## 1. Overview

Tiba Stone is a bespoke marble atelier. The website is a **curated digital showroom** — not an e-commerce store. No cart, no checkout, no pricing displayed anywhere. Every piece is bespoke (custom materials, dimensions, finishes), so **every product CTA on the site leads to an inquiry/contact form** — never to a purchase flow. The entire site funnels toward conversation, not transaction. The audience is architects, interior designers, and discerning homeowners.

The Serafini website is the primary design reference — study it closely. The patterns that matter most: extreme generosity with whitespace, material-first photography in warm natural light, restrained typography, muted palette, asymmetric editorial layouts that alternate image/text positioning, and product pages that feel like immersive single-scroll experiences.

### Design Principles

1. **Let the stone speak.** The marble is the design. UI never competes with it.
2. **Earned minimalism.** Simple must feel intentional and luxurious, not empty.
3. **Warmth over sterility.** Warm, tactile, human — reflecting the handmade nature of the pieces.
4. **Gallery, not shop.** Curated, unhurried, contemplative.
5. **Craft is the story.** The journey from raw block to finished object is as compelling as the product itself.

### Site Structure

| Page | Purpose |
|------|---------|
| **Home** | Brand introduction, hero moment, curated highlights, entry points |
| **Craft** | Editorial story of the craftsmanship, process, materials, philosophy |
| **Catalog** | Featured products → featured collections → full product grid |
| **Product Detail** | Immersive product experience with photography, specs, materials, inquiry |
| **Contact** | Inquiry form, location, showroom information |

**URL structure:** `/` · `/craft` · `/catalog` · `/catalog/[product-slug]` · `/contact`

Any product should be reachable within two clicks from home. No nested sub-menus or mega-menus.

---

## 2. Brand Identity

### Color Palette

The palette is rich but used with **extreme restraint** on the website. The vast majority of every page is White and Stone. Accent colors appear at specific, intentional moments — never as large background fills. The marble photography provides all the color variety the site needs.

| Name | Hex | Website Role |
|------|-----|------|
| **Stone** | `#222323` | Primary text, headings, nav, logotype, CTA fills. Replaces pure black everywhere. |
| **White** | `#FFFFFF` | Primary page background. The dominant color of the entire website. |
| **Sunset** | `#925638` | Primary accent, used sparingly — hover underlines, accent rules, interactive highlights. Never a section background fill. |
| **River Green** | `#A3996A` | Secondary accent — metadata labels, secondary text, form field borders, category tags. |
| **Dusk Blue** | `#153647` | Deep contrast for rare dramatic moments — footer background option, a single dark banner. Max 1–2 uses per page. |
| **Moss** | `#3E402B` | Secondary dark tone — same sparing rules as Dusk Blue. |

**The test:** if a page rendered in only Stone + White still looks complete, the color usage is correct.

### Typography

**Baskerville** — the display serif. Used for all headings, product names, and pull quotes. Uppercase with generous letter-spacing for titles. Italic available for editorial moments.

**Montserrat** — the body sans-serif. Used for body copy, navigation, buttons, forms, captions, and metadata. Light weight for body text to create an airy reading experience. Medium weight for nav and button labels. Uppercase with letter-spacing for UI elements, sentence case for body text.

The type scale should follow a clear hierarchy from large serif hero titles down to small uppercase sans-serif labels, with plenty of breathing room between sizes. Reference the Serafini site for scale and proportions.

### Logo

The TIBA wordmark: widely spaced, geometric uppercase letterforms. Stands alone — no box, badge, or icon. Stone on light backgrounds, White on dark. Footer treatment is larger, optionally with a descriptor line beneath in Montserrat Light.

---

## 3. Global Design System

### Layout

Content lives within a max-width container, centered on the page. Most text and grids sit within roughly 8–10 columns of a 12-column grid — content should never feel like it's stretching wall-to-wall. Heroes and background bands go full-bleed.

**Whitespace is the most important design element.** Sections need generous vertical spacing between them. If anything feels crowded, it needs more space, not more content. Study the Serafini site for proportions — it's very generous.

### Navigation

**Header:** Fixed/sticky horizontal bar. TIBA wordmark left, nav links center (Home, Craft, Catalog, Contact), right zone for language selector or left empty. Transparent over the hero, transitioning to solid White with a subtle bottom rule on scroll. Hover underlines in Sunset. Active page indicated with underline or weight change.

**Mobile:** Hamburger icon → full-screen overlay with large centered Baskerville nav links and a close icon.

### Footer

Multi-column layout: brand column (wordmark, tagline, social icons), navigation sitemap, and a compact inline contact form — so there's an always-available inquiry touchpoint on every page. Can use White background or Dusk Blue for dramatic contrast. Legal links and copyright in small text at the bottom.

### Buttons

**Primary CTA:** Outlined rectangle, Stone border and text, no fill. On hover, fills to Stone with White text. Sharp corners only — no rounded corners, gradients, or shadows.

**Secondary CTA:** Text-only link with a thin underline or appended arrow. Understated.

**Global CTA rule:** Every product-related CTA on the site — whether on the home page, catalog, product cards, or product detail pages — leads to an inquiry form, not a checkout. The site has no purchase flow. CTAs use language like "Inquire," "Request a Quote," "Begin Your Project," or "Discover More" (which leads to the product page, where the inquiry form lives). Never "Buy," "Add to Cart," or "Order."

### Dividers

Full-width thin rules (Stone at low opacity) between major sections. Short centered accent rules in Sunset above or below key headings for warm punctuation.

---

## 4. Home Page

The primary brand statement. Communicates what Tiba Stone is, what it feels like, and where to go next. Sections alternate between immersive imagery and concise text.

### Hero
Full-viewport, full-bleed image (or split-screen pair) showing products in situ — architectural spaces, natural light, not product-on-white. Centered text overlay with headline and single outlined CTA. Header sits transparently on top. Optional slow carousel with dot indicators. Subtle scroll indicator at bottom.

### Brand Introduction
Centered text block below the hero, narrow width. Large wordmark or brand name, uppercase subtitle, 2–3 short paragraphs about heritage and philosophy. White background with very generous vertical padding.

### Gallery / Showroom Teaser
Asymmetric two-column layout: large editorial photo on one side, text block offset on the other with heading, body text, and outlined CTA. Warm sand/neutral background band. The staggered positioning (image and text at different vertical levels) is a key Serafini pattern.

### Exclusive Creations
1–2 signature pieces with large-format photography in dramatic, gallery-lit environments. Minimal text — the imagery compels. White background.

### Category Teasers
Two side-by-side panels with background product images, subtle dark overlay for readability, bold serif heading per category, and outlined CTAs.

### Craftsmanship Teaser
Warm-toned section with workshop/hands imagery, heading, short paragraph, and CTA linking to the Craft page. The human element is essential.

### Customization Callout
Asymmetric two-column layout communicating the bespoke offering. Image of custom work or material samples on one side, explanatory text and CTA on the other. Optional horizontal strip of marble type images below.

### Expert Advice Banner
Narrow full-width banner. Single line of Baskerville italic, centered. White text on Dusk Blue or Moss background — a moment of quiet authority. No CTA.

---

## 5. Craft Page

A long-form editorial page telling the story of how pieces are made. Not a dry manufacturing overview — a visual, emotional narrative that reads like a design magazine feature.

### Hero
Full-bleed image (workshop or quarry, dramatic). Centered overlay heading in large Baskerville.

### Philosophy Statement
Centered narrow text block. 2–3 paragraphs on the Tiba Stone philosophy. White background, very generous padding.

### The Process (Core Section)
4–6 production stages, each presented as a visual vignette. Stages alternate between image-left/text-right and text-left/image-right to create editorial rhythm. Each stage gets a large image, a stage number or label, a heading, and 1–2 paragraphs.

**Suggested stages:** Material Selection → Design → Cutting & Shaping → Hand Finishing → Quality & Inspection → Installation

### Materials Showcase
Grid of marble sample macro photographs, each labeled with stone name and origin. Warm sand background band.

### Three Pillars
Three equal-width cards with images and bold headings: DESIGN / CRAFTSMANSHIP / MATERIALITY (or equivalent), each with a short descriptor and outlined CTA. This section repeats across multiple pages as a brand signature.

### Close CTA
Centered heading and CTA bridging to the Contact page.

---

## 6. Catalog Page

The complete product offering on a single scrollable page, organized in three tiers.

### Page Hero
Compact hero with full-bleed product image, "TIBA STONE COLLECTION" overlay, and subtitle. Below: two side-by-side outlined category buttons (e.g., "BATH" / "LIVING").

### Featured Products (Tier 1)
2–3 signature pieces with premium treatment. Each gets a full section with large-format image, product name in Baskerville, poetic description, category label, and outlined CTA. Alternating image/text positioning. Alternating White and warm sand backgrounds.

### Featured Collections (Tier 2)
Curated groupings by theme, material, or use case. Each collection gets a heading and product card grid.

**Product card design:** Clean and minimal — product image on light background, product name, type label in small uppercase, subtle "Discover More" link that leads to the product detail page (and ultimately to the inquiry form). No price, no ratings, no badges, no "add to cart" — ever. Consistent image aspect ratios. Subtle scale on hover.

### Full Product Grid (Tier 3)
All products in a multi-column grid. Minimal horizontal tab-style filter bar (All / Washbasins / Bathtubs / Furniture / etc.). Active filter indicated with underline. Same card design throughout. "Load More" button if needed, not infinite scroll.

### Tailor-Made CTA
Bespoke service callout with heading, brief text, strip of custom work images, and CTA linking to Contact.

### Three Pillars (Repeated)
Same Design/Craftsmanship/Materiality section from the Craft page.

---

## 7. Product Detail Page

**The most critical page.** Where a client decides to inquire. Immersive, informative, and beautiful — an experience to scroll through slowly, not a spec sheet.

### Product Hero
Split layout mirroring the Serafini product pages (Cup, Cono):

**Left column (~1/3):** Breadcrumb trail → category label (small uppercase) → product name (large Baskerville) → poetic description (3–5 sentences) → "Inquire About This Piece" primary CTA (links to the inline inquiry form further down the page or the Contact page) + "Download Technical Sheet" secondary link. Text vertically centered against the image.

**Right column (~2/3):** Large hero image in styled environment (not on white). Natural light, visible veining. A large, semi-transparent vertical watermark word along the edge ("FORM" / "STONE" / "DETAIL") — matching the Serafini treatment.

### Veining & Color Detail
Close-up detail image paired with heading and 1–2 paragraphs describing the specific marble, its origin, and characteristics. Product-specific copy.

### About / Design Story
Text block (narrow max width) offset from a large image. Baskerville heading + 2–3 paragraphs on design philosophy and intent. Positions the piece as living sculpture.

### Detail Photography Gallery
3–6 high-resolution images in a **staggered layout** — not a uniform grid. Mix of full-width, paired, and inset images with whitespace. "DETAILS" vertical watermark. Cover every angle: top-down, side, edge detail, interior, in-context room shot. These should be the highest-quality images on the site.

### Material & Finish Selector
Row of small marble sample thumbnails with names. Selected material highlighted. Clicking updates the product image if variant shots exist. "MATERIALS AND FINISHES" heading, optional catalogue download CTA.

### Technical Specifications
Clean, minimal table:

| Field | Content |
|-------|---------|
| Dimensions | L × W × H |
| Weight | kg / lbs |
| Material Options | Available marbles |
| Finish | Polished, honed, brushed, etc. |
| Installation | Freestanding, wall-mounted, countertop, etc. |
| Custom Sizing | Availability |

### Lifestyle Image
Full-bleed image of the product installed in an aspirational interior. No text overlay. Generous breathing room.

### Related Products
2–4 product cards (same design as catalog) under a "Discover Other Tiba Stone Pieces" heading. Prioritize same category, then adjacent categories.

### Inquiry Form
This is the conversion point of the product page — the destination every CTA on the page ultimately points to. An inline, product-specific contact form: Name, Surname, Email, Phone, Message. Filled Stone button ("Send"). The product name (and selected material/finish, if chosen above) should be auto-included in the inquiry so the team has full context. Privacy consent checkbox. Social/messaging icons below.

### FAQ
3–5 accordion questions (customization, marble options, delivery, lead time). Clean styling with thin rules between items, expand/collapse icons.

---

## 8. Contact Page

The conversion destination. Welcoming and effortless.

### Hero
Centered Baskerville heading + single supporting line. No background image. White and type only.

### Form
**Fields:** Name + Surname (two columns) → Email + Phone (two columns) → Subject dropdown (General Inquiry, Bespoke Commission, Architect/Designer, Trade Partnership, Press, Other) → Message textarea → Privacy consent → Filled Stone "Send" button.

**Styling:** Bottom-border-only inputs. River Green borders that transition to Stone on focus (floating label pattern). Error states in Sunset. Success: smooth transition to a centered "Thank you" confirmation in Baskerville.

### Location & Showroom
Two-column: contact details left (address, phone, email, hours), map or showroom photo right.

---

## 9. Interaction & Motion

All animation is subtle and purposeful — enhances quality without calling attention to itself.

- **Scroll reveals:** Content fades in and shifts up gently as it enters the viewport. Staggered timing for adjacent elements.
- **Image reveals:** Optional curtain/wipe effect on large images.
- **Parallax:** Very subtle on heroes and large backgrounds. Barely perceptible.
- **Hover states:** Nav underlines slide in. Product card images scale up slightly within their container. CTAs fill smoothly.
- **Page transitions:** Smooth crossfade between pages if feasible.
- **Loading:** Progressive blur-up or White placeholder that fades to the loaded image. No spinners or skeleton screens.

---

## 10. Responsive

**Desktop:** Full multi-column layouts as described. **Tablet:** Columns reduce or collapse. **Mobile:** Single column, all content stacks vertically.

Mobile nav becomes full-screen overlay. Heroes stay full-bleed but reduce height. Product grids go to 2 columns. The product detail hero stacks image on top, info below. Footer columns stack. Typography scales down proportionally but body text stays readable. All touch targets meet accessibility minimums.

---

## 11. Photography & Content

### Photography
Photography is the most important element on the site. Everything else serves it.

**Products:** Always in styled architectural environments (not white backdrops). Natural directional light, warm tones. Accurate marble color. Multiple angles per product including detail close-ups and in-context room shots. High resolution throughout.

**Craft/process:** Documentary but beautiful. Real workshop, real hands, real dust — composed with intention.

**Lifestyle:** Warm, architecturally interesting spaces. Raw plaster, warm wood, brass, greenery.

### Copy Direction
**Voice:** Confident and quiet. Material-focused and tactile. Timeless vocabulary — never trendy or techy. Economical — every sentence earns its place.

**Lengths:** Hero overlays ~5–8 words. Section body text ~2–4 sentences. Product descriptions ~3–5 sentences. CTAs ~2–3 words.

**SEO:** Naturally integrate key terms (bespoke marble washbasin, marble bathtub, custom marble furniture, handcrafted stone) into headings, body, meta descriptions, and alt text.
