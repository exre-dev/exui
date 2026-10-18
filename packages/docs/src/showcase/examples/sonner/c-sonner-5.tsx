
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
        onClick={() =>
          toast("Quick notice", {
            description: "Disappears in 2 seconds.",
            duration: 2000,
          })
        }
      >
        {<ExampleText>2s Duration </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Standard notice", {
            description: "Disappears in 5 seconds.",
            duration: 5000,
          })
        }
      >
        {<ExampleText>5s Duration </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Extended notice", {
            description: "Stays for 10 seconds.",
            duration: 10000,
          })
        }
      >
        {<ExampleText>10s Duration </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="col-span-3 w-full"
        onClick={() =>
          toast("Persistent notice", {
            description: "This toast stays until dismissed.",
            duration: Infinity,
            closeButton: true,
          })
        }
      >
        {<ExampleText>Persistent </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
