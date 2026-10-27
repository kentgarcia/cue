# Chapters 05–06 — The International Stage / The First Step

These chapters occupy slides 17–22 in the current 22-slide deck. Spoken cues wait for the presenter; the completed branding reveal automatically continues to the QR invitation.

| Slide | Opening hold | Following cues |
| --- | --- | --- |
| 17 · Representing the Philippines | International group photograph and headline · 30 | Hold while introducing the ANENT Myth Smashers International Finals. |
| 18 · Competition scale | 17 teams · 24 | Reveal 12 countries · 48. |
| 19 · International result | 2nd place · 36 | Pause for the result. |
| 20 · Return to the audience | “Are you willing to take the first step?” · 30 | Hold and make eye contact. |
| 21 · The final message | “Start with what you know.” · 24 | “Learn what you don't.” · 48 → “Discover what's possible.” · 72 → AtomIQ reveal and three-second hold · 253, then automatically transition to slide 22. |

| 22 · Your next discovery | Animated invitation and large QR · 72 | Holds indefinitely for scanning. |

## International photograph

`internationalAsset` in `src/presentation/chapters/chapter-05/assets.ts` uses the supplied `public/media/journey/international.png`. It fills the slide behind the headline. The browser selects its generated, fingerprinted WebP alternative through `srcset`, while the original URL remains editable.

## Closing sequence

All three statements accumulate on separate cues. After the third, advance once to restore the full AtomIQ showcase from slide 8: logo, name, official tagline, phone and Schrödi. Its local entrance finishes at slide frame 163, followed by a three-second hold. At frame 253, playback automatically transitions to the dedicated QR slide. The automatic transition is frame-driven, pauses with playback, and does not run when seeking to the final branding frame or revisiting it with Left.

The QR invitation has a warm paper background, orbital line art, orange accents, a staggered entrance and gently floating Schrödi and sparks. Its large white scan card settles once and remains fixed. Reduced motion and thumbnails keep ambient motion disabled. The screen holds indefinitely while people scan.

The locally bundled vector QR at `public/media/atomiq/promo-qr.svg` encodes exactly `https://atomiq-pi.vercel.app/`, with high error correction and a four-module white quiet zone. It requires no external QR service. The QR and written address are also clickable.

Pause can interrupt the branding countdown. From the settled QR, Left rewinds its entrance; another Left returns to the completed branding and holds. Another Left restores the three statements. Restart applies to the current slide. End jumps directly to the settled QR invitation.

## Verification

Run `npm run check` and browser checks in `tests/chapters-five-six.spec.ts`. These cover the actual international image, number cues, independent closing statements, branding-to-QR automatic transition, scan-card stability, ambient motion, destination links, display size, reverse navigation, canvas bounds and reduced motion. Development review sheets are available at `/tests/chapter-preview.html?chapter5` and `?chapter6`.
