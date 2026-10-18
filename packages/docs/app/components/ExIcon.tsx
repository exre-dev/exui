import type { CSSProperties, HTMLAttributes } from "react"
import { base } from "../lib/urls"

type ExIconProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  size?: CSSProperties["width"]
}

export function ExIcon({ size = "2rem", className, style, ...props }: ExIconProps) {
  return <span
    {...props}
    className={`ex-glass docs-icon${className ? ` ${className}` : ""}`}
    style={{ ...style, width: size, height: size }}
    aria-hidden={props["aria-hidden"] ?? true}
  >
    <span className="docs-icon-mark" style={{ maskImage: `url("${base}icon.svg")` }} />
  </span>
}
