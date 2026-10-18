import type { ExampleEntry } from "../../ExampleGallery"
import ExUIEmojiPickerSearch from "./exui-emoji-picker-search"

export const extensions: readonly ExampleEntry[] = [
  { id: "exui-emoji-picker-search", order: 0, layout: "half", title: { en: "Search visibility", "zh-CN": "搜索栏显示" }, Component: ExUIEmojiPickerSearch },
]
