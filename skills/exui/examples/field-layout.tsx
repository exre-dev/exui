import "@exre/exui/style.css"
import { useId, useState } from "react"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel, Input, Switch } from "@exre/exui"

// Each .consumer-field-item is its own container, including in narrow grid columns.
const layoutCss = `
.consumer-field-item { container: consumer-field / inline-size; min-width: 0; width: 100%; }
.consumer-field-item > [data-slot="field"] { display: grid; grid-template-columns: minmax(0, 1fr); gap: .75rem; align-items: start; }
.consumer-field-item .consumer-field-heading { display: grid; gap: .25rem; min-width: 0; }
.consumer-field-item .consumer-field-content { display: grid; gap: .5rem; width: 100%; min-width: 0; max-width: none; margin-inline: 0; }
@container consumer-field (min-width: 21.75rem) {
  .consumer-field-item > [data-slot="field"] { grid-template-columns: 9rem minmax(12rem, 1fr); }
  .consumer-field-item .consumer-field-content { max-width: 18rem; justify-self: start; }
  .consumer-field-item .consumer-field-content[data-align="right"] { justify-self: end; }
}
`

export default function StandaloneFields() {
  const nameId = useId()
  const noticesId = useId()
  const [name, setName] = useState("")
  const [notices, setNotices] = useState(true)
  const [touched, setTouched] = useState(false)
  const invalid = touched && name.trim().length === 0
  return <section style={{ display: "grid", gap: "1.25rem", minWidth: 0 }}>
    <style>{layoutCss}</style>
    <div className="consumer-field-item">
      <Field data-invalid={invalid}>
        <div className="consumer-field-heading">
          <FieldLabel htmlFor={nameId}>Display name</FieldLabel>
          <FieldDescription id={`${nameId}-description`}>Shown to teammates</FieldDescription>
        </div>
        <FieldContent className="consumer-field-content" data-align="right">
          <Input id={nameId} value={name} onChange={(event) => setName(event.target.value)} onBlur={() => setTouched(true)}
            aria-invalid={invalid} aria-describedby={[`${nameId}-description`, invalid && `${nameId}-error`].filter(Boolean).join(" ")} />
          {invalid && <FieldError id={`${nameId}-error`}>Enter a display name.</FieldError>}
        </FieldContent>
      </Field>
    </div>
    <div className="consumer-field-item">
      <Field>
        <div className="consumer-field-heading">
          <FieldLabel htmlFor={noticesId}>Notifications</FieldLabel>
          <FieldDescription id={`${noticesId}-description`}>Receive project updates</FieldDescription>
        </div>
        <FieldContent className="consumer-field-content">
          <Switch id={noticesId} checked={notices} onCheckedChange={setNotices} aria-describedby={`${noticesId}-description`} />
        </FieldContent>
      </Field>
    </div>
    <div className="consumer-field-item">
      <Field>
        <div className="consumer-field-heading"><FieldLabel asChild><span>Workspace</span></FieldLabel></div>
        <FieldContent className="consumer-field-content"><p>Design workspace</p></FieldContent>
      </Field>
    </div>
  </section>
}
