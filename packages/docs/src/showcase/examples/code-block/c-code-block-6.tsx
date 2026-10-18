"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@exre/exui"

/**
 * Diff styling expressed as notation inside the source rather than as props.
 * `transformers` is a straight pass-through to shiki, so `@shikijs/transformers`
 * works without the primitive knowing about it. The directive above is required:
 * this object carries a method, and functions cannot cross a server boundary.
 */
const notationDiff = {
  line(node: { properties: Record<string, unknown> }, line: number) {
    if (line === 2) node.properties.class = "line diff remove"
    if (line === 3) node.properties.class = "line diff add"
  },
}

const code = `export function slugify(input: string) {
  return input.toLowerCase().replace(/ /g, "-")
  return input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-")
}`

/* The array itself must be module-scope: `transformers` is a reference dep
   of the highlight effect, so a fresh array each render re-tokenizes. */
const transformers = [notationDiff]

  function OriginalPattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock
        code={code}
        language="typescript"
        showLineNumbers
        transformers={transformers}
      >
        <CodeBlockHeader>
          <CodeBlockTitle>{<ExampleText>slugify.ts</ExampleText>}</CodeBlockTitle>
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "11.875rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
