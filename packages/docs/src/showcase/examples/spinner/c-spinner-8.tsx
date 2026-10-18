
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Card, CardContent } from "@exre/exui"
import { Spinner } from "@exre/exui"

  function OriginalPattern() {
  return (
    <Card className="min-h-[200px] w-full max-w-xs">
      <CardContent className="flex grow flex-col items-center justify-center gap-4">
        <Spinner className="size-4 opacity-50" />
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium">{<ExampleText>Setting up your workspace</ExampleText>}</p>
          <p className="text-muted-foreground text-xs">
            {<ExampleText>This may take a few seconds... </ExampleText>}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
