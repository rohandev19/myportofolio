# Design Document: Senior-Level Portfolio Features

## Overview

Dokumen ini menjelaskan arsitektur teknis dan desain komprehensif untuk 15 fitur senior-level yang akan diintegrasikan ke dalam portfolio website berbasis Next.js 15, React 19, dan TypeScript. Setiap fitur dirancang dengan prinsip **clean architecture**, **separation of concerns**, dan **progressive enhancement** — memastikan codebase tetap maintainable seiring pertumbuhan fitur.

Portfolio ini bukan hanya sebuah website; ini adalah demonstrasi langsung dari kemampuan engineering. Setiap keputusan arsitektur mencerminkan trade-off yang dipikirkan matang antara performa, maintainability, aksesibilitas, dan keamanan.

### Tujuan Desain

- **Separation of Concerns**: UI, business logic, data fetching, dan side effects dipisah dengan tegas
- **Type Safety**: TypeScript strict mode di seluruh codebase dengan zero `any` types
- **Performance First**: Code splitting agresif, caching berlapis, dan lazy loading sebagai default
- **Accessibility by Default**: WCAG AA compliance bukan afterthought melainkan constraint desain awal
- **Security Hardened**: Input sanitization, CSP headers, rate limiting di setiap attack surface
- **Testability**: Arsitektur memudahkan unit testing, property testing, dan integration testing

### Tech Stack

| Layer         | Library               | Version           | Rationale                                 |
| ------------- | --------------------- | ----------------- | ----------------------------------------- |
| Framework     | Next.js               | 16.x (App Router) | RSC + streaming, built-in code splitting  |
| UI Runtime    | React                 | 19.x              | Concurrent features, use() hook           |
| Language      | TypeScript            | 5.x strict        | Type safety, IDE support                  |
| Animation     | GSAP + ScrollTrigger  | 3.x               | Professional-grade, performance-optimized |
| 3D            | React Three Fiber     | 9.x               | Declarative 3D                            |
| Smooth Scroll | Lenis                 | 1.x               | Native-feel scrolling                     |
| Styling       | Tailwind CSS          | v4                | Utility-first, JIT                        |
| Form          | react-hook-form + zod | latest            | Type-safe validation                      |
| State         | Zustand               | 5.x               | Lightweight, devtools-compatible          |
| Testing       | Vitest + fast-check   | latest            | PBT support, ESM-native                   |

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Next.js App Router                           │
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ Server Layer │  │  API Routes  │  │    Middleware Layer       │  │
│  │ (RSC + SSG)  │  │  (App/API/)  │  │ (Auth, Rate Limit, CSP)  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────────┘  │
│         │                 │                                          │
│  ┌──────▼───────────────────────────────────────────────────────┐   │
│  │                    Client Layer (React 19)                    │   │
│  │                                                               │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐  │   │
│  │  │   Zustand   │  │ Context API  │  │  GSAP/Animation    │  │   │
│  │  │ Global Store│  │ (Theme, A11y)│  │  Engine            │  │   │
│  │  └─────────────┘  └──────────────┘  └────────────────────┘  │   │
│  │                                                               │   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │                  Feature Modules                        │  │   │
│  │  │  CommandPalette │ CodePlayground │ GitHubDashboard     │  │   │
│  │  │  ProjectShowcase│ Analytics     │ BlogSystem           │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  │                                                               │   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │              Shared UI Primitives                       │  │   │
│  │  │  Button │ Card │ Toast │ Modal │ Skeleton │ Input       │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                               │
              ┌────────────────┼─────────────────┐
              ▼                ▼                  ▼
       GitHub API v3     Email Service       Analytics DB
       (Cached 5min)    (Resend/SendGrid)   (Self-hosted)
```

### Directory Structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout + RSC providers
│   ├── page.tsx                    # Home page
│   ├── blog/
│   │   ├── page.tsx                # Blog listing (SSG)
│   │   └── [slug]/page.tsx         # Article page (SSG + ISR)
│   └── api/
│       ├── github-stats/route.ts   # GitHub data proxy + cache
│       ├── contact/route.ts        # Contact form + rate limit
│       └── analytics/route.ts      # Analytics ingest
├── components/
│   ├── features/                   # Feature-specific compound components
│   │   ├── command-palette/
│   │   ├── code-playground/
│   │   ├── github-dashboard/
│   │   ├── project-showcase/
│   │   ├── analytics-dashboard/
│   │   └── blog/
│   ├── scenes/                     # Full-page scroll sections (existing)
│   ├── ui/                         # Shared design system primitives
│   └── providers/                  # Context + global state providers
├── hooks/                          # Custom React hooks (pure logic)
│   ├── use-command-palette.ts
│   ├── use-debounce.ts
│   ├── use-fuzzy-search.ts
│   ├── use-theme.ts
│   ├── use-intersection-observer.ts
│   └── use-rate-limit.ts
├── lib/
│   ├── animations/                 # GSAP animation presets
│   ├── cache/                      # Cache Manager abstraction
│   ├── rate-limit/                 # Sliding window rate limiter
│   ├── sanitize/                   # Input sanitization utilities
│   ├── seo/                        # Metadata generation utilities
│   ├── validation/                 # Zod schemas
│   └── utils/                      # Pure utility functions
├── store/                          # Zustand store slices
│   ├── ui.store.ts                 # Toast, modal, sidebar state
│   ├── theme.store.ts              # Theme preference state
│   └── analytics.store.ts         # Analytics event queue
├── types/                          # TypeScript type definitions
└── content/                        # Static content (existing)
```

