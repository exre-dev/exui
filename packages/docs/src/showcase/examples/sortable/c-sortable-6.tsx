"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BarChart3Icon, CalendarIcon, FolderIcon, GripVerticalIcon, InboxIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react"

import { type ReactNode, useState } from "react"
import { Badge } from "@exre/exui"
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@exre/exui"



interface NavItem {
  id: string
  label: string
  icon: ReactNode
  count?: number
}

const defaultItems: NavItem[] = [
  {
    id: "1",
    label: "Dashboard",
    icon: (
      <LayoutDashboardIcon className="text-muted-foreground size-4" />
    ),
  },
  {
    id: "2",
    label: "Inbox",
    icon: (
      <InboxIcon className="text-muted-foreground size-4" />
    ),
    count: 5,
  },
  {
    id: "3",
    label: "Projects",
    icon: (
      <FolderIcon className="text-muted-foreground size-4" />
    ),
    count: 12,
  },
  {
    id: "4",
    label: "Calendar",
    icon: (
      <CalendarIcon className="text-muted-foreground size-4" />
    ),
  },
  {
    id: "5",
    label: "Analytics",
    icon: (
      <BarChart3Icon className="text-muted-foreground size-4" />
    ),
  },
  {
    id: "6",
    label: "Settings",
    icon: (
      <SettingsIcon className="text-muted-foreground size-4" />
    ),
  },
]

  function OriginalPattern() {
  const [items, setItems] = useState<NavItem[]>(defaultItems)

  return (
    <div className="mx-auto w-full max-w-xs">
      <Frame spacing="xs">
        <FrameHeader>
          <FrameTitle>{<ExampleText>Navigation</ExampleText>}</FrameTitle>
        </FrameHeader>
        <FramePanel className="p-2!">
          <Sortable
            value={items}
            onValueChange={setItems}
            getItemValue={(item) => item.id}
            strategy="vertical"
            className="space-y-0.5"
          >
            {<ExampleText>{items.map((item) => (
              <SortableItem key={item.id} value={item.id}>
                <div className="hover:bg-accent flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors">
                  <SortableItemHandle className="text-muted-foreground hover:text-foreground opacity-0 transition-opacity group-hover:opacity-100 [div:hover>&]:opacity-100">
                    <GripVerticalIcon className="size-3.5" />
                  </SortableItemHandle>
                  {<ExampleText>{item.icon}</ExampleText>}
                  <span className="flex-1 text-sm">{<ExampleText>{item.label}</ExampleText>}</span>
                  {<ExampleText>{item.count && (
                    <Badge variant="outline" size="sm" className="rounded-full">
                      {<ExampleText>{item.count}</ExampleText>}
                    </Badge>
                  )}</ExampleText>}
                </div>
              </SortableItem>
            ))}</ExampleText>}
          </Sortable>
        </FramePanel>
      </Frame>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
