# ExUI

[English](README.md) · **简体中文**

**Exre 界面的共享视觉基础。**

React 19 组件、框架中立的设计 Tokens，以及一致的主题体系。使用共享控件构建界面、组合类型安全的表单，并在合适的位置采用 Glass 材质。

**[ExUI Docs](https://exre-dev.github.io/exui/)** · [快速开始](#快速开始) · [本地开发](#本地开发) · [贡献指南](CONTRIBUTING.md)

![浅色模式下的 ExUI 组件目录，展示 Accordion、Alert、Alert Dialog、Aspect Ratio、Attachment、Autocomplete、Avatar 和 Badge 的真实预览。](.github/assets/readme-components-light.png#gh-light-mode-only)
![深色模式下的 ExUI 组件目录，展示 Accordion、Alert、Alert Dialog、Aspect Ratio、Attachment、Autocomplete、Avatar 和 Badge 的真实预览。](.github/assets/readme-components-dark.png#gh-dark-mode-only)

图片来自 ExUI 文档站的真实组件目录，内容为演示数据。在 [ExUI Docs](https://exre-dev.github.io/exui/) 中体验交互示例；站内提供英文和简体中文文档。

## 能力概览

- **应用界面组件。** 控件、对话框、导航、数据表格、图表、日程与媒体组件，通过同一个 React 19 包提供。
- **Tokens 与主题。** 共享颜色、字体排版、圆角与阴影，提供浅色、深色、纯黑主题及密度控制。Token 入口也可在不依赖 React 的环境中使用。
- **类型安全的表单与通知。** 使用配置式 `ExForm` 或组合式 `Form` 字段构建表单；通过 `Toaster` 与 `toast`，或受管理的 `ExMessage` 调用提供反馈。
- **按需启用的 Glass 材质。** 为支持的组件添加共享材质效果；`backdrop-filter` 不可用时回退为不透明主题背景。

## 安装与使用

### 快速开始

安装唯一公开包及所需的 React 宿主运行时：

```bash
npm add @exre/exui react@19 react-dom@19
```

TypeScript 项目还需将 `@types/react@19` 和 `@types/react-dom@19` 安装为开发依赖。引入一次完整样式表，再从公开入口使用组件：

```tsx
import "@exre/exui/style.css"
import { Button } from "@exre/exui"

export function App() {
  return <Button>Continue</Button>
}
```

React 入口仅支持 ESM，并要求 React 19。样式表已包含 Token 变量和字体；应用布局使用自己的 CSS 或工具类配置。主题、表单、Glass、通知及完整示例请参阅 [React 包使用指南](packages/components/README.md)。

框架中立的使用方式可引入 `@exre/exui/tokens`、`@exre/exui/tokens/style.css`，以及可选的 `@exre/exui/tokens/font.css`。这些入口不要求安装 React。内部工作区 `@exre/exui-tokens` 从不发布。

## 文档导航

从 **[ExUI Docs](https://exre-dev.github.io/exui/)** 开始浏览组件目录、交互示例及中英文指南。

- [React 包使用指南](packages/components/README.md)：安装、主题、表单、受管理的通知、Glass 材质、尺寸与内置图表 API。
- [内部 Token 工作区](packages/tokens/README.md)：Token 构建、格式与长度规范。
- [ExUI skill](skills/exui/SKILL.md)：组件选择、组合、本地参考与完整示例。
- [文档站内容](packages/docs/content/zh-CN/getting-started/quick-start.mdx)：维护中的简体中文站点源文档；`packages/docs/content/en/` 为英文版本。
- [表单参考](skills/exui/references/exui/form.md)：配置式与组合式表单、校验及生命周期。
- [通知参考](skills/exui/references/exui/notifications.md)：`Toaster`、`toast` 与受管理的 `ExMessage` 调用。
- [Token 定制](skills/exui/references/exui/token-customization.md)：CSS 覆盖、主题作用域与基础 Token 引用。
- [Fumadocs 主题](skills/exui/references/exui/docs-theme.md)：可选样式表 `@exre/exui/docs/theme.css` 及其消费方前置条件。

`.docset.json` 记录上述文档及贡献、测试指南所依据的已提交源码快照。只有完整跟踪范围经过审阅且文档检查通过后，才推进这一快照。

## 本地开发

本仓库是私有 pnpm workspace，只发布 `@exre/exui`：

| 工作区 | 职责 |
| --- | --- |
| `packages/tokens` | 私有、框架中立的 Token 源；生成产物通过 `@exre/exui/tokens` 提供。 |
| `packages/components` | React 19 组件库 `@exre/exui`、完整样式表及公开 Token 入口。 |
| `packages/docs` | 私有 React Router/Fumadocs 文档站；示例只使用公开包入口。原 Showcase 留在 `src/showcase` 作为内部夹具。 |

使用 **Node.js 24** 和 **pnpm 11.9.0**，从仓库根目录运行：

```bash
pnpm install
pnpm upstream:restore
pnpm dev
```

| 命令 | 用途 |
| --- | --- |
| `pnpm watch` | 构建 Tokens 和组件，再监听组件库源码。 |
| `pnpm tokens:check` | 校验 Token 数据、CSS、语义及导出。 |
| `pnpm typecheck` | 检查各工作区类型。 |
| `pnpm lint` | 使用 Oxlint 检查源码。 |
| `pnpm build` | 构建 Tokens、组件、声明与静态文档站。 |
| `pnpm verify:pack` | 在隔离的消费方环境中验证公开包产物。 |

组件构建会自动恢复并校验固定版本的源缓存；完整缓存支持离线使用。修改组件适配或公开导出后，运行 `pnpm upstream:check`。源锁与更新流程见[源码维护门禁](TESTING.md#source-maintenance-gates)。

`pnpm watch` 不启动文档站，也不监听包清单和构建配置；修改这些文件后需重启或重新构建。文档站消费已构建的公开包入口。完整检查、视觉测试前置条件及 skill 示例验证见[测试指南](TESTING.md)，DCO 与 Changeset 要求见[贡献指南](CONTRIBUTING.md)。Changesets 只管理公开包版本，私有 docs 和 tokens 工作区不得参与发布。

## 文档站托管

生产目标为 [ExUI Docs](https://exre-dev.github.io/exui/)。`pnpm build` 将静态站点输出到 `packages/docs/build/client`。子路径部署需在构建时设置 `EXUI_DOCS_BASE=/exui/`，验证和托管时使用相同的 base。

完整托管该目录，包括 `.data/`、搜索索引、资源和示例源码文件，不使用 SPA 回退或 Node 服务。每个示例分享路由都从同一份源导出提供可读 HTML、`source.md` 和 `source.json`。运行 `pnpm docs:content:check` 检查双语内容与链接；静态站点、源导出、浏览器及打包消费方检查见[测试指南](TESTING.md)。

<details>
<summary>GitHub Pages 配置与恢复</summary>

完成一次性配置后，每次成功的 `main` push CI 都会保存已验证的 `/exui/` 静态产物；独立的 `Docs Pages` 工作流在对应提交仍为当前提交时部署该产物。Pull Request 运行检查，但不发布预览。文档部署与 npm Release 分别消费 CI 结果。

管理员需在 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**，允许 `main` 使用 `github-pages` 环境且不要求每次部署人工审批，再对当前 `main` CI 执行 **Re-run all jobs**。部署摘要会报告 Pages 返回的实际 URL。工作流文件和本地检查本身不能证明目标已启用或线上站点通过验收。

产物保留七天。源产物丢失或过期时，完整重跑当前 `main` CI。若 Pages 执行失败，但源提交仍为当前提交且产物可用，对 `Docs Pages` 使用 **Re-run all jobs**；部分重跑不是恢复入口。旧提交会被跳过。恢复旧内容需通过新的 `main` revert 提交及 CI。配置检查与线上验收见 [GitHub Pages 交付](TESTING.md#github-pages-delivery)。

</details>

## 构建随 ExUI 缩放的内容

ExUI 的可缩放尺寸使用基于 16px 根字号的 `rem`。应用修改根字号时，自定义 React 内容也应随组件库缩放：优先采用 Tokens，并用 rem 表达字体、间距、图标与普通圆角。有意固定的效果（例如 `1px` 边框）保留像素单位。可复用组件应保留应用设置的根字号。

例如，React 的 `style={{ padding: "1.5rem", borderWidth: "1px" }}` 会缩放内边距，同时保持边框宽度不变；`padding: 24` 则固定为 24px。

自定义内容的可缩放长度、固定效果、密度和根字号验证见[根字号缩放与密度指南](skills/exui/references/exui/scaling.md)。
