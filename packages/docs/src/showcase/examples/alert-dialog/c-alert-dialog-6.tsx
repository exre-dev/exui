
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@exre/exui"
import { Button } from "@exre/exui"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@exre/exui"

  function OriginalPattern() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{<ExampleText>Open Dialog</ExampleText>}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{<ExampleText>Alert Dialog Example</ExampleText>}</DialogTitle>
          <DialogDescription>
            {<ExampleText>Click the button below to open an alert dialog. </ExampleText>}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>{<ExampleText>Open Alert Dialog</ExampleText>}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogTitle>{<ExampleText>Are you absolutely sure?</ExampleText>}</AlertDialogTitle>
                <AlertDialogDescription>
                  {<ExampleText>This action cannot be undone. This will permanently delete your account and remove your data from our servers. </ExampleText>}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{<ExampleText>Cancel</ExampleText>}</AlertDialogCancel>
                <AlertDialogAction>{<ExampleText>Continue</ExampleText>}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
