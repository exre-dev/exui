
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CardSimIcon } from "lucide-react"

import { Frame, FramePanel } from "@exre/exui"

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
        <Button variant="outline">{<ExampleText>Discard Changes</ExampleText>}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="overflow-hidden p-0! ring-0">
        <Frame className="p-px">
          <FramePanel>
            <div className="flex items-start gap-3">
              <div className="rounded-full flex size-10 shrink-0 items-center justify-center border border-amber-100 bg-amber-50 text-amber-500 dark:bg-amber-950 dark:text-amber-300">
                <CardSimIcon className="size-5" />
              </div>
              <div className="flex flex-col justify-center gap-1">
                <AlertDialogTitle className="text-sm font-semibold">
                  {<ExampleText>Unsaved changes </ExampleText>}</AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground text-sm">
                  {<ExampleText>You have unsaved changes in this form. If you leave now, your progress will be lost. </ExampleText>}</AlertDialogDescription>
              </div>
            </div>
            <AlertDialogFooter className="mt-6 items-center gap-4 sm:justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id={exampleId("dont-ask-again")} />
                <Label
                  htmlFor={exampleId("dont-ask-again")}
                  className="text-muted-foreground font-normal"
                >
                  {<ExampleText>Don't ask again </ExampleText>}</Label>
              </div>
              <div className="flex items-center gap-2">
                <AlertDialogCancel>{<ExampleText>Stay</ExampleText>}</AlertDialogCancel>
                <AlertDialogAction>{<ExampleText>Discard Changes</ExampleText>}</AlertDialogAction>
              </div>
            </AlertDialogFooter>
          </FramePanel>
        </Frame>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
