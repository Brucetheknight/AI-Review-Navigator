# AI Review Navigator

A Vite + React + TypeScript workspace that mirrors the folder layout requested for the AI Review Navigator project. The structure is optimized for stage-based review flows with dedicated routes and styling per stage.

## Getting Started

```bash
pnpm install # or npm install / yarn install
pnpm dev     # start the development server
```

## Available Scripts
- `pnpm dev` – start Vite in development mode
- `pnpm build` – type-check and bundle the project
- `pnpm preview` – preview the production build locally
- `pnpm lint` – run ESLint across the codebase

## Project Layout
- `src/components` – shared UI components such as the global `ErrorBoundary`
- `src/pages` – page-level route components organized by stage folders
- `src/apis` – API client helpers and mocks
- `src/types` – global type declarations including CSS modules

Tailwind CSS is configured for rapid prototyping and consistent styling.
