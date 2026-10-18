
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@exre/exui"

const activities = [
  {
    name: "Sarah Chen",
    avatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    action: "deployed",
    target: "v2.4.1 to production",
    badge: "success-light" as const,
    time: "5 min ago",
  },
  {
    name: "Marcus Johnson",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    action: "merged",
    target: "feat/dark-mode into main",
    badge: "info-light" as const,
    time: "32 min ago",
  },
  {
    name: "Emily Park",
    avatar:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
    action: "opened",
    target: "issue #284: Fix mobile nav",
    badge: "warning-light" as const,
    time: "1 hour ago",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <ItemGroup>
        {<ExampleText>{activities.map((activity, index) => (
          <ExampleRuntimeConsumer key={index} render={({copy: copyExample}) => (<div key={index}>
            <Item variant="outline" size="xs">
              <ItemMedia>
                <Avatar size="sm">
                  <AvatarImage src={activity.avatar} alt={copyExample(activity.name)} />
                  <AvatarFallback>
                    {<ExampleText>{activity.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}</ExampleText>}
                  </AvatarFallback>
                </Avatar>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{<ExampleText>{activity.name}</ExampleText>}</ItemTitle>
                <ItemDescription>
                  <Badge
                    variant={activity.badge}
                    size="xs"
                    className="mr-1 align-text-top"
                  >
                    {<ExampleText>{activity.action}</ExampleText>}
                  </Badge>
                  {<ExampleText>{activity.target}</ExampleText>}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <span className="text-muted-foreground text-xs whitespace-nowrap">
                  {<ExampleText>{activity.time}</ExampleText>}
                </span>
              </ItemActions>
            </Item>
          </div>)} />
        ))}</ExampleText>}
      </ItemGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
