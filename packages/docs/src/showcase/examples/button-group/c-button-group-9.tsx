
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { AudioLinesIcon, SendIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { ButtonGroup } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button aria-label={copyExample("Send message")} variant="outline" size="icon">
          <SendIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput placeholder={copyExample("Send a message...")} />
          <>
            <Tooltip>
              <InputGroupAddon align="inline-end">
                <TooltipTrigger asChild>
                  <button type="button" aria-label={copyExample("Voice Mode")} className="inline-flex items-center justify-center rounded-sm focus-visible:outline-2 focus-visible:outline-ring">
                    <AudioLinesIcon aria-hidden="true" />
                  </button>
                </TooltipTrigger>
              </InputGroupAddon>
              <TooltipContent>{<ExampleText>Voice Mode</ExampleText>}</TooltipContent>
            </Tooltip>
          </>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
