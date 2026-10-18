
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@exre/exui"
import { Button } from "@exre/exui"
import { Checkbox } from "@exre/exui"
import { Label } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{<ExampleText>Task Status</ExampleText>}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex items-center gap-3 py-1">
          <div className="rounded-full flex size-10 items-center justify-center bg-emerald-50 text-emerald-500 dark:bg-emerald-950 dark:text-emerald-300">
            <CheckIcon className="size-5" />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <AlertDialogTitle className="text-sm font-semibold">
              {<ExampleText>Task successful </ExampleText>}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              {<ExampleText>Your task has been completed successfully. </ExampleText>}</AlertDialogDescription>
          </div>
        </div>
        <AlertDialogFooter className="items-center gap-4 sm:justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id={exampleId("show-again")} />
            <Label
              htmlFor={exampleId("show-again")}
              className="text-muted-foreground font-normal"
            >
              {<ExampleText>Don't show again </ExampleText>}</Label>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialogCancel>{<ExampleText>Cancel</ExampleText>}</AlertDialogCancel>
            <AlertDialogAction>{<ExampleText>Confirm</ExampleText>}</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
