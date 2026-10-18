### Standalone ExItem

`ExItem` provides a title, description and layout around any child; it does not bind form state. A direct `Input` receives an ID and description association automatically. For another control, give it an ID and pass the same `controlId` to `ExItem`. Conflicting `controlId` and direct Input IDs throw. Numeric `contentMaxWidth` is CSS pixels; use a CSS length for scalable sizing.

```tsx verify
import { ExItem, Input, Switch } from "@exre/exui"

export function SettingsItems() {
  return <><ExItem title="Name" desc="Shown to teammates"><Input defaultValue="Alex" /></ExItem>
    <ExItem title="Notifications" controlId="notices" layout="horizontal"><Switch id="notices" /></ExItem></>
}
```
