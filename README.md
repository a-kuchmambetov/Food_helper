# Food Helper

Plan meals, browse recipes, and manage your ingredient inventory.

## Workspace

- `apps/web`: Next.js App Router frontend with Untitled UI providers, theme tokens, and base components. See [the web integration notes](apps/web/UNTITLED_UI.md) for setup and source attribution.
- `apps/api`: TypeScript Fastify API, Better Auth sessions, and PostgreSQL/Drizzle schema.
- `packages/shared`: shared catalog, inventory, and planner contracts.
- `.db`: legacy schema fixture and optional recipe seed data.
- `client/` and `server/`: retained legacy source snapshots, excluded from the pnpm workspace.

Requires Node.js 22.13+ and pnpm 11.24.0. The root manifest pins pnpm.

## Local setup

```sh
pnpm install
cp .env.example .env
# Replace BETTER_AUTH_SECRET in .env with: openssl rand -base64 32
# Optional: start local PostgreSQL and the email inbox.
docker compose up -d
pnpm db:migrate
# Optional: load the existing sample recipes into a fresh local database.
docker compose exec -T postgres psql -U app -d app < .db/SQL_Inserts.sql
pnpm dev
```

Open http://localhost:3000. Email verification is required; local verification messages appear at http://localhost:8025. Existing PostgreSQL and SMTP services can be used instead by editing `.env`. Infisical is not required; injected environment variables and `PG_PASSWORD_FILE` are supported.

Both apps load the root `.env` independently of the shell's working directory. The API listens on `API_PORT` (5000 by default). Next.js proxies `/api/*` to `API_INTERNAL_URL`, so browser requests and session cookies use the web origin. Keep `WEB_ORIGIN` and `BETTER_AUTH_BASE_URL` aligned with the public web URL; `NEXT_PUBLIC_API_URL=/api` is the default. Public Next.js variables are embedded at build time.

## Commands

```sh
pnpm dev          # Run API and web concurrently
pnpm build        # Build all workspaces
pnpm typecheck    # Check all workspace types
pnpm lint         # Run Oxlint across all active workspaces
pnpm lint:fix     # Apply safe lint fixes
pnpm format       # Format with Oxfmt
pnpm format:check # Check formatting without writing
pnpm test         # API database/integration tests and frontend session tests
pnpm db:generate  # Generate a reviewed SQL migration from the Drizzle schema
pnpm db:migrate   # Apply pending migrations transactionally
```

Oxfmt preserves four-space indentation, a 160-character line width, sorted imports, and Tailwind class sorting. Oxlint includes TypeScript, React Hooks, and Next.js checks. React Compiler diagnostics for effects and manual memoization stay disabled to match the prior Hooks rules; React Compiler is not enabled in this app. Both tools skip generated files and the retained legacy directories.

After building, run `pnpm --filter @repo/api start` and `pnpm --filter @repo/web start` as separate processes. Terminate TLS at your reverse proxy and route browser requests through Next.js. `/health` and `/api/health` report API process health; they do not assert database connectivity.

Tests use isolated in-memory PostgreSQL instances via PGlite and do not require or modify a running database. API tests exercise fresh and legacy schemas, email verification, cookie sessions, CRUD, invalid input, and access across different users.

## Upgrade an existing database

Stop the legacy Express API and take a database backup before running `pnpm db:migrate` with the existing database connection. Do not apply `.db/SQL_Tables.sql` to a new database; the Drizzle migrations replace that setup script.

The migration detects `public.users.user_id`, moves the legacy tables into the `legacy_food_helper` schema, creates the new schema, and copies all application data in one transaction. It preserves user IDs, roles, verification status, disabled/locked account state, recipe data, inventory, meal plans, and sequence positions. Existing bcrypt hashes become Better Auth credential accounts; new and changed passwords use scrypt. Legacy tokens and session tables remain archived, but users must sign in again. Old email-verification links must be resent from the new application.

Duplicate case-insensitive email addresses or multiple dishes in one user's meal slot stop the migration without changing the database. Resolve those records before retrying. Applied SQL migrations are checksummed in `food_helper_migrations`; repeated runs are safe. Generate future migrations with `pnpm db:generate` and apply them using `pnpm db:migrate`, which also handles the legacy upgrade. Do not use `drizzle-kit push` or a second migration runner against this database.

The archive is retained for inspection and recovery and is not used by the new application. Rollback after a successful cutover requires restoring the backup; writes made after cutover need separate reconciliation.

## API changes

Feature routes now have the `/api` prefix: `/api/dishes`, `/api/dish/:id`, `/api/inventory/*`, and `/api/planner/*`. The frontend uses Better Auth's `/api/auth/sign-up/email`, `/sign-in/email`, `/get-session`, `/verify-email`, `/send-verification-email`, `/update-user`, `/change-password`, and `/sign-out` endpoints. Session listing and revocation use Better Auth's `/list-sessions`, `/revoke-session`, and `/revoke-sessions` endpoints. The old JWT refresh and administrative cleanup routes are retired.

New accounts keep the scaffold's `unapproved` role. Verified accounts can use food features; admin operations remain restricted to admins. The browser never stores access tokens in local storage.
