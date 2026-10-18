
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Kbd, KbdGroup } from "@exre/exui"
import { Separator } from "@exre/exui"

const shortcuts = [
  { label: "Search", keys: ["⌘", "K"] },
  { label: "New File", keys: ["⌘", "N"] },
  { label: "Save", keys: ["⌘", "S"] },
  { label: "Undo", keys: ["⌘", "Z"] },
  { label: "Redo", keys: ["⌘", "⇧", "Z"] },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col">
      <p className="mb-3 text-sm font-medium">{<ExampleText>Keyboard Shortcuts</ExampleText>}</p>
      <Separator />
      <div className="flex flex-col">
        {<ExampleText>{shortcuts.map((shortcut) => (
          <div
            key={shortcut.label}
            className="flex items-center justify-between border-b py-2.5 last:border-b-0"
          >
            <span className="text-muted-foreground text-sm">
              {<ExampleText>{shortcut.label}</ExampleText>}
            </span>
            <KbdGroup>
              {<ExampleText>{shortcut.keys.map((key) => (
                <Kbd key={key}>{<ExampleText>{key}</ExampleText>}</Kbd>
              ))}</ExampleText>}
            </KbdGroup>
          </div>
        ))}</ExampleText>}
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
