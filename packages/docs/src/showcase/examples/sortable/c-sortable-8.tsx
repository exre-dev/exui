"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, createExampleRandom, type ExampleTimers } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { GripVerticalIcon } from "lucide-react"
const exampleRandom = createExampleRandom("c-sortable-8")
import { useState } from "react"
import { Badge } from "@exre/exui"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
  type SortableCommitMeta,
} from "@exre/exui"




interface Item {
  id: string
  title: string
}

const defaultItems: Item[] = [
  { id: "1", title: "Draft the release notes" },
  { id: "2", title: "Review open pull requests" },
  { id: "3", title: "Update the changelog" },
  { id: "4", title: "Cut the release tag" },
  { id: "5", title: "Announce on the blog" },
]

// Simulated backend. Swap for a tRPC mutation or fetch in your app. Rejects
// roughly one in four calls so the optimistic rollback is easy to see.
function persistOrder(_meta: SortableCommitMeta<Item>, exampleTimers: ExampleTimers): Promise<void> { return exampleTimers.delay(700).then(() => { if (exampleRandom() < 0.25) throw new Error("Network error") }) }

  function OriginalPattern() {
  const {format: formatExample, copy: copyExample, timers: exampleTimers, toast } = useExampleRuntime()

  const [items, setItems] = useState<Item[]>(defaultItems)

  // Sortable commits once, on drop. `onValueChange` has already applied the
  // new order optimistically; meta.previousValue is the order before the drag.
  const handleValueCommit = (next: Item[], meta: SortableCommitMeta<Item>) => {
    const previous = meta.previousValue
    const moved = next[meta.overIndex]

    toast.promise(persistOrder(meta, exampleTimers), {
      loading: "Saving order...",
      success: () => formatExample("Saved \"{title}\" at position {position}", { title: copyExample(moved.title), position: meta.overIndex + 1 }),
      error: () => {
        // Roll back to the pre-drag order. In production prefer a refetch here
        // so a newer drag is not clobbered by this snapshot.
        setItems(previous)
        return "Could not save the new order. Restored."
      },
    })
  }

  return (
    <div className="mx-auto w-full max-w-xl p-6">
      <Sortable
        value={items}
        onValueChange={setItems}
        onValueCommit={handleValueCommit}
        getItemValue={(item) => item.id}
        strategy="vertical"
        className="space-y-2"
      >
        {<ExampleText>{items.map((item, index) => (
          <SortableItem key={item.id} value={item.id}>
            <div className="bg-background border-border flex items-center gap-3 rounded-md border p-3">
              <SortableItemHandle className="text-muted-foreground hover:text-foreground">
                <GripVerticalIcon className="h-4 w-4" />
              </SortableItemHandle>
              <Badge variant="outline" className="tabular-nums">
                {<ExampleText>{index + 1}</ExampleText>}
              </Badge>
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                {<ExampleText>{item.title}</ExampleText>}
              </span>
            </div>
          </SortableItem>
        ))}</ExampleText>}
      </Sortable>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
