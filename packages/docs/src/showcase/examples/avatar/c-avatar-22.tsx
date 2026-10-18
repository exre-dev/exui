
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"

const avatars = [
  {
    src: "/examples/reui/photos/973d47055c51440af7.jpg",
    fallback: "DK",
    name: "David Kim",
  },
  {
    src: "/examples/reui/photos/96b8bd25ab6ed38fc5.png",
    fallback: "ML",
    name: "Max Leiter",
  },
  {
    src: "/examples/reui/photos/c75592a667f30cfd44.jpg",
    fallback: "ER",
    name: "James Brown",
  },
  {
    src: "/examples/reui/photos/fc5e87c5ff3500323d.png",
    fallback: "JW",
    name: "Jenny Wilson",
  },
]

  function OriginalPattern() {
  return (
    <>
      <div className="flex -space-x-2">
        {<ExampleText>{avatars.map((avatar, index) => (
          <ExampleRuntimeConsumer key={index} render={({copy: copyExample}) => (<Tooltip key={index}>
            <TooltipTrigger>
              <Avatar className="ring-background ring-2 transition-all duration-300 ease-in-out hover:z-1 hover:-translate-y-1 hover:shadow-md">
                <AvatarImage src={avatar.src} alt={copyExample(avatar.name)} />
                <AvatarFallback className="text-xs">
                  {<ExampleText>{avatar.fallback}</ExampleText>}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent sideOffset={10}>{<ExampleText>{avatar.name}</ExampleText>}</TooltipContent>
          </Tooltip>)} />
        ))}</ExampleText>}
      </div>
    </>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
