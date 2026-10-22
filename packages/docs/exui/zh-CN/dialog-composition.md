### 快捷写法、标题动作与手机全屏

内容区默认四边 padding 均为 `1.5rem`，根字号为 16px 时即 24px，与 ReUI 一致。全屏时，各方向取此 padding 与对应安全区 inset 的较大值。

给 `Dialog` 提供 `title`，即可自动生成 Content/Header/Body/Footer 结构。`title`、可选的 `description` 和 `footer` 支持 React 节点，children 作为正文。不传 `title` 时继续使用显式组合写法。两种写法都沿用 `open`/`onOpenChange` 或 `defaultOpen`，默认关闭。快捷写法由外部按钮触发，关闭时恢复此前的焦点；可通过 `contentProps.onCloseAutoFocus` 阻止默认恢复。非模态弹窗由外部交互关闭时，保留该外部目标的焦点。

`DialogHeader.action` 接受 React 按钮鼠标回调，或 `{ tooltip?: string, onClick, icon?: LucideIcon }`。标题左侧显示 Ghost 图标按钮，默认 `ArrowLeft`，对齐标题首行。点击只触发回调，不自动关闭弹窗或提交表单；异步、加载、错误和业务导航由调用方负责。无障碍名称按 `actionLabel`、`tooltip`、`"Back"` 的顺序取值；没有 tooltip 文字时不显示 Tooltip。禁用右上角关闭按钮不会禁用此独立动作。

带动作的标题使用 `0.125rem` 列间距，按钮逻辑起始边距为 `-0.25rem`（16px 根字号下分别为 2px 和 -4px）。按钮保留原有点击范围，说明仍与标题左对齐。快捷写法与显式组合共用此布局。

标题动作带 Tooltip 时，打开弹窗默认聚焦有无障碍名称的弹窗容器，提示不会自动出现；Tab 到动作按钮或主动悬停时才显示。调用方通过 `onOpenAutoFocus` 阻止默认行为后，仍可自定义初始焦点。

在 `DialogContent` 上，或快捷 `Dialog` 的顶层设置 `responsiveFullscreen`，宽度小于 48 个当前根 rem 单位时铺满动态视口，默认字号下约为 768px。默认值为 `false`。全屏去掉外框与圆角，保留安全区，并在窗口或根字号变化时保留同一 DOM 和草稿状态。显式的 `contentProps.style` 可以覆盖全屏几何。

将 `DialogHeader`、`DialogBody` 和可选的 `DialogFooter` 作为 `DialogContent` 的直接子节点，即可限制正文高度，让正文独立滚动，标题和底部操作保持可见。放大字号或极低视口导致固定区域放不下时，外层滚动会保证所有内容和操作可达。快捷写法会自动提供此结构。表单可放在 `DialogBody` 中，独立底部的提交按钮可用 HTML `form` 属性关联表单。组件不会检查或重排任意自定义嵌套内容。

快捷写法顶层提供 `action`、`actionLabel` 和 `responsiveFullscreen`。通过 `contentProps` 设置已有 Content 能力，例如 `className`、`style`、`glass`、`showCloseButton`、`closeLabel`、`closeButtonDisabled` 和事件处理器。快捷模式拥有宿主和 children，因此 `contentProps` 排除 `asChild`、`children` 以及顶层全屏选项。空白的动作名称和 tooltip 文字会回退到下一个非空无障碍名称。底部属性拼写为 `footer`。

```tsx verify
import { useState } from "react"
import { Button, Dialog, Input } from "@exre/exui"

export function QuickDialogExample() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  return <>
    <Button onClick={() => setOpen(true)}>编辑资料</Button>
    <Dialog open={open} onOpenChange={setOpen}
      title="编辑资料" description={`第 ${step} 步，共 2 步`}
      action={{ tooltip: "上一步", onClick: () => setStep(1) }}
      responsiveFullscreen contentProps={{ closeLabel: "关闭", glass: true }}
      footer={<><Button onClick={() => setStep(2)}>下一步</Button><Button onClick={() => setOpen(false)}>完成</Button></>}>
      <Input aria-label="显示名称" defaultValue="小明" />
    </Dialog>
  </>
}
```

显式组合写法使用同一套子组件：

```tsx verify
import { Button, Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@exre/exui"

export function ComposedDialogExample() {
  return <Dialog>
    <DialogTrigger asChild><Button>打开设置</Button></DialogTrigger>
    <DialogContent responsiveFullscreen>
      <DialogHeader action={() => window.history.back()} actionLabel="返回">
        <DialogTitle>设置</DialogTitle>
        <DialogDescription>修改保留在当前会话中。</DialogDescription>
      </DialogHeader>
      <DialogBody>设置内容</DialogBody>
      <DialogFooter><DialogClose asChild><Button>完成</Button></DialogClose></DialogFooter>
    </DialogContent>
  </Dialog>
}
```
