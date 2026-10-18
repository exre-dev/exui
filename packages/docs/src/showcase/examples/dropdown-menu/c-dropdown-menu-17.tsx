
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellIcon, CheckIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@exre/exui"


const icons = {
  bell: (
    <BellIcon aria-hidden="true" />
  ),
  check: (
    <CheckIcon aria-hidden="true" />
  ),
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={copyExample("Notifications")}>
          {<ExampleText>{icons.bell}</ExampleText>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{<ExampleText>Notifications</ExampleText>}</DropdownMenuLabel>
          <DropdownMenuItem>
            <span className="flex-1">{<ExampleText>New message from Alex</ExampleText>}</span>
            {<ExampleText>{icons.check}</ExampleText>}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="flex-1">{<ExampleText>Document approved</ExampleText>}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="flex-1">{<ExampleText>Pipeline stage updated</ExampleText>}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
