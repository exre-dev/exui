
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SquareTerminalIcon } from "lucide-react"

import { cn } from "@exre/exui"
import { Card, CardContent } from "@exre/exui"


const stats = [
  { label: "Environment", value: "Production" },
  { label: "Region", value: "us-east-1" },
  { label: "Version", value: "v2.4.0" },
  { label: "Status", value: "Healthy" },
]

  function OriginalPattern() {
  return (
    <Card className="mx-auto w-full max-w-xs overflow-hidden p-0">
      <CardContent className="flex flex-col items-center p-0">
        {/* Header with gradient */}
        <div className="flex w-full flex-col items-center justify-center bg-linear-to-b from-fuchsia-50/80 to-transparent py-12">
          <div className="relative mb-6">
            <div className="absolute inset-0 scale-150 rounded-full bg-fuchsia-400/10 blur-2xl" />
            <SquareTerminalIcon aria-hidden="true" className="relative size-16 text-fuchsia-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-foreground text-lg font-semibold">
            {<ExampleText>Deployment Successful </ExampleText>}</h3>
          <p className="text-muted-foreground text-sm">{<ExampleText>Your app is now live</ExampleText>}</p>
        </div>

        {/* Status Rows */}
        <div className="w-full space-y-1 px-4 pb-4">
          {<ExampleText>{stats.map((item, index) => (
            <div
              key={item.label}
              className={cn(
                "rounded-lg flex items-center justify-between px-3 py-2.5",
                index % 2 === 0 && "bg-muted/40"
              )}
            >
              <span className="text-foreground text-sm font-medium">
                {<ExampleText>{item.label}</ExampleText>}
              </span>
              <span className="text-muted-foreground text-sm">
                {<ExampleText>{item.value}</ExampleText>}
              </span>
            </div>
          ))}</ExampleText>}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
