"use client"

// Surface SVG links: runtime-shared definitions; per-shape definition instances.
import { scopeSvgReferences } from "../_shared/surface-runtime"
import { useExampleRuntime as useSvgReferenceRuntime } from "../_shared/example-runtime"

import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
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
  { week: "W1", signups: 64 },
  { week: "W2", signups: 78 },
  { week: "W3", signups: 52 },
  { week: "W4", signups: 92 },
  { week: "W5", signups: 85 },
  { week: "W6", signups: 110 },
  { week: "W7", signups: 98 },
  { week: "W8", signups: 125 },
]

const chartConfig = {
  signups: {
    label: "Signups",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

  function OriginalPattern() {
  const { id: svgReferenceId } = useSvgReferenceRuntime()

  const { id: exampleId, copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {<ExampleText>New Signups </ExampleText>}<Badge variant="success-light" className="ml-2">
            <TrendingUpIcon aria-hidden="true" />
            +144%
          </Badge>
        </CardTitle>
        <CardDescription>{<ExampleText>Weekly user registration trends</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={copyExampleData(chartConfig)}>
          <Recharts.AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 2, bottom: 0, left: 2 }}
          >
            <defs>
              <linearGradient id={exampleId("chart16-fill")} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-signups)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-signups)"
                  stopOpacity={0}
                />
              </linearGradient>
              <filter
                id={exampleId("chart16-dot-glow")}
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
              <filter
                id={exampleId("chart16-line-glow")}
                x="-10%"
                y="-20%"
                width="120%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <Recharts.CartesianGrid vertical={false} strokeDasharray="3 3" />
            <Recharts.XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="min-w-36 gap-2.5"
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
              dataKey="signups"
              type="natural"
              fill={scopeSvgReferences("url(#chart16-fill)", svgReferenceId, ["^chart16-fill$","^chart16-dot-glow$","^chart16-line-glow$"])}
              stroke="var(--color-signups)"
              strokeWidth={2}
              filter={scopeSvgReferences("url(#chart16-line-glow)", svgReferenceId, ["^chart16-fill$","^chart16-dot-glow$","^chart16-line-glow$"])}
              dot={scopeSvgReferences({
                r: 4,
                fill: "var(--color-signups)",
                strokeWidth: 2,
                stroke: "var(--background)",
                filter: "url(#chart16-dot-glow)",
              }, svgReferenceId, ["^chart16-fill$","^chart16-dot-glow$","^chart16-line-glow$"])}
              activeDot={{ r: 6, strokeWidth: 3, stroke: "var(--background)" }}
            />
          </Recharts.AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
