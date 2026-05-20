# Rohan - Personal Portfolio

A personal portfolio website built to showcase my web development projects and experience.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP
- **3D Integration:** React Three Fiber (Three.js)
- **Language:** TypeScript
- **Tooling:** ESLint, Prettier, Husky

## Technical Notes

- Implemented Server and Client Components to manage rendering.
- Set up basic HTTP security headers (CSP, HSTS) in Next.js config.
- Used GSAP `useGSAP` hook for animation cleanup.
- Managed 3D canvas frameloop to reduce GPU usage.

## Local Setup

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

## License

MIT
