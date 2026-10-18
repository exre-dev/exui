"use client"

import * as React from "react"
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockExpandButton,
  CodeBlockHeader,
  CodeBlockTitle,
  useCodeBlockConfig,
} from "@exre/exui"

import { cn } from "@exre/exui"
import { ScrollArea, ScrollBar } from "@exre/exui"

/**
 * An excerpt that opens partway through a generated file, so the first row
 * reads 120 rather than 1. `startLine` only resets the gutter's CSS counter:
 * line specs keep addressing source lines, so moving the offset never
 * invalidates a `highlightedLines` value.
 */
const code = Array.from(
  { length: 26 },
  (_, index) =>
    `export const rule${index + 120} = { id: ${index + 120}, enabled: true }`
).join("\n")

/*
 * The collapse cap lives on the ScrollArea VIEWPORT and follows the block's
 * own `expanded` state through `useCodeBlockConfig`, so "Show more" releases
 * the cap and every scrollbar on this block is the shadcn one. `maxLines`
 * still marks the block collapsible; with the surface composed here it caps
 * nothing itself.
 */
function CollapsibleArea({ children }: { children: React.ReactNode }) {
  const { expanded } = useCodeBlockConfig("CollapsibleArea")

  return (
    <ScrollArea
      className={cn(
        "rounded-[inherit]",
        /* overflow-hidden makes collapsed mean collapsed - without it the
           reader could wheel through everything under the "Show more" fade.
           The 208px cap is chosen to LAND near maxLines' 8 rows, not derived
           from it. */
        !expanded &&
          "**:data-[slot=scroll-area-viewport]:max-h-52 **:data-[slot=scroll-area-viewport]:overflow-hidden"
      )}
    >
      {<ExampleText>{children}</ExampleText>}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

  function OriginalPattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        startLine={120}
        maxLines={8}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{<ExampleText>rules.generated.ts</ExampleText>}</CodeBlockTitle>
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
        <CollapsibleArea>
          <CodeBlockContent />
        </CollapsibleArea>
        <CodeBlockExpandButton />
      </CodeBlock>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "17.5rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
