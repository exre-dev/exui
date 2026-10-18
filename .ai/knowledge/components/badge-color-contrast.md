# Badge 前景色与背景的配对

实底色上的前景色不能直接用于同色浅底或描边标签。ExUI 的危险实底前景色在浅色
主题为白色，复用它会使 `destructive-light` 接近白字浅红底、
`destructive-outline` 成为白底白字；暗色主题中的若干描边变体也会因实底前景色
过暗而失去可读性。

Badge 在组件内派生浅底、语义色描边的文字色，保留对当前语义色和主题正文色的
运行时引用，不修改全局 Token，避免同时改变 Button、Alert 等组件。品牌蓝实底
标签的字号较小，因此遵循 Badge 自己的文字门槛，不沿用通用 Token 策略中的
品牌填色例外。消费规则只在双语 Badge 能力片段及其生成的 docs/skill 页面维护。

验证必须加载完整文档样式，而非单独加载组件 CSS。公共包样式位于 `exui` 层，
文档私有工具类位于更高的 `utilities` 层；如果同一节点上同时命中私有的普通
文字类和公共包的暗色文字类，较高层可以覆盖暗色声明。默认品牌标签使用 Token
引用的颜色类，避免通用类在两个编译产物中重复后破坏主题切换与 Glass 绘制。

证据：`packages/components/src/components/reui/badge.tsx`、
`packages/docs/src/showcase/Badge.vrt.test.tsx`。该浏览器测试从真实合成背景测量
文字对比度，同时验证所有变体、标准背景、主题、密度、Glass、几何和覆盖入口；
不将自定义配色或任意图片背景纳入默认配色保证。
