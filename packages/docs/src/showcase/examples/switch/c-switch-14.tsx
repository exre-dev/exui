
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BarChart3Icon, BugIcon, DatabaseIcon, GlobeIcon } from "lucide-react"

import { Field, FieldContent, FieldGroup, FieldLabel, FieldTitle } from "@exre/exui"
import { Switch } from "@exre/exui"


const features = [
  {
    id: "feat-analytics",
    title: "Analytics",
    description: "Track page views and user interactions",
    checked: true,
    icon: (
      <BarChart3Icon aria-hidden="true" className="size-4" />
    ),
  },
  {
    id: "feat-logging",
    title: "Error Logging",
    description: "Capture and report runtime errors",
    checked: true,
    icon: (
      <BugIcon aria-hidden="true" className="size-4" />
    ),
  },
  {
    id: "feat-cdn",
    title: "CDN Caching",
    description: "Serve static assets from edge network",
    checked: false,
    icon: (
      <GlobeIcon aria-hidden="true" className="size-4" />
    ),
  },
  {
    id: "feat-backup",
    title: "Auto Backup",
    description: "Daily snapshots of your database",
    checked: false,
    icon: (
      <DatabaseIcon aria-hidden="true" className="size-4" />
    ),
  },
]

  function OriginalPattern() {
  return (
    <FieldGroup className="grid w-full max-w-md grid-cols-2 gap-4">
      {<ExampleText>{features.map((feature) => (
        <ExampleRuntimeConsumer key={feature.id} render={({id: exampleId}) => (<FieldLabel key={feature.id} htmlFor={exampleId(feature.id)} className="p-0!">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle className="flex items-start gap-2">
                <div className="bg-background border-border flex shrink-0 items-center justify-center rounded-md border p-1.5 shadow-xs shadow-black/5">
                  {<ExampleText>{feature.icon}</ExampleText>}
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-sm font-semibold">{<ExampleText>{feature.title}</ExampleText>}</span>
                  <span className="text-muted-foreground text-xs">
                    {<ExampleText>{feature.description}</ExampleText>}
                  </span>
                </div>
              </FieldTitle>
            </FieldContent>
            <Switch
              id={exampleId(feature.id)}
              defaultChecked={feature.checked}
              size="sm"
            />
          </Field>
        </FieldLabel>)} />
      ))}</ExampleText>}
    </FieldGroup>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
