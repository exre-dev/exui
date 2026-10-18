
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { PhoneInput } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  return (
    <PhoneInput labels={exampleLocales.phoneInput}
      variant="sm"
      placeholder={copyExample("Enter phone number")}
      defaultCountry="NL"
      value="+31612345678"
    />
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
