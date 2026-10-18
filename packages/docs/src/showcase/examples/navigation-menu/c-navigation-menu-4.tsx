
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BuildingIcon, CircleDollarSignIcon, LayoutGridIcon, RadioIcon, SparklesIcon, UserIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@exre/exui"


const industries = [
  {
    title: "Individuals",
    description: "Keep your finances organized.",
    href: "#",
    icon: (
      <UserIcon  />
    ),
  },
  {
    title: "LLCs",
    description: "Benefit from tax write-offs.",
    href: "#",
    icon: (
      <BuildingIcon  />
    ),
  },
  {
    title: "Freelancers",
    description: "For independent workers.",
    href: "#",
    icon: (
      <CircleDollarSignIcon  />
    ),
  },
  {
    title: "Investors",
    description: "Make and grow your money.",
    href: "#",
    icon: (
      <LayoutGridIcon  />
    ),
  },
  {
    title: "Small businesses",
    description: "We take care of your taxes.",
    href: "#",
    icon: (
      <SparklesIcon  />
    ),
  },
  {
    title: "Crypto",
    description: "For tech enthusiasts.",
    href: "#",
    icon: (
      <CircleDollarSignIcon  />
    ),
  },
  {
    title: "Big companies",
    description: "Run your finances easily.",
    href: "#",
    icon: (
      <BuildingIcon  />
    ),
  },
  {
    title: "Investments",
    description: "Launch your ideas worldwide.",
    href: "#",
    icon: (
      <RadioIcon  />
    ),
  },
]

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>{<ExampleText>Industries</ExampleText>}</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[500px]">
                <ul className="grid grid-cols-2 gap-1">
                  {<ExampleText>{industries.map((item) => (
                    <li key={item.title}>
                      <NavigationMenuLink
                        asChild
                        className="flex items-start gap-2 p-3"
                      >
                        <a onClick={(event) => event.preventDefault()} href="#">
                          {<ExampleText>{item.icon}</ExampleText>}
                          <div className="flex flex-col gap-0.5">
                            <div className="text-sm leading-none font-medium">
                              {<ExampleText>{item.title}</ExampleText>}
                            </div>
                            <p className="text-muted-foreground text-xs leading-snug">
                              {<ExampleText>{item.description}</ExampleText>}
                            </p>
                          </div>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}</ExampleText>}
                </ul>
                <div className="mt-2 px-1 pb-1">
                  <Button className="w-full" asChild>
                    <a onClick={(event) => event.preventDefault()} href="#">{<ExampleText>Learn more</ExampleText>}</a>
                  </Button>
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
