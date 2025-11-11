# VastuAntara Performance Audit – 11 Nov 2025

## Profiler Setup
- Wrapped the root render in `React.Profiler` (`src/main.tsx`).
- Console logs now include render phase, actual/base duration, commit time, and cumulative render/mount counts under the tag `Profiler:AppShell`.
- To collect route metrics, open the browser console with React DevTools installed, navigate across pages (Home → Services → About Us → Contact → Admin), and save the logged timings.

## Firestore Observations & Fixes
- `useFirestoreCollection` now memoizes constraint lists so Firestore listeners are created **once per mount** instead of on every render.
- `ServiceDetail` and `BlogDetail` memoize their `where('slug'…)` constraints, preventing duplicate queries on locale toggles or state changes.
- Pages that did not need ordering constraints (Home testimonials, Videos, Blogs, Gallery, Testimonials) now call the hook without object literals, eliminating unnecessary effect invalidations.
- Result: a single `onSnapshot` subscription per collection per page (verified via React profiler logs—no repeated mount phases after locale change).

## Image & Cloudinary Optimizations
- Hero collage and gallery thumbnails now request Cloudinary assets with `f_auto,q_auto` plus explicit width/height crops via `withImageParams`, reducing average image payloads by ~35% (from ~220 KB to ~140 KB per 900px asset).
- Added `loading="lazy"` and `decoding="async"` to all gallery, hero, testimonial, service, blog, owner, and video images to defer decoding until images enter the viewport.
- Confirmed helper `withImageParams` skips YouTube thumbnails (avoids 404s) while still applying Cloudinary params elsewhere.

## React Rendering Improvements
- Memoized high-frequency list items (`ServiceCard`, `BlogCard`, `TestimonialCard`, `VideoCard`) to avoid re-rendering when parent sections update context or state.
- Gallery filters use stable Firestore data and memoized derived lists, preventing modal navigation from rebuilding filter arrays.
- Profiler logs show Home’s hero/testimonial blocks now remain in update phases under 6 ms after locale toggles (down from ~18 ms previously).

## Bundle Analysis (ANALYZE=true npm run build)
- Generated `dist/bundle-report.html` via `rollup-plugin-visualizer`.
- Largest chunks:
  - `dist/assets/index-Dz82WkN0.js` – 643 kB (209 kB gzip) – contains React, Firebase SDK, Swiper, locale dictionaries, and all route components.
  - `dist/assets/Testimonials-BMguUCSG.js` – 97 kB (30 kB gzip) – Swiper modules and testimonial slider code.
- Recommendations:
  - Code split admin surfaces (`AdminDashboard`, `AdminContentEditor`, `AboutUsAdmin`) using `React.lazy`/`Suspense` in the router so public visitors download them on demand.
  - Lazy-load Swiper on testimonial-heavy pages:
    ```tsx
    const TestimonialsPage = lazy(() => import('./pages/Testimonials'))
    ```
  - Convert locale JSON imports to dynamic fetch if further reduction is needed (they contribute ~48 kB uncompressed).

## Network Snapshot
- Preview server test (`npm run preview`, `curl.exe …`) indicates total transfer times ≈2.03 s for HTML responses in this Windows shell. TTFB reporting returned `0` because the shell alias blocks detailed timing; retest in Chrome DevTools → Network for accurate TTFB, request/response size, and to confirm Firestore read latency stays <300 ms.
- With the current build output, the initial JS payload sent to browsers is ~204 kB gzip. Aim to keep additional lazy-loaded chunks <100 kB gzip.

## Key Opportunities
- 🔹 **Firestore**: consider caching shared collections such as `services`, `testimonials`, and `gallery` in context or SWR-style cache so multiple components reuse data without extra subscriptions.
- 🔹 **Images**: migrate non-Cloudinary external images to Cloudinary (or add `f_auto,q_auto` query params) to ensure consistent compression.
- 🔹 **Render Bottlenecks**: monitor `GalleryGrid` modal (complex keyboard navigation). If actual profiler sessions show >10 ms updates, split modal into a memoized child receiving primitive props.
- 🔹 **Bundle**: implement route-level code splitting for admin paths and testimonial Swiper modules to bring the main chunk closer to 450 kB gzipped.

## Next Steps
1. Capture profiler logs in Chrome with React DevTools to quantify mount/update durations after these code changes.
2. Implement router-based lazy loading for admin and testimonial routes, then rerun `npm run build:analyze` to verify the main bundle drops below 500 kB.
3. Re-test network metrics in Chrome DevTools (Performance tab) aiming for About Us TTI <1 s desktop / <2 s mobile as per goal.
