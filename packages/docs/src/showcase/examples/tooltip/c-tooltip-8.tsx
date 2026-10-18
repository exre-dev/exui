
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BoldIcon, ImageIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { Separator } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={copyExample("Bold")}>
                <BoldIcon aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{<ExampleText>Bold</ExampleText>}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={copyExample("Italic")}>
                <ItalicIcon aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{<ExampleText>Italic</ExampleText>}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={copyExample("Underline")}>
                <UnderlineIcon aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{<ExampleText>Underline</ExampleText>}</TooltipContent>
          </Tooltip>
          <div className="flex items-center">
            <Separator
              orientation="vertical"
              className="mx-1 h-5 leading-none"
            />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={copyExample("Image")}>
                <ImageIcon aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{<ExampleText>Insert Image</ExampleText>}</TooltipContent>
          </Tooltip>
        </div>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
