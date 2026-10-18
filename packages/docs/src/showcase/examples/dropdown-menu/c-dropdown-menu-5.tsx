
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            {<ExampleText>With Submenu </ExampleText>}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuGroup>
            <DropdownMenuItem>{<ExampleText>Team</ExampleText>}</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{<ExampleText>Invite users</ExampleText>}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-32">
                  <DropdownMenuItem>{<ExampleText>Email</ExampleText>}</DropdownMenuItem>
                  <DropdownMenuItem>{<ExampleText>Message</ExampleText>}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{<ExampleText>More…</ExampleText>}</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              {<ExampleText>New Team </ExampleText>}<DropdownMenuShortcut>{<ExampleText>⌘+T</ExampleText>}</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
