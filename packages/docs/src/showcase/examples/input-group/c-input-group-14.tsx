
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { InfoIcon } from "lucide-react"

import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <Field className="w-full max-w-xs">
      <InputGroup>
        <InputGroupInput type="number" defaultValue="5000" />
        <InputGroupAddon align="inline-end">
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <InputGroupButton aria-label={copyExample("Monthly request limit")} variant="ghost" size="icon-xs">
                  <InfoIcon  />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>{<ExampleText>Monthly request limit</ExampleText>}</TooltipContent>
            </Tooltip>
          </>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
