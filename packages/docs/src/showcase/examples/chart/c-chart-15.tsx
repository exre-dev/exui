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
  { month: "January", connections: 48 },
  { month: "February", connections: 62 },
  { month: "March", connections: 62 },
  { month: "April", connections: 85 },
  { month: "May", connections: 85 },
  { month: "June", connections: 110 },
  { month: "July", connections: 110 },
  { month: "August", connections: 135 },
]

const chartConfig = {
  connections: {
    label: "Connections",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

  function OriginalPattern() {
  const { id: svgReferenceId } = useSvgReferenceRuntime()

  const { id: exampleId, copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {<ExampleText>Active Connections </ExampleText>}<Badge variant="success-light" className="ml-2">
            <TrendingUpIcon aria-hidden="true" />
            +257%
          </Badge>
        </CardTitle>
        <CardDescription>{<ExampleText>Server connection pool over time</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={copyExampleData(chartConfig)}>
          <Recharts.AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 2, bottom: 0, left: 2 }}
          >
            <defs>
              <pattern
                id={exampleId("chart15-dot-pattern")}
                patternUnits="userSpaceOnUse"
                width="5"
                height="5"
              >
                <rect
                  width="5"
                  height="5"
                  fill="var(--color-connections)"
                  opacity="0.08"
                />
                <circle
                  cx="2.5"
                  cy="2.5"
                  r="1"
                  fill="var(--color-connections)"
                  opacity="0.5"
                />
              </pattern>
              <linearGradient
                id={exampleId("chart15-stroke-grad")}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-connections)"
                  stopOpacity={0.4}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-connections)"
                  stopOpacity={1}
                />
              </linearGradient>
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
              dataKey="connections"
              type="stepAfter"
              fill={scopeSvgReferences("url(#chart15-dot-pattern)", svgReferenceId, ["^chart15-dot-pattern$","^chart15-stroke-grad$"])}
              stroke="var(--color-connections)"
              strokeWidth={2}
            />
          </Recharts.AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
