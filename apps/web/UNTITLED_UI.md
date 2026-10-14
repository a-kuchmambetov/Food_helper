# Untitled UI integration

This app follows the [official Next.js guide](https://www.untitledui.com/react/integrations/nextjs). The React Aria router provider, next-themes provider, Tailwind theme and plugins, and `@/` aliases support Untitled UI source components. `components.json` configures the version 8 CLI for the Next.js App Router.

The sign-in and registration forms use the official Input, Checkbox, and Button components. Recipe search uses Input, and the existing shared button delegates to Button. All icons use `@untitledui/icons`. Existing feature-specific screens retain their application logic and custom layouts.

Inter is bundled through `@fontsource-variable/inter` and `next/font/local`, so builds do not require Google Fonts access. The app currently fixes the theme to `dark-mode` to match its existing screens. Formatting and linting use Oxfmt and Oxlint.

## Source attribution

The components in `src/components/base/`, styles in `src/styles/`, utilities in `src/utils/`, and providers in `src/providers/` derive from the [official Untitled UI Next.js starter kit](https://github.com/untitleduico/untitledui-nextjs-starter-kit/tree/32d249b02eccbc88fa2f9f6978160635bca41013), revision `32d249b02eccbc88fa2f9f6978160635bca41013`. Its README licenses the starter kit and included components under MIT. PRO components are not included.

Local adaptations include Oxfmt formatting, React Aria import aliases, a fixed dark theme, existing scrollbar styles, and a null-safe React component type guard with a localized Oxlint exception for the upstream generic component predicate.

The Untitled UI MCP server returned HTTP 429 during setup; source files were obtained from the public official starter instead. Future UI work can use MCP when available or the [documented CLI](https://www.untitledui.com/react/docs/cli).
