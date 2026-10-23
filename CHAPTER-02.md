# Chapter 02 — The Challenge

Slides 4–7 follow Chapter 01. The existing frame-driven Remotion timeline controls all reveals; pause and restart remain available.

| Slide | Playback |
| --- | --- |
| 4 · The word nuclear | Hold on centered NUCLEAR at frame 14. Next shifts to red · 31, then reveals the supplied Bombs · 48, Radiation · 65 and Disasters · 82 photographs as three full-height columns. |
| 5 · Fiction versus reality | No opening question. Teenage Mutant Ninja Turtles, Hulk, Gagamboy and Powerpuff Girls automatically reveal in angled full-height panels, one second apart. Hold on all four panels at frame 114 until the presenter advances. |
| 6 · The opportunity | The supplied competition poster fills the slide; hold at frame 24. |
| 7 · The defining question | Hold on “What if we could change the way people see nuclear science?” at frame 24. |

Slide 5 images live in `public/media/slide-5/`; the poster lives in `public/media/slide-6/`. Uploaded originals remain preserved. Comic panel images move inside fixed polygon masks, keeping the split boundaries steady. Reduced motion fades the images in place.

Slide 5 uses a single automatic segment. Pause stops the sequence, Play resumes it, Restart replays all four reveals, and Left returns to its initial frame. The completed composition never advances to the next slide on its own. Slide 4 and the defining question retain their presenter-controlled holds.

Run `npm run check` for unit checks and a production build. `tests/chapter-two.spec.ts` checks automatic comic reveals, independent nuclear cues, final holds, image loading, reverse/restart and reduced motion. `/tests/chapter-preview.html?chapter2` on the development server shows initial, intermediate and final frames.
