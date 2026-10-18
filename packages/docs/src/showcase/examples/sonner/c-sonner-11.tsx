
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ExternalLinkIcon } from "lucide-react"



import { Button } from "@exre/exui"


  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  const showStatusToast = () => {
    toast.custom(() => (
      <div className="bg-popover text-popover-foreground border-border rounded-[var(--border-radius)] flex w-full flex-col gap-2 border p-4 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-green-500" />
          <p className="text-sm font-medium">{<ExampleText>Deployment Successful</ExampleText>}</p>
        </div>
        <div className="text-muted-foreground space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span>{<ExampleText>Environment</ExampleText>}</span>
            <span className="text-foreground font-medium">{<ExampleText>Production</ExampleText>}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{<ExampleText>Duration</ExampleText>}</span>
            <span className="text-foreground font-medium">{<ExampleText>42s</ExampleText>}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{<ExampleText>Commit</ExampleText>}</span>
            <span className="text-foreground font-mono font-medium">
              {<ExampleText>a1b2c3d </ExampleText>}</span>
          </div>
        </div>
        <div className="mt-1 flex gap-2">
          <Button
            size="xs"
            variant="outline"
            className="flex-1"
            onClick={() => toast.dismiss()}
          >
            <ExternalLinkIcon className="size-3" aria-hidden="true" />
            {<ExampleText>View Logs </ExampleText>}</Button>
          <Button size="xs" className="flex-1" onClick={() => toast.dismiss()}>
            {<ExampleText>Open Site </ExampleText>}</Button>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showStatusToast} variant="outline" className="w-fit">
        {<ExampleText>Deployment Toast </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
