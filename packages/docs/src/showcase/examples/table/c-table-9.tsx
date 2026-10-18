
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"
import { Frame, FramePanel } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exre/exui"

const activities = [
  {
    user: "Sarah Chen",
    avatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    action: "Deployed",
    target: "production",
    badge: "success" as const,
    timestamp: "2 minutes ago",
  },
  {
    user: "Marcus Johnson",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    action: "Merged",
    target: "feat/auth-flow",
    badge: "info" as const,
    timestamp: "15 minutes ago",
  },
  {
    user: "Emily Park",
    avatar:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
    action: "Commented",
    target: "PR #284",
    badge: "outline" as const,
    timestamp: "1 hour ago",
  },
  {
    user: "David Kim",
    avatar:
      "/examples/reui/photos/823cc7e47d4e7e6cb0.jpg",
    action: "Reverted",
    target: "hotfix/api-crash",
    badge: "destructive" as const,
    timestamp: "3 hours ago",
  },
  {
    user: "Sofia Davis",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    action: "Created",
    target: "issue #512",
    badge: "secondary" as const,
    timestamp: "5 hours ago",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Frame spacing="xs">
        <FramePanel className="p-0!">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{<ExampleText>User</ExampleText>}</TableHead>
                <TableHead>{<ExampleText>Action</ExampleText>}</TableHead>
                <TableHead>{<ExampleText>Target</ExampleText>}</TableHead>
                <TableHead className="text-right">{<ExampleText>Time</ExampleText>}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {<ExampleText>{activities.map((activity, index) => (
                <ExampleRuntimeConsumer key={index} render={({copy: copyExample}) => (<TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarImage
                          src={activity.avatar}
                          alt={copyExample(activity.user)}
                        />
                        <AvatarFallback>
                          {<ExampleText>{activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}</ExampleText>}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {<ExampleText>{activity.user}</ExampleText>}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={activity.badge} size="sm">
                      {<ExampleText>{activity.action}</ExampleText>}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {<ExampleText>{activity.target}</ExampleText>}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right text-sm">
                    {<ExampleText>{activity.timestamp}</ExampleText>}
                  </TableCell>
                </TableRow>)} />
              ))}</ExampleText>}
            </TableBody>
          </Table>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
