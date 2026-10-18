
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
          toast("Top Left", {
            description: "Notification appears in the top left.",
            position: "top-left",
          })
        }
      >
        {<ExampleText>Top Left </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Top Center", {
            description: "Notification appears in the top center.",
            position: "top-center",
          })
        }
      >
        {<ExampleText>Top Center </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Top Right", {
            description: "Notification appears in the top right.",
            position: "top-right",
          })
        }
      >
        {<ExampleText>Top Right </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Bottom Left", {
            description: "Notification appears in the bottom left.",
            position: "bottom-left",
          })
        }
      >
        {<ExampleText>Bottom Left </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Bottom Center", {
            description: "Notification appears in the bottom center.",
            position: "bottom-center",
          })
        }
      >
        {<ExampleText>Bottom Center </ExampleText>}</Button>
      <Button
        size="sm"
        variant="outline"
        className="w-full"
        onClick={() =>
          toast("Bottom Right", {
            description: "Notification appears in the bottom right.",
            position: "bottom-right",
          })
        }
      >
        {<ExampleText>Bottom Right </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
