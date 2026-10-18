### Shared Glass material

`glass` and the exact `ex-glass` class opt a surface into ExUI's material; each surface opts in independently, including a Select popup. Import `@exre/exui/style.css`. Mount one `GlassSeed` per document if optional refraction is desired. It renders invisible SVG filter definitions without visible layout content, is not a provider, and can render on the server. The material works without a seed. Browser support checks accept the filter declaration; they do not prove the engine paints refraction, so verify that visual effect in the target browser.

```tsx verify
import { Button, GlassSeed, SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue } from "@exre/exui"

export function GlassChoices() {
  return <><GlassSeed /><Button type="button" glass>Continue</Button>
    <SelectField defaultValue="one"><SelectTrigger glass><SelectValue /></SelectTrigger>
      <SelectContent glass><SelectItem value="one">One</SelectItem></SelectContent>
    </SelectField></>
}
```
