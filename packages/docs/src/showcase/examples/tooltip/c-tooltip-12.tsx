
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-not-allowed" tabIndex={0} role="button" aria-disabled="true" aria-label={copyExample("Delete Project")}>
              <Button variant="outline" disabled>
                {<ExampleText>Delete Project </ExampleText>}</Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{<ExampleText>You need admin access to delete projects</ExampleText>}</p>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
