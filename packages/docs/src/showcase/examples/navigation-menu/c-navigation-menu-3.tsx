
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{<ExampleText>Status</ExampleText>}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[200px] gap-2">
                <li>
                  <NavigationMenuLink asChild>
                    <a onClick={(event) => event.preventDefault()} href="#" className="flex items-center gap-2">
                      <CircleAlertIcon  />
                      {<ExampleText>Backlog </ExampleText>}</a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a onClick={(event) => event.preventDefault()} href="#" className="flex items-center gap-2">
                      <CircleCheckIcon  />
                      {<ExampleText>Done </ExampleText>}</a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
