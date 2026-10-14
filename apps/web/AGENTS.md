# Web UI conventions

Follow the [Untitled UI Next.js integration](https://www.untitledui.com/react/integrations/nextjs) and [official agent instructions](https://www.untitledui.com/react/AGENT.md) for new UI work. This project uses pnpm, Oxfmt, and Oxlint; keep those tools when following upstream examples.

- Use the existing source components in `src/components/base/` before building new controls. New reusable component filenames use kebab-case; React component names use PascalCase.
- Use `@/` imports, `cx`/`sortCx` from `@/utils/cx`, and semantic tokens from `src/styles/theme.css`.
- Alias React Aria imports with `Aria` prefixes. Use `@untitledui/icons` for icons; verify export names with MCP or the installed package when MCP is unavailable.
- Keep the Next.js router and theme providers in the root layout. The current application supports dark mode; the theme provider fixes `dark-mode` until all screens support light mode.
- `components.json` configures the official CLI for this app. Run component installation from `apps/web` and inspect its changes; preserve the existing application and tooling.
- Run `pnpm format`, `pnpm lint`, `pnpm --filter @repo/web test:run`, and `pnpm --filter @repo/web build` for UI changes.

See `UNTITLED_UI.md` for upstream attribution and integration details.
