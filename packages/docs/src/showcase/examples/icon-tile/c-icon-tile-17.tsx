
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleAlertIcon, MessageSquareIcon, Settings2Icon, StarIcon } from "lucide-react"

import { IconTile } from "@exre/exui"



// The `elevated` variant keeps its background-colored ring and shadow while the
// fill is overridden with a raw Tailwind color plus a white glyph, for solid
// brand-colored tiles.
const tiles = [
  {
    className: "bg-indigo-500 text-white",
    icon: (
      <StarIcon  />
    ),
  },
  {
    className: "bg-amber-500 text-white",
    icon: (
      <MessageSquareIcon  />
    ),
  },
  {
    className: "bg-emerald-600 text-white",
    icon: (
      <Settings2Icon  />
    ),
  },
  {
    className: "bg-rose-500 text-white",
    icon: (
      <CircleAlertIcon  />
    ),
  },
]

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center gap-4">
      {<ExampleText>{tiles.map((tile) => (
        <IconTile
          key={tile.className}
          variant="elevated"
          className={tile.className}
          aria-hidden="true"
        >
          {<ExampleText>{tile.icon}</ExampleText>}
        </IconTile>
      ))}</ExampleText>}
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
