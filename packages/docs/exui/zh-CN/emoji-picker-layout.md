### 搜索栏显示与默认布局

`EmojiPicker` 支持 `hideSearch?: boolean`，默认值为 `false`。搜索框默认高度为 `2rem`。设为 `true` 后，内嵌面板和弹层都不显示搜索栏；显式组合的 `EmojiPickerSearch` 也遵循这个参数。分类浏览和键盘选择仍可使用；没有搜索栏的弹层会将焦点放在表情网格上。

默认面板包含搜索、分类和表情网格，不再显示底部信息栏、预览或肤色选择入口。`EmojiPickerFooter`、`EmojiPickerPreview` 和 `EmojiPickerSkinTone` 仍可用于显式自定义组合。`hideSearch` 只控制搜索界面，不清空已有的 `query`。

```tsx verify
import { EmojiPicker, EmojiPickerPanel } from "@exre/exui"

export function BrowseEmoji() {
  return <EmojiPicker hideSearch>
    <EmojiPickerPanel />
  </EmojiPicker>
}
```

### 移除当前表情

单选模式支持 `onRemove?: () => void`。提供回调且已有选中值时，分类栏右侧显示直径为 `2rem` 的圆形叉号按钮，与分类页签之间有分隔；没有选中值时隐藏。按钮使用 `ghost` 样式，提示与无障碍名称由 `i18n.labels.remove` 配置。多选模式不支持该属性。

点击先清空选中值，再关闭弹层，最后触发 `onRemove`；清空会通过 `onValueChange(null)` 通知调用方。受控模式需要更新 `value`，受控弹层需要响应 `onOpenChange(false)`。移除不会触发表情选择回调 `onEmojiSelect`。

`hideSearch` 不隐藏移除按钮，也不会为它保留额外的顶部行。默认面板和显式组合的 `EmojiPickerCategories` 都包含该动作。窄面板的分类页签可横向滚动，移除按钮固定在右侧；它不属于分类页签或表情网格，可通过 Tab 聚焦并按 Enter 激活，搜索时仍可使用。弹层关闭后焦点返回触发按钮或 `returnFocus` 指定的节点；内嵌面板保持显示，移除后的焦点交给表情网格，调用方可在回调中隐藏整个内嵌面板。

```tsx verify
import { useState } from "react"
import { EmojiPicker } from "@exre/exui"

export function RemovableEmoji() {
  const [value, setValue] = useState<string | null>("🎯")
  const [removed, setRemoved] = useState(false)
  return <>
    <EmojiPicker value={value}
      onValueChange={(next) => { setValue(next); setRemoved(false) }}
      onRemove={() => setRemoved(true)} />
    <p role="status">{removed ? "已移除表情" : null}</p>
  </>
}
```
