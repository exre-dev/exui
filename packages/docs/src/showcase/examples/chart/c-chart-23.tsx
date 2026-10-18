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
  { skill: "Frontend", score: 92 },
  { skill: "Backend", score: 78 },
  { skill: "DevOps", score: 68 },
  { skill: "Design", score: 74 },
  { skill: "Testing", score: 85 },
  { skill: "Security", score: 62 },
]

const chartConfig = {
  score: { label: "Proficiency", color: "var(--chart-1)" },
} satisfies ChartConfig

  function OriginalPattern() {
  const { id: svgReferenceId } = useSvgReferenceRuntime()

  const { id: exampleId, copyData: copyExampleData } = useExampleRuntime()

  return (
    <Card className="w-full max-w-xs">
      <CardHeader className="items-center pb-0">
        <CardTitle>{<ExampleText>Skill Assessment</ExampleText>}</CardTitle>
        <CardDescription>{<ExampleText>Team proficiency across key areas</ExampleText>}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={copyExampleData(chartConfig)}
          className="mx-auto aspect-square max-h-[280px]"
        >
          <Recharts.RadarChart accessibilityLayer data={chartData}>
            <defs>
              <linearGradient id={exampleId("chart24-fill")} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-score)"
                  stopOpacity={0.5}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-score)"
                  stopOpacity={0.08}
                />
              </linearGradient>
              <filter
                id={exampleId("chart24-glow")}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Recharts.PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
            <Recharts.PolarGrid strokeDasharray="3 3" />
            <Recharts.Radar
              dataKey="score"
              fill={scopeSvgReferences("url(#chart24-fill)", svgReferenceId, ["^chart24-fill$","^chart24-glow$"])}
              stroke="var(--color-score)"
              strokeWidth={2}
              filter={scopeSvgReferences("url(#chart24-glow)", svgReferenceId, ["^chart24-fill$","^chart24-glow$"])}
              dot={{ r: 4, fill: "var(--color-score)", strokeWidth: 0 }}
            />
          </Recharts.RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
