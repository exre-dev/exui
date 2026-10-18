"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { GripVerticalIcon } from "lucide-react"

import { type ComponentProps, useState } from "react"
import { Badge } from "@exre/exui"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import { Card, CardContent, CardHeader, cn } from "@exre/exui"


interface Task {
  id: string
  title: string
  priority: "low" | "medium" | "high"
  description?: string
  assignee?: string
  assigneeAvatar?: string
  dueDate?: string
}

const COLUMN_TITLES: Record<string, string> = {
  backlog: "Backlog",
  inProgress: "In Progress",
  done: "Done",
}

interface TaskCardProps extends Omit<
  ComponentProps<typeof KanbanItem>,
  "value" | "children"
> {
  task: Task
  asHandle?: boolean
  isOverlay?: boolean
}

function TaskCard({ task, asHandle, isOverlay, ...props }: TaskCardProps) {
  const cardContent = (
    <Card size="sm" className="rounded-[1rem]">
      <CardContent className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 text-sm font-medium">{<ExampleText>{task.title}</ExampleText>}</span>
          <Badge
            variant={
              task.priority === "high"
                ? "destructive-light"
                : task.priority === "medium"
                  ? "primary-light"
                  : "warning-light"
            }
            className="pointer-events-none h-5 shrink-0 rounded-sm px-1.5 text-xs capitalize"
          >
            {<ExampleText>{task.priority}</ExampleText>}
          </Badge>
        </div>
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          {<ExampleText>{task.assignee && (
            <div className="flex items-center gap-1">
              <Avatar className="size-4">
                <AvatarImage src={task.assigneeAvatar} />
                <AvatarFallback>{<ExampleText>{task.assignee.charAt(0)}</ExampleText>}</AvatarFallback>
              </Avatar>
              <span className="line-clamp-1">{<ExampleText>{task.assignee}</ExampleText>}</span>
            </div>
          )}</ExampleText>}
          {<ExampleText>{task.dueDate && (
            <time className="text-[10px] whitespace-nowrap tabular-nums">
              {<ExampleText>{task.dueDate}</ExampleText>}
            </time>
          )}</ExampleText>}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <KanbanItem value={task.id} {...props}>
      {<ExampleText>{asHandle && !isOverlay ? (
        <KanbanItemHandle>{<ExampleText>{cardContent}</ExampleText>}</KanbanItemHandle>
      ) : (
        cardContent
      )}</ExampleText>}
    </KanbanItem>
  )
}

interface TaskColumnProps extends Omit<
  ComponentProps<typeof KanbanColumn>,
  "children"
> {
  tasks: Task[]
  isOverlay?: boolean
}

function TaskColumn({ value, tasks, isOverlay, ...props }: TaskColumnProps) {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <KanbanColumn value={value} {...props}>
      <Card size="sm" className="mb-2.5 rounded-[1.5rem]">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-semibold">
              {<ExampleText>{COLUMN_TITLES[value]}</ExampleText>}
            </span>
            <Badge variant="outline">{<ExampleText>{tasks.length}</ExampleText>}</Badge>
          </div>
          <KanbanColumnHandle asChild>
            <Button aria-label={copyExample("Drag column")} size="icon-xs" variant="ghost">
              <GripVerticalIcon  />
            </Button>
          </KanbanColumnHandle>
        </CardHeader>
        <CardContent>
          <KanbanColumnContent value={value} className="flex flex-col gap-2.5">
            {<ExampleText>{tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                asHandle={!isOverlay}
                isOverlay={isOverlay}
              />
            ))}</ExampleText>}
          </KanbanColumnContent>
        </CardContent>
      </Card>
    </KanbanColumn>
  )
}

  function OriginalPattern() {
  const [columns, setColumns] = useState<Record<string, Task[]>>({
    backlog: [
      {
        id: "1",
        title: "Add authentication",
        priority: "high",
        assignee: "Alex Johnson",
        assigneeAvatar:
          "/examples/reui/photos/e93553df2422635515.jpg",
        dueDate: "Jan 10, 2025",
      },
      {
        id: "2",
        title: "Create API endpoints",
        priority: "medium",
        assignee: "Sarah Chen",
        assigneeAvatar:
          "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
        dueDate: "Jan 15, 2025",
      },
      {
        id: "3",
        title: "Write documentation",
        priority: "low",
        assignee: "Michael Rodriguez",
        assigneeAvatar:
          "/examples/reui/photos/4349381d8a8476edbc.jpg",
        dueDate: "Jan 20, 2025",
      },
    ],
    inProgress: [
      {
        id: "4",
        title: "Design system updates",
        priority: "high",
        assignee: "Emma Wilson",
        assigneeAvatar:
          "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
        dueDate: "Aug 25, 2025",
      },
      {
        id: "5",
        title: "Implement dark mode",
        priority: "medium",
        assignee: "David Kim",
        assigneeAvatar:
          "/examples/reui/photos/973d47055c51440af7.jpg",
        dueDate: "Aug 25, 2025",
      },
    ],
    done: [
      {
        id: "7",
        title: "Setup project",
        priority: "high",
        assignee: "Aron Thompson",
        assigneeAvatar:
          "/examples/reui/photos/df73db9a2c25069a42.jpg",
        dueDate: "Sep 25, 2025",
      },
      {
        id: "8",
        title: "Initial commit",
        priority: "low",
        assignee: "James Brown",
        assigneeAvatar:
          "/examples/reui/photos/c75592a667f30cfd44.jpg",
        dueDate: "Sep 20, 2025",
      },
    ],
  })

  return (
    <Kanban
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
    >
      <KanbanBoard className="grid auto-rows-fr grid-cols-3">
        {<ExampleText>{Object.entries(columns).map(([columnValue, tasks]) => (
          <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
        ))}</ExampleText>}
      </KanbanBoard>
      <KanbanOverlay>
        {({ variant }) => (
          <div
            className={cn(
              "bg-muted/10 size-full border-2 border-dashed",
              variant === "column"
                ? "rounded-[1.5rem]"
                : "rounded-[1rem]"
            )}
          />
        )}
      </KanbanOverlay>
    </Kanban>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
