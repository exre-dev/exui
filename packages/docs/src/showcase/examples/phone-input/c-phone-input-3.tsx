
import { ExampleRuntimeProvider, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { PhoneInput } from "@exre/exui"

  function OriginalPattern() {
  const { copy: copyExample, locales: exampleLocales } = useExampleRuntime()

  return (
    <PhoneInput labels={exampleLocales.phoneInput}
      variant="lg"
      placeholder={copyExample("Enter phone number")}
      defaultCountry="US"
      value="+12125551234"
    />
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
