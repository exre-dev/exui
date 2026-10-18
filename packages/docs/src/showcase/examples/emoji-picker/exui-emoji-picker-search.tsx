import { useId, useState } from "react"
import { Card, EmojiPicker, EmojiPickerPanel, Switch } from "@exre/exui"
import { usePreviewCopy } from "../../preview-copy"
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

function SearchVisibility() {
  const copy = usePreviewCopy()
  const { language, locales } = useExampleRuntime()
  const [hideSearch, setHideSearch] = useState(true)
  const id = useId()
  return <div className="flex w-full flex-col items-center gap-4">
    <label htmlFor={id} className="flex items-center gap-2 text-sm">
      <Switch id={id} checked={hideSearch} onCheckedChange={setHideSearch} />
      {copy("Hide search", "隐藏搜索栏")}
    </label>
    <Card className="w-fit py-0">
      <EmojiPicker
        hideSearch={hideSearch}
        i18n={locales.emojiPicker}
        locale={language === "zh-CN" ? "zh" : "en"}
        dataUrl="/examples/reui/emoji/emojibase-data-17.0.0"
      >
        <EmojiPickerPanel />
      </EmojiPicker>
    </Card>
  </div>
}

export default function ExUIEmojiPickerSearch() {
  return <ExampleRuntimeProvider dictionary={dictionary}><SearchVisibility /></ExampleRuntimeProvider>
}
