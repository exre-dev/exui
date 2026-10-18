
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"



import { Button } from "@exre/exui"

  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  return (
    <div className="grid grid-cols-3 gap-2">
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() => toast("Default notification")}
      >
        {<ExampleText>Default </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast.success("Operation completed", {
            classNames: { icon: "text-green-500" },
          })
        }
      >
        {<ExampleText>Success </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast.error("Operation failed", {
            classNames: { icon: "text-destructive" },
          })
        }
      >
        {<ExampleText>Error </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast.warning("Proceed with caution", {
            classNames: { icon: "text-yellow-500" },
          })
        }
      >
        {<ExampleText>Warning </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast.info("System update available", {
            classNames: { icon: "text-primary" },
          })
        }
      >
        {<ExampleText>Info </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() => toast.loading("Processing...")}
      >
        {<ExampleText>Loading </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
