# Implementation Plan: Senior-Level Portfolio Features

## Overview

Rencana implementasi ini mengikuti **4 fase** sesuai design document: Foundation → Core Features → Advanced Features → Showcase Features. Setiap task granular (1–4 jam), diurutkan berdasarkan dependencies, dan mencakup semua 15 requirements serta 16 correctness properties. Bahasa implementasi: **TypeScript** (Next.js 15, React 19, Vitest + fast-check, Playwright).

---

## Tasks

### Phase 1 — Foundation

- [ ] 1. Setup testing infrastructure dan shared type definitions
  - [ ] 1.1 Install dan konfigurasi Vitest + fast-check + jsdom
    - Install: `vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event fast-check jsdom`
    - Buat `vitest.config.ts` di root dengan environment `jsdom`, globals, setupFiles, dan coverage thresholds (lines: 80, functions: 80, branches: 75)
    - Buat `tests/setup.ts` dengan global mocks (localStorage, matchMedia, ResizeObserver)
    - Tambahkan scripts `"test": "vitest --run"` dan `"test:coverage": "vitest --run --coverage"` di `package.json`
    - _Requirements: 1.3, 1.8, 3.7, 4.6, 4.10, 5.6, 7.8, 8.12–8.14, 11.2, 11.4, 11.6, 11.12_

  - [ ] 1.2 Install dan konfigurasi Playwright untuk E2E tests
    - Install: `@playwright/test` lalu `npx playwright install`
    - Buat `playwright.config.ts` dengan baseURL `http://localhost:3000`, timeout 30s, projects chromium/firefox/webkit
    - Buat `tests/e2e/` direktori dengan `global-setup.ts`
    - Tambahkan script `"test:e2e": "playwright test"` di `package.json`
    - _Requirements: 1.1, 1.4, 5.16, 3.11, 11.9_

  - [ ] 1.3 Buat shared TypeScript type definitions
    - Buat `src/types/portfolio.types.ts` — `Project`, `ProjectCategory`, `Repository`, `ContributionDay`, `CacheEntry<T>`, `RateLimitState`
    - Buat `src/types/command-palette.types.ts` — `Command`, `CommandCategory`, `FuzzySearchOptions`, `FuzzyResult<T>`
    - Buat `src/types/analytics.types.ts` — `AnalyticsEvent`, `AnalyticsBatchPayload`, `Toast`, `ToastType`
    - Buat `src/types/blog.types.ts` — `ArticleFrontmatter`, `ArticleMetadata`
    - Buat `src/types/api.types.ts` — `ContactRequestBody`, `ContactResponse`, `GitHubStatsResponse`, `ErrorResponse`
    - _Requirements: semua (foundational types)_

- [ ] 2. Implementasi Theme System
  - [ ] 2.1 Buat Zustand theme store dan CSS custom properties
    - Install: `zustand`
    - Buat `src/store/theme.store.ts` — state `theme: 'dark' | 'light' | 'system'`, `resolvedTheme`, action `setTheme()`, persist middleware ke localStorage
    - Update `src/app/globals.css` — tambahkan CSS custom properties untuk `:root[data-theme="dark"]` dan `:root[data-theme="light"]` dengan transition `color 500ms cubic-bezier(0.4, 0, 0.2, 1), background-color 500ms`
    - Definisikan semua color tokens: `--color-bg-primary`, `--color-bg-secondary`, `--color-text-primary`, `--color-accent-blue`, dll.
    - _Requirements: 2.1, 2.2, 2.3, 2.6_

  - [ ] 2.2 Buat ThemeProvider dan inline script untuk anti-flash
    - Buat `src/components/providers/ThemeProvider.tsx` — baca localStorage, set `data-theme` attribute di `<html>`, sync dengan `prefers-color-scheme` jika belum ada preference
    - Tambahkan inline `<script>` di `src/app/layout.tsx` (sebelum render) untuk apply theme sebelum first paint — mencegah FOIT
    - Export `useTheme()` hook dari provider
    - _Requirements: 2.4, 2.5_

  - [ ]* 2.3 Tulis property test untuk theme persistence (Property 3)
    - **Property 3: Theme Persistence Round-Trip**
    - Buat `tests/unit/theme.property.test.ts`
    - Generate arbitrary theme values `('dark' | 'light' | 'system')`, set ke store, baca dari localStorage, assert roundtrip equality
    - Test bahwa `resolvedTheme` tidak pernah `'system'` (selalu resolved ke `'dark'` atau `'light'`)
    - **Validates: Requirements 2.3, 2.4**

  - [ ]* 2.4 Tulis property test untuk WCAG contrast invariant (Property 4)
    - **Property 4: Theme WCAG Contrast Invariant**
    - Buat `tests/unit/theme-contrast.property.test.ts`
    - Implement helper `computeContrastRatio(fg: string, bg: string): number` berdasarkan WCAG relative luminance formula
    - Assert semua pasangan color token (text/bg) di kedua theme ≥ 4.5:1
    - **Validates: Requirements 2.7, 9.9**

- [ ] 3. Implementasi Shared UI Primitives dan Micro-Interaction System
  - [ ] 3.1 Buat animation presets dan reduced-motion utility
    - Buat `src/lib/animations/presets.ts` — `AnimationPresets` object (`fadeInUp`, `scaleIn`, `slideInTop`, `ripple`, `shimmer`)
    - Buat `src/lib/animations/reduced-motion.ts` — `prefersReducedMotion(): boolean` dan `withReducedMotion<T>(preset: T): T` yang override duration ke 0ms
    - Install GSAP matchMedia integration — `gsap.matchMedia()` wrapper untuk disable expensive animations
    - _Requirements: 8.4, 8.5, 8.12, 8.13, 8.14, 8.15_

  - [ ]* 3.2 Tulis property test untuk reduced motion compliance (Property 13)
    - **Property 13: Reduced Motion Compliance**
    - Buat `tests/unit/animation-system.property.test.ts`
    - Mock `window.matchMedia` untuk `prefers-reduced-motion: reduce`
    - Assert `withReducedMotion(anyPreset).duration === 0` untuk semua arbitrary presets
    - Assert tidak ada translate/rotate/scale transforms saat reduced motion aktif
    - **Validates: Requirements 8.12, 8.13, 8.14**

  - [ ] 3.3 Buat Toast system (Zustand store + Toast component)
    - Buat `src/store/ui.store.ts` — `toasts: Toast[]`, `addToast()`, `dismissToast()`, `commandPaletteOpen`, `openCommandPalette()`, `closeCommandPalette()`, `isPageLoading`
    - Buat `src/components/ui/Toast.tsx` — slide-in dari top dengan bounce easing (GSAP `slideInTop` preset), auto-dismiss 3000ms, role="status" aria-live="polite"
    - Buat `src/components/ui/ToastContainer.tsx` — portal ke `document.body`, stack multiple toasts
    - _Requirements: 8.9, 8.10, 9.5_

  - [ ] 3.4 Buat shared UI primitives (Button, Input, Skeleton, Modal base)
    - Update `src/components/ui/InteractiveButton.tsx` — tambahkan ripple effect on click (Property dari Req 8.2), magnetic cursor effect dalam radius 50px (Req 8.3), scale animation 200ms hover
    - Buat `src/components/ui/SkeletonLoader.tsx` — shimmer animation, berbagai ukuran props (`line`, `card`, `circle`)
    - Buat `src/components/ui/FocusTrap.tsx` — hook `useFocusTrap(ref)` untuk modal dialogs, trap Tab/Shift+Tab dalam container
    - Buat `src/components/ui/Spinner.tsx` — loading spinner dengan aria-label="Loading"
    - _Requirements: 8.1, 8.2, 8.3, 8.8, 8.11, 9.10, 9.11_

