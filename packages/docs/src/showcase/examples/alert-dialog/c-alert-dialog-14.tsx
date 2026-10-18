
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FingerprintPatternIcon, KeySquareIcon, LockIcon, ShieldAlertIcon } from "lucide-react"

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


const SECURITY_ITEMS = [
  {
    icon: (
      <LockIcon className="text-muted-foreground size-4" />
    ),
    title: "Password Policy",
    description: "Verify strength and rotation",
    status: "Pending",
  },
  {
    icon: (
      <FingerprintPatternIcon className="text-muted-foreground size-4" />
    ),
    title: "Biometric Status",
    description: "Check hardware encryption",
    status: "Done",
  },
  {
    icon: (
      <KeySquareIcon className="text-muted-foreground size-4" />
    ),
    title: "Active Sessions",
    description: "Review connected devices",
    status: "Pending",
  },
]

  function OriginalPattern() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">{<ExampleText>Advanced Security Check</ExampleText>}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm! gap-0 overflow-hidden p-0">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-1.5 px-4 pt-6 pb-5 text-center">
          <AlertDialogMedia className="size-12 rounded-full bg-green-50 text-green-500 dark:bg-green-950 dark:text-green-400">
            <ShieldAlertIcon className="size-6" />
          </AlertDialogMedia>
          <AlertDialogTitle className="text-base font-semibold">
            {<ExampleText>Advanced Security Audit </ExampleText>}</AlertDialogTitle>
          <AlertDialogDescription className="p-0 text-sm">
            {<ExampleText>Summary of your account status and security settings. </ExampleText>}</AlertDialogDescription>
        </div>

        {/* Content */}
        <div className="space-y-3 p-4">
          {<ExampleText>{SECURITY_ITEMS.map((item) => (
            <div
              key={item.title}
              className="border-border flex items-center justify-between rounded-md border border-dashed px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="bg-background border-border/80 flex size-8 items-center justify-center rounded-md border shadow-xs">
                  {<ExampleText>{item.icon}</ExampleText>}
                </div>
                <div className="flex flex-col gap-0.25">
                  <span className="text-sm font-medium">{<ExampleText>{item.title}</ExampleText>}</span>
                  <span className="text-muted-foreground text-xs">
                    {<ExampleText>{item.description}</ExampleText>}
                  </span>
                </div>
              </div>
              <Badge
                variant={
                  item.status === "Pending" ? "warning-light" : "success-light"
                }
              >
                {<ExampleText>{item.status}</ExampleText>}
              </Badge>
            </div>
          ))}</ExampleText>}
        </div>

        {/* Footer */}
        {/* The content is `p-0`, so there is no padding to escape: the footer's
            built-in `-mx-4 -mb-4` pushed the bar OUTSIDE the dialog, where
            `overflow-hidden` clipped it - which is why it looked like it had no
            padding. Cancelling the breakout puts it flush edge-to-edge with its
            own `p-4` intact. */}
        <AlertDialogFooter className="mx-0 mb-0 grid grid-cols-1 gap-2 p-4">
          <AlertDialogAction variant="default" className="flex-1">
            {<ExampleText>Start Deep Audit </ExampleText>}</AlertDialogAction>
          <AlertDialogCancel variant="ghost" className="flex-1">
            {<ExampleText>Skip for now </ExampleText>}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
