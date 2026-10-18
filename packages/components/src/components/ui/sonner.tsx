"use client"

import * as React from "react"
import { Toaster as Sonner, toast, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, CircleXIcon, Loader2Icon } from "lucide-react"
import { useOptionalTheme } from "../theme-provider"
import { useRootRem } from "@/hooks/use-root-rem"
import { cn } from "@/lib/utils"

// Theme resolution: an explicit `theme` prop wins, then the surrounding
// ExUI ThemeProvider (read via the optional helper so this component
// stays mountable without a provider), then a `system` fallback. The
// public `useTheme` hook still throws outside <ThemeProvider />; this
// component deliberately does not.
const Toaster = ({ theme: explicitTheme, style, toastOptions, className, gap, offset, mobileOffset, icons, ...props }: ToasterProps) => {
  const rem = useRootRem()
  const [viewportWidth, setViewportWidth] = React.useState<number | null>(null)
  React.useEffect(() => {
    const update = () => setViewportWidth(window.innerWidth)
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])
  const providerTheme = useOptionalTheme()
  const resolvedTheme = explicitTheme ?? providerTheme ?? "system"

  return (
    <Sonner
      theme={resolvedTheme}
      className={cn("toaster group exui-toaster", viewportWidth !== null && viewportWidth <= 37.5 * rem && "exui-toaster-mobile", className)}
      gap={gap ?? 0.875 * rem}
      offset={offset ?? "1.5rem"}
      mobileOffset={mobileOffset ?? "1rem"}
      icons={{
        close: <svg xmlns="http://www.w3.org/2000/svg" width="0.75rem" height="0.75rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
        success: (
          <CircleCheckIcon
            aria-hidden="true"
            className="size-4"
          />
        ),
        info: (
          <InfoIcon
            aria-hidden="true"
            className="size-4"
          />
        ),
        warning: (
          <TriangleAlertIcon
            aria-hidden="true"
            className="size-4"
          />
        ),
        error: (
          <CircleXIcon
            aria-hidden="true"
            className="size-4"
          />
        ),
        loading: (
          <Loader2Icon
            aria-hidden="true"
            className="size-4 animate-spin"
          />
        ),
        ...icons,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius-2xl)",
          "--width": "22.25rem",
          ...style,
        } as React.CSSProperties
      }
      toastOptions={{
        ...toastOptions,
        classNames: {
          toast: "cn-toast",
          ...toastOptions?.classNames,
        },
      }}
      {...props}
    />
  )
}

// Re-export `toast` next to the Toaster so the package root exposes the
// exact Sonner instance bundled into this file: Vite collapses both uses of
// the "sonner" specifier into a single bundled module, so the Toaster and
// the re-exported `toast` see one queue. Keep this re-export inside the
// component file: the declaration then lands in
// types/components/ui/sonner.d.ts, which the exui-usage updater classifies
// into the Sonner family (same pattern as chart.tsx re-exporting Recharts).
export { Toaster, toast }
