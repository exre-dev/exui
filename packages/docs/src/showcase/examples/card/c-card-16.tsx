
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, MoreVerticalIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Card className="w-full max-w-sm p-0">
      <CardContent className="p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <Badge variant="secondary">
            <CheckIcon aria-hidden="true" />
            {<ExampleText>Live </ExampleText>}</Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
                aria-label={copyExample("More options")}
              >
                <MoreVerticalIcon aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32" align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem>{<ExampleText>Edit</ExampleText>}</DropdownMenuItem>
                <DropdownMenuItem>{<ExampleText>Copy link</ExampleText>}</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm leading-tight font-medium">
              {<ExampleText>Integration name </ExampleText>}</h3>
            <Badge variant="success-light" size="sm">
              {<ExampleText>Installed </ExampleText>}</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {<ExampleText>Short description of the integration and what it does in one line. </ExampleText>}</p>
          <AvatarGroup>
            <Avatar className="size-6">
              <AvatarImage
                src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
                alt={copyExample("User 1")}
              />
              <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
            </Avatar>
            <Avatar className="size-6">
              <AvatarImage
                src="/examples/reui/photos/4349381d8a8476edbc.jpg"
                alt={copyExample("User 2")}
              />
              <AvatarFallback>{<ExampleText>MR</ExampleText>}</AvatarFallback>
            </Avatar>
            <Avatar className="size-6">
              <AvatarImage
                src="/examples/reui/photos/046af0b7d159f9f4fd.jpg"
                alt={copyExample("User 3")}
              />
              <AvatarFallback>{<ExampleText>EW</ExampleText>}</AvatarFallback>
            </Avatar>
            <AvatarGroupCount className="size-6 border text-[10px]">
              +3
            </AvatarGroupCount>
          </AvatarGroup>
        </div>
        <div className="border-t p-3">
          <Button variant="outline" className="w-full">
            {<ExampleText>Open </ExampleText>}</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
