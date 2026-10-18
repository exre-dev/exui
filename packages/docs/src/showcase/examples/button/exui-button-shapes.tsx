import { ActionButton, Button } from "@exre/exui"
import { usePreviewCopy } from "../../preview-copy"

const variants = [
  { value: "default", chinese: "默认" },
  { value: "outline", chinese: "描边" },
  { value: "ghost", chinese: "幽灵" },
] as const

export default function ExUIButtonShapes() {
  const copy = usePreviewCopy()
  return <div className="showcase-stack">
    <div>
      <p>{copy("Capsule Button", "胶囊形 Button")}</p>
      <div className="flex flex-wrap gap-3">
        {variants.map(variant => <Button key={variant.value} type="button" variant={variant.value}>
          {copy(`Button ${variant.value}`, `按钮 ${variant.chinese}`)}
        </Button>)}
      </div>
    </div>
    <div>
      <p>{copy("Rounded ActionButton", "常规圆角 ActionButton")}</p>
      <div className="flex flex-wrap gap-3">
        {variants.map(variant => <ActionButton key={variant.value} type="button" variant={variant.value}>
          {copy(`Action ${variant.value}`, `操作 ${variant.chinese}`)}
        </ActionButton>)}
      </div>
    </div>
    <div>
      <p>{copy("XS: 1.5rem · Compact default: 2rem", "XS：1.5rem · 紧凑默认：2rem")}</p>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" size="xs">XS Button</Button>
        <ActionButton type="button" size="xs">XS ActionButton</ActionButton>
        <div className="density-compact">
          <Button type="button">{copy("Compact default", "紧凑默认")}</Button>
        </div>
      </div>
    </div>
  </div>
}
