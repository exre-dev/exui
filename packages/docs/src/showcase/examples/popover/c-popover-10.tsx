"use client"


import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { SettingsIcon } from "lucide-react"

import { useState } from "react"

import { Button } from "@exre/exui"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@exre/exui"
import { Slider } from "@exre/exui"
import { Switch } from "@exre/exui"


  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  const [volume, setVolume] = useState([75])

  return (
    <div className="flex min-h-[100px] items-center justify-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon" aria-label={copyExample("Quick Settings")}>
            <SettingsIcon aria-hidden="true" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 gap-0 p-0" align="end">
          <div className="border-b p-3">
            <h4 className="m-0 font-medium">{<ExampleText>Quick Settings</ExampleText>}</h4>
            <p className="text-muted-foreground">{<ExampleText>Adjust your preferences.</ExampleText>}</p>
          </div>
          <div className="space-y-3 p-3 pb-4">
            <div className="flex items-center justify-between">
              <label htmlFor={exampleId("qs-dark")}>{<ExampleText>Dark Mode</ExampleText>}</label>
              <Switch id={exampleId("qs-dark")} />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor={exampleId("qs-notif")}>{<ExampleText>Notifications</ExampleText>}</label>
              <Switch id={exampleId("qs-notif")} defaultChecked />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label>{<ExampleText>Volume</ExampleText>}</label>
                <span className="text-muted-foreground">{<ExampleText>{volume[0]}</ExampleText>}%</span>
              </div>
              <Slider
                value={volume}
                onValueChange={(v) => setVolume(v as number[])}
                max={100}
                step={1}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
