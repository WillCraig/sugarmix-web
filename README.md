# SugarMix

A mobile-first SvelteKit calculator for planning plain-sugar endurance drink
mixes. It supports ride-based fueling plans and direct bottle recipes, reports
the resulting concentration, and gives practical mixing guidance around the
conservative 900 g/L target.

## Commands

- `pnpm install` installs dependencies from the pinned lockfile.
- `pnpm dev` starts the local development server.
- `pnpm check` runs Svelte and TypeScript checks.
- `pnpm lint` runs ESLint.
- `pnpm test` runs calculator tests with Vitest.
- `pnpm build` creates the static site in `build/`.
- `pnpm preview` serves the production build locally.

The repository pins pnpm 11.5.2, rejects unreviewed dependency build scripts,
and waits seven days before accepting newly published package versions.

## GitHub Pages

The workflow in `.github/workflows/deploy.yml` builds and deploys on pushes to
`main`. The SvelteKit base path is derived from `GITHUB_REPOSITORY`, so project
Pages URLs such as `https://OWNER.github.io/sugarmix-web/` work without a
hard-coded repository name.
