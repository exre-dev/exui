"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { glassClassName, type GlassSurfaceProps } from "@/lib/glass"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useIsMobile } from "@/hooks/use-mobile"
import { ArrowLeft, XIcon, type LucideIcon } from "lucide-react"

type DialogAction = React.MouseEventHandler<HTMLButtonElement> | {
  tooltip?: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
  icon?: LucideIcon
}

type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
  closeLabel?: string
  /** Disables only the corner close button, not Escape or outside interaction. */
  closeButtonDisabled?: boolean
  overlayClassName?: string
  /** Fill the dynamic viewport below 48 root rem units. Off by default. */
  responsiveFullscreen?: boolean
} & GlassSurfaceProps

type DialogHeaderProps = React.ComponentProps<"div"> & {
  action?: DialogAction
  /** Accessible action name; falls back to tooltip, then "Back". */
  actionLabel?: string
}

type DialogProps = React.ComponentProps<typeof DialogPrimitive.Root> & {
  /** A defined title selects the convenience Header/Body/Footer composition. */
  title?: React.ReactNode
  description?: React.ReactNode
  footer?: React.ReactNode
  action?: DialogAction
  actionLabel?: string
  responsiveFullscreen?: boolean
  contentProps?: Omit<DialogContentProps, "children" | "asChild" | "responsiveFullscreen">
}

// Fullscreen geometry must survive a consumer importing the public sheet into
// a lower CSS layer than its own generic .border/.grid/size utilities.
const fullscreenStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  inset: 0,
  width: "100%",
  height: "100dvh",
  minWidth: 0,
  minHeight: 0,
  maxWidth: "none",
  maxHeight: "none",
  margin: 0,
  translate: "none",
  transform: "none",
  border: 0,
  borderRadius: 0,
  boxShadow: "none",
  overflowX: "hidden",
  overflowY: "auto",
  paddingTop: "max(var(--exui-component-dialog-surface-padding), env(safe-area-inset-top, 0px))",
  paddingRight: "max(var(--exui-component-dialog-surface-padding), env(safe-area-inset-right, 0px))",
  paddingBottom: "max(var(--exui-component-dialog-surface-padding), env(safe-area-inset-bottom, 0px))",
  paddingLeft: "max(var(--exui-component-dialog-surface-padding), env(safe-area-inset-left, 0px))",
}

