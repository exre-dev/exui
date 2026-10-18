"use client"

// Surface SVG links: runtime-shared definitions; per-shape definition instances.
import { scopeSvgReferences } from "../_shared/surface-runtime"
import { useExampleRuntime as useSvgReferenceRuntime } from "../_shared/example-runtime"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { type CSSProperties } from "react"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@exre/exui"

const chartData = [
  { month: "January", forecast: 2600, forecastArea: 2600 },
  { month: "February", forecast: 4200, forecastArea: 4200 },
  { month: "March", forecast: 2400, forecastArea: 2400 },
  { month: "April", forecast: 5000, forecastArea: 5000 },
  { month: "May", forecast: 2800, forecastArea: 2800 },
  { month: "June", forecast: 5800, forecastArea: 5800 },
  { month: "July", forecast: 3200, forecastArea: 3200 },
  { month: "August", forecast: 6200, forecastArea: 6200 },
  { month: "September", forecast: 3800, forecastArea: 3800 },
]

const chartConfig = {
  forecast: { label: "Forecast", color: "var(--chart-4)" },
  forecastArea: { label: "Forecast", color: "var(--chart-4)" },
} satisfies ChartConfig

  function OriginalPattern() {
  const { id: svgReferenceId } = useSvgReferenceRuntime()

  const { id: exampleId, copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{<ExampleText>Sales Forecast</ExampleText>}</CardTitle>
        <CardDescription>
          {<ExampleText>Projected sales performance with trends </ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={copyExampleData(chartConfig)}>
          <Recharts.ComposedChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 0, bottom: 0, left: 0 }}
          >
            <defs>
              <pattern
                id={exampleId("chart17-forecast-stripe")}
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
              >
                <rect
                  width="6"
                  height="6"
                  fill="var(--color-forecast)"
                  opacity="0.04"
                />
                <path
                  d="M0,6 L6,0"
                  stroke="var(--color-forecast)"
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
                          className="rounded-xs h-2.5 w-2.5 shrink-0 bg-(--color-bg)"
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
                        {<ExampleText>{value != null
                          ? `$${Number(value).toLocaleString()}`
                          : "—"}</ExampleText>}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Recharts.Area
              dataKey="forecastArea"
              type="natural"
              fill={scopeSvgReferences("url(#chart17-forecast-stripe)", svgReferenceId, ["^chart17-forecast-stripe$"])}
              stroke="none"
              connectNulls
              legendType="none"
              tooltipType="none"
            />
            <Recharts.Line
              dataKey="forecast"
              type="natural"
              stroke="var(--color-forecast)"
              strokeWidth={2.5}
              dot={false}
              connectNulls
            />
          </Recharts.ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
