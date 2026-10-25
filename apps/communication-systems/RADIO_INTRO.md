# Communication Systems — illuminated radio introduction

The Communication Systems project opens with an introduction inspired by the expanding light in the supplied Essentia site's entry animation. It uses the same dark purple atmosphere, a small luminous origin, expanding outline illumination, and a soft fade into the page. The phones, globe, satellite and motion are new SVG/CSS artwork for this project.

## The sequence

| Time | What appears |
| --- | --- |
| 0–2.35 seconds | “Ever wondered how radio communication happens?” appears first. |
| 2.35–3.2 seconds | The question fades away. A person’s satellite phone illuminates with the message “HELLO”. |
| 3.2–4.75 seconds | Light and expanding radio waves travel away from the sender, out above Earth. |
| 4.75–6.15 seconds | The satellite lights up and relays the signal along a curved path around the gently turning Earth. |
| 6.15–7.25 seconds | The travelling signal approaches the receiver on the other side. |
| 7.25–9.9 seconds | The receiver illuminates, “HELLO” appears, and sound-wave marks show the received audio. The enter button appears. |
| 9.9–10.75 seconds | The introduction fades into the existing app automatically. |

This is an illustrative satellite link. It introduces one way radio communication happens; the app's underlying signal model is unchanged.

## Controls and behavior

- **Sound off / Sound on:** tap the control to enable or mute soft synthesized tones. The send and receive cues use the same three-note message. Audio begins only after this tap, allowing the introduction to work with browser audio restrictions. No audio files, network service, microphone access or API key are needed.
- **Skip intro** and **Escape:** enter the app immediately through a short fade.
- **Explore how it works:** enter when the message has arrived.
- **Replay intro:** available in the return-to-portfolio bar. Replaying on another app section returns focus to the same section afterward.
- Normal page entry plays the intro. Direct lesson/notebook links with a URL fragment, such as `#notes`, open that content immediately.
- Keyboard focus stays inside the introduction while it is open and is restored when it closes. The app's background is temporarily inert; scrolling and interaction return after the fade.
- With reduced motion enabled, the question is shown as a short static introduction, then the app opens.

The intro does not read, write or clear notebook storage. The app URL and its React/TypeScript code and production bundles are unchanged.

## Files and future editing

| File | Purpose |
| --- | --- |
| `apps/communication-systems/public/signal-intro.js` | SVG artwork, story text and timing, audio, skip/replay, keyboard behavior |
| `apps/communication-systems/public/signal-intro.css` | Light bloom, moving wave, Earth/orbit motion, typography and responsive layout |
| `apps/communication-systems/index.html` | Loads the two intro files in the app's source entry |
| `apps/communication-systems/docs/` | Standalone app export with the intro already included |
| `docs/projects/communication-systems/` | Published website copy with the intro already included |

After editing the two intro files under `public/`, run from the **website repository root**:

```sh
npm run build
```

The portfolio build copies these files into the standalone export, ensures its intro tags are present, and updates the published website. If changing React/TypeScript app source, use the full build instructions in `README.md` instead.

When merging another app version, preserve the two `public/signal-intro.*` files and the two intro tags in the source `index.html`. `public/` ensures they are copied during a full Vite build too.

## Publish

This ZIP is already built. Replace the contents of the existing website repository with the contents of this package, including the complete root `docs/` folder. Commit and push, keep the existing Pages publishing source and domain, and wait for the deployment. See `START_HERE.txt`.

## Checks

The question-first opening, satellite scene, optional sound control, automatic entry, replay, keyboard skip/focus restoration and direct notebook links were checked in a local browser. The layout was inspected at desktop and 390-pixel phone widths. The portfolio build, JavaScript syntax checks and local asset references were also checked. This package does not deploy to your live website.