### Architectural Patterns

**1. Feature Module Pattern (Compound Components)**

Setiap fitur complex (Command Palette, Code Playground, dsb.) diorganisir sebagai compound component dengan context internal. Pattern ini menjaga enkapsulasi state dan memungkinkan fleksibel composition.

```typescript
// Pattern: Compound Component dengan Context Internal
// components/features/command-palette/index.tsx

interface CommandPaletteContextValue {
  isOpen: boolean;
  query: string;
  results: CommandResult[];
  selectedIndex: number;
  open: () => void;
  close: () => void;
  setQuery: (q: string) => void;
  selectCommand: (cmd: CommandResult) => void;
}

// Root component yang provide context
CommandPalette.Root = CommandPaletteRoot;
CommandPalette.Trigger = CommandPaletteTrigger;
CommandPalette.Dialog = CommandPaletteDialog;
CommandPalette.Input = CommandPaletteInput;
CommandPalette.Results = CommandPaletteResults;
CommandPalette.Item = CommandPaletteItem;
```

**2. Custom Hook Pattern (Logic Extraction)**

Business logic selalu diekstrak ke custom hooks, memisahkannya dari rendering concerns.

```typescript
// hooks/use-fuzzy-search.ts — pure logic, tidak ada JSX
export function useFuzzySearch<T>(
  items: T[],
  keys: (keyof T)[],
  options: FuzzySearchOptions
): {
  results: FuzzyResult<T>[];
  search: (query: string) => void;
  clear: () => void;
};
```

**3. Repository Pattern untuk Data Fetching**

API calls diabstrak ke repository functions, memudahkan mocking dalam tests.

```typescript
// lib/repositories/github.repository.ts
export interface GitHubRepository {
  fetchRepos(username: string): Promise<Repo[]>;
  fetchContributions(username: string, days: number): Promise<ContributionDay[]>;
}
```

**4. Layered Caching Strategy**

```
Request → In-Memory LRU Cache (100ms)
        → Redis/KV Cache (5min TTL)
        → GitHub API (rate-limited)
        → Stale-While-Revalidate fallback
```

---

## Components and Interfaces

### 1. Command Palette System

**Component Hierarchy:**

```
<CommandPalette.Root>          ← Context provider, keyboard listener
  <CommandPalette.Trigger />   ← Visual hint button (optional)
  <CommandPalette.Dialog>      ← Portal + focus trap + backdrop
    <CommandPalette.Input />   ← Search input dengan autofocus
    <CommandPalette.Results>   ← Virtualized results list
      <CommandPalette.Item />  ← Individual command item
    </CommandPalette.Results>
  </CommandPalette.Dialog>
</CommandPalette.Root>
```

**Core Interface:**

```typescript
// types/command-palette.types.ts
export type CommandCategory = "navigation" | "actions" | "settings" | "themes";

export interface Command {
  id: string;
  label: string;
  description?: string;
  category: CommandCategory;
  keywords: string[]; // Untuk fuzzy search
  icon?: React.ComponentType;
  shortcut?: string[]; // e.g. ['⌘', 'K']
  action: () => void | Promise<void>;
}

export interface FuzzySearchOptions {
  threshold: number; // Max Levenshtein distance (default: 2)
  keys: (keyof Command)[]; // Fields untuk search
  limit: number; // Max results
}
```

**Key Hook: `useCommandPalette`**

```typescript
// hooks/use-command-palette.ts
export function useCommandPalette() {
  // Global keyboard listener (⌘K / Ctrl+K)
  // Focus management (trap focus in dialog)
  // Scroll lock when open
  // Returns: { isOpen, open, close, commands, query, setQuery, results }
}
```

**Key Hook: `useFuzzySearch`**

```typescript
// hooks/use-fuzzy-search.ts
// Implements Levenshtein distance algorithm
// Debounced execution (100ms)
// Supports multi-key search dengan scoring
export function useFuzzySearch<T extends Record<string, unknown>>(
  items: T[],
  keys: (keyof T)[],
  query: string,
  options?: Partial<FuzzySearchOptions>
): FuzzyResult<T>[];
```

---

### 2. Theme System

**Architecture:** Zustand store + CSS custom properties + localStorage persistence

```typescript
// store/theme.store.ts
interface ThemeStore {
  theme: "dark" | "light" | "system";
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
  // Persisted via zustand/middleware/persist with localStorage
}
```

**CSS Custom Properties Strategy:**
Theme values diprop sebagai CSS variables sehingga transisi bisa di-animate via CSS transitions:

```css
/* globals.css */
:root[data-theme="dark"] {
  --color-bg-primary: #070b14;
  --color-bg-secondary: #0f172a;
  --color-text-primary: #f8fafc;
  --color-accent-blue: #38bdf8;
  transition:
    color 500ms cubic-bezier(0.4, 0, 0.2, 1),
    background-color 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

### 3. Interactive Code Playground

**Architecture: Sandboxed Execution**

Code execution harus diisolasi dari page context. Ada dua pendekatan, dan kami memilih **sandboxed iframe** approach karena tidak memerlukan server-side execution:

```
User Code (string)
    │
    ▼
