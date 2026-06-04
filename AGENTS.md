# Repository Guidelines

## Project Structure & Module Organization

This is a Vite React app for the SugarMix calculator. Application code lives in `src/`: `main.jsx` mounts React, `App.jsx` owns top-level state, `components/` contains UI controls, `components/results/` contains result display components, and `utils/calc.js` contains the calculator logic. Global styling and Tailwind layer imports are in `src/index.css`; app-specific CSS also exists in `src/App.css`. Static files belong in `public/`, while `src/assets/` is for bundled React/Vite assets. The `suygar/` directory appears to be an older standalone prototype/reference; keep production changes in `src/` unless intentionally porting behavior.

## Build, Test, and Development Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production build locally for smoke testing.
- `npm run lint` runs ESLint across JavaScript and JSX files.

Run commands from the repository root.

## Coding Style & Naming Conventions

Use ES modules and functional React components. Name component files and exported components in PascalCase, such as `InputPanel.jsx`; use camelCase for state, props, helper functions, and local variables. Keep calculation helpers as named exports in `src/utils/`. Match the existing style: single quotes, concise JSX, semicolons in most component files, and two-space indentation in config objects. Prefer Tailwind utility classes and the CSS custom properties defined in `src/index.css` for colors, spacing, and responsive layout.

## Testing Guidelines

There is currently no test runner or `npm test` script. For now, verify changes with `npm run lint`, `npm run build`, and a manual smoke test through `npm run dev` or `npm run preview`. Calculator changes should include hand-checked examples for volume, carbs, rate, and bottles modes. If tests are added, prefer colocated `*.test.jsx` or `*.test.js` files under `src/` and add the command to `package.json`.

## Commit & Pull Request Guidelines

This checkout does not expose usable Git history because `.git/` is empty, so no project-specific commit convention can be inferred. Use short imperative subjects, for example `Add bottle recipe summary`, and keep each commit focused. Pull requests should describe the user-facing change, list verification commands run, call out calculator formula changes, and include screenshots or screen recordings for UI updates.

## Agent-Specific Instructions

Do not edit generated output in `dist/` or dependencies in `node_modules/`. Preserve the existing single-page app shape unless the task explicitly asks for routing, persistence, or backend work.
