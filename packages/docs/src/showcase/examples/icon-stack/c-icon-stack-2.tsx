
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArchiveIcon, LayersIcon, PackageIcon } from "lucide-react"

import { IconStack } from "@exre/exui"



const sizes = [
  {
    label: "Small",
    className: "h-16 w-14",
    icon: (
      <ArchiveIcon className="size-3.5" />
    ),
  },
  {
    label: "Default",
    className: "h-20 w-18",
    icon: (
      <PackageIcon className="size-4" />
    ),
  },
  {
    label: "Large",
    className: "h-28 w-24",
    icon: (
      <LayersIcon className="size-6" />
    ),
  },
]

  function OriginalPattern() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-8">
      {<ExampleText>{sizes.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-2">
          <IconStack aria-hidden="true" className={item.className}>
            {<ExampleText>{item.icon}</ExampleText>}
          </IconStack>
          <span className="text-muted-foreground text-sm">{<ExampleText>{item.label}</ExampleText>}</span>
        </div>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
