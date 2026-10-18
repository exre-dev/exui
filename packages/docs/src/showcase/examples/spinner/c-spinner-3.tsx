
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Badge } from "@exre/exui"

import { Spinner } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Badge>
        <Spinner data-icon="inline-start" />
        {<ExampleText>Updating </ExampleText>}</Badge>
      <Badge variant="secondary">
        <Spinner data-icon="inline-start" />
        {<ExampleText>Syncing </ExampleText>}</Badge>
      <Badge variant="outline">
        <Spinner data-icon="inline-start" />
        {<ExampleText>Loading </ExampleText>}</Badge>
      <Badge variant="destructive-light">
        <Spinner data-icon="inline-start" />
        {<ExampleText>Updating </ExampleText>}</Badge>
      <Badge variant="success-light">
        <Spinner data-icon="inline-start" />
        {<ExampleText>Syncing </ExampleText>}</Badge>
      <Badge variant="info-light">
        <Spinner data-icon="inline-start" />
        {<ExampleText>Loading </ExampleText>}</Badge>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
