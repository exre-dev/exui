### ExUI actions

ExUI `Button` uses shared tokens and has a capsule radius. ExUI's added `ActionButton` uses the same variant and size recipes but overrides the radius to `0.75rem`, giving it ordinary rounded corners. The default size reads shared density variables: `2.25rem` in standard density and `2rem` in compact density. Explicit `xs` is `1.5rem` high in both densities; `sm`, `lg` and icon sizes retain their geometry tokens. At a 16px root font size, these default heights are 36px, 32px and 24px respectively. Both offer `default`, `danger`, `destructive`, `outline`, `secondary`, `ghost` and `link` variants; `destructive` is a compatibility alias for the danger treatment. Glass is an independent opt-in and preserves the danger tone and focus state. Set `type="button"` outside form submission.

```tsx verify
import { ActionButton, Button } from "@exre/exui"

export function ActionChoices() {
  return <div>
    <Button type="button">Save</Button>
    <Button type="button" variant="outline">Preview</Button>
    <Button type="button" variant="ghost">More</Button>
    <ActionButton type="button">Continue</ActionButton>
    <ActionButton type="button" variant="danger" glass>Delete</ActionButton>
  </div>
}
```
