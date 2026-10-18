
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckCircleIcon, CheckIcon, ChevronDownIcon, MessageSquareIcon, XIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"


const icons = {
  check: (
    <CheckIcon aria-hidden="true" />
  ),
  chevronDown: (
    <ChevronDownIcon aria-hidden="true" />
  ),
  checkCircle: (
    <CheckCircleIcon aria-hidden="true" />
  ),
  messageSquare: (
    <MessageSquareIcon aria-hidden="true" />
  ),
  x: (
    <XIcon aria-hidden="true" />
  ),
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <ButtonGroup className="**:data-[slot=button]:border-x-0">
      <Button variant="default">
        {<ExampleText>{icons.check}</ExampleText>}
        {<ExampleText>Approve </ExampleText>}</Button>
      <ButtonGroupSeparator className="bg-primary-foreground/20" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="default"
            size="icon"
            aria-label={copyExample("More approval options")}
          >
            {<ExampleText>{icons.chevronDown}</ExampleText>}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              {<ExampleText>{icons.checkCircle}</ExampleText>}
              {<ExampleText>Approve with Conditions </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              {<ExampleText>{icons.messageSquare}</ExampleText>}
              {<ExampleText>Request Changes </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              {<ExampleText>{icons.x}</ExampleText>}
              {<ExampleText>Reject </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
