
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { Trash2Icon } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@exre/exui"
import { Button } from "@exre/exui"


  function OriginalPattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{<ExampleText>Delete Chat</ExampleText>}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon  />
          </AlertDialogMedia>
          <AlertDialogTitle>{<ExampleText>Delete chat?</ExampleText>}</AlertDialogTitle>
          <AlertDialogDescription>
            {<ExampleText>This will permanently delete this chat conversation. View</ExampleText>}{<ExampleText>{" "}</ExampleText>}
            <a onClick={(event) => event.preventDefault()} href="#" className="underline">
              {<ExampleText>Settings </ExampleText>}</a>{<ExampleText>{" "}</ExampleText>}
            {<ExampleText>to delete any memories saved during this chat. </ExampleText>}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="ghost">{<ExampleText>Cancel</ExampleText>}</AlertDialogCancel>
          <AlertDialogAction variant="destructive">{<ExampleText>Delete</ExampleText>}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
