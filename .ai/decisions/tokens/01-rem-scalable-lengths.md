# 内建可缩放长度统一使用 rem

最后更新：2026-10-16

状态：已接受
模块：tokens
日期：2026-09-16
来源：`.notes/rem-sizing/specs/2026-10-16-complete-root-font-scaling.md`（扩展）、`.notes/rem-sizing/specs/2026-09-15-rem-sizing-design.md`、`packages/tokens/scripts/token-length-policy.mjs`

背景：仅 Token 配方使用 rem 无法覆盖复杂组件的固定列宽、虚拟行估算、数字定位默认值与内置第三方的可视尺寸；根字号变化会使 CSS 布局与数值算法处于不同尺度。2026-10-16 的已批准扩展替代了此前不添加运行时监听和第三方不适配的限制。

决策：内建可缩放静态长度以 16px 设计基准写为 rem，零为无单位0。只接受数字的 API 在运行时将相对默认值换算为实际 CSS 像素。显式调用方数字参数与受控 resize 状态保持原像素语义；DOM 测量、SVG 内容坐标、签名笔迹与业务数据保持原单位。细边框、分隔线、焦点环、阴影、胶囊圆角及边框补偿维持固定。Glass 模糊属于相对视觉长度。ExUI 不设置根字号、不声明缩放变量、不增加 RWD 双入口；运行时仅在数值边界提供必要的观测、换算与清理。机制与确切边界见 [[../../architectures/components/public-surface]] 的根字号尺寸边界。

理由：应用仍以根字号控制整体尺寸，CSS 原生 rem 与数字算法共享同一基准。另增全局 scale 或重解释全部 number 参数会形成第二套控制机制或破坏调用方已明确给定的坐标语义。

影响：16px 下保持原设计值；非16px宿主会看到更多默认尺寸随字号变化，这是已接受的行为变化。可见区域仍受视口、容器、换行等限制，不承诺整页截图严格等比。第三方私有或低层无生命周期入口的剩余范围必须在消费者文档明确列出，不能以源码扫描冒充实际渲染验证。

重新审视条件：需要同页不同缩放基准、任意跨 document 表模型归属、依赖提供新的私有几何适配点，或更改16px设计基准时。

证据：`packages/tokens/scripts/token-length-policy.mjs`、`glass-policy.mjs` 及其策略测试；`packages/components/src/lib/rem.ts`、`hooks/use-root-rem.ts`、`lib/recharts.tsx`、`lib/tanstack-table.ts`；`packages/docs/tests/browser/RemSizing.vrt.test.tsx` 与六组 `*RemSizing.vrt.test.tsx` 的16/21.328/32px矩阵、显式数字兼容性及动态布局回归；`packages/components/tests/consumers/verify-packages.mjs` 的隔离公开包消费者；消费者缩放指南 `skills/exui/references/exui/scaling.md`。源码检查、交互测试与打包证据的范围分别记录，不能推断为远端发布或真实折射效果验收。
