
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"



import { Button } from "@exre/exui"

  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  const showToast = () => {
    toast("Event has been created", {
      description: "Monday, January 3rd at 6:00pm",
    })
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        {<ExampleText>Show Toast with Description </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
