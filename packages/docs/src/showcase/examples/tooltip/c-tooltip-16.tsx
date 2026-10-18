
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellIcon } from "lucide-react"

import { Button } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={copyExample("Notifications")}>
              <div className="relative">
                <BellIcon  />
                <span className="bg-destructive absolute -top-1 -right-1 block size-2 rounded-full" />
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-medium">{<ExampleText>3 new notifications</ExampleText>}</p>
              <a onClick={(event) => event.preventDefault()}
                href="#"
                className="text-xs font-medium underline underline-offset-2"
              >
                {<ExampleText>View all → </ExampleText>}</a>
            </div>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
