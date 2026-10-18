
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BluetoothIcon } from "lucide-react"

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
        <Button variant="outline">{<ExampleText>Default (Media)</ExampleText>}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <BluetoothIcon  />
          </AlertDialogMedia>
          <AlertDialogTitle>{<ExampleText>Pair with this device?</ExampleText>}</AlertDialogTitle>
          <AlertDialogDescription>
            {<ExampleText>This will allow the device to connect and share data with your current session. </ExampleText>}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{<ExampleText>Cancel</ExampleText>}</AlertDialogCancel>
          <AlertDialogAction>{<ExampleText>Connect</ExampleText>}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
