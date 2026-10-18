"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon, ChevronRightIcon, CopyIcon, LockIcon, MoreHorizontalIcon, PlusIcon, TrashIcon } from "lucide-react"

import { useState } from "react"
import { useCopyToClipboard } from "@exre/exui"
import {
  Frame,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exre/exui"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@exre/exui"


const initialKeys = [
  { id: "1", name: "Production", key: "AUDO230454*242SDIFPPL" },
  { id: "2", name: "Development", key: "DUILO30454*242SDIFUIP" },
  { id: "3", name: "Staging", key: "IPPODAS230454*242SDI" },
]

  function OriginalPattern() {
  const { language } = useExampleRuntime()
  const [keys, setKeys] = useState(initialKeys)

  return (
    <div className="h-54 w-full max-w-xs">
      <Frame stacked dense spacing="sm">
        <Collapsible defaultOpen>
          <FrameHeader className="flex w-full grow flex-row items-center justify-between gap-1.5 py-1!">
            <CollapsibleTrigger className="flex min-w-0 grow items-center gap-1.5 text-start">
              <ChevronRightIcon aria-hidden="true" className="text-muted-foreground size-4 transition-transform in-aria-expanded:rotate-90" />
              <FrameTitle className="text-sm font-medium">{<ExampleText>API Keys</ExampleText>}</FrameTitle>
            </CollapsibleTrigger>
            <Button
              variant="ghost"
              size="icon-sm"
              className="hover:border-border ml-auto"
              aria-label={language === "zh-CN" ? "添加 API 密钥" : "Add API key"}
            >
              <PlusIcon aria-hidden="true" />
            </Button>
          </FrameHeader>
          <CollapsibleContent>
            <FramePanel>
              <div className="flex flex-col gap-2.5">
                {<ExampleText>{keys.map((item) => (
                  <ApiKeyItem
                    key={item.id}
                    item={item}
                    onDelete={(id) =>
                      setKeys((k) => k.filter((i) => i.id !== id))
                    }
                  />
                ))}</ExampleText>}
              </div>
            </FramePanel>
          </CollapsibleContent>
        </Collapsible>
      </Frame>
    </div>
  )
}

function ApiKeyItem({
  item,
  onDelete,
}: {
  item: (typeof initialKeys)[0]
  onDelete: (id: string) => void
}) {
  const { copy: copyExample } = useExampleRuntime()
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  return (
    <div className="flex items-center justify-between gap-3.5">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="bg-muted border-border/60 flex size-5.5 shrink-0 items-center justify-center rounded-sm border-2">
            <LockIcon aria-hidden="true" className="size-3.25 text-emerald-600" />
          </div>
          <div className="w-10 truncate text-xs">{<ExampleText>{item.name}</ExampleText>}</div>
        </div>
        <div className="bg-muted w-40 truncate rounded-md px-2 py-1 text-xs">
          {<ExampleText>{item.key}</ExampleText>}
        </div>
      </div>
      <div className="flex shrink-0 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label={copyExample("More options")} variant="ghost" size="icon-xs">
              <MoreHorizontalIcon aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-32">
            <DropdownMenuItem onClick={() => copyToClipboard(item.key)}>
              {<ExampleText>{isCopied ? (
                <CheckIcon aria-hidden="true" className="text-green-500" />
              ) : (
                <CopyIcon aria-hidden="true" />
              )}</ExampleText>}
              <span>{<ExampleText>{isCopied ? "Copied" : "Copy key"}</ExampleText>}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => onDelete(item.id)}
            >
              <TrashIcon aria-hidden="true" />
              <span>{<ExampleText>Delete</ExampleText>}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
