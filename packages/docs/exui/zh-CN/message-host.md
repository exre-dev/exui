### 托管消息与 Sonner

调用 `ExMessage` 前先挂载一个 `ExMessageContext`。它已经渲染包内共享的 `Toaster`。`loading` 返回的 `onSuccess`、`onError` 和 `dismiss` 都作用于同一条消息。根入口的 `toast` 共用这个 Sonner 实例；应用自行安装的另一份 Sonner 有独立状态。`maxCount` 只会淘汰托管的 ExMessage 记录，但宿主也将其传给 `Toaster.visibleToasts`，因此直接调用的 toast 也共用可见条数上限。

```tsx verify
import { Button, ExMessage, ExMessageContext } from "@exre/exui"

export function MessageExample() {
  return <><ExMessageContext placement="top-right" maxCount={3} />
    <Button type="button" onClick={() => {
      const pending = ExMessage.loading("正在保存")
      pending.onSuccess("已保存")
    }}>保存</Button></>
}
```
