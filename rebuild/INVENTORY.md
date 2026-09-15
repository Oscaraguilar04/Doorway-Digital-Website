# Phase 0 inventory

Inspected the existing repository as a **business and operations reference only**.
Nothing from the old layout, CSS, or JavaScript was imported into this rebuild.

## What the old project actually is

| Item | Finding |
| --- | --- |
| Framework | None. Static `index.html` + `css/styles.css` + `js/script.js` |
| Build tooling | None. No `package.json`, no bundler |
| Deployment | GitHub Pages from `main` |
| Domain | `CNAME` → `acreandsignalstudio.com` |
| Analytics | No GA, Plausible, pixels, or tag manager. Only a custom `acre:track` CustomEvent |
| Fonts in use | Google Fonts: Playfair Display, Inter, Great Vibes |

## Preserved (facts, URLs, owned assets)

These are allowed inputs for the new project. They are **not** an implementation foundation.

### Identity and contact
- Company: Acre & Signal
- Founder: Oscar Aguilar
- Location: Bakersfield, California
- Email: `acreandsignal@outlook.com`
- Site: `https://acreandsignalstudio.com/`

### Working external URLs
- Consultation: `https://calendly.com/acreandsignal/30min`
- Sebastian concept: `https://oscaraguilar04.github.io/Sebastian/`
- Canonical / sitemap / robots already point at the production domain

### Owned assets copied into `rebuild/public/`
- `favicon.svg`
- `images/brand/acre-and-signal-logo-light.webp`
- `images/brand/acre-and-signal-logo-dark.webp`
- `images/brand/acre-and-signal-social.png` (1200×630 OG)
- `images/brand/oscar-aguilar.webp` — **real photograph of Oscar**
- `images/portfolio/sebastian-desktop.webp`
- `images/portfolio/sebastian-mobile.webp`
- `images/portfolio/sebastian-residence.webp`

### Fonts we are allowed to keep using
- Playfair Display (serif) — self-hosted via Fontsource
- Inter (sans) — self-hosted via Fontsource

### Conversion hook to recreate later (not copied)
- Event names: `book_consultation_click`, `view_work_click`, `sebastian_project_click`, `contact_interaction`
- UTM passthrough onto Calendly links
- CustomEvent name used today: `acre:track`

## Intentionally discarded

- Entire `css/styles.css` (tokens mixed with patches, stacked media queries, icon treatments)
- Entire `js/script.js` (nav, scroll chapters, FAQ accordion, reveals)
- Homepage markup and section components
- Header tagline lockup, hero facts, spine, plinth, laptop chrome, giant SVGs
- Great Vibes (signature flourish, not part of the new system)
- Unused / unverified portfolio stills: Camila Reyes, Elena Martinez, Esme Rodriguez, `residence-still.webp`
- Arbitrary spacing, gold extras not in the new color brief, pill-button language, old motion
- Any implication that Sebastian is a client

## Production safety

The live site files at the repository root (`index.html`, `css/`, `js/`, `CNAME`, `assets/`)
were **not modified**. This rebuild lives only under `rebuild/`.
