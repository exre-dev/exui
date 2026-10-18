
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Button } from "@exre/exui"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@exre/exui"
import { Input } from "@exre/exui"
import {
  SelectField as Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId, copy: copyExample } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-lg">
      <FieldGroup>
        <Field orientation="responsive">
          <FieldLabel htmlFor={exampleId("resp-first")}>{<ExampleText>First Name</ExampleText>}</FieldLabel>
          <Input id={exampleId("resp-first")} placeholder={copyExample("First name")} />
        </Field>
        <Field orientation="responsive">
          <FieldLabel htmlFor={exampleId("resp-last")}>{<ExampleText>Last Name</ExampleText>}</FieldLabel>
          <Input id={exampleId("resp-last")} placeholder={copyExample("Last name")} />
        </Field>
        <Field orientation="responsive">
          <FieldLabel htmlFor={exampleId("resp-email")}>{<ExampleText>Email</ExampleText>}</FieldLabel>
          <Input id={exampleId("resp-email")} type="email" placeholder={copyExample("you@example.com")} />
        </Field>
        <Field orientation="responsive">
          <FieldLabel htmlFor={exampleId("resp-role")}>{<ExampleText>Role</ExampleText>}</FieldLabel>
          <Select defaultValue="member">
            <SelectTrigger id={exampleId("resp-role")}>
              <SelectValue placeholder={copyExample("Select role")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">{<ExampleText>Admin</ExampleText>}</SelectItem>
              <SelectItem value="member">{<ExampleText>Member</ExampleText>}</SelectItem>
              <SelectItem value="viewer">{<ExampleText>Viewer</ExampleText>}</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <FieldSeparator />
        <FieldDescription>
          {<ExampleText>The invited member will receive an email with a link to join. </ExampleText>}</FieldDescription>
        <div className="flex justify-end gap-2">
          <Button variant="outline">{<ExampleText>Cancel</ExampleText>}</Button>
          <Button>{<ExampleText>Send Invite</ExampleText>}</Button>
        </div>
      </FieldGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
