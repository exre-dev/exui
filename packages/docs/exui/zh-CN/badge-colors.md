### Badge 的 1.0 迁移

不再支持 `variant="ghost"` 和 `variant="link"`。可改用 `outline` 等受支持变体，或通过自定义类实现纯文字样式。`destructive` 现在使用实底；需要浅色背景时使用 `destructive-light`。

### 可读的状态配色

ExUI Badge 提供实底、浅底、描边的视觉层次。浅底和语义色描边
变体使用语义色与当前主题正文色推导文字、图标颜色，不复用实底状态色上的文字色，
因此浅红标签不再出现白字。默认蓝色标签和实底 focus 变体使用更深的填色，同时
保留原有语义前景色 Token。其他组件的品牌色与前景色不受影响。

全部 23 个内建变体都会在浅色、深色、纯黑主题的标准页面和卡片背景上，分别以
两档密度验证至少 **4.5:1 的文字对比度**。尺寸、字号、内边距、圆角不随颜色变体
改变。使用 `currentColor` 的图标跟随文字。图表和状态行应直接使用现有变体，
不必在每个示例重复写混色样式。

继续支持 `className`、`style`、`asChild` 和语义色覆盖。对比度保证覆盖内建配色
与标准表面；自定义颜色及背景需要消费方自行验证。Glass 仍独立开启并遵循共用
材质规则，针对这些标准背景单独验证，不保证任意图片背景上的可读性。

```tsx verify
import { Badge } from "@exre/exui"

export function StatusBadges() {
  return <div className="flex flex-wrap gap-2">
    <Badge variant="success-light">已通过</Badge>
    <Badge variant="warning-light">待处理</Badge>
    <Badge variant="destructive-light">已拒绝</Badge>
    <Badge variant="destructive-outline">需要关注</Badge>
    <Badge>新增</Badge>
  </div>
}
```
