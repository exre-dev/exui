
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ShieldQuestionMarkIcon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@exre/exui"
import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{<ExampleText>Logout</ExampleText>}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent
        size="sm"
        className="gap-0 overflow-hidden p-0 sm:max-w-sm"
      >
        <div className="flex flex-col items-center justify-center gap-2 p-8">
          <AlertDialogMedia className="rounded-full size-12 bg-violet-50 text-violet-500 dark:bg-violet-950 dark:text-violet-400">
            <ShieldQuestionMarkIcon className="size-6" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-center text-base font-semibold">
            {<ExampleText>Are you sure? </ExampleText>}</AlertDialogTitle>
          <AlertDialogDescription className="p-0 text-center text-sm font-medium">
            {<ExampleText>You can always log in later to your account. </ExampleText>}</AlertDialogDescription>
        </div>
        <AlertDialogFooter className="grid flex-none grid-cols-2 gap-0 divide-x border-t pt-0">
          <AlertDialogCancel
            variant="ghost"
            className="border-border h-12 flex-1 rounded-none border-0 border-r p-0"
          >
            {<ExampleText>No </ExampleText>}</AlertDialogCancel>
          <AlertDialogAction
            variant="ghost"
            className="h-12 flex-1 rounded-none border-0 p-0"
          >
            {<ExampleText>Yes, Logout </ExampleText>}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
