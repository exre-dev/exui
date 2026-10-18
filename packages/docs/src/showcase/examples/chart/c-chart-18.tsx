"use client"

// Surface SVG links: runtime-shared definitions; per-shape definition instances.
import { scopeSvgReferences } from "../_shared/surface-runtime"
import { useExampleRuntime as useSvgReferenceRuntime } from "../_shared/example-runtime"

import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
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
  { month: "January", api: 1820, webhook: 1640 },
  { month: "February", api: 2340, webhook: 2160 },
  { month: "March", api: 1960, webhook: 1880 },
  { month: "April", api: 2780, webhook: 2540 },
  { month: "May", api: 2100, webhook: 1920 },
  { month: "June", api: 3120, webhook: 2880 },
  { month: "July", api: 2540, webhook: 2320 },
  { month: "August", api: 3480, webhook: 3160 },
  { month: "September", api: 2860, webhook: 2580 },
  { month: "October", api: 2420, webhook: 2140 },
  { month: "November", api: 3240, webhook: 2960 },
  { month: "December", api: 2680, webhook: 2440 },
]

const chartConfig = {
  api: {
    label: "API Calls",
    color: "var(--chart-1)",
  },
  webhook: {
    label: "Webhooks",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

function CrosshatchPattern({ config }: { config: ChartConfig }) {
  const entries = Object.entries(config).filter(([, v]) => v.color)
  return (
    <>
      {entries.map(([key, { color }]) => (
        <ExampleRuntimeConsumer key={key} render={({id: exampleId}) => (<pattern
          key={key}
          id={exampleId(`chart18-crosshatch-${key}`)}
          x="0"
          y="0"
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
        >
          <path d="M0,8 L8,0" stroke={color} strokeWidth="0.8" opacity="0.4" />
          <path d="M0,0 L8,8" stroke={color} strokeWidth="0.8" opacity="0.2" />
        </pattern>)} />
      ))}
    </>
  )
}

  function OriginalPattern() {
  const { id: svgReferenceId } = useSvgReferenceRuntime()

  const { copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {<ExampleText>Request Volume </ExampleText>}<Badge variant="success-light" className="ml-2">
            <TrendingUpIcon aria-hidden="true" />
            +12.8%
          </Badge>
        </CardTitle>
        <CardDescription>
          {<ExampleText>API and webhook traffic over 12 months </ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={copyExampleData(chartConfig)}>
          <Recharts.AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
          >
            <Recharts.CartesianGrid vertical={false} strokeDasharray="3 3" />
            <Recharts.XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
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
            <defs>
              <CrosshatchPattern config={copyExampleData(chartConfig)} />
            </defs>
            <Recharts.Area
              dataKey="webhook"
              type="natural"
              fill={scopeSvgReferences("url(#chart18-crosshatch-webhook)", svgReferenceId, ["^chart18-crosshatch-.*$"])}
              fillOpacity={0.5}
              stroke="var(--color-webhook)"
              stackId="a"
              strokeWidth={1}
            />
            <Recharts.Area
              dataKey="api"
              type="natural"
              fill={scopeSvgReferences("url(#chart18-crosshatch-api)", svgReferenceId, ["^chart18-crosshatch-.*$"])}
              fillOpacity={0.5}
              stroke="var(--color-api)"
              stackId="a"
              strokeWidth={1}
            />
          </Recharts.AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
