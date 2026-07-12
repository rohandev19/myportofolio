# PORTFOLIO MASTER BLUEPRINT V4 (FINAL) — Rohan (Fullstack Developer)

> **Cara pakai:** Tempel ke AI IDE (Cursor / Claude Code / Windsurf). Eksekusi **satu Fase per satu perintah** (Bagian 17). Satu Fase = satu branch = satu PR = satu commit.
>
> **Batasan Scope (dikunci):** blueprint ini dianggap _feature-complete_ untuk portofolio single-developer. Penambahan CMS, i18n/multi-language, A/B testing, atau admin dashboard di luar scope ini — kalau muncul dorongan menambah salah satu, itu tandanya over-engineering, bukan penyempurnaan.

---

## 1. VISION

```
WHO I AM            → Loader, Hero, About
WHERE I'VE BEEN     → Journey Timeline
WHAT I BUILD        → Tech Galaxy, Featured Projects
HOW I BUILD         → Engineering Philosophy, System Architecture
PROOF               → GitHub Statistics
PRODUCTION MINDSET  → Security & DevOps
WHERE I'M GOING     → Career Roadmap
WHY IT MATTERS      → Contact
```

---

## 2. ARCHITECTURE

```
Browser → Vercel Edge (CDN) → Next.js 15 App Router
              ↓                        ↓
     /api/contact              /api/github-stats (ISR revalidate 3600s)
              ↓                        ↓
   Resend + Upstash Redis        GitHub REST API
   (kirim email + rate limit +
    DOMPurify sanitize body)
```

```
src/
  content/
    hero.ts, about.ts, projects.ts, timeline.ts
    roadmap.ts, principles.ts, techstack.ts
  app/
    layout.tsx, page.tsx
    sitemap.ts, robots.ts, opengraph-image.tsx
    api/contact/route.ts
    api/github-stats/route.ts
  components/
    scenes/  ...
    ui/
    error-boundaries/
      GlobalErrorBoundary.tsx
      TechGalaxyErrorBoundary.tsx
      ContactErrorBoundary.tsx
    canvas/
  lib/
    animations/, validation/, rate-limit/, seo/, sanitize/, utils/
  hooks/
  store/
  types/
```

---

## 3. DESIGN SYSTEM

Tidak berubah: `#070B14` / `#0F172A` / `#38BDF8` / `#818CF8`, font sans + mono.

---

## 4. SCENE PLANNING (13 Scene)

