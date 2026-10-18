import { ActionButton, Button } from "@exre/exui"
import { usePreviewCopy } from "../../preview-copy"

export default function ExUIButtonGlass() {
  const copy = usePreviewCopy()
  return <div className="showcase-stack">
    <p>{copy("Glass is opt-in for each control.", "每个控件均可单独开启玻璃材质。")}</p>
    <div className="flex flex-wrap gap-3">
      <Button type="button">{copy("Default Button", "默认 Button")}</Button>
      <Button type="button" glass>{copy("Glass Button", "玻璃 Button")}</Button>
      <ActionButton type="button" variant="outline" glass>
        {copy("Glass ActionButton", "玻璃 ActionButton")}
      </ActionButton>
    </div>
  </div>
}
