
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
  DropdownMenuTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            {<ExampleText>Open </ExampleText>}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>My Account</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuItem>{<ExampleText>Profile</ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>{<ExampleText>Billing</ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>{<ExampleText>Settings</ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>{<ExampleText>GitHub</ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>{<ExampleText>Support</ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem disabled>{<ExampleText>API</ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
