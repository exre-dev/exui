
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MoreHorizontalIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"
import { Field } from "@exre/exui"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Field className="max-w-xs">
      <InputGroup>
        <InputGroupInput placeholder={copyExample("Enter file name")} />
        <InputGroupAddon align="inline-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <InputGroupButton aria-label={copyExample("More options")} variant="ghost" size="icon-xs">
                <MoreHorizontalIcon className="size-4" />
              </InputGroupButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{<ExampleText>Rename</ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>{<ExampleText>Duplicate</ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                {<ExampleText>Delete </ExampleText>}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
