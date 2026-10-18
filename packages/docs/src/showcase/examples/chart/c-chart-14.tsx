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
  { month: "January", organic: 1200, paid: 580, referral: 320 },
  { month: "February", organic: 1450, paid: 620, referral: 380 },
  { month: "March", organic: 1380, paid: 540, referral: 420 },
  { month: "April", organic: 1650, paid: 710, referral: 460 },
  { month: "May", organic: 1520, paid: 680, referral: 390 },
  { month: "June", organic: 1800, paid: 750, referral: 510 },
]

const chartConfig = {
  organic: { label: "Organic", color: "var(--chart-1)" },
  paid: { label: "Paid", color: "var(--chart-2)" },
  referral: { label: "Referral", color: "var(--chart-3)" },
} satisfies ChartConfig

  function OriginalPattern() {
  const { id: svgReferenceId } = useSvgReferenceRuntime()

  const { copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {<ExampleText>Traffic Sources </ExampleText>}<Badge variant="success-light" className="ml-2">
            <TrendingUpIcon aria-hidden="true" />
            +18.3%
          </Badge>
        </CardTitle>
        <CardDescription>{<ExampleText>Visitor acquisition by channel</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={copyExampleData(chartConfig)}>
          <Recharts.AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              {<ExampleText>{(["organic", "paid", "referral"] as const).map((key) => (
                <ExampleRuntimeConsumer key={key} render={({id: exampleId}) => (<linearGradient
                  key={key}
                  id={exampleId(`chart14-${key}`)}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.5}
                  />
                  <stop
                    offset="95%"
                    stopColor={`var(--color-${key})`}
                    stopOpacity={0.1}
                  />
                </linearGradient>)} />
              ))}</ExampleText>}
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
              dataKey="referral"
              type="natural"
              stackId="1"
              fill={scopeSvgReferences("url(#chart14-referral)", svgReferenceId, ["^chart14-.*$"])}
              fillOpacity={0.4}
              stroke="var(--color-referral)"
              strokeWidth={0.8}
              strokeDasharray="3 3"
            />
            <Recharts.Area
              dataKey="paid"
              type="natural"
              stackId="1"
              fill={scopeSvgReferences("url(#chart14-paid)", svgReferenceId, ["^chart14-.*$"])}
              fillOpacity={0.4}
              stroke="var(--color-paid)"
              strokeWidth={0.8}
              strokeDasharray="3 3"
            />
            <Recharts.Area
              dataKey="organic"
              type="natural"
              stackId="1"
              fill={scopeSvgReferences("url(#chart14-organic)", svgReferenceId, ["^chart14-.*$"])}
              fillOpacity={0.4}
              stroke="var(--color-organic)"
              strokeWidth={2}
            />
          </Recharts.AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
