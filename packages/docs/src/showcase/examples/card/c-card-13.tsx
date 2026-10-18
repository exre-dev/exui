"use client"


import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ChevronDownIcon } from "lucide-react"

import { useState } from "react"

import { cn } from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import { Progress } from "@exre/exui"


  function OriginalPattern() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Card className="relative w-full max-w-md gap-6 overflow-visible pb-1">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>{<ExampleText>3 days remaining in cycle</ExampleText>}</CardTitle>
        <CardAction>
          <Button variant="outline" size="sm">
            {<ExampleText>Billing </ExampleText>}</Button>
        </CardAction>
      </CardHeader>
      <CardContent
        className={cn(
          "relative space-y-5 overflow-hidden transition-all duration-500 ease-in-out",
          isOpen ? "max-h-[500px]" : "max-h-48"
        )}
      >
        {/* Usage Details */}
        <div className="bg-muted/60 rounded-lg space-y-3 p-4">
          <div className="text-muted-foreground flex justify-between text-xs font-medium">
            <span>{<ExampleText>Included Credit</ExampleText>}</span>
            <span>{<ExampleText>On-Demand Charges</ExampleText>}</span>
          </div>
          <div className="flex justify-between text-lg font-bold">
            <span>$18.08 / $20</span>
            <span>$0</span>
          </div>
          <Progress value={90} className="h-2" />
        </div>

        {/* Additional Usage Details */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">{<ExampleText>Requests</ExampleText>}</span>
            <span className="text-muted-foreground">$210.84</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">{<ExampleText>Active CPU</ExampleText>}</span>
            <span className="text-muted-foreground">$21.95</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">{<ExampleText>Events</ExampleText>}</span>
            <span className="text-muted-foreground">$21.20</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">{<ExampleText>Storage Usage</ExampleText>}</span>
            <span className="text-muted-foreground">$20.45</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">{<ExampleText>Bandwidth</ExampleText>}</span>
            <span className="text-muted-foreground">$0.00</span>
          </div>
        </div>

        {/* Faded background effect for collapsed state */}
        <div
          className={cn(
            "from-background pointer-events-none absolute inset-x-0 bottom-0 h-20 rounded-b-4xl bg-linear-to-t to-transparent transition-opacity duration-300",
            isOpen ? "opacity-0" : "opacity-100"
          )}
        />
      </CardContent>

      {/* Toggle button */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
        <Button
          variant="outline"
          size="icon-sm"
          className="bg-background hover:bg-background rounded-full shadow-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDownIcon aria-hidden="true" className={cn(
              "transition-transform duration-300",
              isOpen && "rotate-180"
            )} />
          <span className="sr-only">{<ExampleText>Toggle card</ExampleText>}</span>
        </Button>
      </div>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