Code Transformer (TypeScript → JS via Sucrase/Babel WASM)
    │
    ▼
Sandboxed iframe (srcdoc, sandbox="allow-scripts")
    │
    ▼ (postMessage)
Output Panel (console.log intercept, error capture, return values)
```

**Component Hierarchy:**

```
<CodePlayground>
  <PlaygroundHeader>
    <LanguageTabs />     ← JS/TS/HTML/CSS selector
    <ActionButtons />    ← Run, Reset, Share
  </PlaygroundHeader>
  <PlaygroundEditor>
    <CodeMirror />       ← Dynamic import (code split)
    <LineNumbers />
  </PlaygroundEditor>
  <PlaygroundOutput>
    <ConsoleOutput />    ← Log stream
    <ErrorDisplay />     ← Stack trace dengan line numbers
  </PlaygroundOutput>
</CodePlayground>
```

**Timeout Mechanism:**

```typescript
// lib/sandbox/code-executor.ts
const EXECUTION_TIMEOUT_MS = 5000;

function createTimeoutWrapper(code: string): string {
  // Wrap user code: check elapsed time in loop bodies
  // Inject: if (Date.now() - __startTime__ > 5000) throw new Error('Timeout')
}
```

**URL State Encoding:**

```typescript
// URL share: base64url encode the code state
function encodeCodeState(state: CodeState): string {
  const json = JSON.stringify(state);
  return btoa(json).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function decodeCodeState(encoded: string): CodeState {
  const json = atob(encoded.replace(/-/g, "+").replace(/_/g, "/"));
  return JSON.parse(json);
}
```

---

### 4. GitHub Activity Dashboard

**Data Flow:**

```
Browser → /api/github-stats → In-Memory Cache → GitHub REST API v3
                    │
                    └→ Stale cache (served with "cached" indicator)
```

**API Route Design:**

```typescript
// app/api/github-stats/route.ts
export async function GET(request: Request): Promise<Response> {
  // 1. Rate limiting check (10 req/min per IP)
  // 2. Cache check (5min TTL)
  // 3. Fetch from GitHub API if cache miss
  // 4. Transform + return with cache headers
}

// Response shape
interface GitHubStatsResponse {
  repos: Repository[];
  contributions: ContributionData;
  stats: { totalCommits: number; totalPRs: number; totalIssues: number };
  languageDistribution: LanguageDistribution;
  cachedAt?: string; // Present if served from cache
  rateLimitRemaining?: number;
}
```

**Contribution Heatmap Algorithm:**

```
ContributionData → [{ date: string, count: number, level: 0-4 }]
                 → 52 weeks × 7 days grid
                 → SVG/div rendering dengan color intensity
```

---

### 5. Project Showcase dengan Search & Filter

**State Architecture:**

```typescript
// Semua filter state direpresentasikan sebagai single object
// untuk mudah di-serialize ke URL params
interface ShowcaseFilterState {
  search: string;
  categories: string[];
  techTags: string[];
  sortBy: "latest" | "oldest" | "impact";
}

// Synchronized ke URL: ?search=react&cat=web&tech=ts&sort=latest
```

**Search Index Design:**

```typescript
// lib/search/project-search.ts
// Menggunakan FlexSearch.js (lightweight, no server needed)
// Pre-built index dari content/showcase.ts pada module initialization
export function createProjectIndex(projects: Project[]): FlexSearch.Document {
  // Index: id, title (boost:3), description (boost:2), tags (boost:1.5)
}
```

**Filter + Sort Pipeline:**

```
Raw Projects Array
    │
    ├─ filterByCategory(categories[]) → O(n)
    ├─ filterByTechTags(techTags[])   → O(n)
    ├─ filterBySearch(query, index)   → O(log n) via search index
    └─ sortBy(sortKey)               → O(n log n)
    │
    ▼
Filtered + Sorted Projects
```

---

### 6. Performance Analytics Dashboard

**Privacy-First Architecture (Req 6 + 7):**

```
Client Event → LocalEventQueue (buffer, 5s debounce)
             → Batch POST /api/analytics
             → Server: Strip PII, anonymize IP (hash last octet)
             → Store in lightweight DB (SQLite via Turso / PlanetScale)
```

**Web Vitals Collection:**

```typescript
// lib/analytics/web-vitals-collector.ts
import { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } from "web-vitals";

// Sampling: Only collect if Math.random() < SAMPLE_RATE (0.1 in prod)
const SAMPLE_RATE = process.env.NODE_ENV === "production" ? 0.1 : 1.0;

export function initWebVitalsCollection(endpoint: string): void {
  if (Math.random() > SAMPLE_RATE) return;
  [onCLS, onFCP, onFID, onINP, onLCP, onTTFB].forEach((fn) => fn(sendToAnalytics));
}
```

**Analytics Event Schema (No PII):**

```typescript
interface AnalyticsEvent {
  type: "page_view" | "web_vital" | "feature_use" | "search";
  sessionId: string; // Hashed fingerprint, NOT a real identifier
  timestamp: number;
  path: string;
  // NO: ip, email, name, userId
  metadata: Record<string, string | number>;
}
```

---

### 7. Micro-Interactions & Animation System

**Animation Registry Pattern:**

```typescript
// lib/animations/presets.ts
// Centralized animation presets untuk konsistensi
export const AnimationPresets = {
  fadeInUp: { from: { y: 50, opacity: 0 }, to: { y: 0, opacity: 1, duration: 0.8 } },
  scaleIn: { from: { scale: 0.95, opacity: 0 }, to: { scale: 1, opacity: 1, duration: 0.3 } },
  slideInTop: { from: { y: -20, opacity: 0 }, to: { y: 0, opacity: 1, duration: 0.4 } },
} as const;

// Reduced Motion Override
export function withReducedMotion<T>(preset: T): T {
  if (prefersReducedMotion()) return { duration: 0, delay: 0 } as T;
  return preset;
}
```

**Toast System:**

```typescript
// Managed via Zustand store
interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  duration: number; // Default 3000ms
}
```

---

### 8. Contact Form Advanced Validation

**Validation Layer:**

```typescript
// lib/validation/contact.schema.ts
import { z } from "zod";

