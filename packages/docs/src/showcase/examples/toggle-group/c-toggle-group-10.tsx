
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <ToggleGroup type="single" defaultValue="light" variant="outline">
        <ToggleGroupItem value="light" aria-label={copyExample("Light theme")}>
          <SunIcon  />
          {<ExampleText>Light </ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label={copyExample("Dark theme")}>
          <MoonIcon  />
          {<ExampleText>Dark </ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="system" aria-label={copyExample("System theme")}>
          <MonitorIcon  />
          {<ExampleText>System </ExampleText>}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
