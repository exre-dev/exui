"use client"


import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon } from "lucide-react"



import { Button } from "@exre/exui"
import { Spinner } from "@exre/exui"


function LoadingToast({ message }: { message: string }) {
  return (
    <div className="bg-popover text-popover-foreground border-border rounded-[var(--border-radius)] flex w-full items-center gap-3 border p-4 shadow-lg">
      <Spinner className="size-4 opacity-60" />
      <p className="text-xs font-medium">{<ExampleText>{message}</ExampleText>}</p>
    </div>
  )
}

function SuccessToast() {
  return (
    <div className="bg-popover text-popover-foreground border-border rounded-[var(--border-radius)] flex w-full items-start gap-3 border p-4 shadow-lg">
      <div className="flex size-4 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
        <CheckIcon className="size-3" />
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <p className="text-xs font-semibold">{<ExampleText>Upload complete!</ExampleText>}</p>
        <p className="text-muted-foreground text-xs">
          {<ExampleText>3 files uploaded successfully. </ExampleText>}</p>
      </div>
    </div>
  )
}

  function OriginalPattern() {
  const { timers: exampleTimers, toast } = useExampleRuntime()

  const startProgress = () => {
    const toastId = toast.custom(
      () => <ExampleRuntimeConsumer render={({copy: copyExample}) => (<LoadingToast message={copyExample("Preparing upload...")} />)} />,
      { duration: Infinity }
    )

    exampleTimers.setTimeout(() => {
      toast.custom(() => <ExampleRuntimeConsumer render={({copy: copyExample}) => (<LoadingToast message={copyExample("Uploading files... 30%")} />)} />, {
        id: toastId,
        duration: Infinity,
      })
    }, 1000)

    exampleTimers.setTimeout(() => {
      toast.custom(() => <ExampleRuntimeConsumer render={({copy: copyExample}) => (<LoadingToast message={copyExample("Uploading files... 70%")} />)} />, {
        id: toastId,
        duration: Infinity,
      })
    }, 2000)

    exampleTimers.setTimeout(() => {
      toast.custom(() => <SuccessToast />, {
        id: toastId,
        duration: 4000,
      })
    }, 3000)
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={startProgress} variant="outline" className="w-fit">
        {<ExampleText>Updatable Toast </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
