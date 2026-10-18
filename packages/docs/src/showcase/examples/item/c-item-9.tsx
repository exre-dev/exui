
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MoreHorizontalIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@exre/exui"


const members = [
  {
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    role: "Admin",
    roleVariant: "default" as const,
  },
  {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    role: "Editor",
    roleVariant: "info-light" as const,
  },
  {
    name: "Emily Park",
    email: "emily@example.com",
    avatar:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
    role: "Viewer",
    roleVariant: "outline" as const,
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <ItemGroup>
        {<ExampleText>{members.map((member) => (
          <ExampleRuntimeConsumer key={member.email} render={({copy: copyExample}) => (<div key={member.email}>
            <Item variant="outline" size="xs">
              <ItemMedia>
                <Avatar>
                  <AvatarImage src={member.avatar} alt={copyExample(member.name)} />
                  <AvatarFallback>
                    {<ExampleText>{member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}</ExampleText>}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{<ExampleText>{member.name}</ExampleText>}</ItemTitle>
                <ItemDescription>{<ExampleText>{member.email}</ExampleText>}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Badge variant={member.roleVariant} size="sm">
                  {<ExampleText>{member.role}</ExampleText>}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-1 size-7">
                      <MoreHorizontalIcon  />
                      <span className="sr-only">{<ExampleText>Actions</ExampleText>}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>{<ExampleText>Change Role</ExampleText>}</DropdownMenuItem>
                    <DropdownMenuItem>{<ExampleText>View Profile</ExampleText>}</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      {<ExampleText>Remove </ExampleText>}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </ItemActions>
            </Item>
          </div>)} />
        ))}</ExampleText>}
      </ItemGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
