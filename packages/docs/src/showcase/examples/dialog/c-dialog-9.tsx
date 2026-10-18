
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"
import { Kbd } from "@exre/exui"

const shortcuts = [
  { keys: ["⌘", "K"], action: "Search" },
  { keys: ["⌘", "B"], action: "Bold" },
  { keys: ["⌘", "I"], action: "Italic" },
  { keys: ["⌘", "S"], action: "Save" },
  { keys: ["⌘", "Z"], action: "Undo" },
  { keys: ["⌘", "⇧", "Z"], action: "Redo" },
  { keys: ["⌘", "N"], action: "New File" },
  { keys: ["⌘", "P"], action: "Quick Open" },
  { keys: ["⌘", "/"], action: "Toggle Comment" },
  { keys: ["⌘", "D"], action: "Duplicate Line" },
]

  function OriginalPattern() {
  const half = Math.ceil(shortcuts.length / 2)
  const leftColumn = shortcuts.slice(0, half)
  const rightColumn = shortcuts.slice(half)

  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{<ExampleText>Keyboard Shortcuts</ExampleText>}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{<ExampleText>Keyboard Shortcuts</ExampleText>}</DialogTitle>
            <DialogDescription>
              {<ExampleText>Quick reference for commonly used keyboard shortcuts. </ExampleText>}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
            {<ExampleText>{[leftColumn, rightColumn].map((column, colIndex) => (
              <div key={colIndex} className="space-y-3">
                {<ExampleText>{column.map((shortcut) => (
                  <div
                    key={shortcut.action}
                    className="flex items-center justify-between"
                  >
                    <span className="text-muted-foreground text-sm">
                      {<ExampleText>{shortcut.action}</ExampleText>}
                    </span>
                    <div className="flex gap-1">
                      {<ExampleText>{shortcut.keys.map((key, index) => (
                        <Kbd key={index}>{<ExampleText>{key}</ExampleText>}</Kbd>
                      ))}</ExampleText>}
                    </div>
                  </div>
                ))}</ExampleText>}
              </div>
            ))}</ExampleText>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{<ExampleText>Close</ExampleText>}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
