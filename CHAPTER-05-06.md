# Chapters 05–06 — The International Stage / The First Step

These chapters occupy slides 17–22 in the current 22-slide deck. Spoken cues wait for the presenter; the completed branding reveal automatically continues to the QR invitation.

| Slide | Opening hold | Following cues |
| --- | --- | --- |
| 17 · Representing the Philippines | International group photograph and headline · 30 | Hold while introducing the ANENT Myth Smashers International Finals. |
| 18 · Competition scale | 17 teams · 24 | Reveal 12 countries · 48. |
| 19 · International result | 2nd place · 36 | Pause for the result. |
| 20 · Return to the audience | “Are you willing to take the first step?” · 30 | Hold and make eye contact. |
| 21 · The final message | “Start with what you know.” · 24 | “Learn what you don't.” · 48 → “Discover what's possible.” · 72 → AtomIQ reveal and three-second hold · 253, then automatically transition to slide 22. |

| 22 · Facebook & website | Facebook QR on the left, website QR on the right · 72 | Both codes hold indefinitely for scanning. |

## International photograph

`internationalAsset` in `src/presentation/chapters/chapter-05/assets.ts` uses the supplied `public/media/journey/international.png`. It fills the slide behind the headline. The browser selects its generated, fingerprinted WebP alternative through `srcset`, while the original URL remains editable.

## Closing sequence

All three statements accumulate on separate cues. After the third, advance once to restore the full AtomIQ showcase from slide 8: logo, name, official tagline, phone and Schrödi. Its local entrance finishes at slide frame 163, followed by a three-second hold. At frame 253, playback automatically transitions to the dedicated QR slide. The automatic transition is frame-driven, pauses with playback, and does not run when seeking to the final branding frame or revisiting it with Left.

The final invitation has two equal white cards on a warm paper background. The left card is labeled Facebook with a blue accent; the right is labeled Website with an orange accent. Both cards have a short, gentle entrance and stay fixed after it. Reduced motion uses only opacity. There is no mascot or continuous decorative motion on this screen.

Both QR codes are locally bundled vectors with high error correction and a four-module white quiet zone. The left QR at `public/media/atomiq/facebook-qr.svg` encodes `https://www.facebook.com/share/1bd1LduxTg/?mibextid=wwXIfr`. The right QR at `public/media/atomiq/promo-qr.svg` encodes `https://atomiq-pi.vercel.app/`. They require no external QR service to display, and the codes and captions are clickable.

Pause can interrupt the branding countdown. From the settled QR, Left rewinds its entrance; another Left returns to the completed branding and holds. Another Left restores the three statements. Restart applies to the current slide. End jumps directly to the settled QR invitation.

## Verification

Run `npm run check` and browser checks in `tests/chapters-five-six.spec.ts`. These cover the actual international image, number cues, independent closing statements, branding-to-QR automatic transition, scan-card stability, destination links, display size, reverse navigation, canvas bounds and reduced motion. Development review sheets are available at `/tests/chapter-preview.html?chapter5` and `?chapter6`.
