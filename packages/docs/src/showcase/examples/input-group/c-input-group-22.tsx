
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ShieldCheckIcon } from "lucide-react"

import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <Field className="max-w-xs">
      <InputGroup className="gap-0">
        <InputGroupAddon>
          <Popover>
            <PopoverTrigger asChild>
              <InputGroupButton aria-label={copyExample("Security information")}
                variant="ghost"
                size="icon-xs"
                className="cursor-help"
              >
                <ShieldCheckIcon className="text-emerald-500" />
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72">
              <PopoverHeader>
                <PopoverTitle>{<ExampleText>Secure Connection</ExampleText>}</PopoverTitle>
                <PopoverDescription>
                  {<ExampleText>Your data is encrypted end-to-end using industry-standard protocols. </ExampleText>}</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
        <InputGroupInput
          defaultValue="https://reui.com"
          className="pl-0.5!"
          readOnly
        />
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
