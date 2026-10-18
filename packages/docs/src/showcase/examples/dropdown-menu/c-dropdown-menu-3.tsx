
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CreditCardIcon, LogOutIcon, SettingsIcon, UserIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-fit">
            {<ExampleText>Options </ExampleText>}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <UserIcon  />
              {<ExampleText>Profile </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <CreditCardIcon  />
              {<ExampleText>Billing </ExampleText>}</DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon  />
              {<ExampleText>Settings </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <LogOutIcon  />
            {<ExampleText>Log out </ExampleText>}</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
