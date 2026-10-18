"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, createExampleRandom, type ExampleTimers } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { GripVerticalIcon } from "lucide-react"
const exampleRandom = createExampleRandom("c-kanban-6")
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
  type KanbanCommitMeta,
} from "@exre/exui"


import { Button } from "@exre/exui"
import { Card, CardContent, CardHeader, cn } from "@exre/exui"


interface Task {
  id: string
  title: string
  priority: "low" | "medium" | "high"
}

const COLUMN_TITLES: Record<string, string> = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
}

// Simulated backend. In a real app this would be a tRPC mutation or a fetch
// to your API. It rejects roughly one in four calls so the optimistic
// rollback path is easy to see.
function persistBoard(exampleTimers: ExampleTimers): Promise<void> { return exampleTimers.delay(700).then(() => { if (exampleRandom() < 0.25) throw new Error("Network error") }) }

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
      <CardContent className="flex items-center justify-between gap-2">
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
  const {format: formatExample, copy: copyExample,  timers: exampleTimers, toast } = useExampleRuntime()

  const [columns, setColumns] = useState<Record<string, Task[]>>({
    todo: [
      { id: "1", title: "Add authentication", priority: "high" },
      { id: "2", title: "Create API endpoints", priority: "medium" },
      { id: "3", title: "Write documentation", priority: "low" },
    ],
    inProgress: [
      { id: "4", title: "Design system updates", priority: "high" },
      { id: "5", title: "Implement dark mode", priority: "medium" },
    ],
    done: [{ id: "6", title: "Setup project", priority: "low" }],
  })

  // Fires once per completed drag, never during the hover preview. The first
  // argument is the final board (already shown, because onValueChange applied
  // it live), so we only need meta.previousValue to roll back on failure.
  const handleValueCommit = (
    _next: Record<string, Task[]>,
    meta: KanbanCommitMeta<Task>
  ) => {
    const previous = meta.previousValue
    const label =
      meta.kind === "column"
        ? formatExample("Reordered \"{column}\"", { column: copyExample(COLUMN_TITLES[meta.activeContainer] ?? meta.activeContainer) })
        : formatExample("Moved to \"{column}\"", { column: copyExample(COLUMN_TITLES[meta.overContainer] ?? meta.overContainer) })

    toast.promise(persistBoard(exampleTimers), {
      loading: "Saving board...",
      success: () => label,
      error: () => {
        // Roll back to the pre-drag arrangement. In production prefer a
        // refetch here so a newer drag is not clobbered by this snapshot.
        setColumns(previous)
        return "Could not save. Board restored."
      },
    })
  }

  return (
    <Kanban
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
      onValueCommit={handleValueCommit}
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
