
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"

const sides = ["left", "top", "bottom", "right"] as const

  function OriginalPattern() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {<ExampleText>{sides.map((side) => (
        <DropdownMenu key={side}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {<ExampleText>{side.replace("-", " ").charAt(0).toUpperCase() +
                side.replace("-", " ").slice(1)}</ExampleText>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={side as "left" | "top" | "bottom" | "right"}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem>{<ExampleText>Profile</ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>{<ExampleText>Billing</ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>{<ExampleText>Settings</ExampleText>}</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
