
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Card, CardContent } from "@exre/exui"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@exre/exui"


const issues = [
  {
    id: "ISS-421",
    title: "Login page returns 500 on mobile",
    priority: "Critical",
    priorityVariant: "destructive" as const,
    priorityIcon: (
      <ArrowUpIcon className="size-3" aria-hidden="true" />
    ),
    label: "Bug",
    labelVariant: "destructive-light" as const,
    assignee: "Sarah Chen",
    assigneeAvatar:
      "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
    status: "Open",
    statusVariant: "info-light" as const,
  },
  {
    id: "ISS-420",
    title: "Add dark mode support",
    priority: "High",
    priorityVariant: "warning" as const,
    priorityIcon: (
      <ArrowUpIcon className="size-3" aria-hidden="true" />
    ),
    label: "Feature",
    labelVariant: "info-light" as const,
    assignee: "Marcus Johnson",
    assigneeAvatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    status: "In Progress",
    statusVariant: "warning-light" as const,
  },
  {
    id: "ISS-419",
    title: "Update user onboarding flow",
    priority: "Medium",
    priorityVariant: "info" as const,
    priorityIcon: (
      <ArrowRightIcon className="size-3" aria-hidden="true" />
    ),
    label: "Improvement",
    labelVariant: "success-light" as const,
    assignee: "Emily Park",
    assigneeAvatar:
      "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
    status: "In Review",
    statusVariant: "info-light" as const,
  },
  {
    id: "ISS-418",
    title: "Refactor API rate limiter module",
    priority: "Low",
    priorityVariant: "secondary" as const,
    priorityIcon: (
      <ArrowDownIcon className="size-3" aria-hidden="true" />
    ),
    label: "Tech Debt",
    labelVariant: "outline" as const,
    assignee: "David Kim",
    assigneeAvatar:
      "/examples/reui/photos/823cc7e47d4e7e6cb0.jpg",
    status: "Closed",
    statusVariant: "success-light" as const,
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Card className="p-0">
        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">{<ExampleText>ID</ExampleText>}</TableHead>
                <TableHead>{<ExampleText>Issue</ExampleText>}</TableHead>
                <TableHead>{<ExampleText>Assignee</ExampleText>}</TableHead>
                <TableHead>{<ExampleText>Status</ExampleText>}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {<ExampleText>{issues.map((issue) => (
                <ExampleRuntimeConsumer key={issue.id} render={({copy: copyExample}) => (<TableRow key={issue.id}>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {<ExampleText>{issue.id}</ExampleText>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">
                        {<ExampleText>{issue.title}</ExampleText>}
                      </span>
                      <Badge variant="outline" size="xs">
                        {<ExampleText>{issue.label}</ExampleText>}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">
                        <AvatarImage
                          src={issue.assigneeAvatar}
                          alt={copyExample(issue.assignee)}
                        />
                        <AvatarFallback>
                          {<ExampleText>{issue.assignee
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}</ExampleText>}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{<ExampleText>{issue.assignee}</ExampleText>}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={issue.statusVariant} size="sm">
                      {<ExampleText>{issue.status}</ExampleText>}
                    </Badge>
                  </TableCell>
                </TableRow>)} />
              ))}</ExampleText>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
