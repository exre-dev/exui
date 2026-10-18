---
"@exre/exui": major
---

Release ExUI 1.0 with a unified React component catalog, shared design tokens, and bilingual documentation.

### Breaking changes

- Replace `Modal` and its public types with `Dialog` composition. Use `DialogHeader`, `DialogBody`, and `DialogFooter` for structured content, or the quick title, description, and footer API.
- Badge no longer accepts the `ghost` or `link` variants. Choose a supported variant such as `outline`, or apply custom classes for a text-only treatment. The `destructive` variant now uses a solid status fill; use `destructive-light` for a pale background.
- Built-in component geometry, Glass effects, virtual layouts, and supported bundled dependency defaults now follow the application root font size. Explicit numeric pixel props, measured coordinates, thin borders, focus rings, and shadows retain their semantics. The low-level non-React `TanStackTable.constructTable` API and InputOTP password-manager badge geometry remain pixel based.

### Features

- Expand the public catalog with data grids, scheduling and calendars, pickers, boards, trees, sortable flows, signatures, and the eight-part Trace API. Export supporting hooks, types, and the bundled `TanStackTable` namespace from `@exre/exui`.
- Add Dialog header actions, an independently scrolling body, configurable quick composition, and opt-in mobile fullscreen. Keep action hints closed during default opening autofocus while preserving keyboard and pointer access.
- Add `EmojiPicker.hideSearch` for inline, popup, and composed layouts. The default picker omits its information footer and skin-tone selector; explicit composition components remain available.
- Preserve `ExForm` and `ExMessage` APIs. Managed messages share the bundled Toaster and Lucide outline status icons, inherited colors, and per-toast icon customization.

### Visual and interaction fixes

- Use a plain Accordion list with transparent expanded rows and visible keyboard focus. Prevent clipping in nested, reopened, and wrapped content.
- Improve Badge status text and icon contrast across solid, light, and outline variants in all built-in themes.
- Reduce default Card insets, Dialog and AlertDialog padding, Sheet header/footer padding, Command and DataGrid empty states, Gantt empty content, and vertical Timeline item spacing to `1rem`. Keep Card section gaps independently configurable.
- Set explicit Button and ActionButton `xs` heights to `1.5rem` while preserving the compact default at `2rem`. Keep ButtonGroup seams, corners, captions, input groups, and vertical layouts connected across application CSS layers.
- Keep Input borders transparent in idle, hover, and disabled states while retaining focus and validation feedback. Prevent checked Checkbox, RadioGroup, and Switch labels and cards from acquiring unintended backgrounds.
- Align PhoneInput country buttons and number fields, and use the standard rounded Input for country search. Keep Calendar selections circular at week edges, including calendars with week numbers.
- Restore NavigationMenu popup sizing and visible content, draggable horizontal Resizable separators, joined filter chips, and Toggle selection backgrounds when application utilities load above the public stylesheet.
- Coordinate Tabs track and item corners, add a theme-aware active shadow, and preserve line styling and keyboard focus. Align attachment media corners with their containing card and round notification cards using the shared surface token.
- Fix Questionnaire CardAction placement, visible selected indicators, shared navigation button heights, and desktop write-in input sizing while preserving mobile touch targets and wrapped content.

### Documentation

- Provide a static English and Simplified Chinese documentation site with interactive component examples and shareable source. Consolidate consumer guidance into the `exui` skill with verified public imports, examples, and token inventories.
