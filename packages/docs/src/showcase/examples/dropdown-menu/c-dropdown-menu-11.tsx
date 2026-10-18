
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellIcon } from "lucide-react"

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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@exre/exui"


const notifications = [
  {
    id: "1",
    user: "Sarah",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    initials: "SC",
    action: "commented on",
    target: "Design System v2",
    time: "2 min ago",
    unread: false,
  },
  {
    id: "2",
    user: "James Wilson",
    avatar:
      "/examples/reui/photos/2bc0a75442d5cf52e4.jpg",
    initials: "JW",
    action: "shared",
    target: "Q4 Report",
    time: "1 hour ago",
    unread: true,
  },
  {
    id: "3",
    user: "Emily Davis",
    avatar:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
    initials: "ED",
    action: "invited you to",
    target: "Project Alpha",
    time: "3 hours ago",
    unread: false,
  },
]

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative" aria-label={copyExample("Notifications")}>
            <BellIcon aria-hidden="true" />
            <Badge
              variant="destructive"
              size="sm"
              className="absolute -top-1.5 -right-2 rounded-full px-1"
              aria-hidden="true"
            >
              8
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>{<ExampleText>Notifications</ExampleText>}</span>
              <button className="text-foreground text-xs font-normal underline-offset-2 hover:underline">
                {<ExampleText>Mark all as read </ExampleText>}</button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {<ExampleText>{notifications.map((notification) => (
                <ExampleRuntimeConsumer key={notification.id} render={({copy: copyExample}) => (<DropdownMenuItem
                  key={notification.id}
                  className="flex items-start gap-2 py-1"
                >
                  <Avatar className="mt-0.5 size-6 shrink-0">
                    <AvatarImage
                      src={notification.avatar}
                      alt={copyExample(notification.user)}
                    />
                    <AvatarFallback>{<ExampleText>{notification.initials}</ExampleText>}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 flex-col gap-px">
                    <p className="leading-snug">
                      <span className="font-medium">{<ExampleText>{notification.user}</ExampleText>}</span>{<ExampleText>{" "}</ExampleText>}
                      <span className="text-muted-foreground">
                        {<ExampleText>{notification.action}</ExampleText>}
                      </span>{<ExampleText>{" "}</ExampleText>}
                      <span className="font-medium">{<ExampleText>{notification.target}</ExampleText>}</span>
                    </p>
                    <span className="text-muted-foreground">
                      {<ExampleText>{notification.time}</ExampleText>}
                    </span>
                  </div>
                  {<ExampleText>{notification.unread && (
                    <span className="bg-primary mt-2 size-1.5 shrink-0 rounded-full" />
                  )}</ExampleText>}
                </DropdownMenuItem>)} />
              ))}</ExampleText>}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center">
              {<ExampleText>View all notifications </ExampleText>}</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
