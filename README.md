# AI Review Navigator

Single-page Vue 3 + Tailwind (CDN) implementation of **AI 综述领航员 (V4.7 整合版)**. The app runs entirely in the browser, pulls data from OpenAlex, and orchestrates the SPARK research workflow (seed analysis, gap finding, SPARK definition, retrieval blueprint, evidence curation, and writing assistant).

## Structure
- `index.html` — minimal shell that wires CDN assets and mounts the Vue app.
- `src/styles.css` — shared styling extracted from the original inline blocks.
- `src/constants.js` — shared enums/config for steps, SPARK schema, storage keys, and project factory.
- `src/storage.js` — safe localStorage helpers.
- `src/api.js` — OpenAlex + SiliconFlow request wrappers and abstract reconstruction helpers.
- `src/charts.js` — Plotly rendering helpers for citation history and galaxy graph.
- `src/utils.js` — markdown rendering, date formatting, and JSON extraction utilities.
- `src/main.js` — Vue 3 composition-API app logic orchestrating the SPARK workflow.

## Usage
- Open `index.html` directly in a browser, or serve locally with a simple static server such as `npx serve .`.
- Enter a SiliconFlow API key in the sidebar to enable the LLM-driven steps (gap extraction, SPARK synthesis, PRISMA plan, and writing automation).
- The page depends on CDN assets (Vue, Plotly, Marked, Tailwind, Phosphor Icons) and browser `localStorage`, so ensure JavaScript is enabled and your network can reach the CDNs.

## Notes
- Data is stored in `localStorage` under `ai_navigator_projects_v4` and `ai_navigator_key` to preserve projects between sessions.
- The app relies on OpenAlex public endpoints; ensure network access when running.
