# Acre & Signal — clean rebuild

Isolated from the live GitHub Pages site. The production files at the
repository root must stay until this project is built, QA’d, and explicitly
approved for deployment.

Checkpoint 1 is the **design system only**. There is no homepage yet.

## Preview

```bash
cd rebuild
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

Production build:

```bash
cd rebuild
npm run build
npm run preview
```

Open `http://127.0.0.1:4173/`.

## What this folder is

| Path | Role |
| --- | --- |
| `src/styles/tokens.css` | Color, type, space, layout, motion tokens |
| `src/styles/reset.css` | Document defaults |
| `src/styles/typography.css` | Display, title, body, label |
| `src/styles/components.css` | Container, buttons, links, media |
| `src/styles/specimen.css` | Temporary system page. Delete later. |
| `src/content/site.js` | Business facts and URLs |
| `src/lib/track.js` | Conversion hook (unused until later) |
| `public/` | Owned images and favicon only |

## Do not deploy from here yet
