import type { ExampleEntry } from "../../ExampleGallery"
import ExUIEmojiPickerSearch from "./exui-emoji-picker-search"

export const extensions: readonly ExampleEntry[] = [
  { id: "exui-emoji-picker-search", order: 0, layout: "half", title: { en: "Search and removal", "zh-CN": "搜索与移除" }, Component: ExUIEmojiPickerSearch },
]
