import * as React from "react"
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { cn } from "@exre/exui"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"

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
    <div className="group/avatars flex items-center px-2 py-4">
      {<ExampleText>{avatars.map((avatar, index) => (
        <ExampleRuntimeConsumer key={index} render={({copy: copyExample}) => (<div
          key={index}
          style={
            {
              "--index": index,
              zIndex: avatars.length - index,
            } as React.CSSProperties
          }
          className="group/avatar-item translate-x-[calc(var(--index)*-8px)] transition-all duration-300 ease-in-out will-change-transform group-hover/avatars:translate-x-[calc(var(--index)*6px)]"
        >
          <Avatar
            className={cn(
              "ring-background origin-center ring-2 transition-transform duration-300 ease-in-out",
              "group-hover/avatar-item:scale-110"
            )}
          >
            <AvatarImage src={avatar.src} alt={copyExample(avatar.name)} />
            <AvatarFallback className="text-xs">
              {<ExampleText>{avatar.fallback}</ExampleText>}
            </AvatarFallback>
          </Avatar>
        </div>)} />
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
