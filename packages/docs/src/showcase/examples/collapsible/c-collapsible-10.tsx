"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronRightIcon, DownloadIcon, FileIcon, FolderIcon, TrashIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import { Card, CardContent, CardHeader } from "@exre/exui"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exre/exui"
import {
  Item,
  ItemActions,
  ItemMedia,
  ItemTitle,
} from "@exre/exui"
import { Tabs, TabsList, TabsTrigger } from "@exre/exui"


type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] }

const fileTree: FileTreeItem[] = [
  {
    name: "components",
    items: [
      {
        name: "ui",
        items: [
          { name: "button.tsx" },
          { name: "card.tsx" },
          { name: "dialog.tsx" },
        ],
      },
      { name: "login-form.tsx" },
    ],
  },
  {
    name: "lib",
    items: [{ name: "utils.ts" }, { name: "api.ts" }],
  },
  {
    name: "hooks",
    items: [{ name: "use-debounce.ts" }, { name: "use-local-storage.ts" }],
  },
  { name: "app.tsx" },
  { name: "package.json" },
]

function TreeItem({
  item,
  level = 0,
  selectedId,
  onSelect,
}: {
  item: FileTreeItem
  level?: number
  selectedId?: string | null
  onSelect?: (name: string) => void
}) {
  const { format: formatExample } = useExampleRuntime()
  const isFolder = "items" in item
  const isSelected = selectedId === item.name

  if (isFolder) {
    return (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Item asChild
            size="xs"
            className="hover:bg-accent aria-expanded:bg-accent cursor-pointer bg-transparent py-1.5 focus-visible:ring-inset"
            style={{ paddingLeft: `${level * 12 + 8}px`, color: "inherit", fontFamily: "inherit", textAlign: "left" }}
          >
            <button type="button">
              <ItemMedia variant="icon">
                <ChevronRightIcon aria-hidden="true" className="text-muted-foreground size-3 transition-transform in-aria-expanded:rotate-90" />
                <FolderIcon aria-hidden="true" className="text-muted-foreground group-hover/item:text-foreground size-3.5" />
              </ItemMedia>
              <ItemTitle className="text-sm">{<ExampleText>{item.name}</ExampleText>}</ItemTitle>
            </button>
          </Item>
        </CollapsibleTrigger>
        <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden motion-reduce:animate-none">
          <div className="flex flex-col gap-0.5 ps-1.5 pt-0.5">
            {<ExampleText>{item.items.map((child) => (
              <TreeItem
                key={child.name}
                item={child}
                level={level + 1}
                selectedId={selectedId}
                onSelect={onSelect}
              />
            ))}</ExampleText>}
          </div>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <Item
      className="group/item hover:bg-accent data-[active=true]:bg-accent py-1.5"
      data-active={isSelected}
      style={{ paddingLeft: `${level * 12 + 9}px` }}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3.5 rounded-sm border-0 bg-transparent p-0 text-left focus-visible:outline-2 focus-visible:outline-ring"
        style={{ color: "inherit", font: "inherit" }}
        onClick={() => onSelect?.(item.name)}
      >
        <ItemMedia variant="icon">
          <FileIcon aria-hidden="true" className="text-muted-foreground group-hover/item:text-foreground group-data-[active=true]/item:text-foreground size-4" />
        </ItemMedia>
        <ItemTitle className="text-secondary-foreground group-hover/item:text-foreground group-data-[active=true]/item:text-foreground text-sm">
          {<ExampleText>{item.name}</ExampleText>}
        </ItemTitle>
      </button>
      <ItemActions className="-mr-2 ml-auto gap-0 opacity-0 transition-opacity group-hover/item:opacity-100 group-focus-within/item:opacity-100 group-data-[active=true]/item:opacity-100">
        <Button aria-label={formatExample("Download {name}", { name: item.name })} size="icon-xs" variant="ghost">
          <DownloadIcon aria-hidden="true" />
        </Button>
        <Button aria-label={formatExample("Delete {name}", { name: item.name })} variant="ghost" size="icon-xs">
          <TrashIcon aria-hidden="true" />
        </Button>
      </ItemActions>
    </Item>
  )
}

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState("explorer")

  return (
    <div className="min-h-64 w-72">
      <Card size="sm" className="gap-1 p-1">
        <CardHeader className="p-0">
          <Tabs value={view} onValueChange={setView}>
            <TabsList className="bg-accent h-8 w-full p-1">
              <TabsTrigger value="explorer" id={exampleId("view-explorer")} aria-controls={exampleId("file-tree-panel")} className="text-xs">
                {<ExampleText>Explorer </ExampleText>}</TabsTrigger>
              <TabsTrigger value="outline" id={exampleId("view-outline")} aria-controls={exampleId("file-tree-panel")} className="text-xs">
                {<ExampleText>Outline </ExampleText>}</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0" role="tabpanel" id={exampleId("file-tree-panel")} aria-labelledby={exampleId(`view-${view}`)}>
          <div className="flex flex-col gap-0.5">
            {<ExampleText>{fileTree.map((item) => (
              <TreeItem
                key={item.name}
                item={item}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            ))}</ExampleText>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
