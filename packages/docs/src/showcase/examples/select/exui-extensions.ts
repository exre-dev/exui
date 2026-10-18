import type { ExampleEntry } from "../../ExampleGallery"
import ExUISelectApis from "./exui-select-apis"

export const extensions: readonly ExampleEntry[] = [
  { id: "exui-select-apis", order: 0, layout: "full", title: { en: "Select APIs", "zh-CN": "Select 两种接口" }, Component: ExUISelectApis },
]
