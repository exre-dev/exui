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
  { priority: "critical", bugs: 14, fill: "url(#chart22-critical-pattern)" },
  { priority: "high", bugs: 28, fill: "var(--color-high)" },
  { priority: "medium", bugs: 42, fill: "url(#chart22-medium-pattern)" },
  { priority: "low", bugs: 36, fill: "var(--color-low)" },
]

const chartConfig = {
  bugs: { label: "Bugs" },
  critical: { label: "Critical", color: "var(--destructive)" },
  high: { label: "High", color: "var(--chart-4)" },
  medium: { label: "Medium", color: "var(--chart-3)" },
  low: { label: "Low", color: "var(--chart-5)" },
} satisfies ChartConfig

  function OriginalPattern() {
  const { id: svgReferenceId } = useSvgReferenceRuntime()

  const { id: exampleId, copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="items-center pb-0">
        <CardTitle>{<ExampleText>Bug Priority</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>Open issues by severity level</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={copyExampleData(chartConfig)}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <Recharts.PieChart accessibilityLayer>
            <defs>
              <pattern
                id={exampleId("chart22-critical-pattern")}
                patternUnits="userSpaceOnUse"
                width="6"
                height="6"
              >
                <rect
                  width="6"
                  height="6"
                  fill="var(--destructive)"
                  opacity="0.3"
                />
                <path
                  d="M0,6 L6,0 M-2,2 L2,-2 M4,8 L8,4"
                  stroke="var(--destructive)"
                  strokeWidth="1.5"
                  opacity="0.9"
                />
              </pattern>
              <pattern
                id={exampleId("chart22-medium-pattern")}
                patternUnits="userSpaceOnUse"
                width="5"
                height="5"
              >
                <rect
                  width="5"
                  height="5"
                  fill="var(--chart-3)"
                  opacity="0.2"
                />
                <circle
                  cx="2.5"
                  cy="2.5"
                  r="1.2"
                  fill="var(--chart-3)"
                  opacity="0.7"
                />
              </pattern>
            </defs>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="min-w-40 gap-2.5"
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
            <ChartLegend
              content={<ChartLegendContent nameKey="priority" />}
              className="-translate-y-2"
            />
            <Recharts.Pie
              data={scopeSvgReferences(chartData, svgReferenceId, ["^chart22-critical-pattern$","^chart22-medium-pattern$"])}
              dataKey="bugs"
              nameKey="priority"
              innerRadius={40}
              cornerRadius={4}
              paddingAngle={3}
              stroke="var(--background)"
              strokeWidth={3}
            >
              {<ExampleText>{chartData.map((entry) => (
                <Recharts.Cell key={entry.priority} fill={entry.fill} />
              ))}</ExampleText>}
            </Recharts.Pie>
          </Recharts.PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
