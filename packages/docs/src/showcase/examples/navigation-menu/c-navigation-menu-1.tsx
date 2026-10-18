
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{<ExampleText>Getting started</ExampleText>}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-80">
                <li>
                  <NavigationMenuLink asChild>
                    <a onClick={(event) => event.preventDefault()} href="#">
                      <div className="flex flex-col gap-1 px-1">
                        <div className="font-medium">{<ExampleText>Introduction</ExampleText>}</div>
                        <div className="text-muted-foreground line-clamp-2 text-sm">
                          {<ExampleText>Re-usable components built with Tailwind CSS. </ExampleText>}</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a onClick={(event) => event.preventDefault()} href="#">
                      <div className="flex flex-col gap-1 px-1">
                        <div className="font-medium">{<ExampleText>Installation</ExampleText>}</div>
                        <div className="text-muted-foreground line-clamp-2 text-sm">
                          {<ExampleText>How to install dependencies and structure your app. </ExampleText>}</div>
                      </div>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <a onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Documentation</ExampleText>}</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
