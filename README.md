# Sarthak Chadha — portfolio for GitHub Pages

A complete static portfolio connecting engineering, research and perfumery.

**Start with `START_HERE.txt`.** Detailed GitHub, DNS, HTTPS and domain-forwarding instructions are in `GITHUB_AND_IONOS_SETUP.md`.

## Publish the first version

The `docs/` directory is already built. Upload this repository's contents to a new GitHub repository, then choose **Settings → Pages → Deploy from a branch → main → /docs**.

The links work both at a repository URL such as `https://petrichor-sc.github.io/sarthak-portfolio/` and at the custom domain. The example repository URL will exist only after you create and publish that repository.

The intended main address is **https://sarthakchadha.com/**. The `.de`, `.global` and `.store` domains should use IONOS forwarding to that main address. The supplied configuration does not apply those external account settings automatically.

## What is included

| Location | Purpose |
| --- | --- |
| `docs/` | Ready-to-publish website |
| `public/assets/` | Original supplied photos and actual application screenshot |
| `src/` | Portfolio styles and interactions |
| `scripts/build.mjs` | Generates the portfolio and integrates the app |
| `apps/communication-systems/` | Source and prebuilt export from the supplied ZIP |
| `deployment/CNAME` | Correct main domain, ready to copy into the publishing source if needed |

The project collection includes:

- **Communication Systems:** opens the working browser application, with a link back to the portfolio.
- **SENSA:** a research overview focused on onboarding and calibration.
- **EDA Analysis Pipeline:** opens its Python/Jupyter source repository.
- **Synesthesia:** a digital-olfaction research page using real prototype photographs.

All four supplied photos are included unchanged. Cropping is handled by the browser. SENSA uses typography instead of a fabricated screenshot, and the EDA preview is a labeled workflow diagram.

## Edit and rebuild the portfolio

Use Node.js 22.13 or newer. The portfolio build itself has no package dependencies.

```sh
node scripts/build.mjs
```

Upload the resulting `docs/` changes. Portfolio content is in `scripts/build.mjs`; styling and interactions are in `src/site.css` and `src/site.js`. The build keeps an existing `docs/CNAME` file. Keep the custom-domain file in future uploads after setting the domain in GitHub Pages.

## Update Communication Systems

Its original React/TypeScript source, dependency lockfile, README and third-party notices are preserved under `apps/communication-systems/`.

1. Install its dependencies with `npm --prefix apps/communication-systems ci`.
2. Make the application changes.
3. Build the application with `npm run build:communication`.
4. Run `npm run build` from this repository's root to copy the updated app into the portfolio.
5. Upload the changed source and `docs/` output to GitHub.

The portfolio build adds its return link after copying the application's prebuilt export. The app keeps its own interface, signal model and browser storage behavior.

## Content still to add

- Authentic SENSA screenshots.
- A preferred public contact email and a connected enquiry form. Current contact links open LinkedIn, GitHub and Essentia.
- Any required photographer credits.

## Input provenance

Communication Systems is imported from the uploaded `Communication_Systems_GitHub_Pages.zip`.

SHA-256: `2d50d38c5bce82f669445b8833bcb3077b1280209bdcec11dfd20bce61339e3e`.