- [ ] 4. Implementasi Utility Libraries (Validation, Sanitization, Rate Limiter, Cache)
  - [ ] 4.1 Buat Zod validation schemas
    - Install: `zod react-hook-form @hookform/resolvers`
    - Buat `src/lib/validation/contact.schema.ts` — schema dengan RFC 5322 email regex, name min 2/max 100, message min 10/max 1000, honeypot max 0, subject optional min 5/max 200
    - Buat `src/lib/validation/analytics.schema.ts` — schema untuk `AnalyticsEvent` validation
    - Export TypeScript types via `z.infer<>`
    - _Requirements: 11.1–11.6_

  - [ ]* 4.2 Tulis property tests untuk validation correctness (Properties 14 & 15)
    - **Property 14: Email Validation Correctness**
    - **Property 15: Message Length Boundary Invariant**
    - Buat `tests/unit/validation.property.test.ts`
    - P14: Generate valid RFC 5322 emails (fc.emailAddress()), assert `valid: true`; generate invalid strings, assert `valid: false`
    - P15: Generate strings dengan length [10, 1000], assert valid; generate length < 10 atau > 1000, assert invalid
    - **Validates: Requirements 11.4, 11.6**

  - [ ] 4.3 Buat DOMPurify sanitization utility
    - Install: `dompurify @types/dompurify`
    - Buat `src/lib/sanitize/index.ts` — `sanitizeHtml(input: string): string` menggunakan DOMPurify dengan config yang strip `<script>`, event handlers, `javascript:`, `data:text/html`
    - `sanitizePlainText(input: string): string` — untuk input yang tidak perlu HTML sama sekali
    - JSDoc lengkap dengan contoh penggunaan
    - _Requirements: 11.12_

  - [ ]* 4.4 Tulis property test untuk XSS sanitization (Property 16)
    - **Property 16: XSS Sanitization Safety**
    - Buat `tests/unit/sanitize.property.test.ts`
    - Generate arbitrary HTML injection vectors (`<script>`, `onerror=`, `javascript:`, CSS expression) menggunakan `fc.constantFrom()` kombinasi dengan `fc.string()`
    - Assert output tidak mengandung executable JS
    - Generate plain-text strings, assert `sanitizePlainText(s) === s` (content preservation)
    - **Validates: Requirements 11.12**

  - [ ] 4.5 Buat sliding window rate limiter (server-side)
    - Buat `src/lib/rate-limit/sliding-window.ts` — `createRateLimiter(config: RateLimitConfig)` menggunakan in-memory Map untuk edge runtime compatibility
    - `checkRateLimit(identifier: string): Promise<{ allowed: boolean; remaining: number; resetAt: Date }>`
    - Gunakan IP hash (tidak raw IP) sebagai identifier
    - _Requirements: 4.10, 11.11_

  - [ ]* 4.6 Tulis property test untuk rate limiter (Property 8)
    - **Property 8: Rate Limiter Window Correctness**
    - Buat `tests/unit/rate-limiter.property.test.ts`
    - Generate N requests (N > 10, dari `fc.integer({ min: 11, max: 50 })`), assert tepat 10 diterima dan sisanya ditolak
    - Generate N ≤ 10 requests, assert semua diterima
    - 300 runs minimum
    - **Validates: Requirements 4.10, 11.11**

  - [ ] 4.7 Buat in-memory Cache Manager
    - Buat `src/lib/cache/cache-manager.ts` — generic `CacheManager<T>` class dengan `get(key)`, `set(key, value, ttl)`, `invalidate(key)`, `isStale(key)`
    - Implementasi LRU eviction untuk batas 100 entries
    - Support stale-while-revalidate: return stale data sambil trigger background refresh
    - _Requirements: 4.6, 4.7_

  - [ ]* 4.8 Tulis property test untuk cache TTL invariant (Property 7)
    - **Property 7: Cache TTL Invariant**
    - Buat `tests/unit/cache-manager.property.test.ts`
    - Generate arbitrary TTL values dan timestamps, assert data dikembalikan dari cache sebelum TTL expired tanpa API call baru
    - Assert data di-fetch ulang setelah TTL berakhir
    - 200 runs minimum
    - **Validates: Requirements 4.6**

- [ ] 5. Implementasi Enhanced Contact Form
  - [ ] 5.1 Buat API route contact dengan rate limiting dan sanitization
    - Buat `src/app/api/contact/route.ts` — method POST, validasi dengan contactFormSchema (Zod), cek honeypot field, rate limit 3 req/jam per IP
    - Install: `resend` (atau konfigurasi email service)
    - Kirim email via Resend API, return `ContactResponse`
    - Tambahkan security headers via `secureApiResponse()` helper
    - _Requirements: 11.11, 11.12, 11.13, 11.14_

  - [ ] 5.2 Buat `src/lib/utils/api-response.ts` dengan error codes
    - Implementasi `secureApiResponse<T>(data, status)` dengan headers `X-Content-Type-Options`, `Cache-Control: no-store`, `X-Frame-Options`
    - Implementasi `errorResponse(message, code, retryAfter?)` untuk consistent error format
    - _Requirements: 13.1, 13.11_

  - [ ] 5.3 Update ContactScene dengan react-hook-form + real-time validation
    - Update `src/components/scenes/ContactScene.tsx` — integrasikan react-hook-form dengan `@hookform/resolvers/zod` dan `contactFormSchema`
    - Real-time validation dengan debounce 500ms (Req 11.2)
    - Field-level error messages dengan red color + icon (Req 11.3)
    - Character count indicator untuk message: format "X / 1000" (Req 11.15)
    - Disable submit button saat ada validation errors (Req 11.7)
    - Honeypot field tersembunyi (aria-hidden, tabIndex=-1) (Req 11.13)
    - Simpan form state di sessionStorage (Req 11.16)
    - _Requirements: 11.1–11.10, 11.15, 11.16_

  - [ ]* 5.4 Tulis unit tests untuk contact form validation logic
    - Buat `tests/unit/contact-form.test.ts`
    - Test: valid submission passes schema, honeypot rejection, email format validation, message length boundaries
    - Test: sessionStorage save/restore
    - _Requirements: 11.1–11.6, 11.13, 11.16_

