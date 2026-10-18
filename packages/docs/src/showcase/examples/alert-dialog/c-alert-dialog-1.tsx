
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

  function OriginalPattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{<ExampleText>Open Alert Dialog</ExampleText>}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-sm">
        <AlertDialogHeader className="sm:place-items-center sm:text-center">
          <AlertDialogTitle>{<ExampleText>Are you absolutely sure?</ExampleText>}</AlertDialogTitle>
          <AlertDialogDescription>
            {<ExampleText>This action cannot be undone. This will permanently delete your account and remove your data from our servers. </ExampleText>}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <AlertDialogCancel>{<ExampleText>Cancel</ExampleText>}</AlertDialogCancel>
          <AlertDialogAction>{<ExampleText>Continue</ExampleText>}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
