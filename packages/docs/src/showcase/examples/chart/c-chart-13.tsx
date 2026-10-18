"use client"

// Surface SVG links: runtime-shared definitions; per-shape definition instances.
import { scopeSvgReferences } from "../_shared/surface-runtime"
import { useExampleRuntime as useSvgReferenceRuntime } from "../_shared/example-runtime"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { TrendingUpIcon } from "lucide-react"

import { type CSSProperties } from "react"
import { Badge } from "@exre/exui"
import { Recharts } from "@exre/exui"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@exre/exui"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@exre/exui"


const chartData = [
  { month: "January", visitors: 2400 },
  { month: "February", visitors: 2850 },
  { month: "March", visitors: 2600 },
  { month: "April", visitors: 3100 },
  { month: "May", visitors: 2900 },
  { month: "June", visitors: 3400 },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

  function OriginalPattern() {
  const { id: svgReferenceId } = useSvgReferenceRuntime()

  const { id: exampleId, copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {<ExampleText>Website Traffic </ExampleText>}<Badge variant="success-light" className="ml-2">
            <TrendingUpIcon aria-hidden="true" />
            +24.5%
          </Badge>
        </CardTitle>
        <CardDescription>{<ExampleText>Monthly unique visitor trends</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={copyExampleData(chartConfig)}>
          <Recharts.AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <linearGradient id={exampleId("chart13-gradient")} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-visitors)"
                  stopOpacity={0.05}
                />
              </linearGradient>
              <pattern
                id={exampleId("chart13-stripe")}
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
              >
                <path
                  d="M0,6 L6,0"
                  stroke="var(--color-visitors)"
                  strokeWidth="0.8"
                  opacity="0.15"
                />
              </pattern>
            </defs>
            <Recharts.CartesianGrid vertical={false} strokeDasharray="3 3" />
            <Recharts.XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="min-w-40 gap-2.5"
                  labelFormatter={(value) => (
                    <div className="border-border/50 mb-0.5 border-b pb-2">
                      <span className="text-xs font-medium">{<ExampleText>{value}</ExampleText>} 2024</span>
                    </div>
                  )}
                  formatter={(value, name) => (
                    <div className="flex w-full items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-xs bg-(--color-bg)"
                          style={
                            {
                              "--color-bg": `var(--color-${name})`,
                            } as CSSProperties
                          }
                        />
                        <span className="text-muted-foreground">
                          {<ExampleText>{chartConfig[name as keyof typeof chartConfig]
                            ?.label || name}</ExampleText>}
                        </span>
                      </div>
                      <span className="text-foreground font-semibold tabular-nums">
                        {<ExampleText>{Number(value).toLocaleString()}</ExampleText>}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Recharts.Area
              dataKey="visitors"
              type="natural"
              fill={scopeSvgReferences("url(#chart13-gradient)", svgReferenceId, ["^chart13-gradient$","^chart13-stripe$"])}
              stroke="var(--color-visitors)"
              strokeWidth={2}
            />
          </Recharts.AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
