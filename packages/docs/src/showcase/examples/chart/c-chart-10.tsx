"use client"

// Surface SVG links: runtime-shared definitions; per-shape definition instances.
import { scopeSvgReferences } from "../_shared/surface-runtime"
import { useId as useSvgShapeInstanceId } from "react"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { TrendingUpIcon } from "lucide-react"

import { type CSSProperties, type SVGProps } from "react"
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
  { month: "Feb", desktop: 600 },
  { month: "Mar", desktop: 500 },
  { month: "Apr", desktop: 600 },
  { month: "May", desktop: 400 },
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

const CustomDuotoneBar = (
  props: SVGProps<SVGRectElement> & { dataKey?: string }
) => {
  const svgShapeInstanceId = useSvgShapeInstanceId()
  const svgReferenceId = (value: string) => exampleId(svgShapeInstanceId + "-" + value)

  const { id: exampleId } = useExampleRuntime()

  const { fill, x, y, width, height, dataKey } = props

  return (
    <>
      <rect
        rx={4}
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="none"
        fill={scopeSvgReferences(`url(#duotone-bar-pattern-${dataKey})`, svgReferenceId, ["^duotone-bar-pattern-.*$"])}
      />
      <defs>
        <linearGradient
          key={dataKey}
          id={exampleId(svgShapeInstanceId + "-" + (`duotone-bar-pattern-${dataKey}`))}
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop offset="50%" stopColor={fill} stopOpacity={0.4} />
          <stop offset="50%" stopColor={fill} />
        </linearGradient>
      </defs>
    </>
  )
}

  function OriginalPattern() {
  const { copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {<ExampleText>Operational Efficiency </ExampleText>}<Badge variant="success-light" className="ml-2">
            <TrendingUpIcon aria-hidden="true" />
            +12.5%
          </Badge>
        </CardTitle>
        <CardDescription>{<ExampleText>Supply chain performance metrics</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={copyExampleData(chartConfig)}>
          <Recharts.BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              right: 12,
              bottom: 12,
              left: 12,
            }}
          >
            <Recharts.XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
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
            <Recharts.Bar
              dataKey="desktop"
              fill="var(--color-desktop)"
              shape={<CustomDuotoneBar />}
              radius={4}
            />
          </Recharts.BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
