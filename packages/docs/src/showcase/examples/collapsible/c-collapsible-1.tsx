
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronsUpDownIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@exre/exui"


  function OriginalPattern() {
  return (
    <div className="h-48 w-full max-w-xs">
      <Collapsible className="flex w-full flex-col gap-2">
        <div className="flex items-center justify-between gap-4 px-2">
          <h4 className="text-sm font-semibold">{<ExampleText>Order #4189</ExampleText>}</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <ChevronsUpDownIcon aria-hidden="true" className="size-4" />
              <span className="sr-only">{<ExampleText>Toggle details</ExampleText>}</span>
            </Button>
          </CollapsibleTrigger>
        </div>

        <div className="bg-muted/30 rounded-lg flex items-center justify-between border px-3 py-2 text-sm">
          <span className="text-muted-foreground">{<ExampleText>Status</ExampleText>}</span>
          <Badge variant="success-light">{<ExampleText>Shipped</ExampleText>}</Badge>
        </div>

        <CollapsibleContent className="flex flex-col gap-2">
          <div className="rounded-lg border px-3 py-2 text-sm">
            <p className="font-medium">{<ExampleText>Shipping address</ExampleText>}</p>
            <p className="text-muted-foreground">
              {<ExampleText>100 Market St, San Francisco </ExampleText>}</p>
          </div>
          <div className="rounded-lg border px-3 py-2 text-sm">
            <p className="font-medium">{<ExampleText>Items</ExampleText>}</p>
            <p className="text-muted-foreground">{<ExampleText>2x Studio Headphones</ExampleText>}</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
