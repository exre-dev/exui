
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLanguage,
  CodeBlockTitle,
} from "@exre/exui"

const code = `export function useTotals(items: Item[]) {
  return useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price, 0)
    const tax = Math.round(subtotal * 0.2)
    return { subtotal, tax, total: subtotal + tax }
  }, [items])
}`

  function OriginalPattern() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock code={code} language="typescript" showLineNumbers>
        <CodeBlockHeader>
          <CodeBlockTitle>{<ExampleText>use-totals.ts</ExampleText>}</CodeBlockTitle>
          <CodeBlockLanguage />
          <CodeBlockCopyButton className="ml-auto" />
        </CodeBlockHeader>
      </CodeBlock>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "16.875rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
