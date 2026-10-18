"use client"


import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import {
  EmojiPicker,
  EmojiPickerPanel,
} from "@exre/exui"

import { Card } from "@exre/exui"

  function OriginalPattern() {
  const { language: exampleLanguage, locales: exampleLocales } = useExampleRuntime()

  // Controlled, as an inline picker usually feeds a form. The panel announces
  // each pick without adding a persistent information footer.
  const [value, setValue] = useState<string | null>(null)

  return (
    // Card has no flush size, so `py-0` keeps its padding off the panel's own
    // insets; `w-fit` hugs the panel when the parent is not a flex row.
    <Card className="w-fit py-0">
      <EmojiPicker i18n={exampleLocales.emojiPicker} locale={exampleLanguage === "zh-CN" ? "zh" : "en"} dataUrl="/examples/reui/emoji/emojibase-data-17.0.0" value={value} onValueChange={setValue}>
        <EmojiPickerPanel />
      </EmojiPicker>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
