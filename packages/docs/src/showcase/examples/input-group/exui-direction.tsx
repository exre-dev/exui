import {
  DirectionProvider,
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@exre/exui"
import { ArrowRight, Search } from "lucide-react"

// Keep the existing consumer-side direction example after the official gallery.
export default function ExUIInputGroupDirection() {
  return <DirectionProvider dir="rtl">
    <div dir="rtl" className="showcase-stack">
      <InputGroup>
        <InputGroupAddon><Search /></InputGroupAddon>
        <InputGroupInput aria-label="البحث عن مشروع" placeholder="البحث عن مشروع…" />
        <InputGroupAddon align="inline-end">
          <InputGroupButton aria-label="إرسال البحث" size="icon-xs"><ArrowRight /></InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupTextarea aria-label="ملاحظات الفريق" placeholder="أضف ملاحظات للفريق…" />
        <InputGroupAddon align="block-end"><InputGroupText>ملاحظات الفريق</InputGroupText></InputGroupAddon>
      </InputGroup>
    </div>
  </DirectionProvider>
}
