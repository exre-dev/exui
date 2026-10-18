### 独立的 ExItem

`ExItem` 为任意子控件提供标题、说明和布局，不绑定表单状态。直接作为子元素的 `Input` 会自动获得 ID 和说明关联。其他控件应自行设置 ID，并把相同的值传给 `ExItem.controlId`。`controlId` 与直接 Input 的 ID 冲突会报错。数字 `contentMaxWidth` 按 CSS 像素解释；需要随字号缩放时传 CSS 长度。

```tsx verify
import { ExItem, Input, Switch } from "@exre/exui"

export function SettingsItems() {
  return <><ExItem title="姓名" desc="对团队成员可见"><Input defaultValue="Alex" /></ExItem>
    <ExItem title="通知" controlId="notices" layout="horizontal"><Switch id="notices" /></ExItem></>
}
```
