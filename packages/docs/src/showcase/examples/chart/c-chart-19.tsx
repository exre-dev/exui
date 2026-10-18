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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@exre/exui"

const chartData = [
  { source: "direct", visits: 4200, fill: "var(--color-direct)" },
  { source: "search", visits: 3600, fill: "var(--color-search)" },
  { source: "social", visits: 2800, fill: "var(--color-social)" },
  { source: "email", visits: 1900, fill: "var(--color-email)" },
  { source: "referral", visits: 1400, fill: "var(--color-referral)" },
]

const total = chartData.reduce((s, d) => s + d.visits, 0)

const chartConfig = {
  visits: { label: "Visits" },
  direct: { label: "Direct", color: "var(--chart-1)" },
  search: { label: "Search", color: "var(--chart-2)" },
  social: { label: "Social", color: "var(--chart-3)" },
  email: { label: "Email", color: "var(--chart-4)" },
  referral: { label: "Referral", color: "var(--chart-5)" },
} satisfies ChartConfig

  function OriginalPattern() {
  const { id: svgReferenceId } = useSvgReferenceRuntime()

  const { id: exampleId, copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="items-center pb-0">
        <CardTitle>{<ExampleText>Traffic Sources</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>Where your visitors come from</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={copyExampleData(chartConfig)}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <Recharts.PieChart accessibilityLayer>
            <defs>
              <filter
                id={exampleId("chart19-3d")}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow
                  dx="0"
                  dy="8"
                  stdDeviation="5"
                  floodOpacity="0.2"
                />
              </filter>
              <linearGradient id={exampleId("gradient-direct")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
              </linearGradient>
              <linearGradient id={exampleId("gradient-search")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.8}
                />
              </linearGradient>
              <linearGradient id={exampleId("gradient-social")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--chart-3)"
                  stopOpacity={0.8}
                />
              </linearGradient>
              <linearGradient id={exampleId("gradient-email")} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--chart-4)"
                  stopOpacity={0.8}
                />
              </linearGradient>
              <linearGradient
                id={exampleId("gradient-referral")}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="var(--chart-5)" stopOpacity={1} />
                <stop
                  offset="100%"
                  stopColor="var(--chart-5)"
                  stopOpacity={0.8}
                />
              </linearGradient>
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
            <Recharts.Pie
              data={chartData}
              dataKey="visits"
              nameKey="source"
              innerRadius={65}
              outerRadius={95}
              cornerRadius={8}
              paddingAngle={4}
              stroke="var(--background)"
              strokeWidth={4}
              style={scopeSvgReferences({ filter: "url(#chart19-3d)" }, svgReferenceId, ["^chart19-3d$","^gradient-direct$","^gradient-search$","^gradient-social$","^gradient-email$","^gradient-referral$"])}
            >
              {<ExampleText>{chartData.map((entry, index) => (
                <Recharts.Cell
                  key={`cell-${index}`}
                  fill={scopeSvgReferences(`url(#gradient-${entry.source})`, svgReferenceId, ["^chart19-3d$","^gradient-direct$","^gradient-search$","^gradient-social$","^gradient-email$","^gradient-referral$"])}
                />
              ))}</ExampleText>}
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
                          {<ExampleText>{(total / 1000).toFixed(1)}</ExampleText>}{<ExampleText>k </ExampleText>}</tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 22}
                          className="fill-muted-foreground text-xs"
                        >
                          {<ExampleText>Total Visits </ExampleText>}</tspan>
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
