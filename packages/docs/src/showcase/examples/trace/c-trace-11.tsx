import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BugIcon, ChevronRightIcon, GlobeIcon, MousePointer2Icon, NavigationIcon } from "lucide-react"
import { CodeBlock } from "@exre/exui"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"
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

const RESPONSE = `{
  "interval": "year",
  "plans": [
    {
      "id": "pro",
      "prices": {
        "month": { "priceId": "price_1Q8sZ7" },
        "year": { "priceId": "price_1Q8sZ9" }
      }
    },
    {
      "id": "team",
      "prices": {
        "month": { "priceId": "price_1Q8t02" }
      }
    }
  ]
}`

const FRAME = `export function CheckoutButton({ plan }: Props) {
  const { interval } = useBilling()
  const price = plan.prices[interval]
  const priceId = price.priceId
  return <Button onClick={() => checkout(priceId)}>Upgrade</Button>
}`

const FRAMEWORK_FRAMES = [
  "renderWithHooks",
  "updateFunctionComponent",
  "beginWork",
  "performUnitOfWork",
  "workLoopSync",
]

// The failing request opens in a dialog: its JSON body is too long to expand
// between one-line events.
function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()
  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceTitle><ExampleText>Breadcrumbs</ExampleText></TraceTitle>
              <TraceDescription><ExampleText>4 events</ExampleText></TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              <TraceLine>
                <TraceIcon>
                  <NavigationIcon aria-hidden="true"
                  />
                </TraceIcon>
                <TraceTitle><ExampleText>Navigated from / to /pricing</ExampleText></TraceTitle>
                <TraceDescription>14:31:02.118</TraceDescription>
              </TraceLine>
              <Dialog>
                <DialogTrigger>
                  <TraceLine>
                    <TraceIcon>
                      <GlobeIcon aria-hidden="true"
                      />
                    </TraceIcon>
                    <TraceTitle><ExampleText>GET /api/plans?interval=year, 200</ExampleText></TraceTitle>
                    <TraceDescription>14:31:05.611</TraceDescription>
                    <TraceIcon>
                      <ChevronRightIcon aria-hidden="true"
                      />
                    </TraceIcon>
                  </TraceLine>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>GET /api/plans?interval=year</DialogTitle>
                    <DialogDescription><ExampleText>
                      200 in 209 ms. The team plan has no yearly price.
                    </ExampleText></DialogDescription>
                  </DialogHeader>
                  <CodeBlock
                    code={RESPONSE}
                    language="json"
                    highlightedLines={[13, 14, 15]}
                    label={copyExample("Response body")}
                  />
                </DialogContent>
              </Dialog>
              <TraceLine>
                <TraceIcon>
                  <MousePointer2Icon aria-hidden="true"
                  />
                </TraceIcon>
                <TraceTitle><ExampleText>Clicked Upgrade on Team</ExampleText></TraceTitle>
                <TraceDescription>14:31:09.023</TraceDescription>
              </TraceLine>
              <TraceLine status="error">
                <TraceIcon>
                  <BugIcon aria-hidden="true"
                  />
                </TraceIcon>
                <TraceTitle><ExampleText>Threw TypeError in CheckoutButton</ExampleText></TraceTitle>
                <TraceDescription>14:31:09.024</TraceDescription>
              </TraceLine>
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
        <TraceCollapsible>
          <TraceCollapsibleTrigger>
            <TraceLine>
              <TraceTitle><ExampleText>Stack trace</ExampleText></TraceTitle>
              <TraceDescription><ExampleText>1 in app, 5 framework</ExampleText></TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <Trace>
              <TraceCollapsible defaultOpen>
                <TraceCollapsibleTrigger>
                  <TraceLine status="error">
                    <TraceTitle>
                      <code className="text-xs">CheckoutButton</code>
                    </TraceTitle>
                    <TraceDescription>
                      <code className="text-xs">checkout-button.tsx:14:25</code>
                    </TraceDescription>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <CodeBlock
                    code={FRAME}
                    language="tsx"
                    showLineNumbers
                    startLine={11}
                    lineLevels={{ error: [4] }}
                    label={copyExample("checkout-button.tsx around line 14")}
                  />
                </TraceCollapsibleContent>
              </TraceCollapsible>
              {/* Framework frames fold into one row: they are real, but
                    rarely where the fix is. */}
              <TraceCollapsible>
                <TraceCollapsibleTrigger>
                  <TraceLine>
                    <TraceTitle><ExampleText>
                      {FRAMEWORK_FRAMES.length} frames in react-dom
                    </ExampleText></TraceTitle>
                  </TraceLine>
                </TraceCollapsibleTrigger>
                <TraceCollapsibleContent>
                  <Trace>
                    {FRAMEWORK_FRAMES.map((frame) => (
                      <TraceLine key={frame}>
                        <TraceTitle>
                          <code className="text-xs">{frame}</code>
                        </TraceTitle>
                      </TraceLine>
                    ))}
                  </Trace>
                </TraceCollapsibleContent>
              </TraceCollapsible>
            </Trace>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
