# Rohan - Full-Stack Developer Portfolio

## Overview

A high-performance, interactive personal portfolio website designed to showcase engineering capabilities, projects, and professional experience. Built with a focus on modern web architecture, interactive 3D elements, and strict security standards.

## Architecture & Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP (GreenSock) via @gsap/react
- **3D Rendering:** React Three Fiber (Three.js)
- **Language:** TypeScript
- **Code Quality:** ESLint, Prettier, Husky (Pre-commit hooks)

## Key Technical Features

- **Server/Client Component Separation:** Optimized rendering strategy to minimize client-side JavaScript payloads.
- **Memory Management:** Implemented strict GSAP context cleanup and on-demand 3D frame loops to prevent memory leaks and ensure 60fps performance across devices.
- **Security Implementations:** Integrated strict HTTP security headers including Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options, and X-Content-Type-Options.
- **SEO & Accessibility:** Embedded JSON-LD structured data (Schema.org), semantic HTML tags, and comprehensive ARIA attributes.
- **Responsive Design:** Fluid layouts engineered for consistent user experience across mobile, tablet, and desktop interfaces.

## Local Development Setup

### Prerequisites

- Node.js (v18.17 or newer)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rohandev19/myportofolio.git
   cd myportofolio
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the application at http://localhost:3000.

## Deployment

This project is configured for seamless deployment on Vercel or any standard Node.js hosting environment supporting Next.js builds.

## License

Copyright (c) 2026 Muhammad Rohan. All rights reserved.
