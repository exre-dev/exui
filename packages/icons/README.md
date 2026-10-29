# Glass icons workspace

This private workspace owns the canonical `glass-icons/*.svg` assets and generates the React icon collection and SVG URL declarations. Only `@exre/exui` is published; its build copies this workspace's output into the public package.

Run `pnpm --filter @exre/exui-icons build` to generate `dist/glass-icons`. React components default to `8rem`, accept `size` and standard SVG props, and are decorative unless given `title` or an explicit accessible label. Each instance scopes SVG IDs to support multiple icons and server rendering.

The React `color` prop accepts the `GlassIconColor` presets `blue`, `green`, `purple`, `pink`, `coral` and `orange`. It maps canonical paints to gradient, body, tint and shade roles and recolors shadow RGB while retaining material geometry, opacity, white highlights and masks. Omit the prop to retain original colors. Unsupported runtime values also retain the original artwork. Canonical SVG assets and downloads are unchanged.
