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
  { plan: "free", users: 12800, fill: "var(--color-free)" },
  { plan: "starter", users: 5400, fill: "var(--color-starter)" },
  { plan: "pro", users: 3600, fill: "var(--color-pro)" },
  { plan: "enterprise", users: 1200, fill: "var(--color-enterprise)" },
]

const totalUsers = chartData.reduce((sum, d) => sum + d.users, 0)
const paidUsers = totalUsers - chartData[0].users
const conversionRate = ((paidUsers / totalUsers) * 100).toFixed(1)

const chartConfig = {
  users: { label: "Users" },
  free: { label: "Free", color: "var(--chart-5)" },
  starter: { label: "Starter", color: "var(--chart-3)" },
  pro: { label: "Pro", color: "var(--chart-2)" },
  enterprise: { label: "Enterprise", color: "var(--chart-1)" },
} satisfies ChartConfig

  function OriginalPattern() {
  const { copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="items-center pb-0">
        <CardTitle>{<ExampleText>Conversion Funnel</ExampleText>}</CardTitle>
        <CardDescription>
          {<ExampleText>{conversionRate}</ExampleText>}{<ExampleText>% of users are on paid plans </ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={copyExampleData(chartConfig)}
          className="mx-auto aspect-square max-h-[300px]"
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
              content={<ChartLegendContent nameKey="plan" />}
              className="-translate-y-2"
            />
            <Recharts.Pie
              data={chartData}
              dataKey="users"
              nameKey="plan"
              innerRadius={55}
              cornerRadius={5}
              paddingAngle={3}
              stroke="var(--background)"
              strokeWidth={3}
              activeShape={({
                outerRadius = 0,
                ...props
              }: Recharts.PieSectorDataItem) => (
                <Recharts.Sector {...props} outerRadius={outerRadius + 10} />
              )}
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
                          className="fill-foreground text-2xl font-bold tabular-nums"
                        >
                          {<ExampleText>{paidUsers.toLocaleString()}</ExampleText>}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-xs"
                        >
                          {<ExampleText>Paid Users </ExampleText>}</tspan>
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
