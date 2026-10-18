
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            {<ExampleText>Shortcuts </ExampleText>}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>My Account</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuItem>
              {<ExampleText>Profile </ExampleText>}<DropdownMenuShortcut>{<ExampleText>⇧⌘P</ExampleText>}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              {<ExampleText>Billing </ExampleText>}<DropdownMenuShortcut>{<ExampleText>⌘B</ExampleText>}</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              {<ExampleText>Settings </ExampleText>}<DropdownMenuShortcut>{<ExampleText>⌘S</ExampleText>}</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            {<ExampleText>Log out </ExampleText>}<DropdownMenuShortcut>{<ExampleText>⇧⌘Q</ExampleText>}</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
