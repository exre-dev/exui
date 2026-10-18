
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"



import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"

  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  const showUserToast = () => {
    toast.custom(() => (
      <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="bg-popover text-popover-foreground border-border rounded-[var(--border-radius)] flex w-full items-start gap-3 border p-4 shadow-lg">
        <Avatar className="size-9 shrink-0">
          <AvatarImage
            src="/examples/reui/photos/e93553df2422635515.jpg"
            alt={copyExample("Alex Johnson")}
          />
          <AvatarFallback>{<ExampleText>AJ</ExampleText>}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{<ExampleText>Alex Johnson</ExampleText>}</p>
            <span className="text-muted-foreground text-xs">{<ExampleText>2m ago</ExampleText>}</span>
          </div>
          <p className="text-muted-foreground text-sm">
            {<ExampleText>Hey! I've finished the design review. Let me know when you're free to discuss. </ExampleText>}</p>
          <div className="mt-2 flex gap-2">
            <Button size="xs" variant="outline" onClick={() => toast.dismiss()}>
              {<ExampleText>Dismiss </ExampleText>}</Button>
            <Button size="xs" onClick={() => toast.dismiss()}>
              {<ExampleText>Reply </ExampleText>}</Button>
          </div>
        </div>
      </div>)} />
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showUserToast} variant="outline" className="w-fit">
        {<ExampleText>User Message Toast </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
