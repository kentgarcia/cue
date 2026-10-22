# Chapter 02 — The Challenge

Slides 04–07 follow Chapter 01 in the main registry. Typography stays centered, cues remain interruptible, and all motion uses the existing frame-driven Remotion helpers. No new runtime libraries.

## Cue sheet

| Slide | Opening hold | Presenter action |
| --- | --- | --- |
| 04 · The word nuclear | NUCLEAR. at frame 14 | Next reveals Bombs. → Radiation. → Disasters. individually, holding at frames 31, 48, 65. Each cue takes about 0.57 seconds. |
| 05 · Fiction versus reality | Question and three character placeholders at frame 20 | Michelle invites audience responses. The slide waits indefinitely. |
| 06 · The opportunity | Heading and actual competition poster at frame 24 | Discuss the challenge. The poster is contained, not cropped; the separate heading stays readable. |
| 07 · The defining question | Full question at frame 24 | Let the question stand alone. No photos, graphics, or automatic advance. Next enters Chapter 03. |

Next can interrupt any entrance and immediately begin the following cue. Left reconstructs the previous hold. Reduced motion retains opacity reveals without transforms. Slide transitions retain the existing short fade.

## Replace the character placeholders

Add licensed or user-supplied character images under `public/media/chapter-02/`. Set each `src` in `src/presentation/chapters/chapter-02/assets.ts` to its public path, for example `/media/chapter-02/lastikman.webp`. Keep the existing labels: Lastikman, Gagamboy, The Powerpuff Girls. Images use `object-fit: contain` and retain their captions. Missing or failed images show an explicitly labeled placeholder instead of breaking the slide.

## Competition poster provenance

The bundled English-language ANENT / INSTA / IAEA Myth Smashers announcement is published with [Seoul National University's competition notice](https://nucleng.snu.ac.kr/community/notice?bbsidx=23622&md=v), dated December 15, 2025.

- Original image: https://nucleng.snu.ac.kr/webdata/upimages/982z6c6z5afz19ez664ze58zf8cz3d0zad4zbe2z4f.png
- Local file: `public/media/chapter-02/myth-smashers-announcement.png`
- The original artwork is unmodified and includes its original international schedule. This is not represented as a Philippine-specific announcement. Replace `competitionAsset.src` with the team's original local announcement if desired.
- Original branding and artwork belong to their respective owners. Verify reuse permissions before publishing the deck outside this presentation context.

## Source and validation

Independent components and the typed chapter registry live in `src/presentation/chapters/chapter-02/`. The global sequence composes `chapterOneSlides` and `chapterTwoSlides`. Optional `SlideDefinition.chapter` metadata drives the editor's chapter badge and title; future chapters do not require hardcoding the UI.

Run `npm test`, `npm run test:e2e`, and `npm run build`. Browser tests cover independent association reveals, backward/restart behavior, long audience holds, placeholders, media loading/failure, chapter labels, final boundaries, reduced motion, and typography bounds. Open `/tests/chapter-preview.html?chapter2` for initial, mid-motion, and settled frames of all four slides.
