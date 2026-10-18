"use client"


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
  { status: "completed", count: 186, fill: "var(--color-completed)" },
  { status: "inProgress", count: 94, fill: "var(--color-inProgress)" },
  { status: "pending", count: 62, fill: "var(--color-pending)" },
  { status: "cancelled", count: 28, fill: "var(--color-cancelled)" },
]

const totalTasks = chartData.reduce((sum, d) => sum + d.count, 0)
const completionRate = Math.round((chartData[0].count / totalTasks) * 100)

const chartConfig = {
  count: { label: "Tasks" },
  completed: { label: "Completed", color: "var(--chart-1)" },
  inProgress: { label: "In Progress", color: "var(--chart-2)" },
  pending: { label: "Pending", color: "var(--chart-3)" },
  cancelled: { label: "Cancelled", color: "var(--chart-5)" },
} satisfies ChartConfig

  function OriginalPattern() {
  const { copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="items-center pb-0">
        <CardTitle>{<ExampleText>Task Status</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>Current sprint task breakdown</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={copyExampleData(chartConfig)}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <Recharts.PieChart accessibilityLayer>
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
              content={<ChartLegendContent nameKey="status" />}
              className="-translate-y-2"
            />
            <Recharts.Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              cornerRadius={5}
              paddingAngle={3}
              stroke="var(--background)"
              strokeWidth={3}
            >
              <Recharts.Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold tabular-nums"
                        >
                          {<ExampleText>{completionRate}</ExampleText>}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 22}
                          className="fill-muted-foreground text-xs"
                        >
                          {<ExampleText>Completed </ExampleText>}</tspan>
                      </text>
                    )
                  }
                }}
              />
            </Recharts.Pie>
          </Recharts.PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
