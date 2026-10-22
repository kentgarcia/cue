# Cue

A code-first, presenter-controlled presentation engine built with React, TypeScript, Vite, and Remotion. **Animate. Pause. Speak. Click. Continue.**

The active deck is **Team AtomIQ — Beyond What We Know**, with **21 slides** across six chapters. It includes the supplied team photos, recreated AtomIQ feature demonstrations, the audience swipe game, and three closing statements followed by the animated AtomIQ showcase. The deleted “Bringing the experience home” slide is not registered. Earlier generic examples in `src/slides/` are not part of the deck.

## Run locally

Requires **Node.js 22** and npm; `.nvmrc` and `package.json` keep local, CI and Vercel builds on the same major version.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite. Dependencies are pinned in `package.json` and `package-lock.json`; `remotion` and `@remotion/player` use exactly the same version, 4.0.537.

```bash
npm run build          # Strict TypeScript check and production build
npm run preview        # Serve the production build
npm test               # Controller and registry validation tests
npx playwright install chromium   # Once, if Chromium is not installed
npm run test:e2e        # Integration tests against the actual Remotion Player
```

Slide 01 uses the supplied **Beyond the Atom** event poster recreated with editable SVG lettering, vector shapes, gradients and patterns, plus live-only background and flare ambience on independent HTML compositor layers. Full-screen procedural noise is omitted to avoid continuous SVG rasterization. The title uses locally bundled Lilita One, supporting copy uses Poppins, and the hand-lettered label uses Kalam; these are visual matches rather than verified original font identities. Reduced motion and all thumbnails/snapshots keep the poster static. The remaining deck uses self-hosted **Inter**, preloaded at weights 500–800 before any Player or Thumbnail mounts. Animated flares remain exclusive to the opening slide. White presentation text uses orange gradient lettering; the AtomIQ reference layout keeps its black wordmark and tagline. The active art direction uses the shared opening orange gradient and white `#ffffff`, with cumulative word-by-word reveals in fixed positions and exact presenter-controlled holds. Previously revealed words stay visible; there are no rapid word swaps or type punches. Space Grotesk remains available to the original templates. The application uses Tailwind v4's Vite plugin and Lucide icons. It needs no accounts, API keys, or remote assets at runtime. Presentation state stays in memory and resets on reload.

## Deploy to Vercel

The repository is initialized on `main`. Add your Git remote and make the initial commit, then import that repository in Vercel. `vercel.json` configures the project:

| Setting | Value |
| --- | --- |
| Framework | Vite |
| Node.js | 22.x |
| Install | `npm ci` |
| Build | `npm run build` |
| Output | `dist` |
| Environment variables | None required |

