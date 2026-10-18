"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { TrendingDownIcon } from "lucide-react"

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
  { month: "Jan", desktop: 342, mobile: 245 },
  { month: "Feb", desktop: 876, mobile: 654 },
  { month: "Mar", desktop: 512, mobile: 389 },
  { month: "Apr", desktop: 629, mobile: 521 },
  { month: "May", desktop: 458, mobile: 367 },
  { month: "Jun", desktop: 781, mobile: 598 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

  function OriginalPattern() {
  const { copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {<ExampleText>Inventory Levels </ExampleText>}<Badge variant="destructive-light" className="ml-2">
            <TrendingDownIcon aria-hidden="true" />
            -3.2%
          </Badge>
        </CardTitle>
        <CardDescription>{<ExampleText>Stock availability across warehouses</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={copyExampleData(chartConfig)}>
          <Recharts.BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -10,
              right: 20,
            }}
            barCategoryGap="30%"
          >
            <Recharts.YAxis
              type="category"
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <Recharts.XAxis
              type="number"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="min-w-40 gap-2.5"
                  labelFormatter={(value) => {
                    return (
                      <div className="border-border/50 mb-0.5 flex flex-col gap-0.5 border-b pb-2">
                        <span className="text-xs font-medium">
                          {<ExampleText>{value}</ExampleText>} 2024
                        </span>
                      </div>
                    )
                  }}
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
                      <span className="text-foreground font-semibold">
                        {<ExampleText>{Number(value).toLocaleString()}</ExampleText>}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Recharts.Bar dataKey="desktop" fill="var(--color-desktop)" radius={2} />
            <Recharts.Bar dataKey="mobile" fill="var(--color-mobile)" radius={2} />
          </Recharts.BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
