
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { LayoutDashboardIcon } from "lucide-react"

import { Frame, FramePanel } from "@exre/exui"
import { IconTile } from "@exre/exui"



  function OriginalPattern() {
  return (
    <Frame className="w-full max-w-xs">
      <FramePanel className="flex flex-col gap-3">
        <IconTile variant="elevated" size="lg" aria-hidden="true">
          <LayoutDashboardIcon  />
        </IconTile>
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-medium">{<ExampleText>Unified dashboard</ExampleText>}</h3>
          <p className="text-muted-foreground text-xs">
            {<ExampleText>Track every project, deployment and metric from a single workspace. </ExampleText>}</p>
        </div>
      </FramePanel>
    </Frame>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
