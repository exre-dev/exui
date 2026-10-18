"use client"

// Surface SVG links: runtime-shared definitions; per-shape definition instances.
import { scopeSvgReferences } from "../_shared/surface-runtime"
import { useExampleRuntime as useSvgReferenceRuntime } from "../_shared/example-runtime"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { TrendingUpIcon } from "lucide-react"

import { type SVGProps } from "react"
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
  { month: "Jan", desktop: 340 },
  { month: "Feb", desktop: 600 },
  { month: "Mar", desktop: 510 },
  { month: "Apr", desktop: 620 },
  { month: "May", desktop: 450 },
  { month: "Jun", desktop: 780 },
  { month: "Jul", desktop: 390 },
  { month: "Aug", desktop: 920 },
  { month: "Sep", desktop: 640 },
  { month: "Oct", desktop: 530 },
  { month: "Nov", desktop: 800 },
  { month: "Dec", desktop: 270 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

const True3DBar = (
  props: SVGProps<SVGRectElement> & {
    dataKey?: string
    payload?: unknown
    index?: number
  }
) => {
  const { id: svgReferenceId } = useSvgReferenceRuntime()

  const { x, y, width, height } = props
  const barX = x as number
  const barY = y as number
  const barWidth = width as number
  const barHeight = height as number

  // 3D perspective parameters
  const depth = Math.min(barWidth * 0.3, 15) // Maximum depth of 15px

  return (
    <g>
      {/* Back face */}
      <rect
        x={barX + depth}
        y={barY - depth}
        width={barWidth}
        height={barHeight}
        fill={scopeSvgReferences("url(#bar-gradient-back)", svgReferenceId, ["^bar-gradient-front$","^bar-gradient-back$","^bar-gradient-side$","^bar-gradient-top$"])}
        rx="3"
      />

      {/* Right side face */}
      <polygon
        points={`${barX + barWidth + 3},${barY - 3} ${barX + barWidth + depth - 3},${barY - depth + 3} ${barX + barWidth + depth - 3},${barY + barHeight - depth - 3} ${barX + barWidth + 3},${barY + barHeight - 3}`}
        fill={scopeSvgReferences("url(#bar-gradient-side)", svgReferenceId, ["^bar-gradient-front$","^bar-gradient-back$","^bar-gradient-side$","^bar-gradient-top$"])}
      />

      {/* Top face */}
      <polygon
        points={`${barX + 3},${barY - 3} ${barX + barWidth - 3},${barY - 3} ${barX + barWidth + depth - 3},${barY - depth + 3} ${barX + depth + 3},${barY - depth + 3}`}
        fill={scopeSvgReferences("url(#bar-gradient-top)", svgReferenceId, ["^bar-gradient-front$","^bar-gradient-back$","^bar-gradient-side$","^bar-gradient-top$"])}
      />

      {/* Front face */}
      <rect
        x={barX}
        y={barY}
        width={barWidth}
        height={barHeight}
        fill={scopeSvgReferences("url(#bar-gradient-front)", svgReferenceId, ["^bar-gradient-front$","^bar-gradient-back$","^bar-gradient-side$","^bar-gradient-top$"])}
        rx="3"
      />
    </g>
  )
}

  function OriginalPattern() {
  const { id: svgReferenceId1 } = useSvgReferenceRuntime()

  const { id: exampleId, copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {<ExampleText>Regional Performance </ExampleText>}<Badge variant="success-light" className="ml-2">
            <TrendingUpIcon aria-hidden="true" />
            +15.7%
          </Badge>
        </CardTitle>
        <CardDescription>{<ExampleText>Global sales distribution by region</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={copyExampleData(chartConfig)}>
          <Recharts.BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 40,
              right: 40,
              bottom: 20,
              left: 20,
            }}
            barCategoryGap="20%"
          >
            <defs>
              <linearGradient
                id={exampleId("bar-gradient-front")}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity="0.9"
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity="0.7"
                />
              </linearGradient>
              <linearGradient
                id={exampleId("bar-gradient-back")}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity="0.5"
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity="0.3"
                />
              </linearGradient>
              <linearGradient
                id={exampleId("bar-gradient-side")}
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity="0.6"
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity="0.4"
                />
              </linearGradient>
              <linearGradient id={exampleId("bar-gradient-top")} x1="0" y1="0" x2="1" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--chart-1)"
                  stopOpacity="0.7"
                />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity="0.5"
                />
              </linearGradient>
            </defs>
            <Recharts.XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
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
                        {<ExampleText>{Number(value).toLocaleString()}</ExampleText>}
                      </span>
                    </div>
                  )}
                />
              }
            />
            <Recharts.Bar
              dataKey="desktop"
              fill={scopeSvgReferences("url(#bar-gradient-front)", svgReferenceId1, ["^bar-gradient-front$","^bar-gradient-back$","^bar-gradient-side$","^bar-gradient-top$"])}
              shape={<True3DBar />}
            />
          </Recharts.BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
