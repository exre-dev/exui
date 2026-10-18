# Dialog 的正文边界与响应式几何

当前适用范围是 `components/ui/dialog`。旧 `Modal` 的历史约束继续由 [Modal 标题布局](modal-header-layout.md) 保存，不能当作当前公开 API。

独立滚动需要明确的正文边界。Dialog 只把直接子级 `DialogBody` 作为可收缩正文，不遍历或重排任意 children；否则包在表单、Fragment 或业务组件内的节点可能被移出其原有状态和语义边界。快捷写法复用同一组 Header/Body/Footer，而不是维护另一套弹窗实现。消费说明见 [Dialog 参考](../../../skills/exui/references/components/dialog.md)。

文档站把公共样式放进 `exui` layer，应用通用工具类位于更高 layer。仅增加高 specificity 的全屏 CSS 不能压过应用层的 `.border`、`.grid` 或尺寸类。全屏几何因此写在现有内容节点的 inline style；显式的调用方 style 仍可覆盖。普通内容容器不挂通用 `.grid` 类，以免它覆盖 Body 布局；动作标题也不会同时携带 `.flex` 和 grid 布局。这个问题必须用完整 docs 样式验证，单独引入公共样式看不出来。

响应式变化只更新同一内容节点的几何，不切换 Portal 或替换 Body。这样窗口宽度和当前根字号变化不会清掉正文输入值、嵌套组件状态和 DOM 焦点。标题动作采用按钮列与可收缩文字列，依据标题首行与按钮高度差对齐；动态根字号会触发共享 Button 的尺寸过渡，几何断言需等待过渡稳定。

带动作时，列间距由局部 CSS 管理，宿主不同时挂共享 gap 工具类，避免文档应用层恢复较宽列距。按钮的逻辑起始边负 margin 收紧实际列宽，使标题与说明一起靠近内容边缘，同时保留按钮本身的点击尺寸。

快捷写法没有 Radix Trigger，因此在打开的 autofocus 回调中保存此前聚焦元素，在关闭时恢复；调用方阻止关闭 autofocus 时遵从调用方。非模态弹窗由外部交互关闭时保留外部目标的焦点；若父组件拒绝此次关闭，后续内部交互会清空旧标记，保证内部关闭仍可恢复焦点。组合写法继续由 Radix Trigger 管理焦点归还。

Radix 的默认挂载 autofocus 会选择首个可操作元素。有 Tooltip 的标题动作恰好位于最前时，程序聚焦也会被 Tooltip 当成键盘聚焦而直接显示提示。DialogContent 对这种标题动作默认聚焦已有无障碍名称的弹窗容器，避免打开即显示 Tooltip；Tab 到动作按钮或主动悬停仍会显示提示。调用方在 `onOpenAutoFocus` 中阻止默认行为时，组件保留其焦点决定，不用延时器或关闭 Tooltip 的键盘行为规避问题。

放大字号或极低视口可能让标题和底部操作的总高超过可用高度。正文至少保留一行可滚动高度，外层允许滚动兜底，避免底部操作不可达；普通高度仍只滚动正文。该退化由 640×320 视口、32px 根字号和多行标题/说明的浏览器用例覆盖。

证据：`packages/components/src/components/ui/dialog.tsx`、`dialog.css`，以及 `packages/docs/src/showcase/DialogEnhancements.vrt.test.tsx` 的完整 docs 样式、主题/密度、根字号、视口切换、独立滚动和同一输入节点检查。原有 `Dialog.vrt.test.tsx` 保留关闭与 ARIA 行为覆盖。测试命令见根目录 `TESTING.md`。
