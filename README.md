# AI Review Navigator

Single-page Vue 3 + Tailwind (CDN) implementation of **AI 综述领航员 (V4.7 整合版)**. The app runs entirely in the browser, pulls data from OpenAlex, and orchestrates the SPARK research workflow (seed analysis, gap finding, SPARK definition, retrieval blueprint, evidence curation, and writing assistant).

## Structure
- `index.html` — standalone SPA using Vue 3 (CDN), Plotly, Marked, and Tailwind CDN configuration. All UI, logic, and styling are contained in this file for quick loading without a build step.

## Usage
- Open `index.html` directly in a browser, or serve locally with a simple static server such as `npx serve .`.
- Enter a SiliconFlow API key in the sidebar to enable the LLM-driven steps (gap extraction, SPARK synthesis, PRISMA plan, and writing automation).

## Notes
- Data is stored in `localStorage` under `ai_navigator_projects_v4` and `ai_navigator_key` to preserve projects between sessions.
- The app relies on OpenAlex public endpoints; ensure network access when running.
