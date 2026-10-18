### 搜索栏显示与默认布局

`EmojiPicker` 支持 `hideSearch?: boolean`，默认值为 `false`。设为 `true` 后，内嵌面板和弹层都不显示搜索栏；显式组合的 `EmojiPickerSearch` 也遵循这个参数。分类浏览和键盘选择仍可使用；没有搜索栏的弹层会将焦点放在表情网格上。

默认面板包含搜索、分类和表情网格，不再显示底部信息栏、预览或肤色选择入口。`EmojiPickerFooter`、`EmojiPickerPreview` 和 `EmojiPickerSkinTone` 仍可用于显式自定义组合。`hideSearch` 只控制搜索界面，不清空已有的 `query`。

```tsx verify
import { EmojiPicker, EmojiPickerPanel } from "@exre/exui"

export function BrowseEmoji() {
  return <EmojiPicker hideSearch>
    <EmojiPickerPanel />
  </EmojiPicker>
}
```
