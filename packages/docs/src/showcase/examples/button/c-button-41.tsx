"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, CopyIcon } from "lucide-react"

import { useCopyToClipboard } from "@exre/exui"
import { Button } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1500 })

  return (
    <Button
      variant="outline"
      aria-label={copyExample(isCopied ? "Copied" : "Copy")}
      onClick={() => copyToClipboard("https://reui.io")}
    >
      {<ExampleText>{isCopied ? (
        <CheckIcon aria-hidden="true" />
      ) : (
        <CopyIcon aria-hidden="true" />
      )}</ExampleText>}
      <span>{<ExampleText>{isCopied ? "Copied" : "Copy"}</ExampleText>}</span>
    </Button>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
