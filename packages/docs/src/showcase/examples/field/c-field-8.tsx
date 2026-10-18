
import { ExampleRuntimeProvider, ExampleText, useExampleRuntime } from "../_shared/example-runtime"
import dictionary from "./copy.generated"

import { Checkbox } from "@exre/exui"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@exre/exui"

  function OriginalPattern() {
  const { id: exampleId } = useExampleRuntime()

  return (
    <div className="mx-auto w-full max-w-xs">
      <FieldGroup>
        <FieldSet>
          <FieldLegend variant="label">{<ExampleText>Access Permissions</ExampleText>}</FieldLegend>
          <FieldDescription>
            {<ExampleText>Configure what this role can access. </ExampleText>}</FieldDescription>
          <FieldGroup className="gap-4">
            <Field orientation="horizontal">
              <Checkbox id={exampleId("perm-read")} defaultChecked />
              <FieldContent>
                <FieldTitle>{<ExampleText>Read</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>View resources and data. Cannot make changes. </ExampleText>}</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id={exampleId("perm-write")} defaultChecked />
              <FieldContent>
                <FieldTitle>{<ExampleText>Write</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>Create and edit resources. Requires read access. </ExampleText>}</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id={exampleId("perm-delete")} />
              <FieldContent>
                <FieldTitle>{<ExampleText>Delete</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>Permanently remove resources. This action is irreversible. </ExampleText>}</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id={exampleId("perm-admin")} disabled />
              <FieldContent>
                <FieldTitle>{<ExampleText>Admin</ExampleText>}</FieldTitle>
                <FieldDescription>
                  {<ExampleText>Full access to all settings. Only available to owners. </ExampleText>}</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </FieldSet>
      </FieldGroup>
    </div>
  )
}

export default function Pattern() { return <ExampleRuntimeProvider dictionary={dictionary}><OriginalPattern /></ExampleRuntimeProvider> }
