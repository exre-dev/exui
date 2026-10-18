"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, CopyIcon } from "lucide-react"

import { useCopyToClipboard } from "@exre/exui"
import { Button } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 1500 })

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            aria-label={copyExample(isCopied ? "Copied" : "Copy")}
            onClick={() => copyToClipboard("https://reui.io")}
          >
            {<ExampleText>{isCopied ? (
              <CheckIcon aria-hidden="true" />
            ) : (
              <CopyIcon aria-hidden="true" />
            )}</ExampleText>}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{<ExampleText>{isCopied ? "Copied" : "Copy link"}</ExampleText>}</TooltipContent>
      </Tooltip>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
