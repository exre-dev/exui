
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BookOpenIcon, ChevronDownIcon, CreditCardIcon, LifeBuoyIcon, LogOutIcon, PlusIcon, SettingsIcon, UserIcon, UsersIcon } from "lucide-react"

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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-52">
            <div className="gap-1.5 flex items-center">
              <Avatar className="size-5">
                <AvatarImage
                  src="/examples/reui/photos/e93553df2422635515.jpg"
                  alt={copyExample("Alex Johnson")}
                />
                <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{<ExampleText>Alex Johnson</ExampleText>}</span>
            </div>

            <ChevronDownIcon className="ml-auto size-4 opacity-60" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center gap-2 py-2">
              <Avatar className="size-8">
                <AvatarImage
                  src="/examples/reui/photos/e93553df2422635515.jpg"
                  alt={copyExample("Alex Johnson")}
                />
                <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-foreground text-sm font-medium">
                  {<ExampleText>Alex Johnson </ExampleText>}</span>
                <span className="text-muted-foreground text-xs font-normal">
                  {<ExampleText>alex@example.com </ExampleText>}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon aria-hidden="true" />
                {<ExampleText>Profile </ExampleText>}<DropdownMenuShortcut>{<ExampleText>⇧⌘P</ExampleText>}</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon aria-hidden="true" />
                {<ExampleText>Billing </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon aria-hidden="true" />
                {<ExampleText>Settings </ExampleText>}<DropdownMenuShortcut>{<ExampleText>⌘S</ExampleText>}</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UsersIcon aria-hidden="true" />
                {<ExampleText>Team </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>
                <PlusIcon aria-hidden="true" />
                {<ExampleText>Invite Members </ExampleText>}</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <LifeBuoyIcon aria-hidden="true" />
                {<ExampleText>Support </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>
                <BookOpenIcon aria-hidden="true" />
                {<ExampleText>Documentation </ExampleText>}</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOutIcon aria-hidden="true" />
              {<ExampleText>Log out </ExampleText>}<DropdownMenuShortcut>{<ExampleText>⇧⌘Q</ExampleText>}</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
