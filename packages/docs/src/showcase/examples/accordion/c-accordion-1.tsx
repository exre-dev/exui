import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@exre/exui"

import { usePreviewCopy } from "../../preview-copy"

const items = [
  {
    value: "item-1",
    trigger: ["Is it accessible ?", "是否支持无障碍？"],
    content: ["Yes. It adheres to the WAI-ARIA design pattern.", "是的，遵循 WAI-ARIA 设计模式。"],
  },
  {
    value: "item-2",
    trigger: ["Is it styled?", "是否自带样式？"],
    content:
      ["Yes. It comes with default styles that matches the other components' aesthetic.", "是的，默认样式与其他组件保持一致。"],
  },
  {
    value: "item-3",
    trigger: ["Is it animated?", "是否有动画？"],
    content:
      ["Yes. It's animated by default, but you can disable it if you prefer.", "是的，默认开启动画，也可以按需关闭。"],
  },
] as const

export default function Pattern() {
  const copy = usePreviewCopy()
  return (
    <div className="mx-auto mb-auto w-full max-w-lg">
      <Accordion type="single" collapsible defaultValue="item-1">
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>{copy(item.trigger[0], item.trigger[1])}</AccordionTrigger>
            <AccordionContent>{copy(item.content[0], item.content[1])}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
