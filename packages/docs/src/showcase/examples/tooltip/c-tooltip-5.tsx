
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { ArrowRightIcon, InfoIcon } from "lucide-react"

import { Badge } from "@exre/exui"

import { Button } from "@exre/exui"
import { Tooltip, TooltipContent, TooltipTrigger } from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label={copyExample("Notifications")}>
              <div className="relative">
                <InfoIcon  />
                <Badge
                  variant="destructive"
                  size="xs"
                  className="absolute -top-3.5 -right-3.5"
                >
                  3
                </Badge>
              </div>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="p-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{<ExampleText>Notifications</ExampleText>}</span>
                <Badge variant="destructive" size="xs">
                  {<ExampleText>3 new </ExampleText>}</Badge>
              </div>
              <div className="flex flex-col gap-1 opacity-80">
                <p>{<ExampleText>• Sarah commented on your PR</ExampleText>}</p>
                <p>{<ExampleText>• Build #421 completed</ExampleText>}</p>
                <p>{<ExampleText>• New team member joined</ExampleText>}</p>
              </div>
              <a onClick={(event) => event.preventDefault()}
                href="#"
                className="flex items-center gap-1 font-medium underline underline-offset-2"
              >
                {<ExampleText>View all </ExampleText>}<ArrowRightIcon className="size-3.5" />
              </a>
            </div>
          </TooltipContent>
        </Tooltip>
      </>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
