
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@exre/exui"

const components = [
  {
    title: "Alert Dialog",
    href: "#",
    description:
      "A modal dialog that interrupts the user with important content.",
  },
  {
    title: "Hover Card",
    href: "#",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "#",
    description:
      "Displays an indicator showing the completion progress of a task.",
  },
  {
    title: "Scroll-area",
    href: "#",
    description: "Visually or semantically separates content.",
  },
]

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{<ExampleText>Components</ExampleText>}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2">
                {<ExampleText>{components.map((component) => (
                  <li key={component.title}>
                    <NavigationMenuLink
                      asChild
                      className="flex flex-col items-start gap-2 p-3"
                    >
                      <a href={component.href}>
                        <div className="text-sm leading-none font-medium">
                          {<ExampleText>{component.title}</ExampleText>}
                        </div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                          {<ExampleText>{component.description}</ExampleText>}
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                ))}</ExampleText>}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
