# Glass 图标的源码与公共产物

最后更新：2026-10-28

`packages/icons` 是私有 `@exre/exui-icons` 工作区，版本恒为 `0.0.0`。`glass-icons/*.svg` 是 50 个图标的规范源码，文件名使用小写连字符。图标不单独发布；唯一公开包 `@exre/exui` 的开发依赖声明该工作区，生产依赖字段不得引用它。

## 构建与入口

`packages/icons/scripts/build.mjs` 从规范 SVG 生成逐图标 TypeScript 模块、显式命名导出的集合和 SVG URL 声明，再编译到 `dist/glass-icons/`。每个图标模块只依赖同目录的 React 工厂，工厂只导入 React。集合构建保留纯工厂调用标记，供消费端去掉未使用图标。

公共包的 `build:types` 在声明整合后调用 `build:icons`：先构建私有图标工作区，再由 `copy-icons-dist.mjs` 替换公共 `dist/icons/`。这一步位于 Vite 清空 `dist/` 之后，也覆盖只运行类型准备的入口，避免 docs 在没有完整库构建时缺少图标声明。开发监听覆盖 SVG、运行时和构建脚本，忽略生成产物。

公开入口与产物映射统一见 [公共包入口](../components/public-surface.md#公开入口)。SVG URL 声明面向消费打包器，不把 SVG 文件变成 Node.js 可直接执行的模块。

组件调用方式和尺寸、无障碍规则由 `packages/components/README.md` 与消费 skill 的 `rules/icons.md` 维护；本页不复制完整 API。

## 透明背景模糊

Figma 导出中的 CSS `backdrop-filter`/`foreignObject` 在 SVG 图片上下文中不能可靠保留玻璃模糊。规范 SVG 将图标内部已绘制的向量保存为 scene：用遮罩清除模糊形状内的清晰像素，再把高斯模糊后的 scene 裁剪回同一形状，继续绘制前景。这样可保持透明度，避免简单叠加模糊副本时仍透出原来的锐利边缘。

模糊仅合成图标自身的向量层，不采样宿主网页。画布和外层展板背景已移除，内部白色高光与原始渐变、路径和阴影保留；没有内嵌位图。

React 工厂用 `useId` 为每个实例的全部内部 ID、`url(#...)` 和本地 `href` 编码前缀；标题节点也位于该实例命名空间。重复图标及 SSR/hydration 不共享滤镜或渐变资源。

## React 预设配色边界

预设改色由共享 React 工厂处理，不改写规范 SVG 或生成额外资源文件。原始配色包含人工调整的色值变体，运行时按渐变端点、主体、染色和暗部角色映射；阴影颜色还存在于 `feColorMatrix` 的 RGB 偏移中。仅替换十六进制填充会遗漏阴影。遮罩黑白、白色高光、透明度、几何和模糊参数保留，未指定配色或收到不支持的运行时值时保留原始绘制内容。

改色发生在实例 ID 隔离之前，与已有 SSR 流程共用确定性的纯字符串转换，不读取 DOM、CSS 主题或浏览器计算样式。消费端 API 和示例统一见消费 skill 的 `rules/icons.md`；原始 SVG 导入和下载保留原色。

## 验证边界

`packages/icons/tests/` 持有资产完整性和 SSR 行为回归，归入根快速 Node 套件。`packages/components/tests/consumers/verify-icons-consumer.mjs` 通过真实公共 tarball 验证类型、资源导入、按需打包、SSR/hydration、rem 缩放和 Chromium 下 50 组 SVG/React 的透明渲染；完整消费者门禁调用该检查。它不等价于所有桌面矢量编辑器的滤镜兼容验收。
