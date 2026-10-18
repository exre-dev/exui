import type { ExampleEntry } from "../../ExampleGallery"
import ExUIButtonShapes from "./exui-button-shapes"
import ExUIButtonGlass from "./exui-button-glass"

export const extensions: readonly ExampleEntry[] = [
  { id: "exui-button-shapes", order: 0, layout: "full", title: { en: "Button shapes", "zh-CN": "按钮形状" }, Component: ExUIButtonShapes },
  { id: "exui-button-glass", order: 0, layout: "full", title: { en: "Glass buttons", "zh-CN": "玻璃按钮" }, Component: ExUIButtonGlass },
]