The build generates optimized images before TypeScript validation and Vite bundling. Vercel serves the static output; no server or database is needed. Fingerprinted JavaScript, CSS and optimized images receive immutable cache headers. Original media URLs remain editable and revalidate normally. SPA requests fall back to `index.html`. Framework settings follow the [official Vite deployment guide](https://vercel.com/docs/frameworks/frontend/vite).

For a CLI deployment, run `npx vercel` and follow the account/project prompts; use `npx vercel --prod` when ready to publish production. `.vercel/`, environment files, dependencies, test artifacts and build output are excluded from Git. `.github/workflows/ci.yml` installs from the lockfile and runs `npm run check` and the production sidebar/media browser checks on pushes and pull requests.

## Performance

- The desktop sidebar has its own viewport-height scroll area; its header and footer stay visible. Mobile retains a horizontal slide strip.
- Only previews in or near that scroll area mount a Remotion `Thumbnail`. Off-screen previews unmount, while all 21 navigation buttons remain accessible. Keyboard navigation scrolls the selected card inside the panel without moving the canvas.
- Memoized cards keep unchanged previews out of unrelated renders. Live playback already isolates source-frame updates from the editor shell.
- `npm run media:optimize` generates fingerprinted WebP derivatives for large PNG photos, the poster, app icon and phone. Original uploads remain untouched. Already-small JPEGs and existing optimized artwork retain their original sources. The manifest and generated images are committed alongside the sources, and the script runs automatically before development and production builds.
- Browser `srcset` selects the compressed derivative while the image's `src` continues to identify the editable original. Remotion loading and error handling are preserved.
- Opening fonts use WOFF2 versions of the original font files, load concurrently, and preload in the document. Font licenses and TTF sources are kept in `public/fonts/event/`.
- React, Remotion and app code have separate fingerprinted bundles so unchanged dependencies remain cached across releases.

To reproduce the cold-load measurements, use two terminals:

```bash
npm run build
npm run preview -- --port 4173
```

```bash
npx playwright install chromium
npm run perf:measure -- http://localhost:4173
```

For browser tests against that production server, run `CUE_PRODUCTION=1 npm run test:e2e -- tests/sidebar-performance.spec.ts`. The normal `npm run test:e2e` command tests the development server.

The measurement command launches a fresh Chromium browser at 1440 × 900 and reports mounted previews, DOM nodes, sidebar geometry, resource bytes and time to the first held slide plus a 500 ms settling interval. Timing depends on the computer and network; structural counts and transfer sizes are more reliable for comparisons. See [PERFORMANCE.md](PERFORMANCE.md) for measured results.


## Present

| Input                                   | Action                                                                                          |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Right arrow, Space, Enter, canvas click | Animate to the next checkpoint; at the final checkpoint, move to the next slide                 |
| Left arrow                              | Seek to the previous checkpoint; from frame zero, revisit the previous slide at its final frame |
| Home                                    | Restart the first slide                                                                         |
| End                                     | Jump to the final slide's final checkpoint                                                      |
| F                                       | Toggle fullscreen / focus mode                                                                  |
| Escape                                  | Leave fullscreen / focus mode                                                                   |

Native keyboard interaction is preserved inside inputs, buttons, links, selects, editable regions, and dialogs. After using an editor control, click a noninteractive area to return keyboard focus to the presentation. Held keys and modified key combinations are ignored.

The slide sidebar jumps to a slide and plays its opening segment. Cue bars seek directly to their exact frame without playback. Play runs only the next segment; Pause stops within the current segment and Play resumes toward the same checkpoint. Restart replays only the current slide's opening. Next during an animation immediately completes that cue and starts the following one; if it was the final cue, it changes slides (or holds at the deck end). Deliberate rapid clicks are accepted, not queued. Navigation is briefly guarded only during slide transitions. Backward navigation can interrupt an animation.

**Presentation mode** keeps the same 16:9 canvas at a logical 1920 × 1080, fitted within the screen without stretching. Its stable fullscreen container survives slide changes. Mouse movement reveals a small navigation dock, which also remains visible while keyboard-focused. Browser fullscreen is requested directly from a user gesture. If the browser rejects it, focus mode provides the same distraction-free layout, with Escape to return.

## Create a slide

Create an independent component in `src/slides/`. `SlideLayout` provides the visual frame and the reduced-motion context. Animation helpers must be its descendants.

```tsx
import type { SlideProps } from "../engine/types";
import { SlideLayout } from "../components/layouts/SlideLayout";
import { AnimatedText, ProgressiveReveal } from "../components/animations";

export function MySlide(props: SlideProps) {
  return (
    <SlideLayout {...props} chapter="A new idea" number="06">
      <div style={{ position: "absolute", left: 108, top: 300 }}>
        <h1 style={{ fontSize: 140, lineHeight: 1 }}>
          <AnimatedText text="Think bigger." startFrame={0} stagger={5} />
        </h1>
        <ProgressiveReveal atFrame={48}>
          <p style={{ fontSize: 40 }}>One idea can change everything.</p>
        </ProgressiveReveal>
      </div>
    </SlideLayout>
  );
}
```

Register it in `src/presentation/slides.ts`:

```tsx
{
  id: 'a-new-idea',
  title: 'A New Idea',
  subtitle: 'The first spark.',
  component: MySlide,
  fps: 30,
  durationInFrames: 96,
  checkpoints: [0, 42, 95],
  checkpointLabels: ['Start', 'Think bigger', 'The idea'],
  transition: 'fade',
  background: '#f5f1e9',
  notes: 'Let the headline settle. Then reveal the supporting thought.',
}
```

`slideCount` and `reducedMotion` are supplied automatically through `SlideProps`. Chapter text, content, and the slide's display number belong to its design; the footer total follows the registry.

### Checkpoint rules

- Frames are zero-based integers, sorted strictly ascending.
- Include `0` and `durationInFrames - 1`.
- Provide one label for every checkpoint, including zero.
- The opening plays from frame `0` to the **first positive checkpoint**. Zero is the initial reversible state, not an opening hold.
- A reveal must begin **after** the preceding checkpoint. Leave enough frames for it to settle before its own checkpoint.
- Each slide may have a different FPS and duration. The number of seconds of animation does not limit speaking time.
- Slide identifiers must be unique. Invalid registries fail with descriptive errors.

For example, with `[0, 42, 90, 143]`, frames 0–42 play on entry, then hold. The next click plays through frame 90. Another click plays through frame 143. One more click changes slides. Left seeks back to an earlier exact frame, so every cue-driven visual must be a pure function of frame and props. Do not use random values, `Date.now()`, CSS animation, or uncontrolled timers for cue-driven content. Decorative idle motion on the opening and AtomIQ/mascot showcases is an explicit exception: it is enabled only by the live Player and excluded from frozen previews and reduced motion.

To create another deck, export a stable `PresentationConfig` object and pass it to `PresentationEngine` in `src/app/App.tsx`. Changing the config reference creates a fresh controller, including during hot reload. The engine has no dependence on the demo's content.

## Animation and layout toolkit

`src/components/animations/index.tsx` exports:

| Component                      | Purpose                                                                                    |
| ------------------------------ | ------------------------------------------------------------------------------------------ |
| `AnimatedText`                 | Word-staggered `spring-up`, `fade`, or `reveal`; configurable start, duration, and stagger |
| `StaggeredText`                | Spring-up typography preset                                                                |
| `WordByWord`                   | Explicit start frame for each word, ideal for click-controlled sentences                   |
| `TextReveal`                   | Frame-driven clipping reveal                                                               |
| `FadeIn`, `SlideIn`, `ScaleIn` | Reusable entrance wrappers                                                                 |
| `AnimatedNumber`               | Deterministic interpolated integer with optional suffix                                    |
| `AnimatedShape`                | Circle, star, or arch with spring entrance                                                 |
| `ProgressiveReveal`            | Reveal any child at an explicit frame                                                      |
| `useProgress`                  | Shared interpolation / spring utility                                                      |

`src/components/layouts/templates.tsx` provides `TitleSlide`, `StatementSlide`, `QuestionSlide`, `ComparisonSlide`, `ImageSlide`, `StatisticSlide`, `TimelineSlide`, and `ClosingSlideTemplate`. These are starting layouts; slides can freely compose their own. The image template uses Remotion's loading-aware `Img`.

The active chapter's palette, font, easing curves, transition length, and checkpoints live in `src/presentation/chapters/chapter-01/theme.ts`. General template tokens remain in `src/presentation/theme.ts`. Editor CSS tokens and responsive rules live in `src/styles/index.css`.

The operating system's reduced-motion preference replaces word-by-word and spatial movement with a single opacity reveal. Slide transitions become fades. Checkpoint timing stays identical.

## Architecture

```text
src/
├── app/App.tsx                    Preview workspace and controls
├── engine/
│   ├── types.ts                   Strict registry, playback, transition types
│   ├── PresentationEngine.tsx     React adapter, keyboard and fullscreen lifecycle
│   ├── PlaybackController.ts      Framework-independent observable state machine
│   ├── PresentationPlayer.tsx     Imperative Player adapter and checkpoint guards
│   ├── KeyboardController.ts      Shortcut filtering and listener cleanup
│   └── TransitionManager.tsx      Frame-driven transition registry and composition
├── presentation/                 Deck configuration, slide registry, design tokens
├── slides/                       Five independent example compositions
├── components/
│   ├── animations/               Pure frame-derived motion primitives
│   ├── layouts/                  Slide shell and eight template types
│   └── ui/                       Sidebar, canvas, shortcut dialog, icon buttons
├── hooks/                        Reduced-motion preference subscription
└── styles/                       Tailwind integration and responsive studio styles
```

### Playback safeguards

1. `PlaybackController` owns navigation and the active frame target. It is independent of React and Remotion. Cached command snapshots update the engine context only on navigation, pause, or checkpoint completion; only the small cue timeline and frame readout subscribe to per-frame snapshots. The editor shell and Player props no longer rerender on every animation frame. Zustand is unnecessary for this scope.
2. Before playback, the Player's public `outFrame` prop is committed to the selected checkpoint. `moveToBeginningWhenEnded={false}` keeps the endpoint visible. This native bound also prevents a delayed browser frame from jumping beyond the checkpoint.
3. A layout effect attaches public `frameupdate` and `ended` listeners, pauses, seeks, and plays the requested segment. Checkpoint changes do **not** remount the Player or slide.
4. The frame listener immediately pauses at or past the target, clamps overshoot with `seekTo()`, and settles controller state at the exact checkpoint. `ended` provides a second completion path. A reentrancy guard handles Remotion's synchronous `ended` event when seeking to the slide's final frame.
5. Every playback command has a revision. Callbacks carrying an earlier revision cannot advance a newer command or slide. Effect cleanup removes listeners and pauses the outgoing Player.
6. Slide changes freeze the outgoing slide at its actual current frame using a `Thumbnail`. A short, separate Remotion composition transitions between this snapshot and the incoming initial frame. The incoming slide remains paused under that overlay. Only the matching transition completion releases its opening animation. There are no transition-completion timeouts.
7. Next interrupts segment playback by seeking to its target and starting the following segment in one revision-guarded command. Old frame/end events cannot settle the new target. Navigation, seeking, and restarting are locked only during the brief transitions. The final deck endpoint remains held rather than looping.

The opening poster has a separate, explicitly enabled CSS idle animation on the live stage; it never advances the timeline and is absent from snapshots and reduced motion. The only application timer hides the optional fullscreen navigation dock. It has no influence on animation, transition completion, or checkpoints.

### Add a transition

The supported names are `fade`, `slide-left`, `slide-right`, `scale`, `wipe`, and `none`. Set `transition` on the destination slide. Reverse navigation passes a negative direction, reversing directional effects.

Add a name to `TransitionName` in `engine/types.ts` and a matching pure effect in `transitionEffects`. Effects receive eased progress `[0, 1]` and navigation direction, and return outgoing/incoming styles. Keep the outgoing image opaque beneath a revealing incoming image to avoid black gaps. All transition progress comes from Remotion's frame context.

For richer art direction, set the optional `transitionComponent` on a slide. It receives the outgoing/incoming frozen artwork, eased progress, raw transition frame/duration, direction, source/destination IDs, and source/destination frames through `SlideTransitionProps`. It runs inside the existing transition Player; it does not replace the engine or its lifecycle. The active deck uses a short dissolve between speaking holds. The Fukushima interview slide keeps a restrained fade. Reduced motion always falls back to the built-in fade.

### Public APIs researched

Implementation was checked against the current official documentation and the installed package's types on October 22, 2026:

- [Remotion Player props, ref methods, and events](https://www.remotion.dev/docs/player/player): `outFrame`, `initialFrame`, `moveToBeginningWhenEnded`, `play`, `pause`, `seekTo`, `getCurrentFrame`, `frameupdate`, and `ended`.
- [Remotion Thumbnail](https://www.remotion.dev/docs/player/thumbnail): frozen, composition-accurate previews and transition snapshots.
- [Autoplay restrictions](https://www.remotion.dev/docs/player/autoplay): audio requires browser user activation. This visual demo explicitly starts muted, including transition Players, avoiding an audio-context gate on its opening animation.
- [Tailwind CSS with Vite](https://tailwindcss.com/docs/installation/using-vite): current Vite plugin integration.

The engine uses the browser Fullscreen API on its persistent stage container, rather than the Player ref's fullscreen methods, so fullscreen survives Player replacement at slide boundaries. The current demo has no audio. Adding audio requires explicit user-gesture playback, media unlock/buffering handling, and deliberate synchronization between muted snapshots and the active Player; that is a future integration, not an assumed capability.

## Verification

Unit tests exercise opening bounds, immediate cue interruption, overshoot, stale callbacks, transition guards, reverse interruption, pause/resume, restart, isolated subscriptions, final boundaries, and malformed registries. Browser tests use the real Player under React Strict Mode and check rendered slide frames as well as controller state: complete deck navigation, rapid Next clicks, persistent Player identity, centered typography, input/dialog filtering, fullscreen/focus fallback, mobile layout, and reduced motion. A render-count regression test ensures that live playback does not rerender the editor context for every source frame.

Presenter view, multiple displays, interactive charts, media, Markdown/AI-generated registries, alternate themes, and export can be added around these rendering and state boundaries. They are not part of this initial implementation.
