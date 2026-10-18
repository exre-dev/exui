
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BluetoothIcon, MapPinIcon, PlaneIcon, WifiIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <ToggleGroup
        type="multiple"
        orientation="vertical"
        spacing={1}
        defaultValue={["wifi", "bluetooth"]}
      >
        <ToggleGroupItem value="wifi" aria-label={copyExample("Wi-Fi")} className="w-full">
          <WifiIcon  />
          {<ExampleText>Wi-Fi </ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem
          value="bluetooth"
          aria-label={copyExample("Bluetooth")}
          className="w-full"
        >
          <BluetoothIcon  />
          {<ExampleText>Bluetooth </ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem
          value="airplane"
          aria-label={copyExample("Airplane Mode")}
          className="w-full"
        >
          <PlaneIcon  />
          {<ExampleText>Airplane Mode </ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem
          value="location"
          aria-label={copyExample("Location")}
          className="w-full"
        >
          <MapPinIcon  />
          {<ExampleText>Location </ExampleText>}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