// RFC 5322 email regex — covers quoted strings, subdomains, international TLDs
const RFC5322_EMAIL =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().regex(RFC5322_EMAIL, "Invalid email format"),
  subject: z.string().min(5).max(200).optional(),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
  honeypot: z.string().max(0), // Must be empty (bot trap)
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
```

**Rate Limiting (Sliding Window):**

```typescript
// lib/rate-limit/sliding-window.ts
interface RateLimitConfig {
  windowMs: number; // 3600000 (1 hour)
  maxRequests: number; // 3
}

// IP-based identifier, hashed for privacy
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}>;
```

---

### 9. Blog System (MDX)

**Architecture:**

```
/content/blog/*.mdx files
    │
    ▼
next-mdx-remote (compile at build time)
    │
    ├─ Frontmatter → getStaticProps metadata
    ├─ Code blocks → rehype-pretty-code (Shiki highlighting)
    └─ React components → Dynamic component mapping
    │
    ▼
SSG pages dengan ISR (revalidate: 86400)
```

**MDX Frontmatter Schema:**

```typescript
export interface ArticleFrontmatter {
  title: string;
  description: string;
  date: string; // ISO 8601
  updatedAt?: string;
  tags: string[];
  author: string;
  coverImage?: string;
  draft?: boolean; // Excluded dari build jika true
}
```

**Reading Time Algorithm:**

```typescript
// lib/utils/reading-time.ts
const WORDS_PER_MINUTE = 200; // Average reading speed

export function calculateReadingTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / WORDS_PER_MINUTE);
}
```

---

### 10. SEO & Social Sharing

**Metadata Generation:**

```typescript
// lib/seo/metadata.ts
// Menggunakan Next.js Metadata API (App Router)
export function generatePortfolioMetadata(page?: string): Metadata {
  return {
    title: { template: '%s | Rohan — Fullstack Developer', default: 'Rohan | Fullstack Developer' },
    description: DEFAULT_DESCRIPTION,
    openGraph: { type: 'website', siteName: 'Rohan Portfolio', ... },
    twitter: { card: 'summary_large_image', creator: '@rohandev19' },
    robots: { index: true, follow: true },
  };
}
```

**Structured Data (JSON-LD):**

```typescript
// lib/seo/schema.ts
export function buildPersonSchema(): object {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Rohan",
    jobTitle: "Fullstack Developer",
    url: SITE_URL,
    sameAs: [GITHUB_URL, LINKEDIN_URL],
    knowsAbout: ["React", "TypeScript", "Laravel", "Flutter"],
  };
}

export function buildArticleSchema(article: ArticleFrontmatter, url: string): object {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    datePublished: article.date,
    author: { "@type": "Person", name: article.author },
    ...
  };
}
```

---

## Data Models

### Core Domain Types

```typescript
// types/portfolio.types.ts

// Projects
export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  techStack: string[];
  impact: string[];
  images: string[]; // Array untuk gallery support
  links: {
    live?: string;
    github?: string;
    case_study?: string;
  };
  featured: boolean;
  publishedAt: string; // ISO 8601
  client?: string;
}

export type ProjectCategory = "web" | "mobile" | "fullstack" | "api" | "devops";

// GitHub Data
export interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  url: string;
  updatedAt: string;
  topics: string[];
}

export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // GitHub contribution intensity
}

// Cache Entry
export interface CacheEntry<T> {
  data: T;
  cachedAt: number; // Unix timestamp
  ttl: number; // milliseconds
  staleAt: number; // cachedAt + ttl
}

// Rate Limit State
export interface RateLimitState {
  requests: number[]; // Timestamps of recent requests (sliding window)
  windowStart: number;
}
```

### State Store Schemas

```typescript
// store/ui.store.ts
interface UIStore {
  // Toast
  toasts: Toast[];
  addToast: (options: Omit<Toast, "id">) => void;
  dismissToast: (id: string) => void;

  // Command Palette
  commandPaletteOpen: boolean;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;

  // Global Loading
  isPageLoading: boolean;
  setPageLoading: (v: boolean) => void;
}

// store/theme.store.ts
interface ThemeStore {
  theme: "dark" | "light" | "system";
  resolvedTheme: "dark" | "light";
  setTheme: (t: ThemeStore["theme"]) => void;
}

// store/analytics.store.ts
interface AnalyticsStore {
  queue: AnalyticsEvent[];
  enqueue: (event: Omit<AnalyticsEvent, "timestamp" | "sessionId">) => void;
  flush: () => Promise<void>;
  sessionId: string; // Hashed fingerprint (computed once per session)
}
```

### API Response Schemas

```typescript
// Contact API
// POST /api/contact
interface ContactRequestBody {
  name: string;
  email: string;
  subject?: string;
  message: string;
  honeypot: string; // Must be empty
}

interface ContactResponse {
  success: boolean;
  message: string;
}

// GitHub Stats API
// GET /api/github-stats
interface GitHubStatsResponse {
  repos: Repository[];
  contributions: ContributionDay[];
  stats: {
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
  };
  languageDistribution: Record<string, number>; // lang -> percentage
  cachedAt: string | null;
}

// Analytics API
// POST /api/analytics
interface AnalyticsBatchPayload {
  events: AnalyticsEvent[];
  sessionId: string;
}
```

---

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Fuzzy Search Completeness — Typo Tolerance

_For any_ command string that differs from an existing command's label or keywords by **at most 2 character edits** (Levenshtein distance ≤ 2), the fuzzy search algorithm SHALL include that command in its results.

**Validates: Requirements 1.3, 1.8**

---

### Property 2: Command Selection Closes Palette

_For any_ valid command in the command registry, selecting that command SHALL cause the Command Palette to transition to a closed state and SHALL invoke the command's associated action function exactly once.

**Validates: Requirements 1.4**

---

### Property 3: Theme Persistence Round-Trip

_For any_ valid theme value (`'dark'`, `'light'`, `'system'`), setting the theme and then reading back from localStorage SHALL return the same theme value. Loading the application with that localStorage entry SHALL apply that theme before first paint (no flash of wrong theme).

**Validates: Requirements 2.3, 2.4**

---

### Property 4: Theme WCAG Contrast Invariant

_For any_ text/background color pair defined in the theme design tokens (both dark and light variants), the computed WCAG contrast ratio SHALL be at least 4.5:1. This property must hold for all color combinations in both theme modes.

**Validates: Requirements 2.7, 9.9**

---

### Property 5: Code Execution Timeout Enforcement

_For any_ code snippet that contains an infinite loop or exceeds 5000ms of execution time, the Code Executor SHALL terminate that execution and return a `TimeoutError` within `5000ms + 500ms tolerance`, leaving the surrounding page state completely unchanged.

**Validates: Requirements 3.7**

---

### Property 6: Code State URL Round-Trip

_For any_ valid code state object (code string + language + multi-file tabs), encoding it to a URL parameter and then decoding that URL parameter SHALL produce a code state that is deeply equal to the original. The encoding/decoding pipeline must be a lossless transformation.

**Validates: Requirements 3.11, 3.12**

---

### Property 7: Cache TTL Invariant

_For any_ GitHub API response cached at time `T`, any subsequent fetch request arriving before `T + 5 minutes` SHALL return the cached data without making a new outbound API call. Any request arriving at or after `T + 5 minutes` SHALL trigger a fresh API call and update the cache.

**Validates: Requirements 4.6**

---

### Property 8: Rate Limiter Window Correctness

_For any_ sequence of N requests arriving within a single 1-minute sliding window where N > 10, exactly the first 10 requests SHALL be allowed and all subsequent requests within that window SHALL be rejected with HTTP 429. For N ≤ 10, all requests SHALL be allowed.

**Validates: Requirements 4.10, 11.11**

---

### Property 9: Debounce Flush Guarantee

_For any_ sequence of input events arriving within a debounce window (300ms for search, 500ms for validation), the debounced function SHALL be invoked exactly once, triggered by the last event in the sequence, after the debounce delay has elapsed without new events.

**Validates: Requirements 5.6, 11.2**

---

### Property 10: Filter State URL Round-Trip

_For any_ valid combination of showcase filters (category set + tech tag set + search query + sort key), serializing the filter state to URL query parameters and then deserializing those URL parameters SHALL produce a filter state that is deeply equal to the original, including empty/default values.

**Validates: Requirements 5.16, 5.17**

---

### Property 11: Analytics Privacy Invariant

_For any_ analytics event generated by any user action on any page, the data payload sent to the analytics endpoint SHALL NOT contain any of the following fields: IP address (raw), email address, full name, phone number, or any personally identifiable information. The session identifier SHALL be a one-way hash that cannot be reversed to identify the user.

**Validates: Requirements 7.1, 7.9**

---

### Property 12: Session Fingerprint Determinism

_For any_ (User-Agent string, screen resolution, timezone) tuple, computing the session fingerprint SHALL always produce the same hash output. Two different tuples SHALL produce different hash outputs with overwhelming probability (collision probability < 2^-64).

**Validates: Requirements 7.8**

---

### Property 13: Reduced Motion Compliance

_For any_ GSAP animation registered via the animation system, when the `prefers-reduced-motion: reduce` media query is active, the animation's effective duration SHALL be 0ms (instant) and no motion-based transforms (translate, rotate, scale) SHALL be applied to the element.

**Validates: Requirements 8.12, 8.13, 8.14**

---

### Property 14: Email Validation Correctness

_For any_ string that conforms to the RFC 5322 email address specification, the email validator SHALL return `valid: true`. _For any_ string that violates RFC 5322 (missing @, invalid TLD, consecutive dots), the validator SHALL return `valid: false`. The validator SHALL handle edge cases including quoted local parts, IPv6 domain literals, and internationalized domain names.

**Validates: Requirements 11.4**

---

### Property 15: Message Length Boundary Invariant

_For any_ string with character count in the inclusive range [10, 1000], the message validator SHALL return `valid: true`. _For any_ string with character count < 10 or > 1000, the validator SHALL return `valid: false`. This invariant SHALL hold for strings containing Unicode characters (emoji, CJK characters count as one character each per the ECMAScript `string.length` specification).

**Validates: Requirements 11.6**

---

### Property 16: XSS Sanitization Safety

_For any_ input string containing HTML injection vectors (`<script>`, `onerror=`, `javascript:`, `data:text/html`, CSS expression), the sanitized output SHALL NOT contain any executable JavaScript content. _For any_ plain-text input containing no HTML, the sanitized output SHALL be identical to the input (content preservation guarantee).

**Validates: Requirements 11.12**

---

## Error Handling

### Error Handling Strategy

Setiap layer memiliki error handling yang terdefinisi dengan baik, mengikuti **fail-safe defaults** — ketika sebuah fitur gagal, rest of the application tetap berfungsi.

### Layer 1: Component-Level Error Boundaries

Setiap major feature section dibungkus Error Boundary tersendiri. Ini mencegah satu fitur yang crash merusak seluruh halaman:

```typescript
// Pattern: Feature-scoped Error Boundary
// components/features/github-dashboard/GitHubDashboardErrorBoundary.tsx

const GitHubDashboardFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div role="alert" className="...">
    <p>Unable to load GitHub activity. <code>{error.message}</code></p>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

// Wrapped di parent:
<ErrorBoundary FallbackComponent={GitHubDashboardFallback}>
  <GitHubDashboard />
</ErrorBoundary>
```

**Error Boundaries per Feature:**

| Feature             | Boundary                  | Fallback Behavior                              |
| ------------------- | ------------------------- | ---------------------------------------------- |
| GitHub Dashboard    | `GitHubDashboardBoundary` | Show cached data or "unavailable" card         |
| Code Playground     | `CodePlaygroundBoundary`  | Show static code snippet instead               |
| Analytics Dashboard | `AnalyticsBoundary`       | Silently disabled (no user impact)             |
| Blog Section        | `BlogBoundary`            | Show article list without interactive features |
| Contact Form        | `ContactBoundary`         | Fallback to mailto: link                       |

### Layer 2: API Route Error Responses

Semua API routes mengikuti consistent error response format:

```typescript
// lib/utils/api-response.ts
interface ErrorResponse {
  error: string; // Human-readable message
  code: string; // Machine-readable code (e.g., "RATE_LIMIT_EXCEEDED")
  retryAfter?: number; // Seconds until retry is allowed (untuk 429)
}

// HTTP Status mapping
// 400 → Validation error (invalid input)
// 429 → Rate limit exceeded
// 500 → Internal server error
// 503 → External API unavailable (GitHub API down)
```

### Layer 3: Global Error Capture

```typescript
// app/layout.tsx — Registered once at app root
// Captures unhandled errors sebelum reach error boundary

if (typeof window !== "undefined") {
  // Unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    errorMonitor.capture(event.reason, { type: "unhandled_rejection" });
  });

  // Global synchronous errors
  window.onerror = (msg, src, line, col, error) => {
    errorMonitor.capture(error ?? new Error(String(msg)), { src, line, col });
    return false; // Don't suppress default behavior
  };
}
```

### Layer 4: Graceful Degradation per Feature

**GitHub Dashboard**: Jika API error, tampilkan last cached data dengan timestamp. Jika tidak ada cache, tampilkan static placeholder.

**Code Playground**: Jika Sucrase/Babel WASM gagal load, tampilkan static syntax highlighting only (no execution).

**Analytics**: Analytics events silently dropped jika endpoint tidak tersedia. Tidak ada retry yang memblok user experience.

**Contact Form**: Jika email service gagal, log error ke monitoring dan tampilkan pesan dengan fallback mailto: link.

### Layer 5: Error Monitoring

```typescript
// lib/monitoring/error-monitor.ts
interface ErrorContext {
  url: string;
  userAgent: string;
  timestamp: string;
  breadcrumbs: Breadcrumb[]; // User actions before error
}

class ErrorMonitor {
  capture(error: Error, context?: Partial<ErrorContext>): void {
    // In production: send to Sentry (sampled at 10%)
    // In development: console.error dengan full context
    // Deduplicate: skip if same error.message within last 5 minutes
  }
}
```

---

## Testing Strategy

### Overview

Testing strategy menggunakan **dual testing approach**: unit/property tests untuk logic, integration tests untuk API boundaries, dan E2E tests untuk critical user flows.

```
Testing Pyramid
━━━━━━━━━━━━━━━━━━━━━━━
           ▲
          /E2E\        ← Playwright (critical flows only)
         /─────\
        / Integ \      ← Vitest + MSW (API routes, data transforms)
       /─────────\
      / Unit/PBT  \    ← Vitest + fast-check (logic, utils, algorithms)
     /─────────────\
━━━━━━━━━━━━━━━━━━━━━━━
```

### Unit & Property-Based Tests (Vitest + fast-check)

**Library pilihan: fast-check** — ESM-native, TypeScript-first, Arbitrary generators yang kaya.

Minimum **100 runs per property test** (default fast-check behavior).

```typescript
// Contoh implementasi Property 1: Fuzzy Search Typo Tolerance
// tests/unit/fuzzy-search.property.test.ts
import { describe, test } from "vitest";
import * as fc from "fast-check";
import { fuzzySearch } from "@/lib/search/fuzzy-search";
import { COMMAND_REGISTRY } from "@/lib/commands/registry";

describe("Fuzzy Search", () => {
  /**
   * @tag Feature: senior-portfolio-features, Property 1: Fuzzy search typo tolerance
   */
  test("Property 1: strings within Levenshtein distance 2 should be found", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...COMMAND_REGISTRY), // Arbitrary: pick a real command
        fc.integer({ min: 1, max: 2 }), // Arbitrary: edit distance (1 or 2)
        (command, editDistance) => {
          const mutated = introduceTypos(command.label, editDistance);
          const results = fuzzySearch(COMMAND_REGISTRY, ["label", "keywords"], mutated);
          return results.some((r) => r.item.id === command.id);
        }
      ),
      { numRuns: 200 }
    );
  });
});
```

```typescript
// Contoh implementasi Property 8: Rate Limiter Correctness
// tests/unit/rate-limiter.property.test.ts
/**
 * @tag Feature: senior-portfolio-features, Property 8: Rate limiter window correctness
 */
