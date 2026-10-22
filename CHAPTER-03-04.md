# Chapters 03–04 — The Idea / Beyond the Classroom: Japan

The current deck has 21 slides. These chapters occupy slides 8–16. Every checkpoint holds until the presenter advances.

| Slide | Opening hold | Following cues |
| --- | --- | --- |
| 8 · Meet AtomIQ | Automatic app introduction · 90 | Hold on the logo, tagline, phone and Schrödi. |
| 9 · Lessons | Lesson map · 54 | Zoom into map · 90 → hand clicks the lesson and opens quiz · 174 → select Rutherford · 210 → check · 252. |
| 10 · Minigames | Game picker · 54 | Four games · 108 → profile · 174 → streak · 228 → awards · 282 → leaderboard · 336. |
| 11 · Schrödi | Science Assistant introduction · 48 | One cue plays the entire conversation · 432. |
| 12 · Myth or fact? | “Bananas are radioactive.” · 24 | Wait for votes. One cue swipes right to FACT, turns the background green and shows Schrödi's explanation · 120. |
| 13 · Champion | Full-screen photograph and bottom title together · 24 | Advance to Japan. |
| 14 · Japan | Full-screen photograph and bottom title together · 24 | Advance to the three-column slide. |
| 15 · Museums, equipment and nuclear facility | Museum · 24 | Monitoring equipment · 48 → nuclear facility · 72. |
| 16 · The human perspective | Both interview photographs and shared title · 36 | Hold for reflection, then advance to the international chapter. |

“Bringing the experience home” has been removed.

## Assets and design

AtomIQ artwork lives in `public/media/atomiq/`; uploaded mascot poses are in its `mascot/` subdirectory. Lessons, minigames, profile and chat demonstrations are recreated DOM compositions, rather than flattened phone screenshots. Profile values match the supplied reference. Schrödi is labeled **Science Assistant**. The conversation is scripted for presentation purposes.

The award and Japan photographs are in `public/media/journey/`. Slides 13–14 fill the screen and use a centered white title on an orange highlight. Slide 15 uses three full-height columns with overlapping, feathered seams and a title in each column. Slide 16 uses two full-height columns and one shared title: “Behind every scientific issue are real people.” Photograph entrances use restrained opacity fades. Masks remain static, with no animated blur.

Large PNG sources receive generated WebP alternatives through `npm run media:optimize`; this also runs before `npm run dev` and `npm run build`. Keep original files and generated assets in the repository. Replacing an existing optimized source while the development server is running requires rerunning the optimization command.

The audience answer explains that bananas contain a tiny amount of naturally radioactive potassium-40. Presenter notes link to the [U.S. EPA's Natural Radioactivity in Food](https://www.epa.gov/radtown/natural-radioactivity-food). Answer content stays absent before the audience-vote cue; reverse and restart restore the unanswered state.

## Verification

`npm run check` runs unit checks and the production build. Browser tests in `tests/chapters-three-four.spec.ts`, `tests/myth-fact.spec.ts` and the feature-specific files verify cue holds, reversed seeks, actual image loading, blended column geometry and reduced motion. Review sheets are available on the development server at `/tests/chapter-preview.html?chapter3` and `?chapter4`.
