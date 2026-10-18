
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

  const showToast = () => {
    toast.custom(() => (
      <ExampleRuntimeConsumer render={({copy: copyExample}) => (<div className="bg-invert text-invert-foreground rounded-[var(--border-radius)] flex w-full items-start gap-3 border border-transparent p-4 shadow-lg">
        <Avatar className="border-border/10 size-9 shrink-0 border">
          <AvatarImage
            src="/examples/reui/photos/dfed3098ae0011e5a5.jpg"
            alt={copyExample("Sarah Chen")}
          />
          <AvatarFallback>{<ExampleText>SC</ExampleText>}</AvatarFallback>
        </Avatar>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{<ExampleText>Sarah Chen</ExampleText>}</p>
            <span className="text-invert-foreground/40 text-xs">{<ExampleText>Just now</ExampleText>}</span>
          </div>
          <p className="text-invert-foreground/70 text-sm">
            {<ExampleText>Invited you to collaborate on "Design System v2" </ExampleText>}</p>
          <div className="mt-2 flex gap-2">
            <Button
              size="xs"
              variant="outline"
              className="bg-background/10 border-border/10 text-invert-foreground"
              onClick={() => toast.dismiss()}
            >
              {<ExampleText>Decline </ExampleText>}</Button>
            <Button
              size="xs"
              className="border-blue-800 bg-blue-500 text-white hover:border-blue-900 hover:bg-blue-600"
              onClick={() => toast.dismiss()}
            >
              {<ExampleText>Accept </ExampleText>}</Button>
          </div>
        </div>
      </div>)} />
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        {<ExampleText>Invert Invite Toast </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