test("Property 8: requests exceeding limit are rejected", () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 11, max: 50 }), // N > 10 requests
      fc.integer({ min: 1, max: 60000 }).map((ms) => Date.now() - ms), // Window start
      (requestCount, windowStart) => {
        const limiter = createRateLimiter({ windowMs: 60000, maxRequests: 10 });
        const results = Array.from({ length: requestCount }, () => limiter.check("test-id"));
        const allowed = results.filter((r) => r.allowed).length;
        return allowed === 10;
      }
    )
  );
});
```

### Key Property Tests Coverage

| Property                             | Test File                            | Library    | Runs |
| ------------------------------------ | ------------------------------------ | ---------- | ---- |
| P1: Fuzzy Search Typo Tolerance      | `fuzzy-search.property.test.ts`      | fast-check | 200  |
| P2: Command Selection Closes Palette | `command-palette.property.test.ts`   | fast-check | 100  |
| P3: Theme Persistence Round-Trip     | `theme.property.test.ts`             | fast-check | 100  |
| P4: WCAG Contrast Invariant          | `theme-contrast.property.test.ts`    | fast-check | 100  |
| P5: Code Execution Timeout           | `code-executor.property.test.ts`     | fast-check | 50   |
| P6: Code State URL Round-Trip        | `code-playground.property.test.ts`   | fast-check | 300  |
| P7: Cache TTL Invariant              | `cache-manager.property.test.ts`     | fast-check | 200  |
| P8: Rate Limiter Correctness         | `rate-limiter.property.test.ts`      | fast-check | 300  |
| P9: Debounce Flush Guarantee         | `debounce.property.test.ts`          | fast-check | 200  |
| P10: Filter State URL Round-Trip     | `showcase-filter.property.test.ts`   | fast-check | 200  |
| P11: Analytics Privacy Invariant     | `analytics-privacy.property.test.ts` | fast-check | 200  |
| P12: Fingerprint Determinism         | `fingerprint.property.test.ts`       | fast-check | 500  |
| P13: Reduced Motion Compliance       | `animation-system.property.test.ts`  | fast-check | 100  |
| P14: Email Validation                | `validation.property.test.ts`        | fast-check | 500  |
| P15: Message Length Boundary         | `validation.property.test.ts`        | fast-check | 500  |
| P16: XSS Sanitization                | `sanitize.property.test.ts`          | fast-check | 500  |

### Integration Tests (Vitest + MSW)

```typescript
// tests/integration/github-api.test.ts
// Menggunakan MSW untuk mock GitHub API responses
// Test: rate limiting, cache behavior, error fallbacks

