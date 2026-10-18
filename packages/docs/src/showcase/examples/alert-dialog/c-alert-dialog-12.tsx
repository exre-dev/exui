
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellIcon } from "lucide-react"

import { Badge } from "@exre/exui"

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
        <Button variant="outline">{<ExampleText>Subscription Expiring</ExampleText>}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="gap-0 p-0 sm:max-w-sm">
        <div className="mx-auto flex flex-col items-center justify-center gap-2 p-8">
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 size-12 rounded-full">
            <BellIcon className="size-6" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-center">
            {<ExampleText>Subscription Expiring Soon </ExampleText>}</AlertDialogTitle>
          <Badge variant="destructive-light" className="font-normal">
            {<ExampleText>Expires in 2 days </ExampleText>}</Badge>
        </div>

        <div className="bg-muted/60 flex flex-col items-center justify-center gap-5 rounded-b-2xl p-6">
          <AlertDialogDescription className="text-muted-foreground text-center">
            {<ExampleText>Your current plan will expire in 2 days. Update your payment method now to ensure uninterrupted access to your Pro features. </ExampleText>}</AlertDialogDescription>
          {/* The footer sits inside this `p-6` section, not directly in the
              content, so its breakout has to cancel THAT padding (`-mx-6
              -mb-6`) to reach the edges. `self-stretch` is required because the
              section is `items-center`, which would otherwise shrink the bar to
              its content width and leave the top border floating short. */}
          <AlertDialogFooter className="-mx-6 -mb-6 gap-4 self-stretch rounded-b-2xl p-6">
            <AlertDialogCancel>{<ExampleText>Remind Me Later</ExampleText>}</AlertDialogCancel>
            <AlertDialogAction>{<ExampleText>Update Payment</ExampleText>}</AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
