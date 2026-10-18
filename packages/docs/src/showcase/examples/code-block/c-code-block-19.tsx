
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockTitle,
} from "@exre/exui"

import { ScrollArea, ScrollBar } from "@exre/exui"

const code = `export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const toggle = () => setTheme((value) => (value === "light" ? "dark" : "light"))
  return { theme, toggle }
}`

/*
 * The "css-variables" theme emits var(--code-token-*) references instead of
 * hex colors, so the palette below IS the syntax theme: swap these lines for
 * your design tokens and the highlighting follows your brand in both modes.
 */
const paletteClass = [
  "[--code-token-keyword:var(--color-rose-600,oklch(58.6%_0.253_17.585))]",
  "[--code-token-function:var(--color-violet-600,oklch(54.1%_0.281_293.009))]",
  "[--code-token-string:var(--color-emerald-600,oklch(59.6%_0.145_163.225))]",
  "[--code-token-string-expression:var(--color-emerald-600,oklch(59.6%_0.145_163.225))]",
  "[--code-token-constant:var(--color-sky-600,oklch(58.8%_0.158_241.966))]",
  "[--code-token-parameter:var(--color-amber-600,oklch(66.6%_0.179_58.318))]",
  "[--code-token-comment:var(--muted-foreground)]",
  "[--code-token-punctuation:var(--foreground)]",
  "[--code-foreground:var(--foreground)]",
  "dark:[--code-token-keyword:var(--color-rose-400,oklch(71.2%_0.194_13.428))]",
  "dark:[--code-token-function:var(--color-violet-400,oklch(70.2%_0.183_293.541))]",
  "dark:[--code-token-string:var(--color-emerald-400,oklch(76.5%_0.177_163.223))]",
  "dark:[--code-token-string-expression:var(--color-emerald-400,oklch(76.5%_0.177_163.223))]",
  "dark:[--code-token-constant:var(--color-sky-400,oklch(74.6%_0.16_232.661))]",
  "dark:[--code-token-parameter:var(--color-amber-400,oklch(82.8%_0.189_84.429))]",
].join(" ")

  function OriginalPattern() {
  return (
    <CodeBlock
      code={code}
      language="typescript"
      showLineNumbers
      themes={{ light: "css-variables", dark: "css-variables" }}
      className={"w-full max-w-2xl " + paletteClass}
    >
      <CodeBlockHeader>
        <CodeBlockTitle>{<ExampleText>use-theme.ts</ExampleText>}</CodeBlockTitle>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="text-muted-foreground text-xs">
            {<ExampleText>Colors from design tokens </ExampleText>}</span>
          <CodeBlockCopyButton />
        </div>
      </CodeBlockHeader>

      {/* The ScrollArea composes INSIDE the block, so the block's own border
          and per-style radius stay the container, the header above never
          scrolls, and `max-h` means the area grows to the content instead of
          stretching past a short file. */}
      <ScrollArea className="rounded-[inherit] **:data-[slot=scroll-area-viewport]:max-h-72">
        <CodeBlockContent />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </CodeBlock>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><div className="relative w-full" style={{ minHeight: "13.75rem" }}><OriginalPattern /></div></ExampleRuntimeProvider> }