// tests/integration/contact-form.test.ts
// Test: honeypot detection, rate limiting, email service integration
```

### E2E Tests (Playwright)

Critical user flows yang dicover:

1. **Command Palette Navigation**: Keyboard shortcut → open → type → select → navigate
2. **Contact Form Submission**: Fill form → validate → submit → success toast
3. **Project Showcase Filter**: Apply filter → URL updates → refresh → filter restored
4. **Code Playground Execute**: Type code → run → see output → share URL → load shared

### Smoke Tests (CI/CD)

```yaml
# .github/workflows/ci.yml
# Run after build:
# - Check gzipped bundle < 200KB (Req 15.1)
# - Run Lighthouse CI (score ≥ 90) (Req 15.4)
# - Validate all JSON-LD schemas (Req 14.8)
# - Check no PII in analytics events (integration smoke)
```

### Test Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
      },
    },
  },
});
```

---

## Security Architecture

### Content Security Policy (CSP)

CSP yang ada di `next.config.ts` perlu diperluas untuk mendukung fitur baru:

```typescript
// next.config.ts — Updated CSP untuk semua features
const CSP = [
  "default-src 'self'",
  // Sucrase/Babel WASM untuk Code Playground
  "script-src 'self' 'wasm-unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  // GitHub API, Analytics endpoint, Email service
  `connect-src 'self' https://api.github.com https://api.resend.com ${ANALYTICS_ENDPOINT}`,
  // Images dari GitHub avatars dan project screenshots
  "img-src 'self' blob: data: https://avatars.githubusercontent.com https://raw.githubusercontent.com",
  // Code Playground sandbox frame
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");
```

### Input Sanitization Pipeline

```
User Input
    │
    ├─ 1. Zod Schema Validation (type + length + format)
    ├─ 2. DOMPurify.sanitize() (strip HTML/script tags)
    ├─ 3. Honeypot check (form submissions only)
    └─ 4. Rate limit check (per IP, sliding window)
    │
    ▼
