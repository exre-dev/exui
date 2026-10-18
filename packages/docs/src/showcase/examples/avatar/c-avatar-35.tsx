
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronsUpDownIcon, LogOutIcon, PlusIcon, SettingsIcon, UserIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
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
  const { copy: copyExample } = useExampleRuntime()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full h-8 gap-1.5 pr-2.5 pl-1"
        >
          <Avatar className="border-background size-6 border">
            <AvatarImage
              src="/examples/reui/photos/a3afee2f77d259ce6a.jpg"
              alt={copyExample("Liam Thompson")}
            />
            <AvatarFallback>{<ExampleText>LT</ExampleText>}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium">{<ExampleText>Liam Thompson</ExampleText>}</span>
          <ChevronsUpDownIcon className="size-3.5 opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="center" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{<ExampleText>Management</ExampleText>}</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserIcon aria-hidden="true" />
            <span>{<ExampleText>Profile</ExampleText>}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon aria-hidden="true" />
            <span>{<ExampleText>Settings</ExampleText>}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserIcon aria-hidden="true" />
            <span>{<ExampleText>Teams</ExampleText>}</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlusIcon aria-hidden="true" />
            <span>{<ExampleText>Invite</ExampleText>}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <LogOutIcon aria-hidden="true" />
          <span>{<ExampleText>Log out</ExampleText>}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