| #   | Scene                  | Catatan                                                                                                       |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------- |
| 1   | Loader                 | ≤1.5 detik; **skip otomatis** kalau `prefers-reduced-motion` aktif ATAU sudah pernah tampil di sesi yang sama |
| 2   | Hero                   | Dibungkus Global Error Boundary sejak fase awal                                                               |
| 3   | About                  | MorphSVG blob (titik pemakaian #1)                                                                            |
| 4   | Journey Timeline       | —                                                                                                             |
| 5   | Tech Galaxy            | 3D berat, dibungkus Error Boundary sendiri (Bagian 11)                                                        |
| 6   | Engineering Philosophy | —                                                                                                             |
| 7   | Featured Projects      | + field Metrics di deep-dive                                                                                  |
| 8   | System Architecture    | —                                                                                                             |
| 9   | GitHub Statistics      | Empty state kalau API gagal (Bagian 11), bukan spinner selamanya                                              |
| 10  | Security & DevOps      | —                                                                                                             |
| 11  | Career Roadmap         | —                                                                                                             |
| 12  | Contact                | Dibungkus Error Boundary sendiri; DOMPurify pada sanitasi body                                                |
| 13  | Footer                 | —                                                                                                             |

**Tech Galaxy tiering (tidak berubah dari V3):**

```
Primary: React · Laravel · Flutter · TypeScript
Secondary: HTML5 · JavaScript · PHP · MySQL · Redis · Git
Ambient particles: 80-120 (desktop) / 20-30 (mobile, auto-turun)
```

---

## 5. ANIMATION PLANNING

| Kebutuhan               | Tool                                        | Catatan                                                                                                                                                                                                             |
| ----------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scroll storytelling     | GSAP + ScrollTrigger                        | —                                                                                                                                                                                                                   |
| Smooth scroll           | **Lenis** (bukan ScrollSmoother)            | —                                                                                                                                                                                                                   |
| Teks reveal             | GSAP SplitText                              | —                                                                                                                                                                                                                   |
| Morph SVG               | GSAP MorphSVG                               | Dibatasi 2 tempat: Loader→Hero, blob About                                                                                                                                                                          |
| Micro-interaction       | `motion`                                    | —                                                                                                                                                                                                                   |
| 3D Tech Galaxy          | **WebGL primary**                           | `<Canvas frameloop="demand">` + panggil `invalidate()` manual saat ada interaksi (hover/parallax); kalau scene keluar viewport, render loop otomatis berhenti — GPU tidak bekerja sia-sia saat idle atau off-screen |
| WebGPU                  | Eksperimen non-blocking, Fase 12 stretch    | Fallback WebGL otomatis kalau gagal init                                                                                                                                                                            |
| Progressive enhancement | View Transitions API, CSS `scroll-timeline` | Fallback GSAP kalau tidak didukung                                                                                                                                                                                  |

---

## 6. SEO STRATEGY (Disederhanakan)

- **Metadata API** — cukup di level **root** (`app/layout.tsx`), karena ini single-page. Tidak perlu `generateMetadata` per section-anchor — section anchor bukan route terpisah, jadi tidak ada gunanya metadata ganda.
- OpenGraph + Twitter Card via `opengraph-image.tsx`.
- `sitemap.ts`, `robots.ts`.
- **JSON-LD terbatas ke 2 hal:** `Person` schema (root/Hero) dan `Project`/`SoftwareSourceCode` schema (satu per project di Featured Projects). Tidak ada JSON-LD tambahan di luar dua ini.
- Canonical URL konsisten.

---

## 7. PERFORMANCE & BUNDLE STRATEGY

### 7.1 Core Web Vitals

| Metrik | Ambang "Good" (Google) | Target Situs Ini |
| ------ | ---------------------- | ---------------- |
| LCP    | ≤ 2.5s                 | ≤ 2.0s           |
| INP    | ≤ 200ms                | ≤ 150ms          |
| CLS    | ≤ 0.1                  | ≤ 0.05           |

### 7.2 Bundle Strategy

```
Critical: Loader, Hero, About (shell)
Lazy (dynamic import, viewport-triggered): Tech Galaxy, GitHub Stats, Contact, System Architecture
Prefetch saat idle: chunk Tech Galaxy di-prefetch begitu Hero selesai render
```

### 7.3 GPU/Memory Budget _(baru — dengan teknik konkret, bukan cuma angka)_

```
Target kesadaran (bukan hard gate otomatis):
Desktop : GPU memory < 250MB
Mobile  : GPU memory < 100MB

Teknik untuk mencapainya:
- Dispose geometry/material/texture eksplisit saat scene unmount
  (useEffect cleanup, gsap.context().revert())
- Partikel ambient pakai InstancedMesh, BUKAN duplikasi mesh satu-satu
- Tekstur logo pakai resolusi dibatasi (mis. 256-512px), kompresi
  KTX2/Basis kalau perlu, bukan PNG mentah beresolusi tinggi
- frameloop="demand" (Bagian 5) sekaligus mengurangi beban GPU saat idle
```

### 7.4 Image Optimization

```
AVIF utama, WebP fallback (next/image otomatis)
blurDataURL untuk gambar non-kritis
priority hanya untuk gambar LCP (Hero)
sizes disesuaikan per breakpoint
```

---

## 8. ACCESSIBILITY STRATEGY

- Keyboard navigation penuh, urutan tab logis.
- Skip navigation link ("Skip to content").
- Focus trap untuk modal (kalau ada, mis. detail project).
- ARIA live region untuk status submit Contact.
- Kontras warna AA (`#38BDF8`/`#818CF8` terverifikasi terhadap background gelap).
- Hierarki heading semantik (`<h1>` sekali di Hero, `<h2>` per scene).
- Loader **wajib** di-skip kalau `prefers-reduced-motion` aktif (Bagian 4).

---

## 9. SECURITY STRATEGY

- Security headers (CSP, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`).
- Rate limiting `/api/contact` via Upstash Redis.
- Validasi Zod client + server.
- Verifikasi Origin/Referer (bukan CSRF token klasik — form ini publik tanpa sesi login, ancaman nyatanya spam/bot, bukan session hijacking).
- Honeypot field + timing heuristic.
- **DOMPurify** — sanitasi `message body` sebelum diinterpolasi ke template React Email, sebagai lapisan tambahan meski React Email sendiri sudah cukup aman secara default (defense in depth, bukan karena React Email tidak aman).
- (Stretch, hanya jika spam jadi masalah nyata) Cloudflare Turnstile free tier.
- Dependabot aktif.

---

## 10. OBSERVABILITY STRATEGY

- Vercel Analytics + Speed Insights.
- Sentry (free tier) — error monitoring client & server, terhubung ke Error Boundary (Bagian 11) supaya setiap boundary yang ke-trigger otomatis ter-log.
- Web Vitals logging via `useReportWebVitals`.
- **GitHub Stats caching (final):**
  ```ts
  // Server
  fetch(url, { next: { revalidate: 3600 } })

  // Client (TanStack Query)
  { staleTime: Infinity, refetchOnWindowFocus: false }
  ```
  Dua layer ini tidak saling menghapus — ISR melindungi rate limit ke GitHub API, `staleTime`/`refetchOnWindowFocus` mencegah refetch percuma dari client ke API route kita sendiri.

### 10.1 Analytics Event Map

```
Track:
- CV Download
- Project Click (per project, dengan label nama project)
- Contact Submit (sukses/gagal dibedakan)
- GitHub Link Click
- Time on Page
- Scroll Depth (per scene, opsional 25/50/75/100%)
```

---

## 11. ERROR BOUNDARY & EMPTY STATE STRATEGY _(baru)_

Alasan: kegagalan Three.js/WebGL yang tidak ditangani bisa membuat seluruh halaman blank — risiko besar untuk first impression recruiter.

```
Global Error Boundary   → membungkus seluruh page, fallback: pesan singkat + tombol reload
TechGalaxy Boundary     → kalau 3D scene gagal (init WebGL error, context lost, dsb),
                          fallback: grid statis logo tech stack (CSS/SVG, bukan 3D)
Contact Boundary        → kalau form/JS error, fallback: tautan email mailto: langsung
```

**Empty State** (bukan Error Boundary, tapi kasus serupa — data gagal dimuat, bukan crash):

```
GitHub Statistics scene, kalau fetch gagal/rate-limited:
  tampilkan teks "GitHub activity temporarily unavailable"
  BUKAN spinner tak berujung
```

---

## 12. BROWSER SUPPORT MATRIX _(baru)_

```
Desktop (wajib mulus):
  Chrome (latest), Edge (latest), Firefox (latest), Safari (latest)

Mobile (wajib mulus):
  Chrome Android, Safari iOS

Graceful degradation (boleh berkurang, TIDAK BOLEH rusak):
  - Tanpa WebGPU     → fallback WebGL otomatis
  - Tanpa View Transitions API → fallback fade GSAP
  - Tanpa CSS scroll-timeline  → fallback ScrollTrigger biasa
  - prefers-reduced-motion     → animasi berat dimatikan, termasuk loader
```

> Alasan eksplisit: recruiter sering membuka portofolio dari Safari (desktop kantor atau iPhone) — matrix ini memastikan tidak ada fitur yang jadi single point of failure di browser tertentu.

---

## 13. TESTING STRATEGY

| Level     | Tool                  | Cakupan                                                 |
| --------- | --------------------- | ------------------------------------------------------- |
| Unit      | Vitest                | Fungsi utilitas, transformasi data                      |
| Component | React Testing Library | Form contact, dot navigation                            |
| E2E       | Playwright            | Scroll penuh, submit form, viewport mobile              |
| CI Gate   | GitHub Actions        | Lint + typecheck + unit + e2e wajib lulus sebelum merge |

---

## 14. DEPLOYMENT STRATEGY (Vercel Free Tier)

1. Push ke GitHub, branch protection di `main`.
2. Import project di Vercel (login GitHub, auto-detect Next.js).
3. Environment variables via dashboard Vercel (`RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, `SENTRY_DSN`, dst).
4. Deploy → domain `nama-project.vercel.app`.
5. Push `main` → production deploy; tiap PR → preview deployment.
6. (Opsional) Dockerfile untuk demonstrasi portabilitas, deploy aktual tetap via Vercel.

---

## 15. AI IDE EXECUTION RULES (Wajib)

**Sebelum menulis kode di setiap fase, urutan wajib:**

```
1. Requirement Analysis   — apa yang harus dicapai fase ini, edge case apa saja
2. Architecture Decision  — komponen apa, data flow-nya bagaimana
3. Implementation Plan    — urutan langkah teknis
4. BARU tulis kode
```

Ditambah aturan tetap:

- ✅ Clean code, tanpa komentar — penamaan self-explanatory.
- 📱 Responsive check tiap fase — minimal 3 breakpoint.
- 🔁 Commit & push setiap fitur selesai (Bagian 16).
- 🧪 Tidak ada fitur kritis tanpa test.

---

## 16. GIT WORKFLOW

- Satu scene/fitur = satu branch → PR → CI lulus → merge `main`.
- Conventional commits: `feat:` `fix:` `perf:` `refactor:` `test:` `chore:` `docs:`.

---

## 17. ROADMAP — FASE 0 SAMPAI 12

| Fase   | Isi                                                                                                                                                                                                                                                       | Commit Contoh                                                |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **0**  | Setup Next.js 15 + TS + Tailwind v4 + ESLint/Prettier/Husky + CI skeleton + folder `content/` + design token + `robots.ts`/`sitemap.ts`                                                                                                                   | `chore: initial project setup`                               |
| **1**  | Layout global + Lenis + ScrollTrigger + dot nav + skip-navigation link + **Global Error Boundary** di root layout + Metadata API root                                                                                                                     | `feat: global layout, scroll driver, global error boundary`  |
| **2**  | Loader (≤1.5s, skip on repeat visit ATAU reduced-motion) + Hero (SplitText) + JSON-LD Person schema                                                                                                                                                       | `feat: loader and hero scene with person schema`             |
| **3**  | About (MorphSVG blob) + Journey Timeline                                                                                                                                                                                                                  | `feat: about and journey timeline scenes`                    |
| **4**  | Tech Galaxy — WebGL primary, tiering logo, `frameloop="demand"`, GPU memory budget (InstancedMesh, dispose, compressed texture), **TechGalaxy Error Boundary** + fallback grid statis                                                                     | `feat: 3D tech galaxy scene with error boundary`             |
| **5**  | Engineering Philosophy scene                                                                                                                                                                                                                              | `feat: engineering philosophy scene`                         |
| **6**  | Featured Projects deep-dive (+ Metrics) + JSON-LD Project schema + tombol CV Download                                                                                                                                                                     | `feat: featured projects with metrics and cv download`       |
| **7**  | System Architecture scene                                                                                                                                                                                                                                 | `feat: system architecture scene`                            |
| **8**  | GitHub Statistics — TanStack Query (`staleTime: Infinity`) + ISR `revalidate: 3600` + **Empty State** kalau API gagal                                                                                                                                     | `feat: github statistics scene with caching and empty state` |
| **9**  | Security & DevOps scene + hardening nyata (headers, rate limit, honeypot, origin check, **DOMPurify**, Dependabot)                                                                                                                                        | `feat: security devops scene and real hardening`             |
| **10** | Career Roadmap + Contact scene (Zod + Resend + honeypot + aria-live + **Contact Error Boundary**) + Footer                                                                                                                                                | `feat: career roadmap and contact scene`                     |
| **11** | Observability (Sentry terhubung ke Error Boundary, Web Vitals logging, **Analytics Event Map** lengkap) + Testing pass (Vitest/RTL/Playwright) + CI gate final                                                                                            | `feat: observability, analytics events, full test coverage`  |
| **12** | SEO finishing + Accessibility audit + Performance/Bundle/GPU-memory audit + **Browser Support Matrix QA** (Chrome/Edge/Firefox/Safari desktop + Chrome Android/Safari iOS) + Deploy Vercel + branch protection + (stretch) WebGPU eksperimen non-blocking | `chore: production hardening and deploy`                     |

---

## 18. CHECKLIST FINAL

- [ ] 13 scene urut sesuai Bagian 1, semua dibungkus Error Boundary yang relevan.
- [ ] Loader ≤1.5 detik, skip pada repeat-visit ATAU `prefers-reduced-motion`.
- [ ] Tech Galaxy: `frameloop="demand"` aktif, GPU budget terjaga (InstancedMesh, dispose, compressed texture), fallback grid statis kalau WebGL gagal.
- [ ] GitHub Stats: ISR 3600s + `staleTime: Infinity` + `refetchOnWindowFocus: false` + Empty State kalau gagal.
- [ ] SEO: metadata root saja (bukan per-section), JSON-LD terbatas Person + Project.
- [ ] Security: header, rate limit, honeypot, origin check, DOMPurify, Dependabot — semua aktif.
- [ ] Observability: Sentry terhubung ke semua Error Boundary, Web Vitals logging jalan, Analytics Event Map lengkap (6 event).
- [ ] Browser Support Matrix diverifikasi manual di Safari desktop & iOS (bukan cuma Chrome).
- [ ] CI (GitHub Actions) gate wajib, branch protection aktif.
- [ ] LCP ≤2.0s, INP ≤150ms, CLS ≤0.05 — diverifikasi via Speed Insights real-user data.
- [ ] Tidak ada CMS/i18n/AB-testing/admin dashboard ditambahkan — scope dikunci sesuai Batasan Scope di atas.
