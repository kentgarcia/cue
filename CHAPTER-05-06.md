# Chapters 05–06 — The International Stage / The First Step

These chapters occupy slides 17–21 in the current 21-slide deck. Each cue waits for the presenter.

| Slide | Opening hold | Following cues |
| --- | --- | --- |
| 17 · Representing the Philippines | International group photograph and headline · 30 | Hold while introducing the ANENT Myth Smashers International Finals. |
| 18 · Competition scale | 17 teams · 24 | Reveal 12 countries · 48. |
| 19 · International result | 2nd place · 36 | Pause for the result. |
| 20 · Return to the audience | “Are you willing to take the first step?” · 30 | Hold and make eye contact. |
| 21 · The final message | “Start with what you know.” · 24 | “Learn what you don't.” · 48 → “Discover what's possible.” · 72 → copied AtomIQ showcase · 163. |

## International photograph

`internationalAsset` in `src/presentation/chapters/chapter-05/assets.ts` uses the supplied `public/media/journey/international.png`. It fills the slide behind the headline. The browser selects its generated, fingerprinted WebP alternative through `srcset`, while the original URL remains editable.

## Closing sequence

All three closing statements accumulate and remain visible together. Advance only after each spoken line lands. The final cue crossfades into the same AtomIQ layout and entrance as slide 8: icon, name, official tagline, phone, Schrödi and orange accent waves. Both slides reuse `AtomIQShowcase`, so their artwork and entrance stay synchronized. A Remotion `Sequence` gives the closing showcase its own local frame zero.

The completed showcase holds indefinitely. Live-only idle motion continues independently of the paused cue; previews and reduced-motion presentations remain static. Reverse returns to the three statements, and restart returns to the first statement. The closing has no automatic exit.

## Verification

Run `npm run check` and browser checks in `tests/chapters-five-six.spec.ts`. These cover the actual international image, number cues, independent closing statements, final-brand reveal, reverse, restart, canvas bounds and reduced motion. Development review sheets are available at `/tests/chapter-preview.html?chapter5` and `?chapter6`.
