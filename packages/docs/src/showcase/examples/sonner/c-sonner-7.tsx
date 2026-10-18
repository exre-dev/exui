
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"



import { Button } from "@exre/exui"

  function OriginalPattern() {
  const {format: formatExample,  timers: exampleTimers, toast } = useExampleRuntime()

  const handleDeploy = () => {
    toast.promise(
      exampleTimers.delay(2000).then(() => ({ name: "production" })),
      {
        loading: "Deploying to production...",
        success: (data) => formatExample("Deployed to {name} successfully", { name: data.name }),
        error: "Deployment failed. Please try again.",
      }
    )
  }

  return (
    <div className="flex items-center justify-center">
      <Button onClick={handleDeploy} variant="outline" className="w-fit">
        {<ExampleText>Deploy </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
