
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { InfoIcon } from "lucide-react"



import { Button } from "@exre/exui"


  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  const showToast = () => {
    toast.custom(() => (
      <div className="bg-popover text-popover-foreground border-border rounded-[var(--border-radius)] flex w-full items-start gap-3 border border-l-4 border-l-blue-500 p-4 shadow-lg">
        <div className="text-blue-500">
          <InfoIcon className="size-5 shrink-0" aria-hidden="true" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm font-semibold">{<ExampleText>New Version Available</ExampleText>}</p>
          <p className="text-muted-foreground text-sm">
            {<ExampleText>v2.4.0 includes performance improvements and bug fixes. </ExampleText>}</p>
          <div className="mt-2 flex gap-2">
            <Button size="xs" variant="outline" onClick={() => toast.dismiss()}>
              {<ExampleText>Later </ExampleText>}</Button>
            <Button size="xs" onClick={() => toast.dismiss()}>
              {<ExampleText>Update Now </ExampleText>}</Button>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        {<ExampleText>Accent Border Toast </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