Safe, validated data
```

### API Security Headers

Setiap API route mengembalikan security headers yang tepat:

```typescript
// lib/utils/secure-response.ts
export function secureApiResponse<T>(data: T, status = 200): Response {
  return Response.json(data, {
    status,
    headers: {
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store", // Tidak cache API responses di CDN
      "X-Frame-Options": "DENY",
    },
  });
}
```

### GitHub Token Management

GitHub Personal Access Token (read-only, minimal scopes) disimpan di environment variables, tidak pernah di-expose ke client:

- Token hanya diakses di API route (`/api/github-stats`) — server-side only
- Scope minimal: `public_repo:read` only
- Rotasi token via GitHub Actions secret rotation schedule

---

## Performance Optimization Design

### Code Splitting Strategy

```typescript
// Setiap fitur heavy di-lazy-load
const CodePlayground = dynamic(
  () => import('@/components/features/code-playground'),
  {
    loading: () => <CodePlaygroundSkeleton />,
    ssr: false,  // Client-only — no server-side execution context
  }
);

const GitHubDashboard = dynamic(
  () => import('@/components/features/github-dashboard'),
  { loading: () => <GitHubDashboardSkeleton /> }
);

const AnalyticsDashboard = dynamic(
  () => import('@/components/features/analytics-dashboard'),
  { ssr: false }
);
```

### Image Optimization

```typescript
// Semua images menggunakan Next.js Image component
// Dengan priority=true untuk above-fold images
<Image
  src={project.image}
  alt={project.title}
  width={800}
  height={450}
  quality={80}
  placeholder="blur"
  blurDataURL={project.blurPlaceholder}  // Base64 thumbnail
  priority={isAboveFold}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Resource Hints

