
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"



import { ActionButton, Button } from "@exre/exui"

  function OriginalPattern() {
  const { copy, toast } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={() => {
          const toastId = toast("Confirm deletion", {
            description:
              "This item will be permanently deleted. This action cannot be undone.",
            action: (
              <ActionButton
                type="button"
                size="sm"
                onClick={() => {
                  toast.dismiss(toastId)
                  toast.success("Item deleted")
                }}
              >
                {copy("Delete")}
              </ActionButton>
            ),
            cancel: (
              <ActionButton
                type="button"
                size="sm"
                variant="secondary"
                className="ml-auto"
                onClick={() => toast.dismiss(toastId)}
              >
                {copy("Cancel")}
              </ActionButton>
            ),
          })
        }}
        variant="outline"
        className="w-fit"
      >
        {<ExampleText>Confirm Action </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
