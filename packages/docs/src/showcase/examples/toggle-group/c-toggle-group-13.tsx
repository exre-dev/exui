
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"
import { BellIcon, MailIcon, MessageSquareIcon, PhoneIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@exre/exui"


  function OriginalPattern() {
  const { copy: copyExample } = useExampleRuntime()

  return (
    <div className="flex items-center justify-center">
      <ToggleGroup
        type="multiple"
        defaultValue={["email", "push"]}
        variant="outline"
        spacing={1}
      >
        <ToggleGroupItem value="email" aria-label={copyExample("Email notifications")}>
          <MailIcon  />
          {<ExampleText>Email </ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="sms" aria-label={copyExample("SMS notifications")}>
          <PhoneIcon  />
          {<ExampleText>SMS </ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="push" aria-label={copyExample("Push notifications")}>
          <BellIcon  />
          {<ExampleText>Push </ExampleText>}</ToggleGroupItem>
        <ToggleGroupItem value="slack" aria-label={copyExample("Slack notifications")}>
          <MessageSquareIcon  />
          {<ExampleText>Slack </ExampleText>}</ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
