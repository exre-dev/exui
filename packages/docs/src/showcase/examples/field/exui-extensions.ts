import type { ExampleEntry } from "../../ExampleGallery"
import SettingsFields from "./exui-field-settings"
import DisplayFields from "./exui-field-display"
import FieldLayout from "./exui-field-layout"
export const extensions: readonly ExampleEntry[] = [
 { id:"exui-field-settings", order:0, layout:"full", title:{en:"Standalone settings", "zh-CN":"独立设置字段"}, Component:SettingsFields },
 { id:"exui-field-display", order:0, layout:"half", title:{en:"Display content", "zh-CN":"展示内容"}, Component:DisplayFields },
 { id:"exui-field-layout", order:0, layout:"full", title:{en:"Width and alignment", "zh-CN":"宽度与对齐"}, Component:FieldLayout },
]
