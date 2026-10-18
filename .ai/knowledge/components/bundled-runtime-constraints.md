# 发布产物的运行时约束

最后更新：2026-10-16

以下三条都是 `@exre/exui` 消费者会踩到、但从组件源码读不出来的行为。它们的根因是构建边界：实现库被打进产物，宿主运行时只有 React（见 [[components/01-bundle-implementation-dependencies]]）。

## 1. 内置实例与消费者自装实例不共享 context

产物里的 Radix UI、Base UI、Recharts、TanStack Table 和 Sonner 等各自是一份独立副本。消费者如果自己也安装了这些库，两份副本不会互相通信：

- 消费者用自己的 Radix / Base UI provider 包裹 ExUI 组件，ExUI 组件读不到该 provider 的值，因为它在读自己那份实现里的 context。要共享状态必须使用 ExUI 导出的 provider。
- 这一点在图表上后果最隐蔽：从 `recharts` 直接导入图表原语时组件照常渲染，但 `ChartTooltip` 与 `ChartLegend` 的内容消失，且没有任何报错。必须从根入口的 `Recharts` 命名空间取原语，见 [[components/02-bundled-recharts-namespace]]。
- ReUI `DataGrid` 与表格模型通过根入口的 `TanStackTable` 命名空间共享同一份 TanStack Table v9。消息宿主、`ExMessage` 和公共 `toast` 则共享 ExUI 打包的 Sonner；从消费者自装的 Sonner 导入 `toast` 会进入另一份实例。

**判断方法**：如果消费者代码里出现来自 `radix-ui`、`recharts`、`@tanstack/react-table`、`vaul`、`cmdk`、`sonner` 等包的导入，且这些组件需要与 ExUI 组件协作，就存在两份实例的风险。

## 2. ThemeProvider 无法在服务端渲染

`ThemeProvider` 在渲染期间读取 `localStorage`，因此在没有 `window`/`localStorage` 的环境里无法渲染，SSR 场景下会失败。`"use client"` 不足以规避：它只影响打包分组，不阻止预渲染。

**操作约束**：SSR 框架中必须在 hydration 之后、只在浏览器里挂载 `ThemeProvider`。这一限制不是文档疏漏而是刻意保留的边界——仓库自己的服务端渲染冒烟用例就绕开了它，只覆盖其余公开面（Button、表单、Chart 系列），因此**服务端渲染能力在 `ThemeProvider` 上没有被门禁覆盖**。

## 3. 根字号缩放受适配边界约束

默认长度、显式数字参数与内容坐标的规则以 [[../../decisions/tokens/01-rem-scalable-lengths]] 为准；已扩展至可维护的第三方 React 边界，不再适用“Sonner 与坐标轴一律固定”的旧限制。具体剩余边界见 [[../../architectures/components/public-surface]] 的根字号尺寸边界。

**判断方法**：根字号会改变默认尺寸，但容器、视口与内容换行仍影响最终布局，不能以整页截图严格等比作为唯一判断。
