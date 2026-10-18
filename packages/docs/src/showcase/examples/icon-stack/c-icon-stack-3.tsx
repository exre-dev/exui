
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SparklesIcon } from "lucide-react"

import { IconStack } from "@exre/exui"



const stacks = [
  {
    label: "Neutral",
    className: "text-foreground",
    iconClassName: "text-muted-foreground",
  },
  {
    label: "Primary",
    className: "text-primary",
    iconClassName: "text-primary",
  },
  {
    label: "Success",
    className: "text-success",
    iconClassName: "text-success",
  },
  {
    label: "Warning",
    className: "text-warning",
    iconClassName: "text-warning",
  },
]

  function OriginalPattern() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-7">
      {<ExampleText>{stacks.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2">
          <IconStack aria-hidden="true" className={item.className}>
            <SparklesIcon className={`size-4 ${item.iconClassName}`} />
          </IconStack>
          <span className="text-muted-foreground text-sm">{<ExampleText>{item.label}</ExampleText>}</span>
        </div>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