```typescript
// app/layout.tsx — Preconnect untuk third-party domains
<link rel="preconnect" href="https://api.github.com" />
<link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
```

### Service Worker Strategy

```
Service Worker (next-pwa atau Workbox)
├─ Cache First: Static assets (JS, CSS, fonts, images)
├─ Network First: API calls (/api/*)
├─ Stale While Revalidate: GitHub stats (5min TTL)
└─ Network Only: Contact form submission, Analytics
```

---

## Implementation Priorities

### Phase 1 — Foundation (High Impact, No New Dependencies)

1. **Theme System** (Req 2) — Zustand store + CSS variables
2. **Enhanced Contact Form** (Req 11) — Zod validation, real feedback
3. **Advanced Accessibility** (Req 9) — Focus management, ARIA labels
4. **Performance Budget Setup** (Req 15) — Bundle analyzer, CI checks

### Phase 2 — Core Features (Medium Complexity)

5. **Command Palette** (Req 1) — Compound component + fuzzy search
6. **Project Showcase Filter/Search** (Req 5) — FlexSearch index
7. **Image Optimization** (Req 12) — Next/Image migration
8. **SEO Enhancement** (Req 14) — JSON-LD schemas, OG images

### Phase 3 — Advanced Features (High Complexity)

9. **GitHub Dashboard** (Req 4) — API route + cache + visualizations
10. **Micro-Interactions System** (Req 8) — Animation registry
11. **Blog System** (Req 10) — MDX pipeline
12. **Analytics Dashboard** (Req 7) — Privacy-first tracking

### Phase 4 — Showcase Features

13. **Code Playground** (Req 3) — Sandboxed execution
14. **Performance Monitor** (Req 6) — Web Vitals dashboard
15. **Error Monitoring** (Req 13) — Sentry integration

---

_Design document ini dibuat berdasarkan requirements.md versi final untuk fitur senior-portfolio-features. Setiap keputusan arsitektur dapat direvisi berdasarkan feedback dan constraint implementasi yang ditemukan._
