import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { glassClassName, type GlassSurfaceProps } from "@/lib/glass"

const badgeVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center w-fit border border-transparent font-medium whitespace-nowrap outline-none transition-shadow",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-3",
  ],
  {
    variants: {
      variant: {
        // Deepen these fills for small labels while retaining the existing
        // semantic foreground tokens and ordinary className overrides.
        default: "bg-[color-mix(in_oklab,var(--primary)_85%,black)] text-[color:var(--primary-foreground)]",
        outline: "border-border bg-transparent dark:bg-input/32",
        secondary: "bg-secondary text-secondary-foreground",
        info: "bg-info text-info-foreground",
        success: "bg-success text-success-foreground",
        warning: "bg-warning text-warning-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        focus: "bg-[color-mix(in_oklab,var(--focus)_70%,black)] text-[color:var(--focus-foreground)]",
        invert: "bg-invert text-invert-foreground",
        "primary-light":
          "border-primary/10 bg-primary/10 text-[color:color-mix(in_oklab,var(--primary)_55%,var(--foreground))] dark:border-primary/25 dark:bg-primary/15",
        "warning-light":
          "border-warning/15 bg-warning/10 text-[color:color-mix(in_oklab,var(--warning)_55%,var(--foreground))] dark:border-warning/25 dark:bg-warning/15",
        "success-light":
          "border-success/15 bg-success/10 text-[color:color-mix(in_oklab,var(--success)_55%,var(--foreground))] dark:border-success/25 dark:bg-success/15",
        "info-light":
          "border-info/15 bg-info/10 text-[color:color-mix(in_oklab,var(--info)_55%,var(--foreground))] dark:border-info/25 dark:bg-info/15",
        "destructive-light":
          "border-destructive/15 bg-destructive/10 text-[color:color-mix(in_oklab,var(--destructive)_55%,var(--foreground))] dark:border-destructive/25 dark:bg-destructive/15",
        "invert-light":
          "border-invert/15 bg-invert/10 text-[color:color-mix(in_oklab,var(--invert)_55%,var(--foreground))] dark:border-invert/45 dark:bg-invert/35",
        "focus-light":
          "border-focus/15 bg-focus/10 text-[color:color-mix(in_oklab,var(--focus)_55%,var(--foreground))] dark:border-focus/25 dark:bg-focus/15",
        "primary-outline":
          "bg-background border-border text-[color:color-mix(in_oklab,var(--primary)_55%,var(--foreground))] dark:bg-input/30",
        "warning-outline":
          "bg-background border-border text-[color:color-mix(in_oklab,var(--warning)_55%,var(--foreground))] dark:bg-input/30",
        "success-outline":
          "bg-background border-border text-[color:color-mix(in_oklab,var(--success)_55%,var(--foreground))] dark:bg-input/30",
        "info-outline":
          "bg-background border-border text-[color:color-mix(in_oklab,var(--info)_55%,var(--foreground))] dark:bg-input/30",
        "destructive-outline":
          "bg-background border-border text-[color:color-mix(in_oklab,var(--destructive)_55%,var(--foreground))] dark:bg-input/30",
        "invert-outline":
          "bg-background border-border text-[color:color-mix(in_oklab,var(--invert)_55%,var(--foreground))] dark:bg-input/30",
        "focus-outline":
          "bg-background border-border text-[color:color-mix(in_oklab,var(--focus)_55%,var(--foreground))] dark:bg-input/30",
      },
      size: {
        xs: "px-1 py-0.25 text-[0.6rem] leading-none h-4 min-w-4 gap-1",
        sm: "px-1 py-0.25 text-[0.625rem] leading-none h-4.5 min-w-4.5 gap-1",
        default: "px-1.25 py-0.5 text-xs h-5 min-w-5 gap-1",
        lg: "px-1.5 py-0.5 text-xs h-5.5 min-w-5.5 gap-1",
        xl: "px-2 py-0.75 text-sm h-6 min-w-6 gap-1.5",
      },
      /** `default`: active style radius. `full`: pill radius. */
      radius: {
        default:
          "rounded-4xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      radius: "default",
    },
  }
)

interface BadgeProps
  extends React.ComponentProps<"span">, VariantProps<typeof badgeVariants>, GlassSurfaceProps {
  asChild?: boolean
}

function Badge({
  className,
  variant,
  size,
  radius,
  asChild = false,
  glass,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot.Root : "span"
  const resolvedVariant = variant ?? "default"

  return (
    <Comp
      data-slot="badge"
      data-variant={resolvedVariant}
      data-exui-glass-tone={resolvedVariant === "destructive" ? "danger" : undefined}
      className={cn(badgeVariants({ variant, size, radius, className }), glassClassName(glass))}
      {...props}
    />
  )
}

export { Badge, badgeVariants, type BadgeProps }
