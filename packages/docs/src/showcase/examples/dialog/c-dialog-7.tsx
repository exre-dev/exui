
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { AlertTriangleIcon } from "lucide-react"

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
          <Button variant="outline">{<ExampleText>Delete Item</ExampleText>}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-start gap-3">
              <div className="bg-destructive/10 text-destructive rounded-full flex size-10 shrink-0 items-center justify-center">
                <AlertTriangleIcon className="size-5" />
              </div>
              <div className="flex flex-col gap-1">
                <DialogTitle>{<ExampleText>Are you sure?</ExampleText>}</DialogTitle>
                <DialogDescription>
                  {<ExampleText>This action cannot be undone. This will permanently delete the item and remove all associated data from our servers. </ExampleText>}</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{<ExampleText>Cancel</ExampleText>}</Button>
            </DialogClose>
            <Button variant="destructive">{<ExampleText>Delete</ExampleText>}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
