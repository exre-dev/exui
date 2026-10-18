import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectField,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"
import { usePreviewCopy } from "../../preview-copy"

export default function ExUISelectApis() {
  const copy = usePreviewCopy()
  const [simpleValue, setSimpleValue] = useState("apple")
  const [composedValue, setComposedValue] = useState("apple")
  const options = [
    { value: "apple", label: copy("Apple", "苹果") },
    { value: "pear", label: copy("Pear", "梨") },
  ]

  return <div className="showcase-stack">
    <div>
      <p>{copy("Simplified Select: options, value, onChange", "简化 Select：options、value、onChange")}</p>
      <Select options={options} value={simpleValue} onChange={setSimpleValue} glass />
      <p>{copy("Selected", "已选")}: {options.find(option => option.value === simpleValue)?.label}</p>
    </div>
    <div>
      <p>{copy("Composed SelectField: onValueChange", "组合式 SelectField：onValueChange")}</p>
      <SelectField value={composedValue} onValueChange={setComposedValue}>
        <SelectTrigger aria-label={copy("Composed fruit", "组合式水果选择")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent glass>
          {options.map(option => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectContent>
      </SelectField>
      <p>{copy("Selected", "已选")}: {options.find(option => option.value === composedValue)?.label}</p>
    </div>
    <p>{copy("The simplified control opts its trigger into Glass; the composed control opts its popup in separately.", "简化控件为触发器开启玻璃材质；组合式控件单独为弹出层开启玻璃材质。")}</p>
  </div>
}
