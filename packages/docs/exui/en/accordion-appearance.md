### Nova-style Accordion

ExUI's Accordion keeps the Radix single/multiple API but uses a plain Nova-style list: no outer panel border, separators between items and transparent open rows. The trigger has a visible keyboard focus ring. Expanded content follows its current content height, including nested items and text wrapping after width changes; do not set a fixed height to compensate.

```tsx verify
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@exre/exui"

export function Details() {
  return <Accordion type="single" collapsible defaultValue="delivery">
    <AccordionItem value="delivery"><AccordionTrigger>Delivery</AccordionTrigger>
      <AccordionContent>Track the order in your account.</AccordionContent></AccordionItem>
  </Accordion>
}
```
