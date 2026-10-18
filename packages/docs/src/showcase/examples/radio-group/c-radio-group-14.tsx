
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { HelpCircleIcon } from "lucide-react"

import { Field, FieldLabel } from "@exre/exui"
import {
  RadioGroup,
  RadioGroupItem,
} from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <>
      <RadioGroup defaultValue="public" className="w-full max-w-xs">
        <Field orientation="horizontal">
          <RadioGroupItem value="public" id={exampleId("vis-public")} />
          <div className="flex items-center gap-1.5">
            <FieldLabel htmlFor={exampleId("vis-public")}>{<ExampleText>Public</ExampleText>}</FieldLabel>
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground" aria-label={copyExample("About public visibility")}>
                <span>
                  <HelpCircleIcon aria-hidden="true" className="size-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent side="right">
                {<ExampleText>Anyone on the internet can see this. </ExampleText>}</TooltipContent>
            </Tooltip>
          </div>
        </Field>
        <Field orientation="horizontal">
          <RadioGroupItem value="private" id={exampleId("vis-private")} />
          <div className="flex items-center gap-1.5">
            <FieldLabel htmlFor={exampleId("vis-private")}>{<ExampleText>Private</ExampleText>}</FieldLabel>
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground" aria-label={copyExample("About private visibility")}>
                <HelpCircleIcon aria-hidden="true" className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent side="right">
                {<ExampleText>Only you and collaborators can access this. </ExampleText>}</TooltipContent>
            </Tooltip>
          </div>
        </Field>
      </RadioGroup>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
