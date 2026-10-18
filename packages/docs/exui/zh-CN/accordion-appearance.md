### Nova 风格 Accordion

ExUI 的 Accordion 沿用 Radix 单选/多选 API，但默认呈现 Nova 式平铺列表：没有外框，相邻项用分隔线区分，展开项保持透明。触发器有清晰的键盘焦点环。展开内容随当前内容高度变化，包括嵌套项及容器变窄后的换行；无需用固定高度补偿。

```tsx verify
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@exre/exui"

export function Details() {
  return <Accordion type="single" collapsible defaultValue="delivery">
    <AccordionItem value="delivery"><AccordionTrigger>配送</AccordionTrigger>
      <AccordionContent>可在账户中查看订单状态。</AccordionContent></AccordionItem>
  </Accordion>
}
```
