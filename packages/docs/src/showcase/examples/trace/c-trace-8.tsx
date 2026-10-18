import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BoxesIcon, FileCodeIcon, PackageIcon, PaletteIcon, TerminalIcon } from "lucide-react"
import { CodeBlock } from "@exre/exui"

import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@exre/exui"

const ITEMS = [
  { name: "@reui/c-data-grid-1", kind: "example" },
  { name: "@reui/data-grid", kind: "component" },
  { name: "button", kind: "ui" },
]

const FILES = [
  { path: "components/reui/data-grid/data-grid.tsx", created: true },
  { path: "components/ui/button.tsx", created: false },
  { path: "components/examples/c-data-grid-1.tsx", created: true },
]

const css = `@theme inline {
  --color-success: var(--success);
  --color-info: var(--info);
  --color-warning: var(--warning);
}`

// A file that already existed is kept, because shadcn add never overwrites a
// file without asking.
function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  const created = FILES.filter((file) => file.created)
  const skipped = FILES.filter((file) => !file.created)

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <TerminalIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Ran shadcn add @reui/c-data-grid-1</ExampleText></TraceTitle>
          <TraceDescription><ExampleText>9.4s</ExampleText></TraceDescription>
        </TraceLine>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <BoxesIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>Resolved {ITEMS.length} registry items</ExampleText></TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {ITEMS.map((item) => (
                <TraceLine key={item.name}>
                  <TraceTitle>
                    <code>{item.name}</code>
                  </TraceTitle>
                  <TraceDescription><ExampleText>{item.kind}</ExampleText></TraceDescription>
                </TraceLine>
              ))}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceLine>
          <TraceIcon>
            <PackageIcon aria-hidden="true"
            />
          </TraceIcon>
          <TraceTitle><ExampleText>Installed @tanstack/react-table</ExampleText></TraceTitle>
          <TraceDescription><ExampleText>6.1s</ExampleText></TraceDescription>
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <FileCodeIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>
                Wrote {created.length} files, kept {skipped.length}
              </ExampleText></TraceTitle>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              {FILES.map((file) =>
                file.created ? (
                  <a key={file.path} href="#">
                    <TraceLine>
                      <TraceTitle><ExampleText>Created {file.path}</ExampleText></TraceTitle>
                    </TraceLine>
                  </a>
                ) : (
                  <TraceLine key={file.path}>
                    <TraceTitle><ExampleText>Kept {file.path}, it already exists</ExampleText></TraceTitle>
                  </TraceLine>
                )
              )}
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceIcon>
                <PaletteIcon aria-hidden="true"
                />
              </TraceIcon>
              <TraceTitle><ExampleText>Updated app/globals.css</ExampleText></TraceTitle>
              <TraceDescription>+3</TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <CodeBlock
              code={css}
              language="css"
              diff={{ added: [2, 3, 4] }}
              label={copyExample("Changes to app/globals.css")}
            />
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
