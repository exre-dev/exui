
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@exre/exui"
import type { CodeBlockLine } from "@exre/exui"

const source = `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a`

/**
 * Lines built without shiki, to show the shape any highlighter can produce.
 *
 * The same array is what a server component gets back from `highlightCode` and
 * hands over the RSC boundary, so this is also the pre-highlighted path: the
 * client never loads a grammar.
 */
const lines: CodeBlockLine[] = source.split("\n").map((text, index) => ({
  number: index + 1,
  text,
  tokens: text
    .split(/(\b(?:def|for|in|return)\b)/)
    .filter(Boolean)
    .map((content) => ({
      content,
      ...(/^(def|for|in|return)$/.test(content)
        ? { color: "#cf222e", colorDark: "#ff7b72" }
        : {}),
    })),
}))

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="w-full max-w-2xl">
      <CodeBlock lines={lines} showLineNumbers label={copyExample("Python code")}>
        <CodeBlockHeader>
          <CodeBlockTitle>{<ExampleText>fib.py</ExampleText>}</CodeBlockTitle>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-muted-foreground text-xs">
              {<ExampleText>No shiki on the client </ExampleText>}</span>
            <CodeBlockCopyButton value={source} />
          </div>
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "13.75rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
