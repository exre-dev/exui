
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ClockIcon, ExternalLinkIcon, MoreHorizontalIcon, PlusIcon, SettingsIcon, UserIcon, UsersIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  ButtonGroup,
  ButtonGroupText,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"


const team = [
  { name: "Shadcn", src: "/examples/reui/photos/0a10b9bc070f3bdf60.jpg", fallback: "CN" },
  { name: "Max", src: "/examples/reui/photos/96b8bd25ab6ed38fc5.png", fallback: "ML" },
  {
    name: "Evil Rabbit",
    src: "/examples/reui/photos/eb59b55e1933bc432a.png",
    fallback: "ER",
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <ButtonGroup>
      {/* Team Context */}
      <Button variant="outline">
        <UsersIcon aria-hidden="true" />
        <span>{<ExampleText>Team</ExampleText>}</span>
      </Button>

      {/* Active Members - Inspired by Avatar Patterns */}
      <ButtonGroupText className="gap-0 bg-transparent">
        <AvatarGroup>
          {<ExampleText>{team.map((member) => (
            <ExampleRuntimeConsumer key={member.name} render={({copy: copyExample}) => (<Avatar key={member.name} className="size-5">
              <AvatarImage src={member.src} alt={copyExample(member.name)} />
              <AvatarFallback>{<ExampleText>{member.fallback}</ExampleText>}</AvatarFallback>
            </Avatar>)} />
          ))}</ExampleText>}
        </AvatarGroup>
        <div className="ml-2 flex items-center gap-1">
          <span className="size-1.5 rounded-full bg-green-500" />
          <span className="text-muted-foreground text-xs font-medium">
            {<ExampleText>3 Live </ExampleText>}</span>
        </div>
      </ButtonGroupText>

      {/* Collaboration Actions */}
      <Button aria-label={copyExample("Add")} variant="outline" size="icon">
        <PlusIcon aria-hidden="true" />
      </Button>
      <Button aria-label={copyExample("Schedule")} variant="outline" size="icon">
        <ClockIcon aria-hidden="true" />
      </Button>

      {/* Options Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button aria-label={copyExample("More options")} variant="outline" size="icon">
            <MoreHorizontalIcon aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>Team Settings</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon aria-hidden="true" />
              <span>{<ExampleText>Manage members</ExampleText>}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon aria-hidden="true" />
              <span>{<ExampleText>Team preferences</ExampleText>}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ExternalLinkIcon aria-hidden="true" />
            <span>{<ExampleText>Open dashboard</ExampleText>}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
