
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CircleAlertIcon } from "lucide-react"

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


  function OriginalPattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{<ExampleText>Deactivate Account</ExampleText>}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="flex items-start gap-3 py-1">
          <div className="bg-destructive/10 dark:bg-destructive/10 rounded-full flex size-10 shrink-0 items-center justify-center">
            <CircleAlertIcon className="text-destructive size-5" />
          </div>
          <div className="flex flex-col justify-center gap-1">
            <AlertDialogTitle className="text-sm font-semibold">
              {<ExampleText>Deactivate your account? </ExampleText>}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-sm">
              {<ExampleText>This will disable your account and remove your profile from all active searches. </ExampleText>}</AlertDialogDescription>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{<ExampleText>Keep My Account</ExampleText>}</AlertDialogCancel>
          <AlertDialogAction variant="destructive">
            {<ExampleText>Deactivate Anyway </ExampleText>}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
