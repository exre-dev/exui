
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

const members = [
  {
    name: "Sarah Chen",
    email: "sarah@example.com",
    avatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    role: "Admin",
    roleVariant: "default" as const,
    status: "Active",
    statusVariant: "success-light" as const,
  },
  {
    name: "Marcus Johnson",
    email: "marcus@example.com",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    role: "Developer",
    roleVariant: "info-light" as const,
    status: "Active",
    statusVariant: "success-light" as const,
  },
  {
    name: "Emily Park",
    email: "emily@example.com",
    avatar:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
    role: "Designer",
    roleVariant: "warning-light" as const,
    status: "Away",
    statusVariant: "warning-light" as const,
  },
  {
    name: "David Kim",
    email: "david@example.com",
    avatar:
      "/examples/reui/photos/823cc7e47d4e7e6cb0.jpg",
    role: "Viewer",
    roleVariant: "outline" as const,
    status: "Offline",
    statusVariant: "outline" as const,
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
                <TableHead>{<ExampleText>Member</ExampleText>}</TableHead>
                <TableHead>{<ExampleText>Role</ExampleText>}</TableHead>
                <TableHead>{<ExampleText>Status</ExampleText>}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {<ExampleText>{members.map((member) => (
                <ExampleRuntimeConsumer key={member.email} render={({copy: copyExample}) => (<TableRow key={member.email}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar size="sm">
                        <AvatarImage src={member.avatar} alt={copyExample(member.name)} />
                        <AvatarFallback>
                          {<ExampleText>{member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}</ExampleText>}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {<ExampleText>{member.name}</ExampleText>}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {<ExampleText>{member.email}</ExampleText>}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.roleVariant} size="sm">
                      {<ExampleText>{member.role}</ExampleText>}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={member.statusVariant} size="sm">
                      {<ExampleText>{member.status}</ExampleText>}
                    </Badge>
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
