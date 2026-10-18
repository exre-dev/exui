"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useEffect, useState } from "react"
import { Badge } from "@exre/exui"
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
} from "@exre/exui"

import { Button } from "@exre/exui"
import { ScrollArea, ScrollBar } from "@exre/exui"

/*
 * The sample deliberately omits its import statements: the registry verifier
 * scans raw file text for import shapes and would read them as real package
 * dependencies of the example, which then fails `registry:verify`.
 */
const target = `export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: openai("gpt-5"),
    system: "You are a concise assistant.",
    messages,
    temperature: 0.2,
    maxOutputTokens: 1024,
  })

  result.usage.then((usage) => {
    metrics.record("chat.tokens", usage.totalTokens)
  })

  return result.toUIMessageStreamResponse()
}`

  function OriginalPattern() {
  const { timers: exampleTimers } = useExampleRuntime()

  const [length, setLength] = useState(0)

  useEffect(() => {
    if (length >= target.length) return
    const id = exampleTimers.setTimeout(() => setLength((value) => value + 3), 24)
    return () => window.clearTimeout(id)
  }, [length, exampleTimers])

  const done = length >= target.length

  return (
    <div className="flex w-full max-w-2xl flex-col gap-3">
      <CodeBlock
        code={target.slice(0, length)}
        language="typescript"
        showLineNumbers
        streaming={!done}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{<ExampleText>app/api/chat/route.ts</ExampleText>}</CodeBlockTitle>
          <CodeBlockLanguage />
          <div className="ml-auto flex items-center gap-1.5">
            <Badge variant={done ? "success-light" : "info-light"}>
              {<ExampleText>{done ? "Complete" : "Generating"}</ExampleText>}
            </Badge>
            <CodeBlockCopyButton />
          </div>
        </CodeBlockHeader>

        {/* The consumer's ScrollArea owns the scroll, and stick-to-bottom
            follows it: the primitive resolves the nearest scrolling ancestor
            per chunk, so the caret stays in view exactly as it does with the
            built-in viewport. */}
        <ScrollArea className="rounded-[inherit] **:data-[slot=scroll-area-viewport]:max-h-60">
          <CodeBlockContent />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CodeBlock>

      <Button
        variant="outline"
        size="sm"
        className="self-start"
        onClick={() => setLength(0)}
      >
        {<ExampleText>Replay stream </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "21.875rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
