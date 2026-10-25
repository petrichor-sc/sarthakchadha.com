# Sarthak Chadha — portfolio for GitHub Pages

A complete static portfolio connecting engineering, research and perfumery.

**New: a cinematic Communication Systems introduction.** The question appears first, then a satellite-phone message travels through space, past a satellite and around Earth to its receiver. The illuminated outline reveal follows the style of the Essentia opening. Optional soft audio, skip, keyboard access and replay are included. See `RADIO_INTRO.md` for the sequence and editing instructions.

**Start with `START_HERE.txt`.** This updated package is ready to replace the files in your existing website repository. The cause of the old Communication Systems app and the update steps are in `DIAGNOSIS_AND_UPDATE.md`. Detailed first-time GitHub, DNS, HTTPS and domain-forwarding instructions are in `GITHUB_AND_IONOS_SETUP.md`.

## Update your existing website

The complete updated website is already built in the root `docs/` folder. Copy this package's contents into the root of your existing website repository, commit and push the changed files, including the complete root `docs/` directory. Keep the existing repository, domain and **Pages → main → /docs** publishing source. No local build is needed to publish this ZIP.

The source under `apps/communication-systems/` was already current in your supplied website ZIP; the published copy under `docs/projects/communication-systems/` was still old. This package synchronizes them. Updating only `apps/` does not update a site published from the root `docs/`.

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

Its React/TypeScript source, dependency lockfile, README and third-party notices are preserved under `apps/communication-systems/`.

If replacing the app with a new project that already includes its built `docs/` folder:

1. Replace the contents of `apps/communication-systems/` with the app project contents. Its `package.json` must be directly inside that folder.
2. From the website repository root, run `npm run build`.
3. Commit and push the updated `apps/` files and the complete root `docs/` folder.

If editing React/TypeScript source, rebuild both the app and the website from the website repository root:

```sh
npm --prefix apps/communication-systems ci
npm --prefix apps/communication-systems test
npm run build:all
```

Then commit and push the source and the complete root `docs/` output. `build:all` runs `build:communication` followed by the portfolio build. `npm run build` alone copies the app's existing prebuilt export; it does not compile React/TypeScript source.

The portfolio build synchronizes the introduction from the app's `public/` folder, replaces the published app folder, then adds its return link. The app keeps its own interface, signal model and browser storage behavior. Keep its existing URL so browser notes continue to use the same storage scope. Keep `public/signal-intro.css`, `public/signal-intro.js` and the intro tags in the app's source `index.html` when merging future app projects.

## Content still to add

- Authentic SENSA screenshots.
- A preferred public contact email and a connected enquiry form. Current contact links open LinkedIn, GitHub and Essentia.
- Any required photographer credits.

## Input provenance

The original portfolio imported Communication Systems from `Communication_Systems_GitHub_Pages.zip`.

SHA-256: `2d50d38c5bce82f669445b8833bcb3077b1280209bdcec11dfd20bce61339e3e`.

This update uses the supplied `Communication_Systems-main.zip`. Its current JavaScript and CSS bundles are copied unchanged into the published application; obsolete, unreferenced app bundles from earlier exports are removed. See `DIAGNOSIS_AND_UPDATE.md` for the compared filenames and validation.

