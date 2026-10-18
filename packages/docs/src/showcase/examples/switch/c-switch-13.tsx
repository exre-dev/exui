
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Separator } from "@exre/exui"
import { Switch } from "@exre/exui"

const settings = [
  {
    id: "auto-save",
    label: "Auto-save",
    description: "Save changes automatically",
    checked: true,
  },
  {
    id: "spell-check",
    label: "Spell check",
    description: "Highlight spelling errors",
    checked: true,
  },
  {
    id: "line-numbers",
    label: "Line numbers",
    description: "Show line numbers in editor",
    checked: false,
  },
]

  function OriginalPattern() {
  return (
    <div className="mx-auto w-full max-w-xs">
      <p className="mb-3 text-sm font-medium">{<ExampleText>Editor Preferences</ExampleText>}</p>
      <Separator />
      <div className="flex flex-col">
        {<ExampleText>{settings.map((setting) => (
          <ExampleRuntimeConsumer key={setting.id} render={({id: exampleId}) => (<label
            key={setting.id}
            htmlFor={exampleId(setting.id)}
            className="flex cursor-pointer items-center justify-between border-b py-3 last:border-b-0"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">{<ExampleText>{setting.label}</ExampleText>}</span>
              <span className="text-muted-foreground text-xs">
                {<ExampleText>{setting.description}</ExampleText>}
              </span>
            </div>
            <Switch
              id={exampleId(setting.id)}
              defaultChecked={setting.checked}
              size="sm"
            />
          </label>)} />
        ))}</ExampleText>}
      </div>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
