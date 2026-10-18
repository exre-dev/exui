
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { PhoneInput } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  return (
    <PhoneInput labels={exampleLocales.phoneInput}
      readOnly
      value="+12125551234"
      placeholder={copyExample("Enter phone number")}
    />
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
