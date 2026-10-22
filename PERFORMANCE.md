# Performance verification

Measured on October 23, 2026 with fresh Chromium browsers against Vite's production preview, at 1440 × 900. Each sample waited for the opening hold and another 500 ms. This is a local before/after comparison, not a claim about hosted latency or device frame rates. Browser timing varies; transferred bytes and mounted composition counts are the primary results.

| Metric | Before | After |
| --- | --- | --- |
| Mounted sidebar previews | 21 | 6 |
| DOM elements | 1649 | 771 |
| Sidebar height | 3584 px | 822 px |
| Document height | 3662 px | 1263 px |
| Initial resource bytes | 16.25 MB | 2.37 MB |
| Media requests | 38 | 15 |
| First held slide plus settling interval | 2692 ms | 2468 ms |

Initial resource transfer fell by **85%**. All 21 slide-navigation buttons remain mounted and accessible. Only previews in the scroll viewport and a 200 px buffer mount their Remotion composition; scrolling away frees those preview trees. The sidebar header and footer stay outside its scroll region. Mobile keeps the horizontal strip.

The six selected large PNG sources total 11.65 MB; their WebP alternatives total 1.60 MB, an 86% reduction. The icon uses lossless encoding; the poster and phone use quality 95, and photographs use quality 88. Originals are preserved, and already-compact JPEGs are served directly. Event fonts use WOFF2 versions of the original glyph sets.

The app entry is about 122 kB before compression, with React and Remotion in independent cached bundles. Total JavaScript remains approximately the same; chunking improves cache reuse across deployments rather than claiming a smaller initial JavaScript total.

## Reproduce

Run `npm run build`, then `npm run preview -- --port 4173`. In another terminal, run `npm run perf:measure -- http://localhost:4173`. The optional second argument writes the measurement JSON to a file.

Run `CUE_PRODUCTION=1 npx playwright test tests/sidebar-performance.spec.ts` to check bounded sidebar geometry, visible-preview limits, automatic selected-card scrolling, desktop/mobile navigation and compressed-image selection. The production browser verification also covered the closing statements, final AtomIQ reveal and Chromium tracing of idle animation; the tracing test confirmed no repeated Paint or Layout events during the sampled AtomIQ hold.

The development-only render probe recorded 4 editor-context renders across 78 source frames. Harness and review-sheet tests run on the development server; production smoke tests exercise the built app.

Vercel uses the checked-in `vercel.json`: Vite output in `dist`, Node 22, lockfile installation, SPA fallback and immutable caching for fingerprinted bundles and optimized images. No remote or deployment has been created by this setup.
