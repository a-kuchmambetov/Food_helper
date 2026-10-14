# Repository Guidelines

## Project Structure & Module Organization

Use [Repo 1](https://github.com/fastify/demo/tree/main) and [Repo 2](https://github.com/revell29/fastify-clean-architecture) as an example of good structure for Fastify API.

This is a pnpm monorepo. `apps/api/src` contains the TypeScript Fastify API, feature services, Better Auth integration, and Drizzle schema. `apps/web/src/app` contains Next.js routes; reusable UI and existing screens live in `apps/web/src/component` and `apps/web/src/screens`. Shared contracts belong in `packages/shared/src`.

## Build, Test, and Development Commands

- `pnpm install`: install workspace dependencies.
- `pnpm dev`: run the Fastify API and Next.js frontend.
- `pnpm build`: build all workspaces.
- `pnpm typecheck`: check all workspace types.
- `pnpm lint`: run Oxlint across the API, web app, and shared package.
- `pnpm lint:fix`: apply safe Oxlint fixes.
- `pnpm format`: format the active workspace with Oxfmt.
- `pnpm format:check`: check formatting without changing files.
- `pnpm test`: run API integration tests and web Vitest tests.
- `pnpm db:generate`: generate a SQL migration from the schema.
- `pnpm db:migrate`: apply migrations using the transaction-safe legacy-aware runner.

## Coding Style & Naming Conventions

Use TypeScript for new workspace code and ES modules throughout. Follow the root Oxfmt configuration in `.oxfmtrc.json`: four-space indentation, a 160-character print width, sorted imports, and normalized Tailwind classes. Run Oxlint (`pnpm lint`) for code changes; its rules are configured in `.oxlintrc.json`. Use `PascalCase` for React components and pages, `camelCase` for functions and variables, and descriptive lowercase feature directories. Keep API layers separated with names such as `inventory.routes.ts`, `inventory.controller.ts`, and `inventory.service.ts`.

## Testing Guidelines

Vitest covers the frontend session context. Node tests with PGlite cover the API, authentication, and database migration. Add tests alongside the unit under test using `*.test.ts`, `*.test.tsx`, or `*.test.js`. Cover successful behavior, validation failures, and authorization boundaries. Run the relevant test command before opening a pull request.

## Commit & Pull Request Guidelines

History favors short, sentence-style summaries such as `Added server part for planner`. Use a concise imperative subject, keep each commit focused, and explain migration-sensitive changes in the body. Pull requests should describe the problem and solution, identify affected apps, link related issues, list verification commands, and include screenshots for visible UI changes. Never commit `.env` files, credentials, tokens, or production connection strings; document required variables in `.env.example`.
