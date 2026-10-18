"use client"

// Surface SVG links: runtime-shared definitions; per-shape definition instances.
import { scopeSvgReferences } from "../_shared/surface-runtime"
import { useExampleRuntime as useSvgReferenceRuntime } from "../_shared/example-runtime"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

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
  { metric: "Speed", value: 88 },
  { metric: "Reliability", value: 94 },
  { metric: "Scalability", value: 72 },
  { metric: "Cost", value: 68 },
  { metric: "Security", value: 82 },
  { metric: "DX", value: 78 },
]

const chartConfig = {
  value: { label: "Score", color: "var(--chart-2)" },
} satisfies ChartConfig

  function OriginalPattern() {
  const { id: svgReferenceId } = useSvgReferenceRuntime()

  const { id: exampleId, copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="items-center pb-0">
        <CardTitle>{<ExampleText>Infrastructure Score</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>Platform performance metrics</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={copyExampleData(chartConfig)}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <Recharts.RadarChart accessibilityLayer data={chartData}>
            <defs>
              <linearGradient id={exampleId("chart25-fill")} x1="0" y1="0" x2="1" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.45}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-value)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <filter
                id={exampleId("chart25-glow")}
                x="-15%"
                y="-15%"
                width="130%"
                height="130%"
              >
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Recharts.PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <Recharts.PolarGrid strokeDasharray="3 3" />
            <Recharts.PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
            />
            <Recharts.Radar
              dataKey="value"
              fill={scopeSvgReferences("url(#chart25-fill)", svgReferenceId, ["^chart25-fill$","^chart25-glow$"])}
              stroke="var(--color-value)"
              strokeWidth={2.5}
              filter={scopeSvgReferences("url(#chart25-glow)", svgReferenceId, ["^chart25-fill$","^chart25-glow$"])}
              dot={{
                r: 4,
                fill: "var(--background)",
                strokeWidth: 2.5,
                stroke: "var(--color-value)",
              }}
            />
          </Recharts.RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
