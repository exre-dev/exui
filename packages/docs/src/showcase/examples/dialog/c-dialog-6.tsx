
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

  function OriginalPattern() {
  return (
    <div className="flex items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{<ExampleText>Full Screen Fluid</ExampleText>}</Button>
        </DialogTrigger>
        <DialogContent className="flex max-h-[calc(100vh-3rem)] w-full max-w-[calc(100vw-3rem)] flex-col overflow-hidden p-0">
          <DialogHeader className="bg-background sticky top-0 z-10 border-b px-6 py-4">
            <DialogTitle>{<ExampleText>Full Screen Dialog</ExampleText>}</DialogTitle>
            <DialogDescription>
              {<ExampleText>A fluid full-screen dialog with sticky header and footer. </ExampleText>}</DialogDescription>
          </DialogHeader>
          <div className="me-0.5 flex-1 [scrollbar-width:thin] [scrollbar-color:rgb(120_120_120/0.4)_transparent] overflow-auto px-6">
            <div className="space-y-4 text-sm">
              {<ExampleText>{Array.from({ length: 20 }).map((_, index) => (
                <p key={index} className="text-muted-foreground leading-normal">
                  {<ExampleText>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. </ExampleText>}</p>
              ))}</ExampleText>}
            </div>
          </div>
          <DialogFooter className="bg-background border-t px-6 py-4">
            <DialogClose asChild>
              <Button variant="outline">{<ExampleText>Close</ExampleText>}</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button>{<ExampleText>Save changes</ExampleText>}</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
