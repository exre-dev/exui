"use client"

import * as React from "react"
import * as Primitive from "recharts"
import { useRootRem } from "@/hooks/use-root-rem"

// Keep the dependency instance (and all chart contexts) shared. Only omitted
// UI geometry is adapted; explicit coordinates and numeric props stay pixels.
export * from "recharts"

export const XAxis: typeof Primitive.XAxis = (props) => {
  const rem = useRootRem()
  return <Primitive.XAxis {...props} height={props.height ?? 1.875 * rem}
    tickSize={props.tickSize ?? 0.375 * rem} tickMargin={props.tickMargin ?? 0.125 * rem}
    minTickGap={props.minTickGap ?? 0.3125 * rem} />
}

export const YAxis: typeof Primitive.YAxis = (props) => {
  const rem = useRootRem()
  return <Primitive.YAxis {...props} width={props.width ?? 3.75 * rem}
    tickSize={props.tickSize ?? 0.375 * rem} tickMargin={props.tickMargin ?? 0.125 * rem}
    minTickGap={props.minTickGap ?? 0.3125 * rem} />
}

export const CartesianAxis: typeof Primitive.CartesianAxis = React.forwardRef((props, ref) => {
  const rem = useRootRem()
  return <Primitive.CartesianAxis {...props} ref={ref}
    tickSize={props.tickSize ?? 0.375 * rem} tickMargin={props.tickMargin ?? 0.125 * rem}
    minTickGap={props.minTickGap ?? 0.3125 * rem} />
})

export const Tooltip: typeof Primitive.Tooltip = (props) => {
  const rem = useRootRem()
  return <Primitive.Tooltip {...props} offset={props.offset ?? 0.625 * rem}
    contentStyle={{ padding: "0.625rem", ...props.contentStyle }}
    itemStyle={{ paddingTop: "0.25rem", paddingBottom: "0.25rem", ...props.itemStyle }} />
}

export const Legend = React.memo((props: React.ComponentProps<typeof Primitive.Legend>) => {
  const rem = useRootRem()
  return <Primitive.Legend {...props} iconSize={props.iconSize ?? 0.875 * rem}
    content={props.content ?? (contentProps => <div className="exui-recharts-legend"><Primitive.DefaultLegendContent {...contentProps} /></div>)} />
})