function Dialog({
  title,
  description,
  footer,
  action,
  actionLabel,
  responsiveFullscreen,
  contentProps,
  children,
  ...props
}: DialogProps) {
  const returnFocus = React.useRef<HTMLElement | null>(null)
  const interactedOutside = React.useRef(false)

  return <DialogPrimitive.Root data-slot="dialog" {...props}>
    {title === undefined ? children : (
      <DialogContent
        {...(description == null ? { "aria-describedby": undefined } : {})}
        {...contentProps}
        responsiveFullscreen={responsiveFullscreen}
        onOpenAutoFocus={event => {
          // Convenience dialogs have no Radix Trigger to restore focus to.
          returnFocus.current = (event.target as HTMLElement).ownerDocument.activeElement as HTMLElement | null
          interactedOutside.current = false
          contentProps?.onOpenAutoFocus?.(event)
        }}
        onInteractOutside={event => {
          contentProps?.onInteractOutside?.(event)
          if (!event.defaultPrevented) interactedOutside.current = true
        }}
        onPointerDownCapture={event => {
          interactedOutside.current = false
          contentProps?.onPointerDownCapture?.(event)
        }}
        onFocusCapture={event => {
          interactedOutside.current = false
          contentProps?.onFocusCapture?.(event)
        }}
        onCloseAutoFocus={event => {
          contentProps?.onCloseAutoFocus?.(event)
          const keepOutsideFocus = props.modal === false && interactedOutside.current
          if (!event.defaultPrevented && !keepOutsideFocus && returnFocus.current?.isConnected) {
            event.preventDefault()
            returnFocus.current.focus()
          }
        }}
      >
        <DialogHeader action={action} actionLabel={actionLabel}>
          <DialogTitle>{title}</DialogTitle>
          {description != null && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
        {footer != null && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    )}
  </DialogPrimitive.Root>
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 [background:var(--exui-component-dialog-overlay-background)] duration-[var(--exui-component-dialog-overlay-duration)] supports-backdrop-filter:backdrop-blur-[var(--exui-component-dialog-overlay-backdrop-blur)] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 motion-reduce:animate-none motion-reduce:duration-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  style,
  children,
  showCloseButton = true,
  closeLabel = "Close",
  closeButtonDisabled = false,
  overlayClassName,
  glass,
  responsiveFullscreen = false,
  onOpenAutoFocus,
  ...props
}: DialogContentProps) {
  const isMobile = useIsMobile()
  const fullscreen = responsiveFullscreen && isMobile
  return (
    <DialogPortal>
      <DialogOverlay className={overlayClassName} />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-exui-fullscreen={fullscreen ? "" : undefined}
        style={fullscreen ? { ...fullscreenStyle, ...style } : style}
        onOpenAutoFocus={event => {
          onOpenAutoFocus?.(event)
          if (event.defaultPrevented) return
          const content = event.target as HTMLElement
          if (content.querySelector('[data-slot="dialog-action"][data-exui-action-tooltip]')) {
            // Mount autofocus on a Tooltip trigger looks like keyboard intent
            // to Radix. Start on the named surface; Tab still reaches the action.
            event.preventDefault()
            content.focus({ preventScroll: true })
          }
        }}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-[var(--exui-component-dialog-surface-gap)] rounded-[var(--exui-component-dialog-surface-radius)] border [border-color:var(--exui-component-dialog-surface-border)] [background:var(--exui-component-dialog-surface-background)] p-[var(--exui-component-dialog-surface-padding)] [color:var(--exui-component-dialog-surface-foreground)] text-sm [box-shadow:var(--exui-component-dialog-surface-shadow)] duration-[var(--exui-component-dialog-overlay-duration)] outline-none sm:max-w-md data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 motion-reduce:animate-none motion-reduce:duration-0",
          glassClassName(glass),
          "[--_exui-glass-host-shadow:var(--exui-component-dialog-surface-shadow)]",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close data-slot="dialog-close" asChild>
            <Button
              variant="ghost"
              className="absolute top-[var(--exui-component-dialog-close-button-placement-top)] right-[var(--exui-component-dialog-close-button-placement-right)] bg-secondary"
              size="icon-sm"
              disabled={closeButtonDisabled}
            >
              <XIcon
              />
              <span className="sr-only">{closeLabel}</span>
            </Button>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, action, actionLabel, children, ...props }: DialogHeaderProps) {
  const config = typeof action === "function" ? { onClick: action } : action
  const tooltip = config?.tooltip?.trim()
  const Icon = config?.icon ?? ArrowLeft
  const button = config && (
    <Button type="button" variant="ghost" size="icon-sm" data-slot="dialog-action"
      data-exui-action-tooltip={tooltip ? "" : undefined}
      aria-label={actionLabel?.trim() || tooltip || "Back"} onClick={config.onClick}>
      <Icon />
    </Button>
  )

  return (
    <div
      data-slot="dialog-header"
      data-exui-action={config ? "" : undefined}
      className={cn(config ? "grid" : "flex flex-col gap-[var(--exui-component-dialog-body-gap)]", className)}
      {...props}
    >
      {config ? <>
        {tooltip ? (
          <TooltipProvider><Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip></TooltipProvider>
        ) : button}
        <div data-slot="dialog-header-text">{children}</div>
      </> : children}
    </div>
  )
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="dialog-body" className={cn("min-w-0 overflow-y-auto", className)} {...props} />
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-[var(--exui-component-dialog-footer-gap)] sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close asChild>
          <Button variant="outline">Close</Button>
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "[font-family:var(--exui-component-dialog-title-font-family)] text-[length:var(--exui-component-dialog-title-font-size)] leading-[var(--exui-component-dialog-title-line-height)] font-[number:var(--exui-component-dialog-title-font-weight)] [color:var(--exui-component-dialog-title-foreground)]",
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "[font-family:var(--exui-component-dialog-description-font-family)] text-[length:var(--exui-component-dialog-description-font-size)] leading-[var(--exui-component-dialog-description-line-height)] font-[number:var(--exui-component-dialog-description-font-weight)] [color:var(--exui-component-dialog-description-foreground)] *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  type DialogAction,
  type DialogContentProps,
  type DialogHeaderProps,
  type DialogProps,
}
