
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { TrendingUpIcon } from "lucide-react"

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
  { month: "Jan", desktop: 300 },
  { month: "Feb", desktop: 550 },
  { month: "Mar", desktop: 400 },
  { month: "Apr", desktop: 630 },
  { month: "May", desktop: 460 },
  { month: "Jun", desktop: 780 },
  { month: "Jul", desktop: 390 },
  { month: "Aug", desktop: 925 },
  { month: "Sep", desktop: 645 },
  { month: "Oct", desktop: 530 },
  { month: "Nov", desktop: 700 },
  { month: "Dec", desktop: 270 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

  function OriginalPattern() {
  const { copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {<ExampleText>Revenue Growth </ExampleText>}<Badge variant="success-light" className="ml-2">
            <TrendingUpIcon aria-hidden="true" />
            +5.2%
          </Badge>
        </CardTitle>
        <CardDescription>{<ExampleText>Monthly revenue performance tracking</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={copyExampleData(chartConfig)}>
          <Recharts.BarChart accessibilityLayer data={chartData}>
            <Recharts.CartesianGrid vertical={false} />
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
                        <div className="bg-chart-1 h-2.5 w-2.5 shrink-0 rounded-xs" />
                        <span className="text-muted-foreground">
                          {<ExampleText>{chartConfig[name as keyof typeof chartConfig]
                            ?.label || name}</ExampleText>}
                        </span>
                      </div>
                      <span className="text-foreground font-semibold">
                        ${<ExampleText>{Number(value).toLocaleString()}</ExampleText>}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Recharts.Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
          </Recharts.BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
