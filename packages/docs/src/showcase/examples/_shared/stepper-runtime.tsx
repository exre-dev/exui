import * as React from "react"
import {
  Stepper as PublicStepper,
  StepperContent as PublicStepperContent,
  StepperItem as PublicStepperItem,
  StepperTrigger as PublicStepperTrigger,
  useStepItem,
  useStepper,
} from "@exre/exui"

interface Scope {
  prefix: string
  tabs: ReadonlyMap<number, string>
  panels: ReadonlyMap<number, { id: string; forceMount: boolean }>
}
interface ChildMetadata {
  children?: React.ReactNode
  step?: number
  value?: number
  id?: string
  forceMount?: boolean
}
const ScopeContext = React.createContext<Scope | null>(null)
function useScope() {
  const scope = React.useContext(ScopeContext)
  if (!scope) throw new Error("Example Stepper parts require ExampleStepper")
  return scope
}

/** Read only already-created elements; never execute a consumer render callback. */
function collectScope(children: React.ReactNode, prefix: string): Scope {
  const tabs = new Map<number, string>()
  const panels = new Map<number, { id: string; forceMount: boolean }>()
  function visit(nodes: React.ReactNode, inheritedStep?: number) {
    React.Children.forEach(nodes, node => {
      if (!React.isValidElement<ChildMetadata>(node)) return
      if (node.type === ExampleStepper || node.type === PublicStepper) return
      const step = node.type === PublicStepperItem ? node.props.step : inheritedStep
      if (node.type === ExampleStepperTrigger && typeof step === "number") {
        tabs.set(step, node.props.id ?? `${prefix}-tab-${step}`)
      }
      if (node.type === ExampleStepperContent && typeof node.props.value === "number") {
        panels.set(node.props.value, {
          id: node.props.id ?? `${prefix}-panel-${node.props.value}`,
          forceMount: node.props.forceMount === true,
        })
      }
      visit(node.props.children, step)
    })
  }
  visit(children)
  return { prefix, tabs, panels }
}

export function ExampleStepper({ children, ...props }: React.ComponentProps<typeof PublicStepper>) {
  const prefix = React.useId()
  const scope = React.useMemo(() => collectScope(children, prefix), [children, prefix])
  return <ScopeContext value={scope}><PublicStepper {...props}>{children}</PublicStepper></ScopeContext>
}

export function ExampleStepperTrigger(props: React.ComponentProps<typeof PublicStepperTrigger>) {
  const scope = useScope()
  const { step } = useStepItem()
  const { activeStep } = useStepper()
  const panel = scope.panels.get(step)
  // Explicit links also cover the nested task scenes' shared outer panel.
  const controls = Object.prototype.hasOwnProperty.call(props, "aria-controls")
    ? props["aria-controls"]
    : panel && (activeStep === step || panel.forceMount) ? panel.id : undefined
  return <PublicStepperTrigger {...props} id={props.id ?? `${scope.prefix}-tab-${step}`} aria-controls={controls} />
}

export function ExampleStepperContent({
  value, forceMount, className, children, id, role, style, ...props
}: React.ComponentProps<typeof PublicStepperContent>) {
  const scope = useScope()
  const labelledBy = Object.prototype.hasOwnProperty.call(props, "aria-labelledby")
    ? props["aria-labelledby"] : scope.tabs.get(value)
  // Completion content has no corresponding tab; keep it ordinary content
  // rather than creating an unnamed tabpanel or inventing a fake tab.
  const panelRole = role ?? (labelledBy || props["aria-label"] ? "tabpanel" : undefined)
  return (
    <PublicStepperContent value={value} forceMount={forceMount} className={className}>
      <div {...props} id={id ?? `${scope.prefix}-panel-${value}`} role={panelRole}
        aria-labelledby={labelledBy} style={{ display: "contents", ...style }}>
        {children}
      </div>
    </PublicStepperContent>
  )
}
