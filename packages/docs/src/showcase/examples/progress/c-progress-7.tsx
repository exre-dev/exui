
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleCheckIcon, CircleIcon } from "lucide-react"

import { Progress } from "@exre/exui"


const steps = [
  { label: "Account", completed: true },
  { label: "Profile", completed: true },
  { label: "Preferences", completed: false },
  { label: "Review", completed: false },
]

  function OriginalPattern() {
  const completedSteps = steps.filter((s) => s.completed).length
  const progressValue = (completedSteps / steps.length) * 100

  return (
    <div className="mx-auto w-full max-w-xs space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{<ExampleText>Setup Progress</ExampleText>}</span>
        <span className="text-muted-foreground text-xs">
          {<ExampleText>{completedSteps}</ExampleText>} {<ExampleText> of </ExampleText>}{<ExampleText>{steps.length}</ExampleText>} {<ExampleText> steps </ExampleText>}</span>
      </div>
      <Progress value={progressValue} />
      <div className="flex flex-col gap-2">
        {<ExampleText>{steps.map((step) => (
          <div key={step.label} className="flex items-center gap-2 text-sm">
            {<ExampleText>{step.completed ? (
              <CircleCheckIcon className="text-success size-4" aria-hidden="true" />
            ) : (
              <CircleIcon className="text-muted-foreground size-4" aria-hidden="true" />
            )}</ExampleText>}
            <span
              className={
                step.completed ? "text-foreground" : "text-muted-foreground"
              }
            >
              {<ExampleText>{step.label}</ExampleText>}
            </span>
          </div>
        ))}</ExampleText>}
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
