import { Button } from "@exre/exui"
import { usePreviewCopy } from "../../preview-copy"

export default function Pattern() {
  const copy = usePreviewCopy()
  return <Button>{copy("Default", "默认")}</Button>
}
