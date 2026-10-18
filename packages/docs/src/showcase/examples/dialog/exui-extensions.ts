import type { ExampleEntry } from "../../ExampleGallery"
import Actions from "./exui-dialog-actions"
import Responsive from "./exui-dialog-responsive"
import Quick from "./exui-dialog-quick"

export const extensions: readonly ExampleEntry[] = [
  { id: "exui-dialog-quick", order: 0, layout: "half", title: { en: "Quick composition", "zh-CN": "快捷写法" }, Component: Quick },
  { id: "exui-dialog-actions", order: 1, layout: "half", title: { en: "Header action", "zh-CN": "标题动作" }, Component: Actions },
  { id: "exui-dialog-responsive", order: 2, layout: "half", title: { en: "Mobile fullscreen", "zh-CN": "手机自适应全屏" }, Component: Responsive },
]
