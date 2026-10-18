"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime, createExampleRandom } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { FileIcon } from "lucide-react"
const exampleRandom = createExampleRandom("c-sonner-10")


import { Button } from "@exre/exui"
import { Progress } from "@exre/exui"


function UploadToast({ progress }: { progress: number }) {
  const { format: formatExample } = useExampleRuntime()

  const done = progress >= 100

  return (
    <div className="bg-popover text-popover-foreground border-border rounded-[var(--border-radius)] flex w-full flex-col gap-3 border p-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg">
          <FileIcon className="size-4" aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col">
          <p className="text-sm font-medium">{<ExampleText>report-q4-2025.pdf</ExampleText>}</p>
          <p className="text-muted-foreground text-xs">
            {<ExampleText>2.4 MB · </ExampleText>}{<ExampleText>{done ? "Complete" : <>{formatExample("Uploading... {progress}%", { progress: progress })}</>}</ExampleText>}
          </p>
        </div>
      </div>
      <Progress
        value={progress}
        className="**:data-[slot=progress-indicator]:bg-success h-1.5"
      />
    </div>
  )
}

  function OriginalPattern() {
  const { timers: exampleTimers, toast } = useExampleRuntime()

  const showUploadToast = () => {
    let progress = 0
    const id = toast.custom(() => <UploadToast progress={progress} />, {
      duration: Infinity,
    })

    const interval = exampleTimers.setInterval(() => {
      progress = Math.min(progress + Math.floor(exampleRandom() * 15) + 5, 100)

      toast.custom(() => <UploadToast progress={progress} />, {
        id,
        duration: progress >= 100 ? 3000 : Infinity,
      })

      if (progress >= 100) {
        clearInterval(interval)
      }
    }, 500)
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showUploadToast} variant="outline" className="w-fit">
        {<ExampleText>Upload Toast </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