- [ ] 6. Implementasi Accessibility Foundation
  - [ ] 6.1 Audit dan perbaiki heading hierarchy dan ARIA labels
    - Audit semua `src/components/scenes/*.tsx` — pastikan heading hierarchy h1 > h2 > h3 konsisten
    - Tambahkan `role="main"` di `<main>` page.tsx, `aria-label` untuk semua icon buttons
    - Update `src/components/ui/SkipToContent.tsx` — pastikan visible on focus, href="#main-content"
    - Tambahkan `aria-live="polite"` regions untuk dynamic content (loading states, search results count)
    - _Requirements: 9.1, 9.2, 9.4, 9.5, 9.6, 9.7_

  - [ ] 6.2 Implementasi keyboard navigation dan focus management
    - Pastikan semua interactive elements reachable via Tab key dengan visible focus ring (outline 2px blue, offset 2px)
    - Update `src/components/ui/FocusTrap.tsx` — dipanggil di semua modals/dialogs
    - Implementasi `useFocusReturn(triggerRef)` hook — kembalikan focus ke trigger element saat modal close
    - Pastikan semua touch targets minimal 44×44px di mobile
    - _Requirements: 9.2, 9.3, 9.10, 9.11, 9.14_

- [ ] 7. Checkpoint Phase 1 — Pastikan semua tests pass
  - Jalankan `npm run test` — semua unit dan property tests harus pass
  - Jalankan `npm run build` — pastikan tidak ada TypeScript errors
  - Verifikasi theme toggle berfungsi tanpa flash
  - Verifikasi contact form validasi dan submission berfungsi
  - Tanya user jika ada pertanyaan sebelum melanjutkan ke Phase 2.

---

### Phase 2 — Core Features

- [ ] 8. Implementasi Fuzzy Search dan Debounce Hooks
  - [ ] 8.1 Buat `useDebounce` custom hook
    - Buat `src/hooks/use-debounce.ts` — generic `useDebounce<T>(value: T, delay: number): T`
    - Buat `src/lib/utils/debounce.ts` — standalone `debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number)` untuk non-React contexts
    - JSDoc dengan contoh penggunaan
    - _Requirements: 5.6, 11.2_

  - [ ]* 8.2 Tulis property test untuk debounce guarantee (Property 9)
    - **Property 9: Debounce Flush Guarantee**
    - Buat `tests/unit/debounce.property.test.ts`
    - Gunakan `vi.useFakeTimers()`, generate arbitrary event sequences, assert function dipanggil tepat sekali setelah delay berakhir
    - Generate rapid sequences dalam window debounce, assert tidak dipanggil mid-sequence
    - 200 runs minimum
    - **Validates: Requirements 5.6, 11.2**

  - [ ] 8.3 Buat fuzzy search algorithm
    - Buat `src/lib/search/fuzzy-search.ts` — implementasi Levenshtein distance algorithm dengan threshold default 2
    - Export `fuzzySearch<T>(items: T[], keys: (keyof T)[], query: string, options?: FuzzySearchOptions): FuzzyResult<T>[]`
    - Sort results by score (lebih dekat = score lebih tinggi)
    - Debounce internal 100ms
    - _Requirements: 1.3, 1.8_

  - [ ] 8.4 Buat `useFuzzySearch` custom hook
    - Buat `src/hooks/use-fuzzy-search.ts` — wrapper hook di atas `fuzzySearch`, memoized dengan `useMemo`
    - _Requirements: 1.3, 1.8_

  - [ ]* 8.5 Tulis property test untuk fuzzy search typo tolerance (Property 1)
    - **Property 1: Fuzzy Search Completeness — Typo Tolerance**
    - Buat `tests/unit/fuzzy-search.property.test.ts`
    - Implement `introduceTypos(str: string, editCount: number): string` helper
    - Generate arbitrary command dari COMMAND_REGISTRY, generate edit distance 1–2, assert command ditemukan
    - 200 runs minimum
    - **Validates: Requirements 1.3, 1.8**

- [ ] 9. Implementasi Command Palette
  - [ ] 9.1 Buat command registry
    - Buat `src/lib/commands/registry.ts` — `COMMAND_REGISTRY: Command[]` dengan categories: `navigation` (sections: Hero, About, Timeline, TechGalaxy, Philosophy, Showcase, Contact), `settings` (Toggle Theme Dark/Light), `themes` (Dark Mode, Light Mode)
    - Setiap command memiliki `id`, `label`, `description`, `category`, `keywords`, `icon`, `shortcut?`, `action`
    - _Requirements: 1.10, 2.8_

  - [ ] 9.2 Buat `useCommandPalette` hook
    - Buat `src/hooks/use-command-palette.ts` — keyboard listener `⌘K`/`Ctrl+K`, update `commandPaletteOpen` di ui.store, scroll lock via `document.body.style.overflow = 'hidden'` saat open, scroll unlock saat close
    - _Requirements: 1.1, 1.2, 1.9_

  - [ ] 9.3 Buat CommandPalette compound component
    - Buat direktori `src/components/features/command-palette/`
    - Buat `index.tsx` — compound component: `CommandPalette.Root`, `CommandPalette.Dialog`, `CommandPalette.Input`, `CommandPalette.Results`, `CommandPalette.Item`
    - `CommandPalette.Dialog` — render via React Portal ke `document.body`, backdrop click closes palette, `role="dialog"`, `aria-modal="true"`, `aria-label="Command Palette"`
    - `CommandPalette.Input` — autofocus, search input, keyboard ↑↓ navigasi hasil, Enter select, Esc close
    - `CommandPalette.Results` — grouped by category, selected item highlighted
    - `CommandPalette.Item` — shortcut hint display, keyboard shortcut label di kanan
    - Tampilkan hint `↑↓ navigate · Enter select · Esc close` di footer
    - Fade-in animation 150ms saat open, fade-out saat close
    - _Requirements: 1.1–1.10, 9.3, 9.10, 9.11_

  - [ ]* 9.4 Tulis property test untuk command selection closes palette (Property 2)
    - **Property 2: Command Selection Closes Palette**
    - Buat `tests/unit/command-palette.property.test.ts`
    - Generate arbitrary valid command dari registry, simulate selection, assert `commandPaletteOpen === false` dan action dipanggil tepat sekali
    - 100 runs minimum
    - **Validates: Requirements 1.4**

  - [ ] 9.5 Integrasikan CommandPalette ke layout
    - Update `src/app/layout.tsx` — tambahkan `<CommandPalette.Root>` yang wrap seluruh app
    - Tambahkan `<CommandPalette.Dialog>` di luar scroll container
    - Pasang `useCommandPalette()` hook di ClientProviders atau layout level
    - _Requirements: 1.1, 1.9_

  - [ ]* 9.6 Tulis E2E test untuk command palette navigation
    - Buat `tests/e2e/command-palette.spec.ts`
    - Test: Ctrl+K membuka palette, mengetik navigasi ke section, Enter menavigasi dan menutup palette, Esc menutup
    - **Validates: Requirements 1.1, 1.2, 1.4, 1.5**

