### Search visibility and default layout

`EmojiPicker` accepts `hideSearch?: boolean`, defaulting to `false`. Set it to `true` to omit the search field from both inline panels and popovers. It also applies to an explicitly composed `EmojiPickerSearch`. Category browsing and keyboard selection remain available; a popup without search focuses its emoji grid.

The default panel contains search, categories and the emoji grid. It has no information footer, preview or skin-tone selector. `EmojiPickerFooter`, `EmojiPickerPreview` and `EmojiPickerSkinTone` remain available for explicit custom compositions. `hideSearch` controls the search UI without clearing an existing `query`.

```tsx verify
import { EmojiPicker, EmojiPickerPanel } from "@exre/exui"

export function BrowseEmoji() {
  return <EmojiPicker hideSearch>
    <EmojiPickerPanel />
  </EmojiPicker>
}
```
