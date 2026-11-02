# Communication Systems website update

Prepared 25 October 2026 from `sarthakchadha.com-main.zip` and `Communication_Systems-main.zip`.

This record documents the original stale-app repair. This package also adds the requested animated entry; see `RADIO_INTRO.md` for that addition.

## Cause confirmed in the supplied files

The website has separate app source, app build output, and website publishing output:

| Location | Purpose | State in the original website ZIP |
| --- | --- | --- |
| `apps/communication-systems/` | App project, including source and its own build output | All 41 files matched the supplied updated app byte for byte |
| `apps/communication-systems/docs/` | Standalone, prebuilt app | Its HTML selected the new app bundles |
| `docs/projects/communication-systems/` | Copy served by the portfolio | Its HTML still selected the old app bundles |
| Root `docs/` | Whole website publishing folder | Included that old public-facing app copy |

The website's publishing instructions select **main → /docs**. With that setup, visitors receive files from the root `docs/` tree. Files under `apps/` are not served directly. There is no active `.github/workflows/` build in the supplied website archive to regenerate the published copy after source changes.

The root `scripts/build.mjs` copies `apps/communication-systems/docs/` into `docs/projects/communication-systems/`. That integration had not been reflected in the uploaded website's published output. This explains the old app without requiring a browser-cache explanation. The live site's account settings were not inspected; this diagnosis is established by the supplied archives.

## Direct evidence

| Asset | Original published app selected | Updated app selects |
| --- | --- | --- |
| JavaScript | `index-jx6iSer6.js` | `index-B3ojs3c8.js` |
| Stylesheet | `index-67VHk8HI.css` | `index-DI8a5Iox.css` |

The new JavaScript contains the separate **Explore transmitter**, **Explore receiver**, and **Inside the software receiver** features. The original published JavaScript does not contain the new transmitter/software-receiver labels. Both projects use package version `1.3.0`, so the package version alone does not distinguish these exports.

## What this package changes

- Regenerates the whole root `docs/` output with the latest supplied app at the existing `/projects/communication-systems/` URL.
- Keeps the current app source, dependency lockfile, numerical model, notebook storage logic, and current JavaScript/CSS bundles unchanged.
- Removes unused app bundles from earlier exports. The supplied current JavaScript bundle is self-contained and has no additional imported chunks or asset dependencies.
- Changes the portfolio build to replace its generated app folder before copying the app export, preventing old destination files from accumulating.
- Adds `npm run build:all` to compile the app and then integrate it into the website.
- Updates the root instructions for an existing website repository.

The portfolio design, other projects, photos, custom-domain file and return-to-projects link are preserved. Existing notebook storage uses the same app path.

## Publish this ZIP

1. Extract the ZIP. Copy the **contents** of `sarthakchadha.com-radio-intro/` into the root of the existing website repository.
2. Commit and push the changed files, including the complete root `docs/` directory. Updating only `apps/` will reproduce the original issue.
3. Keep the existing branch-based **main → /docs** publishing source and custom domain.
4. Wait for the Pages deployment to succeed. Open `https://sarthakchadha.com/projects/communication-systems/` and hard-refresh with **Ctrl+Shift+R** if necessary.

The ZIP is already built. Publishing this package does not require installing dependencies, running a build locally, changing DNS, or creating another repository.

## Future updates

When a replacement app already contains an up-to-date prebuilt `docs/` folder, replace `apps/communication-systems/` and run from the **website repository root**:

```sh
npm run build
```

When changing the app's React/TypeScript source, run from the **website repository root**:

```sh
npm --prefix apps/communication-systems ci
npm --prefix apps/communication-systems test
npm run build:all
```

Then commit and push the source and root `docs/` output. The inner app `docs/` and the website root `docs/` serve different purposes; keep both synchronized.

The app's own README describes publishing the app as a standalone repository. For this combined portfolio repository, use the root instructions above.

## Validation performed

- The existing app tests pass, covering signal calculations, notebook backups, UTF-8/PAM encoding, ADC behavior, channel effects, and software-receiver calculations.
- The portfolio build completes and produces identical output on a repeat build. A temporary obsolete asset is removed by the revised integration step.
- All 76 local HTML links and asset references resolve in the generated website, including the new intro stylesheet and script.
- All five published HTML pages, the app's current JavaScript/CSS, its favicon, and the custom-domain file return HTTP 200 when served locally.
- The published app's JavaScript and CSS match the supplied update byte for byte. All 16 app source files remain unchanged.
- Every published website file outside the Communication Systems app remains byte for byte identical to the original website archive, including `docs/CNAME`.

This repair integrates the supplied prebuilt app; it does not require recompiling its React/TypeScript source. The added intro has also been checked in a local browser preview at desktop and phone widths. The live website has not been deployed by this package.
