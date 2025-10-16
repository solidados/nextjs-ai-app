# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Framework: Next.js 15 (App Router) with React 19 and TypeScript
- Styling: Tailwind CSS v4 (no tailwind.config.js; globals define theme tokens)
- Structure: source under `src/` with App Router in `src/app`

Commands
- Install dependencies
  ```bash
  npm install
  ```
- Start dev server (Turbopack) at http://localhost:3000
  ```bash
  npm run dev
  ```
- Build (Turbopack) and run production server
  ```bash
  npm run build
  npm run start
  ```
- Lint (ESLint)
  ```bash
  npm run lint
  ```
- Type-check (strict TypeScript; no emit)
  ```bash
  npx tsc --noEmit
  ```
- Tests
  - No test runner is configured in this repo. Running a single test is not applicable until one is added.

High-level architecture
- App Router (src/app)
  - `src/app/layout.tsx`: Root layout. Applies global fonts via `next/font/google` (Geist, Geist_Mono) and loads `globals.css`. Exposes font CSS variables used by Tailwind theme.
  - `src/app/page.tsx`: Home route UI. Basic links and static assets.
  - `src/app/globals.css`: Imports Tailwind v4 (`@import "tailwindcss";`), defines CSS variables for light/dark, and an inline `@theme` block wiring Tailwind tokens to font variables.
- Static assets
  - `public/`: SVGs referenced by the home page (`/next.svg`, `/vercel.svg`, etc.).
- Configuration
  - `tsconfig.json`: Strict mode, bundler module resolution, and path alias `@/*` → `src/*` for clean imports.
  - `next.config.ts`: Minimal placeholder (extend here as needed).
  - ESLint is present via `eslint` and `eslint-config-next`; no explicit ESLint config file in the repo.

Notes from README
- Primary workflow is `npm run dev`, then edit `src/app/page.tsx`. Hot reload is enabled by default.