- [ ] 10. Implementasi Advanced Project Showcase
  - [ ] 10.1 Update content/showcase.ts dan Project types
    - Update `src/content/showcase.ts` — expand data sesuai `Project` interface baru: `id`, `title`, `description`, `category: ProjectCategory`, `techStack: string[]`, `impact: string[]`, `images: string[]`, `links`, `featured`, `publishedAt`, `client?`
    - Pastikan existing project (Hamada Operations Platform) dimigrasi ke format baru
    - _Requirements: 5.1_

  - [ ] 10.2 Buat FlexSearch project index
    - Install: `flexsearch`
    - Buat `src/lib/search/project-search.ts` — `createProjectIndex(projects: Project[])` yang index title (boost:3), description (boost:2), tags (boost:1.5)
    - Export `searchProjects(query: string, index): Project[]`
    - _Requirements: 5.5, 5.6_

  - [ ] 10.3 Buat showcase filter state dan URL sync
    - Buat `src/hooks/use-showcase-filters.ts` — state `ShowcaseFilterState` (search, categories, techTags, sortBy), sync ke URL query params menggunakan `useRouter` + `useSearchParams`
    - Implementasi `filterAndSortProjects(projects, filters)` pipeline: filterByCategory → filterByTechTags → filterBySearch → sortBy
    - Init state dari URL params saat component mount
    - _Requirements: 5.2–5.4, 5.7–5.10, 5.13, 5.16, 5.17_

  - [ ]* 10.4 Tulis property test untuk filter state URL round-trip (Property 10)
    - **Property 10: Filter State URL Round-Trip**
    - Buat `tests/unit/showcase-filter.property.test.ts`
    - Generate arbitrary `ShowcaseFilterState` via fc.record(), serialize ke URL params, deserialize kembali, assert deep equality
    - Handle edge cases: empty arrays, default sort value, empty search string
    - 200 runs minimum
    - **Validates: Requirements 5.16, 5.17**

  - [ ] 10.5 Buat ShowcaseScene dengan filter UI dan project cards
    - Update `src/components/scenes/ShowcaseScene.tsx` — integrasikan `useShowcaseFilters()`, tampilkan filter chips (removable), "Clear All Filters" button, project count "Showing X of Y projects", empty state
    - Buat `src/components/features/project-showcase/ProjectCard.tsx` — image lazy loading dengan blur placeholder, title, description, tech stack tags, links, tilt effect + scale on hover (200ms), "View Details" expand inline
    - Buat `src/components/features/project-showcase/FilterBar.tsx` — category dropdown, tech tag multi-select, sort dropdown, search input dengan debounce 300ms
    - Buat `src/components/features/project-showcase/ActiveFilters.tsx` — removable filter chips
    - Filter animation 300ms (Req 5.4)
    - _Requirements: 5.1–5.17_

  - [ ]* 10.6 Tulis E2E test untuk project showcase filter
    - Buat `tests/e2e/project-showcase.spec.ts`
    - Test: apply filter → URL updates → refresh → filter restored
    - **Validates: Requirements 5.16, 5.17**

- [ ] 11. Implementasi Image Optimization
  - [ ] 11.1 Migrasi semua images ke Next.js Image component
    - Audit semua `src/components/scenes/*.tsx` dan `src/components/features/` — ganti `<img>` dengan `<Image>` dari `next/image`
    - Tambahkan `priority={true}` untuk hero section image (above-fold)
    - Tambahkan `sizes` prop yang appropriate: `(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`
    - Tambahkan `width` + `height` untuk prevent CLS
    - _Requirements: 12.1, 12.7, 12.8, 12.14_

  - [ ] 11.2 Implementasi blur placeholders dan lazy loading
    - Generate base64 blur placeholders untuk project images menggunakan `plaiceholder` atau `sharp`
    - Tambahkan `placeholder="blur"` dan `blurDataURL` ke semua images
    - Tambahkan fade-in CSS animation saat image loaded (300ms)
    - Implementasi fallback placeholder dengan error icon jika image gagal load (onError handler)
    - _Requirements: 12.2, 12.3, 12.4, 12.10, 12.11_

  - [ ] 11.3 Konfigurasi Next.js image optimization dan resource hints
    - Update `next.config.ts` — tambahkan `images.formats: ['image/avif', 'image/webp']`, `images.quality: 80`, `images.domains` untuk CDN
    - Update `src/app/layout.tsx` — tambahkan `<link rel="preconnect">` dan `<link rel="dns-prefetch">` untuk GitHub avatars CDN
    - Tambahkan `<link rel="prefetch">` untuk critical images next section
    - _Requirements: 12.5, 12.6, 12.9, 12.13, 12.14, 15.8_

