# Icons

Use named imports from the consuming application's direct `lucide-react` dependency. ExUI's package is built with Lucide; a consumer's `components.json` does not replace those built-in icons.

```tsx
import { SaveIcon } from "lucide-react"
import { Button } from "@exre/exui"

<Button type="button">
  <SaveIcon aria-hidden="true" data-icon="inline-start" />
  Save
</Button>
```

Controls own the size of their child icons. Leave `size-*` off icons inside Button, menu items, Select items and other size-owning controls; size a standalone row icon with `size-4` when needed. Use `data-icon="inline-start"` or `inline-end` on Button's leading or trailing icon.

An icon-only control needs an accessible name on the control, such as `<Button type="button" size="icon" aria-label="Save"><SaveIcon aria-hidden="true" /></Button>`. Tooltips add explanation but do not replace that name.

Use another asset for a brand logo, product artwork or a concept Lucide does not cover. This does not create a second default icon system. Use the existing icon dependency for ordinary controls.

For a monochrome brand SVG, use an alpha mask with `background-color: currentColor` so its paint follows the theme. Resolve the asset URL against the application's deployment base. A logo tile can use `ex-glass` for its surface; keep a decorative mark `aria-hidden` when adjacent text already names the link.

## Colored glass artwork

Browse the docs Icons page at `/<locale>/docs/icons/`, directly below All components in the sidebar. Select a card's artwork to preview it, or its title to copy the complete component name, such as `CameraIcon`. Detail titles also copy the name. The solid color buttons in each icon's details preview its preset palette and update the copied React code; Original restores its canonical colors. The details also provide import examples and canonical SVG downloads. Prefix the route with the docs deployment base when applicable.

For colored glass illustrations, use named imports from `@exre/exui/icons/glass-icons`. This entry needs React 19 and no ExUI stylesheet. It shares the ExUI package/version; do not install a separate icons package.

```tsx
import { CameraIcon, HeartIcon } from "@exre/exui/icons/glass-icons"

export function PhotoArtwork() {
  return <div><CameraIcon title="Camera" /><HeartIcon color="blue" size="4rem" aria-label="Favorites" /></div>
}
```

Defaults are `8rem` square, with a `0 0 128 128` viewBox. Numeric `size` values mean pixels; CSS lengths, `width`, `height`, `className`, `style`, SVG attributes and refs can override the default. Set each React icon's `color` to `blue`, `green`, `purple`, `pink`, `coral` or `orange` to recolor its gradients, glass tint, inner shade and shadows while preserving the glass material. Omit `color` to keep the original artwork. `GlassIconColor` is the exported preset union; arbitrary CSS colors, hex values, CSS variables and `currentColor` are not supported. An unlabeled icon is decorative. Use `title`, `aria-label` or `aria-labelledby` for meaningful artwork; an icon-only control still owns its accessible name.

Bundlers can import `@exre/exui/icons/glass-icons/camera.svg` as an asset URL. File names use lowercase kebab-case (`paper-plus.svg`, `arrow-02.svg`); corresponding components are `PaperPlusIcon` and `Arrow02Icon`. SVG assets and gallery downloads retain their canonical colors; the `color` prop applies to React components. SVG assets have transparent backgrounds and standard vector blur filters. The blur is composited from the artwork itself, rather than the surrounding web page. React instances isolate their internal IDs, so repeated icons and server rendering are supported.
