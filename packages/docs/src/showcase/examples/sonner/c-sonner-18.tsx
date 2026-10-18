
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"



import { Button } from "@exre/exui"

  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={() =>
          toast("File uploaded successfully", {
            description: "report-2025.pdf has been saved to your documents.",
            closeButton: true,
            classNames: {
              closeButton: "left-auto! -right-4! -top-1!",
            },
          })
        }
        variant="outline"
        className="w-fit"
      >
        {<ExampleText>Toast with Close Button </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