- [ ] 12. Implementasi SEO Enhancement
  - [ ] 12.1 Buat metadata generation utilities
    - Buat `src/lib/seo/metadata.ts` — `generatePortfolioMetadata(page?: string): Metadata` dengan template title, description, OpenGraph, Twitter Card, canonical URL, robots
    - Update `src/app/layout.tsx` — gunakan `generatePortfolioMetadata()`, tambahkan `<link rel="canonical">`
    - _Requirements: 14.2, 14.3, 14.4, 14.5, 14.6, 14.14_

  - [ ] 12.2 Implementasi JSON-LD structured data
    - Buat `src/lib/seo/schema.ts` — `buildPersonSchema(): object` (Person schema dengan jobTitle, URL, sameAs), `buildArticleSchema(article, url): object`, `buildBreadcrumbSchema(items): object`
    - Buat `src/components/seo/JsonLd.tsx` — `<script type="application/ld+json">` component
    - Tambahkan `<JsonLd data={buildPersonSchema()} />` di `src/app/layout.tsx`
    - _Requirements: 14.8, 14.9, 14.15_

  - [ ] 12.3 Update robots.txt dan sitemap
    - Update `src/app/robots.ts` — proper crawl rules untuk pages dan API routes
    - Update `src/app/sitemap.ts` — include all static pages + future blog pages dengan priority hints
    - _Requirements: 14.6, 14.7_

- [ ] 13. Checkpoint Phase 2 — Pastikan semua tests pass
  - Jalankan `npm run test` — semua unit dan property tests harus pass
  - Jalankan `npm run build` — pastikan tidak ada TypeScript errors
  - Verifikasi command palette berfungsi dengan keyboard shortcuts
  - Verifikasi project showcase filter dan URL sync berfungsi
  - Verifikasi image lazy loading dan blur placeholders
  - Tanya user jika ada pertanyaan sebelum melanjutkan ke Phase 3.

---

### Phase 3 — Advanced Features

- [ ] 14. Implementasi GitHub Activity Dashboard
  - [ ] 14.1 Buat GitHub API route dengan caching dan rate limiting
    - Buat `src/app/api/github-stats/route.ts` — GET handler, check rate limit (10 req/min via `sliding-window.ts`), check CacheManager (5min TTL), fetch dari GitHub REST API v3, transform response ke `GitHubStatsResponse`, return dengan `Cache-Control: max-age=300` header
    - Gunakan `GITHUB_TOKEN` env variable (server-side only)
    - Return `cachedAt` field jika served dari cache (Req 4.7)
    - Handle rate limit exceeded: return 429 dengan cached data + timestamp
    - _Requirements: 4.1, 4.6, 4.7, 4.10, 4.14_

  - [ ] 14.2 Buat data transform utilities untuk GitHub response
    - Buat `src/lib/repositories/github.repository.ts` — `fetchRepos(username)`, `fetchContributions(username, days)`, `fetchLanguageDistribution(repos)`, `fetchStats(username)`
    - Buat `src/lib/utils/contribution-heatmap.ts` — transform `ContributionDay[]` ke 52 weeks × 7 days grid dengan level 0–4
    - _Requirements: 4.2, 4.3, 4.8, 4.9_

  - [ ] 14.3 Buat GitHubDashboard compound component
    - Buat direktori `src/components/features/github-dashboard/`
    - Buat `index.tsx` dengan ErrorBoundary wrapper (`GitHubDashboardErrorBoundary`)
    - Buat `GitHubDashboardStats.tsx` — animated counters untuk total commits, PRs, issues (Req 4.15)
    - Buat `GitHubRepoCard.tsx` — repo card dengan name, description, stars, forks, language badge, last updated; hover tooltip dengan additional details; link ke GitHub (target="_blank", rel="noopener noreferrer")
    - Buat `ContributionHeatmap.tsx` — calendar grid SVG/div rendering, color intensity per level 0–4, last 12 months
    - Buat `LanguageChart.tsx` — pie/bar chart dengan percentage breakdown
    - Skeleton loaders untuk semua sub-components
    - Fade-in animation saat data received
    - Manual refresh button dengan spinner
    - _Requirements: 4.1–4.15, 13.8_

  - [ ]* 14.4 Tulis integration tests untuk GitHub API route
    - Install: `msw` (Mock Service Worker)
    - Buat `tests/integration/github-api.test.ts`
    - Mock GitHub API responses dengan MSW, test: cache behavior (hit/miss), rate limiting (429 response), error fallback, stale data indicator
    - **Validates: Requirements 4.6, 4.7, 4.10, 4.14**

- [ ] 15. Implementasi Micro-Interactions dan Advanced Animations
  - [ ] 15.1 Implementasi GSAP ScrollTrigger untuk section reveals
    - Install: `@gsap/react` (sudah ada), pastikan `ScrollTrigger` plugin terdaftar
    - Buat `src/lib/animations/scroll-trigger-presets.ts` — presets untuk staggered fade-in, parallax background, section reveal
    - Update scene components — tambahkan GSAP ScrollTrigger untuk staggered reveal animations (Req 8.4)
    - Gunakan `gsap.matchMedia()` untuk disable pada `prefers-reduced-motion: reduce` dan low-performance devices
    - _Requirements: 8.4, 8.5, 8.12, 8.15_

  - [ ] 15.2 Implementasi magnetic cursor effect
    - Update `src/components/ui/CustomCursor.tsx` — implementasi magnetic effect: detect cursor dalam radius 50px dari interactive buttons, apply lerp movement menuju button center
    - Gunakan RAF (requestAnimationFrame) untuk smooth 60fps
    - Disable pada touch devices
    - _Requirements: 8.3, 8.15_

  - [ ] 15.3 Implementasi loading indicators dan skeleton states
    - Update semua feature components untuk menggunakan `SkeletonLoader` saat loading
    - Shimmer animation pada skeleton dengan CSS `@keyframes`
    - `aria-busy="true"` + `aria-label="Loading content"` saat loading
    - _Requirements: 8.8, 9.12_

