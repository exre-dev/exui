"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { useState } from "react"
import { Badge } from "@exre/exui"
import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockWrapToggle,
} from "@exre/exui"

import { Separator } from "@exre/exui"

const code = `export const contentSecurityPolicy = "default-src 'self'; script-src 'self' 'nonce-{NONCE}' https://cdn.example.com; style-src 'self' 'nonce-{NONCE}'; img-src 'self' data: https://images.example.com; font-src 'self' data:; connect-src 'self' https://api.example.com"`

  function OriginalPattern() {
  // Controlled wrap: `wrap` plus `onWrapChange` moves the state up to the page,
  // so the toggle and the status chip read one value. `defaultWrap` would keep
  // it inside the block, leaving the header nothing to render.
  const [wrap, setWrap] = useState(true)

  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        wrap={wrap}
        onWrapChange={setWrap}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{<ExampleText>security-headers.ts</ExampleText>}</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-1.5">
            <Badge variant="info-light">{<ExampleText>{wrap ? "Wrapped" : "Scrolling"}</ExampleText>}</Badge>
            <CodeBlockWrapToggle size="xs" />
            <Separator orientation="vertical" className="h-4" />
            <CodeBlockCopyButton />
          </div>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "11.875rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
