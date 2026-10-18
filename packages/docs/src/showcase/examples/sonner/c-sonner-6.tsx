
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"



import { ActionButton, Button } from "@exre/exui"

  function OriginalPattern() {
  const { copy, toast } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={() => {
          const toastId = toast("Message archived", {
            description: "The conversation has been moved to archive.",
            action: (
              <ActionButton
                type="button"
                size="sm"
                className="ml-auto"
                onClick={() => {
                  toast.dismiss(toastId)
                  toast.success("Action undone")
                }}
              >
                {copy("Undo")}
              </ActionButton>
            ),
          })
        }}
        variant="outline"
        className="w-fit"
      >
        {<ExampleText>Toast with Action </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