- [ ] 16. Implementasi Blog System (MDX)
  - [ ] 16.1 Setup MDX pipeline dan dependencies
    - Install: `next-mdx-remote @next/mdx rehype-pretty-code shiki gray-matter reading-time`
    - Buat direktori `src/content/blog/` dengan sample `.mdx` files
    - Konfigurasi `next.config.ts` untuk MDX support
    - _Requirements: 10.1, 10.2, 10.4, 10.5_

  - [ ] 16.2 Buat blog listing page dan article routing
    - Buat `src/app/blog/page.tsx` — SSG, getStaticProps yang scan `content/blog/*.mdx`, parse frontmatter, return article list
    - Buat `src/app/blog/[slug]/page.tsx` — SSG + ISR (revalidate: 86400), render MDX content, table of contents, reading progress indicator
    - Buat `src/lib/blog/mdx-parser.ts` — `getAllArticles()`, `getArticleBySlug(slug)`, `calculateReadingTime(content)` (200 WPM)
    - _Requirements: 10.3, 10.4, 10.7, 10.10, 10.11_

  - [ ] 16.3 Buat blog UI components
    - Buat `src/components/features/blog/ArticleCard.tsx` — title, excerpt, date, read time, tags, cover image
    - Buat `src/components/features/blog/TableOfContents.tsx` — smooth scroll navigation ke headings, active state tracking
    - Buat `src/components/features/blog/ReadingProgress.tsx` — scrollbar visualization indicator
    - Buat `src/components/features/blog/CodeBlock.tsx` — Shiki syntax highlighting dengan line numbers, "Copy Code" button dengan success feedback toast, accessible labels
    - _Requirements: 10.5, 10.7, 10.8, 10.9_

  - [ ] 16.4 Implementasi blog metadata dan RSS
    - Update `src/lib/seo/metadata.ts` — `generateArticleMetadata(article)` dengan OpenGraph article type, Twitter card, canonical URL
    - Tambahkan `<JsonLd data={buildArticleSchema(article, url)} />` di article page
    - Buat `src/app/blog/rss.xml/route.ts` — generate RSS feed dari semua articles
    - Buat `src/app/blog/[slug]/opengraph-image.tsx` — dynamic OG image dengan article title overlay
    - _Requirements: 10.12, 10.16, 14.9, 14.11_

  - [ ] 16.5 Implementasi blog search, filter, dan related articles
    - Buat `src/lib/search/blog-search.ts` — full-text search menggunakan FlexSearch across titles dan content
    - Implementasi tag filter component (reuse dari project showcase)
    - Buat `src/lib/blog/related-articles.ts` — `getRelatedArticles(article, allArticles)` berdasarkan shared tags (sort by tag overlap count)
    - _Requirements: 10.13, 10.14, 10.15_

  - [ ]* 16.6 Tulis unit tests untuk blog utilities
    - Buat `tests/unit/blog.test.ts`
    - Test: `calculateReadingTime()` accuracy, `getAllArticles()` parsing, `getRelatedArticles()` scoring, draft exclusion
    - **Validates: Requirements 10.10, 10.13**

- [ ] 17. Implementasi Privacy-First Analytics System
  - [ ] 17.1 Buat session fingerprinting utility
    - Buat `src/lib/analytics/fingerprint.ts` — `computeSessionId(): string` menggunakan hashed combination dari `navigator.userAgent + screen.resolution + timezone` via Web Crypto API (`crypto.subtle.digest('SHA-256', ...)`)
    - Output: 16-char hex string (tidak reversible)
    - _Requirements: 7.8, 7.9_

  - [ ]* 17.2 Tulis property test untuk fingerprint determinism (Property 12)
    - **Property 12: Session Fingerprint Determinism**
    - Buat `tests/unit/fingerprint.property.test.ts`
    - Generate arbitrary (userAgent, resolution, timezone) tuples via fc.tuple(), assert sama tuple menghasilkan hash yang sama
    - Assert berbeda tuples menghasilkan berbeda hash dengan probabilitas tinggi (collision test via pigeonhole)
    - 500 runs minimum
    - **Validates: Requirements 7.8**

  - [ ] 17.3 Buat analytics event queue dan Zustand store
    - Buat `src/store/analytics.store.ts` — `queue: AnalyticsEvent[]`, `enqueue(event)`, `flush(): Promise<void>`, `sessionId` (computed once per session)
    - `flush()` — batch POST ke `/api/analytics` dengan debounce 5000ms, clear queue setelah success
    - Sampling rate: `Math.random() < SAMPLE_RATE` (0.1 di production, 1.0 di dev)
    - _Requirements: 6.14, 6.15, 7.1, 7.12, 7.13_

  - [ ]* 17.4 Tulis property test untuk analytics privacy invariant (Property 11)
    - **Property 11: Analytics Privacy Invariant**
    - Buat `tests/unit/analytics-privacy.property.test.ts`
    - Generate arbitrary analytics events, assert output payload tidak mengandung IP, email, name, phone, atau PII fields
    - Assert `sessionId` adalah hash string (tidak mengandung raw user data)
    - 200 runs minimum
    - **Validates: Requirements 7.1, 7.9**

  - [ ] 17.5 Buat analytics API route dan ingest endpoint
    - Buat `src/app/api/analytics/route.ts` — POST handler, validasi batch payload, strip/reject any PII fields, store anonymized events
    - Implementasi IP anonymization: hash last octet sebelum log apapun
    - Tambahkan opt-out via `localStorage.setItem('analytics_optout', 'true')` check di `analytics.store.ts`
    - _Requirements: 7.9, 7.15, 7.16_

  - [ ] 17.6 Implementasi Web Vitals collection
    - Install: `web-vitals`
    - Buat `src/lib/analytics/web-vitals-collector.ts` — `initWebVitalsCollection(endpoint)` yang register `onCLS, onFCP, onFID, onINP, onLCP, onTTFB` dengan sampling
    - Enqueue ke analytics store, tidak langsung kirim
    - _Requirements: 6.1, 6.2_

- [ ] 18. Implementasi Error Monitoring System
  - [ ] 18.1 Buat error monitor utility
    - Buat `src/lib/monitoring/error-monitor.ts` — `ErrorMonitor` class dengan `capture(error, context?)`, deduplication (skip same `error.message` dalam 5 menit), breadcrumbs tracking, sampling 100% dev / 10% prod
    - Register global handlers: `window.addEventListener('unhandledrejection', ...)` dan `window.onerror = ...`
    - _Requirements: 13.3, 13.4, 13.5, 13.6, 13.12, 13.14_

  - [ ] 18.2 Buat feature-scoped error boundaries
    - Buat `src/components/features/github-dashboard/GitHubDashboardErrorBoundary.tsx` — fallback: show cached data atau "unavailable" card dengan retry button
    - Buat `src/components/features/code-playground/CodePlaygroundErrorBoundary.tsx` — fallback: static syntax highlighting only
    - Buat `src/components/features/analytics-dashboard/AnalyticsBoundary.tsx` — fallback: silently disable (no user impact)
    - Buat `src/components/features/blog/BlogBoundary.tsx` — fallback: show article list without interactive features
    - Update `src/components/error-boundaries/GlobalErrorBoundary.tsx` — catch-all dengan retry + "go home" button
    - _Requirements: 13.1, 13.2, 13.7, 13.8, 13.10, 13.11_

  - [ ]* 18.3 Tulis unit tests untuk error recovery strategies
    - Buat `tests/unit/error-monitor.test.ts`
    - Test: deduplication (same error within 5min skipped), sampling rate respected, context captured correctly
    - Test: `errorResponse()` helper returns correct HTTP status codes
    - **Validates: Requirements 13.3, 13.12**

