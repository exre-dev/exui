
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@exre/exui"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exre/exui"
import { Progress } from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="h-72 w-full max-w-xs">
      <Collapsible className="relative">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-sm">{<ExampleText>3 days remaining in cycle</ExampleText>}</CardTitle>
            <CardAction>
              <Button variant="outline" size="sm">
                {<ExampleText>Billing </ExampleText>}</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/60 border-border rounded-lg space-y-2 border p-3">
              <div className="flex justify-between text-sm font-medium">
                <span>$18.08 / $20</span>
                <span>$200</span>
              </div>
              <Progress value={90} className="bg-primary/20 h-1.5" />
            </div>

            <CollapsibleContent className="data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden motion-reduce:animate-none">
              <div className="flex flex-col gap-2.5 pt-6">
                {<ExampleText>{[
                  { label: "Requests", value: "$210.84" },
                  { label: "Active CPU", value: "$21.95" },
                  { label: "Events", value: "$21.20" },
                  { label: "Storage Usage", value: "$20.45" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex justify-between text-xs"
                  >
                    <span className="text-muted-foreground font-medium">
                      {<ExampleText>{item.label}</ExampleText>}
                    </span>
                    <span className="font-medium">{<ExampleText>{item.value}</ExampleText>}</span>
                  </div>
                ))}</ExampleText>}
              </div>
            </CollapsibleContent>
          </CardContent>
        </Card>

        <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2">
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              size="icon-sm"
              className="bg-background! rounded-full shadow-sm"
            >
              <ChevronDownIcon aria-hidden="true" className="size-3.5 transition-transform in-aria-expanded:rotate-180" />
              <span className="sr-only">{<ExampleText>Toggle details</ExampleText>}</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
