
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ExternalLinkIcon, MoreHorizontalIcon, SettingsIcon, UserIcon } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <Card className="w-full max-w-xs gap-2 pt-5">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{<ExampleText>Need a help in Claim?</ExampleText>}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label={copyExample("More options")} variant="ghost" size="icon">
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
      </CardHeader>
      <CardContent className="mb-2">
        <p>
          {<ExampleText>Go to this step by step guideline process on how to certify for your weekly benefits: </ExampleText>}</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">
          <Avatar className="size-5">
            <AvatarImage src="/examples/reui/photos/0a10b9bc070f3bdf60.jpg" alt={copyExample("@shadcn")} />
            <AvatarFallback>{<ExampleText>CH</ExampleText>}</AvatarFallback>
          </Avatar>
          <span className="text-xs">{<ExampleText>@shadcn</ExampleText>}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
