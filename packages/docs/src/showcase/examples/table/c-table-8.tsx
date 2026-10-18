
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FolderIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
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


const projects = [
  {
    name: "Website Redesign",
    description: "Landing page and marketing site",
    status: "In Progress",
    statusVariant: "info-light" as const,
    team: [
      {
        src: "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
        fallback: "SC",
      },
      {
        src: "/examples/reui/photos/e93553df2422635515.jpg",
        fallback: "MJ",
      },
      {
        src: "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
        fallback: "EP",
      },
    ],
    extra: 2,
    dueDate: "Mar 15",
  },
  {
    name: "Mobile App v2",
    description: "iOS and Android release",
    status: "Review",
    statusVariant: "warning-light" as const,
    team: [
      {
        src: "/examples/reui/photos/823cc7e47d4e7e6cb0.jpg",
        fallback: "DK",
      },
      {
        src: "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
        fallback: "SD",
      },
    ],
    extra: 0,
    dueDate: "Apr 1",
  },
  {
    name: "API Integration",
    description: "Third-party payment gateway",
    status: "Completed",
    statusVariant: "success-light" as const,
    team: [
      {
        src: "/examples/reui/photos/e93553df2422635515.jpg",
        fallback: "MJ",
      },
    ],
    extra: 0,
    dueDate: "Feb 28",
  },
  {
    name: "Analytics Dashboard",
    description: "Real-time metrics and reporting",
    status: "Planning",
    statusVariant: "outline" as const,
    team: [
      {
        src: "/examples/reui/photos/c6e9e0d487c842b94f.jpg",
        fallback: "SC",
      },
      {
        src: "/examples/reui/photos/823cc7e47d4e7e6cb0.jpg",
        fallback: "DK",
      },
      {
        src: "/examples/reui/photos/dbc92c73c5f6acf737.jpg",
        fallback: "EP",
      },
    ],
    extra: 4,
    dueDate: "May 10",
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{<ExampleText>Project</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Status</ExampleText>}</TableHead>
            <TableHead>{<ExampleText>Team</ExampleText>}</TableHead>
            <TableHead className="text-right">{<ExampleText>Due</ExampleText>}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {<ExampleText>{projects.map((project) => (
            <TableRow key={project.name}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="bg-muted rounded-sm flex size-8 shrink-0 items-center justify-center">
                    <FolderIcon className="text-muted-foreground size-4" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{<ExampleText>{project.name}</ExampleText>}</span>
                    <span className="text-muted-foreground text-xs">
                      {<ExampleText>{project.description}</ExampleText>}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={project.statusVariant} size="sm">
                  {<ExampleText>{project.status}</ExampleText>}
                </Badge>
              </TableCell>
              <TableCell>
                <AvatarGroup>
                  {<ExampleText>{project.team.map((member) => (
                    <ExampleRuntimeConsumer key={member.fallback} render={({copy: copyExample}) => (<Avatar key={member.fallback} size="sm">
                      <AvatarImage src={member.src} alt={copyExample(member.fallback)} />
                      <AvatarFallback>{<ExampleText>{member.fallback}</ExampleText>}</AvatarFallback>
                    </Avatar>)} />
                  ))}</ExampleText>}
                  {<ExampleText>{project.extra > 0 && (
                    <AvatarGroupCount>
                      <span className="text-muted-foreground text-[0.625rem]">
                        +{<ExampleText>{project.extra}</ExampleText>}
                      </span>
                    </AvatarGroupCount>
                  )}</ExampleText>}
                </AvatarGroup>
              </TableCell>
              <TableCell className="text-muted-foreground text-right text-sm">
                {<ExampleText>{project.dueDate}</ExampleText>}
              </TableCell>
            </TableRow>
          ))}</ExampleText>}
        </TableBody>
      </Table>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
