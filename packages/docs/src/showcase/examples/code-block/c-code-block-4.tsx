"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useEffect, useState } from "react"
import {
  CodeBlock,
  CodeBlockCopyButton,
  markdownFences,
} from "@exre/exui"
import {
  Frame,
  FrameDescription,
  FrameHeader,
  FramePanel,
  FrameTitle,
} from "@exre/exui"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"

const reply = `Use the streaming helper, then render it:

\`\`\`tsx
const { messages } = useChat({ api: "/api/chat" })
\`\`\`

That keeps the transcript in sync.`

/*
 * `markdownFences` flags a fence whose closing delimiter has not arrived as
 * `open`, which is what lets the transcript render the partial block mid
 * stream instead of dropping it until the closer lands.
 */
  function OriginalPattern() {
  const { copy: copyExample, timers: exampleTimers } = useExampleRuntime()

  const [length, setLength] = useState(0)

  useEffect(() => {
    if (length >= reply.length) return
    const id = exampleTimers.setTimeout(() => setLength((value) => value + 4), 30)
    return () => window.clearTimeout(id)
  }, [length, exampleTimers])

  const streamed = reply.slice(0, length)
  const streaming = length < reply.length

  return (
    <Frame dense className="w-full max-w-2xl">
      <FrameHeader>
        <FrameTitle>{<ExampleText>Assistant</ExampleText>}</FrameTitle>
        <FrameDescription>
          {<ExampleText>Generated responses may contain mistakes. </ExampleText>}</FrameDescription>
      </FrameHeader>

      <FramePanel className="flex flex-col gap-4">
        <div className="flex gap-3">
          <Avatar className="size-7 shrink-0 rounded-full">
            <AvatarImage
              src="/examples/reui/photos/c6e9e0d487c842b94f.jpg"
              alt={copyExample("Mira Stone")}
            />
            <AvatarFallback className="text-[10px] font-medium">
              {<ExampleText>MS </ExampleText>}</AvatarFallback>
          </Avatar>
          <p className="pt-1 text-sm">{<ExampleText>How do I stream chat messages?</ExampleText>}</p>
        </div>

        <div className="flex gap-3">
          <Avatar className="size-7 shrink-0 rounded-full">
            <AvatarFallback className="bg-muted text-muted-foreground text-[10px] font-medium">
              {<ExampleText>AI </ExampleText>}</AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-2 pt-1">
            {<ExampleText>{markdownFences(streamed).map((part, index) =>
              part.type === "text" ? (
                <p key={index} className="text-sm whitespace-pre-wrap">
                  {<ExampleText>{part.content}</ExampleText>}
                </p>
              ) : (
                <CodeBlock
                  key={index}
                  code={part.content}
                  language={part.language}
                  streaming={streaming && part.open}
                >
                  <CodeBlockCopyButton />
                </CodeBlock>
              )
            )}</ExampleText>}
          </div>
        </div>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "17.5rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
