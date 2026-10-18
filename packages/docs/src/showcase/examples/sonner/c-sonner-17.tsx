
import { ExampleRuntimeProvider, ExampleRuntimeConsumer, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"



import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@exre/exui"
import { Button } from "@exre/exui"
import { Separator } from "@exre/exui"

const reviewers = [
  {
    name: "Alex Johnson",
    avatar:
      "/examples/reui/photos/e93553df2422635515.jpg",
    initials: "AJ",
  },
  {
    name: "Sarah Chen",
    avatar:
      "/examples/reui/photos/dfed3098ae0011e5a5.jpg",
    initials: "SC",
  },
  {
    name: "David Kim",
    avatar:
      "/examples/reui/photos/973d47055c51440af7.jpg",
    initials: "DK",
  },
]

  function OriginalPattern() {
  const { toast } = useExampleRuntime()

  const showToast = () => {
    toast.custom(() => (
      <div className="bg-invert text-invert-foreground rounded-[var(--border-radius)] flex w-full flex-col gap-3 border border-transparent p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{<ExampleText>Pull Request #284</ExampleText>}</p>
          <span className="text-invert-foreground/40 text-xs">{<ExampleText>2m ago</ExampleText>}</span>
        </div>
        <p className="text-invert-foreground/70 text-sm">
          {<ExampleText>All reviewers approved. Ready to merge into</ExampleText>}{<ExampleText>{" "}</ExampleText>}
          <code className="bg-background/10 rounded px-1 py-0.5 font-mono text-xs">
            {<ExampleText>main </ExampleText>}</code>
        </p>
        <Separator className="bg-border/10" />
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {<ExampleText>{reviewers.map((reviewer) => (
              <ExampleRuntimeConsumer key={reviewer.name} render={({copy: copyExample}) => (<Avatar
                key={reviewer.name}
                className="border-invert size-6 border-2"
              >
                <AvatarImage src={reviewer.avatar} alt={copyExample(reviewer.name)} />
                <AvatarFallback className="text-[10px]">
                  {<ExampleText>{reviewer.initials}</ExampleText>}
                </AvatarFallback>
              </Avatar>)} />
            ))}</ExampleText>}
          </div>
          <div className="flex gap-2">
            <Button
              size="xs"
              variant="outline"
              className="bg-background/10 border-border/10 text-invert-foreground"
              onClick={() => toast.dismiss()}
            >
              {<ExampleText>View </ExampleText>}</Button>
            <Button
              size="xs"
              className="border-green-800 bg-green-500 text-white hover:border-green-900 hover:bg-green-600"
              onClick={() => {
                toast.dismiss()
                toast.success("Merged successfully")
              }}
            >
              {<ExampleText>Merge </ExampleText>}</Button>
          </div>
        </div>
      </div>
    ))
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={showToast} variant="outline" className="w-fit">
        {<ExampleText>PR Merge Toast </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
