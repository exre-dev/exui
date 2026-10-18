"use client"


import { useExampleRuntime, ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { Badge } from "@exre/exui"
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@exre/exui"

import { Button } from "@exre/exui"

const code = `function applyDiscount(order: Order) {
  if (order.coupon) {
    const rate = COUPONS[order.coupon]
    order.total = order.total * (1 - rate)
  }
  return order
}`

/*
  Selection arrives sorted but not necessarily contiguous, so a range label
  would lie about a click on 2 and 6. Count is the only honest summary.
*/
function describe(lines: number[], formatExample: ReturnType<typeof useExampleRuntime>["format"]) {
  if (!lines.length) return formatExample("Select lines to ask about them", {})
  if (lines.length === 1) return formatExample("Ask about line {line}", { line: lines[0] })
  return formatExample("Ask about {count} lines", { count: lines.length })
}

  function OriginalPattern() {
  const { format: formatExample } = useExampleRuntime()

  const [selected, setSelected] = useState<number[]>([])

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        selectable
        selectedLines={selected}
        onSelectedLinesChange={setSelected}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{<ExampleText>discount.ts</ExampleText>}</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-1.5">
            {<ExampleText>{selected.length > 0 && (
              <Badge variant="primary-light">{<ExampleText>{selected.length}</ExampleText>} {<ExampleText> selected</ExampleText>}</Badge>
            )}</ExampleText>}
            <span className="text-muted-foreground text-xs">
              {<ExampleText>Click a line, shift-click to extend </ExampleText>}</span>
          </div>
        </CodeBlockHeader>
      </CodeBlock>

      <div className="flex items-center gap-2">
        <Button size="sm" disabled={!selected.length}>
          {<ExampleText><>{describe(selected, formatExample)}</></ExampleText>}
        </Button>
        {<ExampleText>{selected.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
            {<ExampleText>Clear </ExampleText>}</Button>
        )}</ExampleText>}
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "19.375rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
