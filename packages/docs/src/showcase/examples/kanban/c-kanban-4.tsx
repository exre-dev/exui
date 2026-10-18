"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { type ComponentProps, useState } from "react"
import { Badge } from "@exre/exui"
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Progress } from "@exre/exui"

interface Task {
  id: string
  title: string
  assignee: string
  assigneeAvatar: string
  progress: number
}

function TaskCard({
  task,
  asHandle,
  ...props
}: { task: Task; asHandle?: boolean } & Omit<
  ComponentProps<typeof KanbanItem>,
  "value" | "children"
>) {
  const { copy: copyExample } = useExampleRuntime()

  const content = (
    <Frame variant="ghost" spacing="xs" className="p-0 [--frame-radius:1rem] [--frame-panel-radius:1rem]">
      <FramePanel className="space-y-3 p-3">
        <p className="text-sm font-medium">{<ExampleText>{task.title}</ExampleText>}</p>
        <Progress value={task.progress} className="h-1" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Avatar className="size-5">
              <AvatarImage src={task.assigneeAvatar} alt={copyExample(task.assignee)} />
              <AvatarFallback className="text-[9px]">
                {<ExampleText>{task.assignee.charAt(0)}</ExampleText>}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-xs">
              {<ExampleText>{task.assignee}</ExampleText>}
            </span>
          </div>
          <span className="text-muted-foreground text-xs">
            {<ExampleText>{task.progress}</ExampleText>}%
          </span>
        </div>
      </FramePanel>
    </Frame>
  )

  return (
    <KanbanItem value={task.id} {...props}>
      {<ExampleText>{asHandle ? <KanbanItemHandle>{<ExampleText>{content}</ExampleText>}</KanbanItemHandle> : content}</ExampleText>}
    </KanbanItem>
  )
}

  function OriginalPattern() {
  const [columns, setColumns] = useState<Record<string, Task[]>>({
    planning: [
      {
        id: "1",
        title: "Research competitors",
        assignee: "Alex J.",
        assigneeAvatar:
          "/examples/reui/photos/e93553df2422635515.jpg",
        progress: 20,
      },
    ],
    active: [
      {
        id: "2",
        title: "Build dashboard",
        assignee: "Sarah C.",
        assigneeAvatar:
          "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
        progress: 65,
      },
      {
        id: "3",
        title: "API integration",
        assignee: "David K.",
        assigneeAvatar:
          "/examples/reui/photos/973d47055c51440af7.jpg",
        progress: 40,
      },
    ],
    completed: [
      {
        id: "4",
        title: "Setup repository",
        assignee: "Emma W.",
        assigneeAvatar:
          "/examples/reui/photos/046af0b7d159f9f4fd.jpg",
        progress: 100,
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
        {<ExampleText>{Object.entries(columns).map(([columnId, tasks]) => (
          <KanbanColumn key={columnId} value={columnId}>
            <Frame stacked spacing="sm" className="h-full [--frame-radius:1.5rem]">
              <FrameHeader>
                <div className="flex items-center justify-between">
                  <FrameTitle className="capitalize">{<ExampleText>{columnId}</ExampleText>}</FrameTitle>
                  <Badge variant="outline" size="sm">
                    {<ExampleText>{tasks.length}</ExampleText>}
                  </Badge>
                </div>
                <FrameDescription>
                  {<ExampleText>{columnId === "planning" && "Tasks being scoped"}</ExampleText>}
                  {<ExampleText>{columnId === "active" && "Currently in development"}</ExampleText>}
                  {<ExampleText>{columnId === "completed" && "Finished and deployed"}</ExampleText>}
                </FrameDescription>
              </FrameHeader>
              <KanbanColumnContent
                value={columnId}
                className="flex flex-col gap-2 p-0.5"
              >
                {<ExampleText>{tasks.map((task) => (
                  <TaskCard key={task.id} task={task} asHandle />
                ))}</ExampleText>}
              </KanbanColumnContent>
            </Frame>
          </KanbanColumn>
        ))}</ExampleText>}
      </KanbanBoard>
      <KanbanOverlay className="bg-muted/10 rounded-[1rem] border-2 border-dashed" />
    </Kanban>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
