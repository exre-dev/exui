
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CreditCardIcon, FileTextIcon, LogOutIcon, PlusIcon, SettingsIcon, ShoppingCartIcon, UploadIcon, UserIcon, UserPlusIcon } from "lucide-react"

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
import { Separator } from "@exre/exui"


const user = {
  name: "Alex Johnson",
  email: "alex@example.com",
  initials: "AJ",
}

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex shrink-0 items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm">
            <PlusIcon aria-hidden="true" />
            {<ExampleText>New </ExampleText>}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40" sideOffset={12}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>{<ExampleText>Create</ExampleText>}</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserPlusIcon className="size-4 opacity-60" aria-hidden="true" />
                {<ExampleText>New Customer </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>
                <ShoppingCartIcon className="size-4 opacity-60" aria-hidden="true" />
                {<ExampleText>New Order </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>
                <FileTextIcon className="size-4 opacity-60" aria-hidden="true" />
                {<ExampleText>New Invoice </ExampleText>}</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UploadIcon className="size-4 opacity-60" aria-hidden="true" />
              {<ExampleText>Import Data </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="my-auto h-4" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={copyExample("Open account menu")}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0"
            style={{ font: "inherit" }}
          >
            <Avatar className="size-6">
              <AvatarImage
                src="/examples/reui/photos/e93553df2422635515.jpg"
                alt={copyExample(user.name)}
              />
              <AvatarFallback>{<ExampleText>{user.initials}</ExampleText>}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={12} className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-foreground text-sm">{<ExampleText>{user.name}</ExampleText>}</span>
                <span className="text-muted-foreground text-xs">
                  {<ExampleText>{user.email}</ExampleText>}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon className="size-4 opacity-60" aria-hidden="true" />
                {<ExampleText>Profile </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon className="size-4 opacity-60" aria-hidden="true" />
                {<ExampleText>Billing </ExampleText>}</DropdownMenuItem>
              <DropdownMenuItem>
                <SettingsIcon className="size-4 opacity-60" aria-hidden="true" />
                {<ExampleText>Settings </ExampleText>}</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOutIcon aria-hidden="true" />
              {<ExampleText>Sign out </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
