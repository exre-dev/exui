
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{<ExampleText>Scrollable Content</ExampleText>}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{<ExampleText>Scrollable Content</ExampleText>}</DialogTitle>
            <DialogDescription>
              {<ExampleText>This is a dialog with scrollable content. </ExampleText>}</DialogDescription>
          </DialogHeader>
          <div className="-mx-4 px-4 no-scrollbar max-h-[70vh] overflow-y-auto">
            {<ExampleText>{Array.from({ length: 10 }).map((_, index) => (
              <p
                key={index}
                className="mb-4 leading-normal"
              >
                {<ExampleText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </ExampleText>}</p>
            ))}</ExampleText>}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
