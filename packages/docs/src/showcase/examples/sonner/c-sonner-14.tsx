
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { XIcon } from "lucide-react"



import { Button } from "@exre/exui"
import { Separator } from "@exre/exui"


  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  const showToast = () => {
    toast.custom(() => (
      <div className="bg-invert text-invert-foreground rounded-[var(--border-radius)] flex w-full flex-col gap-3 border border-transparent p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
            <XIcon className="size-3.5" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <p className="text-sm font-semibold">{<ExampleText>Build Failed</ExampleText>}</p>
            <p className="text-invert-foreground/70 text-sm">
              {<ExampleText>Compilation error in 2 files. Fix errors before deploying. </ExampleText>}</p>
          </div>
        </div>
        <Separator className="bg-border/10" />
        <div className="text-invert-foreground/60 space-y-1 font-mono text-xs">
          <p>{<ExampleText>src/api/auth.ts:42 — TypeError: undefined is not a function</ExampleText>}</p>
          <p>{<ExampleText>src/utils/parse.ts:18 — SyntaxError: Unexpected token</ExampleText>}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="xs"
            variant="outline"
            className="bg-background/10 border-border/10 text-invert-foreground flex-1"
            onClick={() => toast.dismiss()}
          >
            {<ExampleText>View Logs </ExampleText>}</Button>
          <Button
            size="xs"
            className="flex-1 border-red-800 bg-red-500 text-white hover:border-red-900 hover:bg-red-600"
            onClick={() => toast.dismiss()}
          >
            {<ExampleText>Retry Build </ExampleText>}</Button>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        {<ExampleText>Invert Error Toast </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
