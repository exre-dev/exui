
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Users as RiFacebookFill, CodeXml as RiGithubFill, Globe as RiGoogleFill, AtSign as RiTwitterXFill } from "lucide-react"

import { Button } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="flex flex-col gap-2">
      <Button variant="outline">
        <RiGoogleFill
          data-icon="inline-start"
          aria-hidden="true"
          className="text-[#DB4437] dark:text-white/60"
          size={16}
        />
        <span className="text-muted-foreground">{<ExampleText>Login with</ExampleText>}</span> {<ExampleText> Google </ExampleText>}</Button>
      <Button variant="outline">
        <RiTwitterXFill
          data-icon="inline-start"
          aria-hidden="true"
          className="text-[#14171a] dark:text-white/60"
          size={16}
        />
        <span className="text-muted-foreground">{<ExampleText>Login with</ExampleText>}</span> {<ExampleText> X </ExampleText>}</Button>
      <Button variant="outline">
        <RiFacebookFill
          data-icon="inline-start"
          aria-hidden="true"
          className="text-[#1877f2] dark:text-white/60"
          size={16}
        />
        <span className="text-muted-foreground">{<ExampleText>Login with</ExampleText>}</span> {<ExampleText> Facebook </ExampleText>}</Button>
      <Button variant="outline">
        <RiGithubFill
          data-icon="inline-start"
          aria-hidden="true"
          className="text-[#333333] dark:text-white/60"
          size={16}
        />
        <span className="text-muted-foreground">{<ExampleText>Login with</ExampleText>}</span> {<ExampleText> GitHub </ExampleText>}</Button>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
