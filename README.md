# SugarMix Web

A Vite React single-page calculator for planning sucrose-based endurance drink mixes.

## Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts the local Vite development server.
- `npm run build` creates the production bundle in `dist/`.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint on production app code.
- `npm run format:check` checks Prettier formatting.
- `npm run format` formats the repository with Prettier.
- `npm test` runs calculator unit tests with Node's built-in test runner.

## Notes

Application code lives in `src/`. The `suygar/` directory is an older standalone prototype/reference and is intentionally ignored by production linting and formatting.

## GitHub Pages Deployment

The repository includes `.github/workflows/deploy.yml`. On pushes to `main`, GitHub Actions installs dependencies, checks formatting, lints, runs tests, builds the Vite app, uploads `dist/`, and deploys it to GitHub Pages.

In GitHub, set **Settings > Pages > Build and deployment > Source** to **GitHub Actions**.

The Vite asset base is set automatically for project Pages URLs like `https://OWNER.github.io/sugarmix-web/`. If the site is deployed at a custom root path, set `VITE_BASE_PATH` in the workflow build step.
