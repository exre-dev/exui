
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { CheckIcon } from "lucide-react"



import { Button } from "@exre/exui"


  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  const showToast = () => {
    toast.custom(() => (
      <div className="bg-invert text-invert-foreground rounded-[var(--border-radius)] flex w-full items-start gap-3 border border-transparent p-4 shadow-lg">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
          <CheckIcon className="size-3.5" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          <p className="text-sm font-semibold">{<ExampleText>Payment Successful</ExampleText>}</p>
          <p className="text-invert-foreground/70 text-sm">
            {<ExampleText>Invoice #INV-2025-0042 has been paid. $2,400.00 received. </ExampleText>}</p>
          <div className="mt-2 flex gap-2">
            <Button
              size="xs"
              variant="outline"
              className="bg-background/10 border-border/10 text-invert-foreground"
              onClick={() => toast.dismiss()}
            >
              {<ExampleText>View Receipt </ExampleText>}</Button>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        {<ExampleText>Invert Success Toast </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
