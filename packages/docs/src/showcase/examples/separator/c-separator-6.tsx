
import { ExampleRuntimeProvider, ExampleText } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Separator } from "@exre/exui"

  function OriginalPattern() {
  return (
    <div className="mx-auto flex w-full max-w-xs flex-col gap-2 text-sm">
      <p className="font-medium">{<ExampleText>Order Summary</ExampleText>}</p>
      <Separator />
      <dl className="flex items-center justify-between">
        <dt className="text-muted-foreground">{<ExampleText>Subtotal</ExampleText>}</dt>
        <dd>$49.00</dd>
      </dl>
      <dl className="flex items-center justify-between">
        <dt className="text-muted-foreground">{<ExampleText>Discount</ExampleText>}</dt>
        <dd className="text-success">-$5.00</dd>
      </dl>
      <dl className="flex items-center justify-between">
        <dt className="text-muted-foreground">{<ExampleText>Tax</ExampleText>}</dt>
        <dd>$3.52</dd>
      </dl>
      <Separator />
      <dl className="flex items-center justify-between font-medium">
        <dt>{<ExampleText>Total</ExampleText>}</dt>
        <dd>$47.52</dd>
      </dl>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
