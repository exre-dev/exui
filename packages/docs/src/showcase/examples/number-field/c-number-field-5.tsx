
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@exre/exui"



  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="w-full max-w-48">
      <NumberField defaultValue={5} min={0} max={100}>
        <NumberFieldScrubArea label={copyExample("Amount")} />
        <NumberFieldGroup>
          <NumberFieldInput className="text-start" />

          <div className="border-input bg-muted/30 rounded-lg m-px flex shrink-0 flex-col overflow-hidden border">
            <NumberFieldIncrement className="border-input hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! border-b px-1.5 leading-none">
              <ChevronUpIcon className="size-3.5" />
            </NumberFieldIncrement>
            <NumberFieldDecrement className="hover:bg-accent focus-visible:bg-accent flex h-3.5 w-full flex-1 shrink-0 items-center rounded-none! px-1.5 leading-none">
              <ChevronDownIcon className="size-3.5" />
            </NumberFieldDecrement>
          </div>
        </NumberFieldGroup>
      </NumberField>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