- [ ] 19. Checkpoint Phase 3 — Pastikan semua tests pass
  - Jalankan `npm run test` — semua unit, property, dan integration tests harus pass
  - Jalankan `npm run build` — pastikan tidak ada TypeScript errors
  - Verifikasi GitHub dashboard menampilkan data dengan skeleton loading
  - Verifikasi blog listing dan article pages render dengan benar
  - Verifikasi analytics events tidak mengandung PII
  - Tanya user jika ada pertanyaan sebelum melanjutkan ke Phase 4.

---

### Phase 4 — Showcase Features

- [ ] 20. Implementasi Interactive Code Playground
  - [ ] 20.1 Buat sandboxed code executor
    - Install: `sucrase` (untuk TypeScript → JS transpilation di browser)
    - Buat `src/lib/sandbox/code-executor.ts` — `createSandboxedIframe()`, `executeCode(code: string, language: 'js' | 'ts'): Promise<ExecutionResult>`
    - Iframe dengan `sandbox="allow-scripts"`, `srcdoc` injection
    - Intercept `console.log` dalam sandbox via `postMessage`
    - Inject timeout wrapper: check `Date.now() - __startTime__ > 5000` throw TimeoutError
    - `ExecutionResult`: `{ output: string[], error?: { message: string; line?: number; stack?: string }, timedOut: boolean }`
    - _Requirements: 3.3, 3.4, 3.7, 3.8_

  - [ ]* 20.2 Tulis property test untuk code execution timeout (Property 5)
    - **Property 5: Code Execution Timeout Enforcement**
    - Buat `tests/unit/code-executor.property.test.ts`
    - Generate arbitrary infinite loop patterns, assert executor returns `TimeoutError` dalam 5500ms
    - Assert page state (external variables) tidak berubah setelah timeout
    - 50 runs minimum (execution tests lebih lambat)
    - **Validates: Requirements 3.7**

  - [ ] 20.3 Buat URL encode/decode untuk code state sharing
    - Buat `src/lib/sandbox/code-state-codec.ts` — `encodeCodeState(state: CodeState): string` (JSON → btoa → URL-safe), `decodeCodeState(encoded: string): CodeState`
    - Handle malformed encoded strings — return null gracefully
    - _Requirements: 3.11, 3.12_

  - [ ]* 20.4 Tulis property test untuk code state URL round-trip (Property 6)
    - **Property 6: Code State URL Round-Trip**
    - Buat `tests/unit/code-playground.property.test.ts`
    - Generate arbitrary `CodeState` (code string + language + tabs) via fc.record(), encode → decode, assert deep equality
    - Test lossless transformation termasuk special characters, unicode, whitespace
    - 300 runs minimum
    - **Validates: Requirements 3.11, 3.12**

  - [ ] 20.5 Buat CodeMirror editor integration (dynamic import)
    - Install: `@codemirror/view @codemirror/state @codemirror/lang-javascript @codemirror/lang-html @codemirror/lang-css`
    - Buat `src/components/features/code-playground/CodeEditor.tsx` — dynamic import CodeMirror (ssr: false), syntax highlighting sesuai language, line numbers, auto-indent, bracket matching, theme sync dengan app theme
    - Highlight syntax dalam 50ms debounce
    - _Requirements: 3.1, 3.2, 3.13_

  - [ ] 20.6 Buat CodePlayground compound component
    - Buat direktori `src/components/features/code-playground/`
    - Buat `index.tsx` — wrap dengan `CodePlaygroundErrorBoundary`, dynamic import (ssr: false)
    - Buat `PlaygroundHeader.tsx` — LanguageTabs (JS/TS/HTML/CSS), ActionButtons (Run, Reset, Share)
    - Buat `PlaygroundOutput.tsx` — ConsoleOutput (log stream), ErrorDisplay (stack trace dengan line number), role="log" aria-label="Code output"
    - Share button: encode state → update URL → copy URL ke clipboard → success toast
    - Load shared state dari URL parameter `?code=...` saat mount
    - Example snippets yang bisa di-load satu klik
    - _Requirements: 3.3–3.14, 9.8_

  - [ ]* 20.7 Tulis E2E test untuk code playground
    - Buat `tests/e2e/code-playground.spec.ts`
    - Test: type code → run → lihat output → share URL → buka shared URL → code restored
    - **Validates: Requirements 3.3, 3.4, 3.11, 3.12**

- [ ] 21. Implementasi Performance Analytics Dashboard
  - [ ] 21.1 Buat Performance Monitor component
    - Buat direktori `src/components/features/analytics-dashboard/`
    - Buat `PerformanceMonitor.tsx` — display Web Vitals (LCP, FID, CLS, TTFB, INP) dengan visual indicators (green/yellow/red sesuai Core Web Vitals thresholds)
    - Buat `MetricsCard.tsx` — metric name, value, status indicator, trend spark line
    - Buat `PercentileChart.tsx` — p50, p75, p95 breakdown per metric
    - Wrap dengan `AnalyticsBoundary` — silently disable jika unavailable
    - _Requirements: 6.1, 6.3, 6.5_

  - [ ] 21.2 Implementasi analytics dashboard data queries
    - Buat `src/components/features/analytics-dashboard/VisitorStats.tsx` — visitor count, session duration, bounce rate dengan date range selector (7d/30d/90d)
    - Buat `src/components/features/analytics-dashboard/DeviceBreakdown.tsx` — pie chart untuk device/browser/connection type
    - Buat `src/components/features/analytics-dashboard/PopularPages.tsx` — top pages dengan view counts
    - Export CSV functionality untuk metrics data
    - _Requirements: 6.4, 6.5, 6.10, 6.11, 6.12, 7.2–7.7, 7.10, 7.14_

