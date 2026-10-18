
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LinkIcon, SettingsIcon } from "lucide-react"



import { Button } from "@exre/exui"
import { Separator } from "@exre/exui"


  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  const showToast = () => {
    toast.custom(() => (
      <div className="bg-popover text-popover-foreground border-border rounded-[var(--border-radius)] flex w-full flex-col gap-3 border p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-lg flex size-10 shrink-0 items-center justify-center bg-linear-to-br from-violet-500 to-purple-600 text-white shadow-sm">
            <LinkIcon className="size-5" aria-hidden="true" />
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-sm font-semibold">{<ExampleText>Integration Connected</ExampleText>}</p>
            <p className="text-muted-foreground text-xs">{<ExampleText>workspace.slack.com</ExampleText>}</p>
          </div>
          <span className="flex items-center gap-1 text-xs text-green-600">
            <span className="size-1.5 rounded-full bg-green-500" />
            {<ExampleText>Active </ExampleText>}</span>
        </div>
        <Separator />
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>{<ExampleText>Syncing 3 channels</ExampleText>}</span>
          <span>{<ExampleText>Last sync: just now</ExampleText>}</span>
        </div>
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="outline"
            className="flex-1"
            onClick={() => toast.dismiss()}
          >
            <SettingsIcon className="size-3" aria-hidden="true" />
            {<ExampleText>Configure </ExampleText>}</Button>
          <Button size="xs" className="flex-1" onClick={() => toast.dismiss()}>
            {<ExampleText>Open Dashboard </ExampleText>}</Button>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        {<ExampleText>Integration Toast </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
