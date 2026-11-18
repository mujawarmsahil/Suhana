# Suhana Firoj Attar — Interior Design Portfolio

A React portfolio built with Vite. The project keeps its original renders, concept board, and technical drawings in `images/`; the image paths and captions are maintained in `src/data/projects.js`.

## Local development

```sh
npm install
npm run dev
```

Create and preview a production build:

```sh
npm run build
npm run preview
```

## Vercel deployment

Import the repository into Vercel and use the Vite preset. The build command is `npm run build`, and the output directory is `dist`. `vercel.json` routes the project case-study URL back to the React app.

## Portfolio content

- Update the student profile in `src/data/profile.js`.
- Add or update project content and image imports in `src/data/projects.js`.
- The existing school listing is kept configurable. Confirm it against the drawing title blocks before changing it; the title blocks list a different institute name.
- No email or social account was available in the source portfolio. Add a verified email to `profile.contactEmail` to enable the form’s `mailto:` fallback. Until then, the form validates input and clearly reports that it cannot send a message.

The hero’s 3D room is an independent conceptual study, not a model of the Mughal-inspired restaurant. It is lazy-loaded on larger screens; a static SVG fallback is used on narrow screens, with reduced motion, or if WebGL fails.