- [ ] 22. Implementasi Performance Budget dan Service Worker
  - [ ] 22.1 Setup code splitting untuk heavy features
    - Update `src/app/page.tsx` — semua feature components yang heavy menggunakan `dynamic()` dari `next/dynamic` dengan loading skeleton
    - `CodePlayground`: `dynamic(() => import(...), { loading: <CodePlaygroundSkeleton />, ssr: false })`
    - `GitHubDashboard`: `dynamic(() => import(...), { loading: <GitHubDashboardSkeleton /> })`
    - `AnalyticsDashboard`: `dynamic(() => import(...), { ssr: false })`
    - _Requirements: 15.2, 15.3_

  - [ ] 22.2 Update CSP headers dan security configuration
    - Update `next.config.ts` — CSP yang mencakup `wasm-unsafe-eval` (untuk Sucrase), `connect-src` untuk GitHub API + Resend + analytics endpoint, `frame-src 'self'` untuk code playground sandbox
    - Tambahkan `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` headers
    - _Requirements: 13.3, 15.1_

  - [ ] 22.3 Setup bundle analyzer dan CI performance checks
    - Install: `@next/bundle-analyzer`
    - Update `next.config.ts` — enable bundle analyzer dengan `ANALYZE=true` env
    - Update `.github/workflows/ci.yml` — tambahkan step bundle size check (gzipped < 200KB initial), Lighthouse CI (score ≥ 90)
    - Buat `lighthouserc.js` configuration
    - _Requirements: 15.1, 15.4, 15.15_

  - [ ] 22.4 Implementasi service worker dengan Workbox
    - Install: `next-pwa` atau konfigurasi Workbox manual
    - Konfigurasi Cache First untuk static assets, Network First untuk API calls, Stale While Revalidate untuk GitHub stats (5min TTL)
    - _Requirements: 15.11_

- [ ] 23. Wiring akhir — Integrasikan semua fitur ke layout
  - [ ] 23.1 Update ClientProviders dengan semua global providers
    - Update `src/components/ClientProviders.tsx` — wrap dengan `ThemeProvider`, `CommandPalette.Root`, Zustand stores initialization, `ErrorMonitor` initialization, Web Vitals collection init, analytics queue init
    - Pastikan urutan provider benar (theme harus paling luar untuk avoid flash)
    - _Requirements: 2.4, 6.2, 17.3 (analytics init)_

  - [ ] 23.2 Update layout.tsx dengan semua metadata dan scripts
    - Update `src/app/layout.tsx` — tambahkan `generateMetadata()` export, anti-flash theme script inline, JSON-LD Person schema, resource hints (`preconnect`, `dns-prefetch`), `ToastContainer`, analytics opt-out script
    - Tambahkan `id="main-content"` pada `<main>` untuk skip-to-content link
    - _Requirements: 9.1, 14.1–14.5, 15.8_

  - [ ] 23.3 Wire GitHubDashboard ke ShowcaseScene atau dedicated section
    - Buat `src/components/scenes/GitHubScene.tsx` atau integrasikan ke existing scene
    - Tambahkan ke `src/app/page.tsx` dengan dynamic import dan command palette navigation command
    - _Requirements: 4.1–4.15_

  - [ ]* 23.4 Tulis E2E smoke tests untuk critical flows
    - Buat `tests/e2e/contact-form.spec.ts` — fill form → validate → submit → success toast
    - Buat `tests/e2e/theme-toggle.spec.ts` — toggle theme → verify CSS variables applied → reload → theme persisted
    - **Validates: Requirements 2.3, 2.4, 11.9**

- [ ] 24. Final Checkpoint — Pastikan semua tests pass dan performance budgets terpenuhi
  - Jalankan `npm run test` — 100% unit, property, dan integration tests pass
  - Jalankan `npm run test:e2e` — semua E2E critical flows pass
  - Jalankan `npm run build` — zero TypeScript errors, zero lint errors
  - Verifikasi semua 16 correctness properties terimplementasi dalam test suite
  - Verifikasi performance: bundle size, LCP, FID, CLS sesuai budget
  - Tanya user jika ada pertanyaan atau penyesuaian yang diperlukan.

---

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat, namun sangat direkomendasikan untuk memverifikasi correctness properties
- Setiap task mereferensikan requirements spesifik untuk traceability
- **16 Correctness Properties** semuanya tercakup dalam property-based tests:
  - P1 → 8.5 | P2 → 9.4 | P3 → 2.3 | P4 → 2.4 | P5 → 20.2 | P6 → 20.4
  - P7 → 4.8 | P8 → 4.6 | P9 → 8.2 | P10 → 10.4 | P11 → 17.4 | P12 → 17.2
  - P13 → 3.2 | P14 → 4.2 | P15 → 4.2 | P16 → 4.4
- Implementasi bahasa: **TypeScript** (strict mode, zero `any`)
- Testing stack: **Vitest + fast-check** (property tests), **Playwright** (E2E)
- Semua API routes menggunakan `secureApiResponse()` dengan proper security headers
- Setiap feature heavy menggunakan `dynamic()` import untuk code splitting (Req 15.2)
- Checkpoints di task 7, 13, 19, dan 24 memastikan validasi incremental

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1", "1.2", "1.3"] },
    { "id": 1, "tasks": ["2.1", "3.1", "4.1", "4.3", "4.5", "4.7"] },
    { "id": 2, "tasks": ["2.2", "3.3", "3.4", "4.2", "4.4", "4.6", "4.8", "8.1", "8.3"] },
    { "id": 3, "tasks": ["2.3", "2.4", "3.2", "5.1", "5.2", "6.1", "6.2", "8.4", "10.1"] },
    { "id": 4, "tasks": ["5.3", "8.2", "8.5", "9.1", "10.2", "10.3", "11.1", "12.1"] },
    { "id": 5, "tasks": ["5.4", "9.2", "10.4", "10.5", "11.2", "11.3", "12.2", "12.3"] },
    { "id": 6, "tasks": ["9.3", "10.6", "14.1", "14.2", "15.1", "16.1", "17.1"] },
    { "id": 7, "tasks": ["9.4", "9.5", "14.3", "15.2", "15.3", "16.2", "17.2", "17.3"] },
    { "id": 8, "tasks": ["9.6", "14.4", "15.4", "16.3", "17.4", "17.5", "17.6", "18.1"] },
    { "id": 9, "tasks": ["16.4", "16.5", "18.2", "20.1", "20.3", "21.1"] },
    { "id": 10, "tasks": ["16.6", "18.3", "20.2", "20.4", "20.5", "21.2"] },
    { "id": 11, "tasks": ["20.6", "22.1", "22.2", "22.3"] },
    { "id": 12, "tasks": ["20.7", "22.4", "23.1", "23.2"] },
    { "id": 13, "tasks": ["23.3", "23.4"] }
  ]
}
```
