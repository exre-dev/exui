### 共用 Glass 材质

`glass` 属性与精确的 `ex-glass` 类名都可启用 ExUI 材质；每个表面分别选择，包括 Select 弹层。先导入 `@exre/exui/style.css`。如需可选折射，每个 document 挂载一个 `GlassSeed`。它渲染不可见的 SVG 滤镜定义，不占可见布局内容，并非 Provider，可在服务端渲染；没有它也有基础材质。浏览器支持检测只确认滤镜声明可被接受，不能证明折射被正确绘制；关键视觉效果需在目标浏览器检查。

```tsx verify
import { Button, GlassSeed, SelectContent, SelectField, SelectItem, SelectTrigger, SelectValue } from "@exre/exui"

export function GlassChoices() {
  return <><GlassSeed /><Button type="button" glass>继续</Button>
    <SelectField defaultValue="one"><SelectTrigger glass><SelectValue /></SelectTrigger>
      <SelectContent glass><SelectItem value="one">选项一</SelectItem></SelectContent>
    </SelectField></>
}
```
