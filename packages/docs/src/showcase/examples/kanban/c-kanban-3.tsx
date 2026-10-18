"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon, CircleDot, CircleIcon } from "lucide-react"

import { type ComponentProps, useState } from "react"
import { Badge } from "@exre/exui"
import {
  Frame,
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



interface Task {
  id: string
  title: string
  label: string
  labelVariant:
    | "primary-light"
    | "success-light"
    | "warning-light"
    | "destructive-light"
    | "info-light"
}

const COLUMNS: Record<string, { title: string; icon: React.ReactNode }> = {
  todo: {
    title: "To Do",
    icon: (
      <CircleIcon className="size-4" />
    ),
  },
  doing: {
    title: "In Progress",
    icon: (
      <CircleDot className="text-muted-foreground size-4" />
    ),
  },
  done: {
    title: "Done",
    icon: (
      <CircleCheckIcon className="size-4" />
    ),
  },
}

function TaskCard({
  task,
  asHandle,
  ...props
}: { task: Task; asHandle?: boolean } & Omit<
  ComponentProps<typeof KanbanItem>,
  "value" | "children"
>) {
  const content = (
    <Frame variant="ghost" spacing="sm" className="p-0 [--frame-radius:1rem] [--frame-panel-radius:1rem]">
      <FramePanel className="p-3">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">{<ExampleText>{task.title}</ExampleText>}</span>
          <Badge variant={task.labelVariant} size="sm" className="w-fit">
            {<ExampleText>{task.label}</ExampleText>}
          </Badge>
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
    todo: [
      {
        id: "1",
        title: "Design landing page",
        label: "Design",
        labelVariant: "info-light",
      },
      {
        id: "2",
        title: "Set up CI/CD pipeline",
        label: "DevOps",
        labelVariant: "warning-light",
      },
      {
        id: "3",
        title: "Write unit tests",
        label: "Testing",
        labelVariant: "success-light",
      },
    ],
    doing: [
      {
        id: "4",
        title: "Implement auth flow",
        label: "Backend",
        labelVariant: "primary-light",
      },
      {
        id: "5",
        title: "Create component library",
        label: "Frontend",
        labelVariant: "destructive-light",
      },
    ],
    done: [
      {
        id: "6",
        title: "Project kickoff",
        label: "Planning",
        labelVariant: "info-light",
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
        {<ExampleText>{Object.entries(columns).map(([columnId, tasks]) => {
          const col = COLUMNS[columnId] ?? { title: columnId, icon: null }
          return (
            <KanbanColumn key={columnId} value={columnId}>
              <Frame spacing="sm" className="h-full [--frame-radius:1.5rem]">
                <FrameHeader className="flex flex-row items-center gap-2">
                  {<ExampleText>{col.icon}</ExampleText>}
                  <FrameTitle>{<ExampleText>{col.title}</ExampleText>}</FrameTitle>
                  <Badge variant="outline" size="sm" className="ml-auto">
                    {<ExampleText>{tasks.length}</ExampleText>}
                  </Badge>
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
          )
        })}</ExampleText>}
      </KanbanBoard>
      <KanbanOverlay className="bg-muted/10 rounded-[1rem] border-2 border-dashed" />
    </Kanban>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
