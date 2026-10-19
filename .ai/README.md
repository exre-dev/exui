# ExUI 仓库知识库

最后更新：2026-10-19

本目录记录 ExUI 仓库中**不能直接从源码读出来**的知识：系统边界与依赖方向、已被接受的技术决策及其理由、以及只有在真实运行或 CI 中才会暴露的约束。已落地行为以源码和运行证据为准；已批准但尚未实施的设计只放在标明“待实现”的决策记录中，不能当作当前行为。这些结论来自仓库证据或已批准设计，不包含未被接受的推测。

普通的使用说明、安装步骤和入门指引不在这里：React 消费者看 `packages/components/README.md`；唯一维护的消费 skill 是 [`skills/exui/SKILL.md`](../skills/exui/SKILL.md)，涵盖组件组合、Form、Glass、Shadow 与 Tokens。其组件文档使用 skill 内的本地链接，公开符号与 Token 索引由仓库级 `scripts/exui-skill/` 生成，隔离示例校验脚本归入 `packages/components/tests/tooling/skill/`。经核查的 ExUI 扩展与适配说明通过能力清单同步至 docs 和 skill，其维护边界见 [`architectures/docs/site.md`](architectures/docs/site.md#exui-公开差异的文档边界)。测试规范与提交流程看 `TESTING.md`、`CONTRIBUTING.md`。

## 模块划分

模块名是固定集合，目录按模块创建，只有写出第一篇文档时才建目录。

| 模块 | 覆盖范围 |
| --- | --- |
| `tokens` | `packages/tokens`：私有工作区 `@exre/exui-tokens`，框架中立的 Token 源、生成器与校验 |
| `components` | `packages/components`：唯一公开发布包 `@exre/exui`，React 19、固定 ReUI 源及 ExUI 适配、公开入口与子路径 |
| `docs` | `packages/docs`：私有 React Router/Fumadocs 静态文档站，维护双语内容、静态分享和新站浏览器验证 |
| `showcase` | `packages/docs/src/showcase`：共享示例；浏览器回归与专用夹具位于 `packages/docs/tests/browser`，相关决策与复审记录保留原模块名 |
| `release` | 仓库级交付：`scripts/`、`scripts/release-bootstrap/`、`.github/workflows/`、`.release-bootstrap.yaml`、`.changeset/` |

跨模块的事实写在本文件所在的 `architectures/overview.md`，不在各模块中重复。

## 目录结构

```text
.ai/
├── README.md              本文件：导航、模块划分、证据来源
├── CONTEXT.md             领域语言（规范术语与应避免的说法）
├── architectures/         结构：边界、职责、接口、流程
│   ├── overview.md        跨模块总览
│   └── <模块>/
├── decisions/             原因：已接受的决策及其理由
│   ├── README.md          决策索引
│   └── <模块>/<NN>-<kebab-title>.md
└── knowledge/             非显然行为：失败模式与运行约束
    └── <模块>/
```

## 文档分工

同一件事实只写在一个地方，其余位置用链接指向它。

| 位置 | 承载 | 不承载 |
| --- | --- | --- |
| `CONTEXT.md` | 领域术语的定义与应避免的同义词 | 实现选择、API 形状、字段清单、模块名 |
| `architectures/<模块>/` | 组件边界、依赖方向、请求与控制流、扩展点 | 选择背后的理由、失败模式 |
| `decisions/<模块>/` | 为什么这样选：背景、备选方案、理由、代价、重新审视条件；待实现决策须标明状态 | 该选择产生的结构本身 |
| `knowledge/<模块>/` | 读源码看不出来的行为：失败模式、运行约束、集成陷阱 | 签名、字段清单、命令清单等可直接读到的内容 |

决策记录引用格式为 `[[<模块>/<NN>-<kebab-title>]]`，不使用裸编号。编号在模块内从 `01` 开始，模块内不复用。

## 主要证据来源

ButtonGroup 的内侧圆角和共享边框可能被应用样式层覆盖，文字段 slot 还影响 Select 隐藏控件旁的末段识别，见 [`knowledge/components/button-group-seams.md`](knowledge/components/button-group-seams.md)。

当前 ReUI 来源、适配与公共入口见 [`architectures/components/public-surface.md`](architectures/components/public-surface.md)；已移除 `Modal` 的历史标题布局只见 [`knowledge/components/modal-header-layout.md`](knowledge/components/modal-header-layout.md)。

Windows 检出换行与公开导出校验的约束见 [`knowledge/components/source-checkout-line-endings.md`](knowledge/components/source-checkout-line-endings.md)。

当前 Dialog 的快捷组合、独立正文边界、跨样式层全屏几何和焦点归还约束见 [`knowledge/components/dialog-layout.md`](knowledge/components/dialog-layout.md)。

Tabs 横向胶囊与竖向轨道的嵌套圆角、选中投影及焦点优先级见 [`knowledge/components/tabs-track-corners.md`](knowledge/components/tabs-track-corners.md)。

表单模块：当前结构见 [`architectures/components/forms.md`](architectures/components/forms.md)，异步任务与消费约束见 [`knowledge/components/forms-lifecycle.md`](knowledge/components/forms-lifecycle.md)；旧 ExItem 展示边界的历史决策见 [[components/07-ex-item-presentation-boundary]]。消费 API 用法由 `skills/exui/references/exui/form.md` 和 `field-layout.md` 维护；本目录不复制完整签名。

全局通知模块：实例和任务边界见 [`architectures/components/notifications.md`](architectures/components/notifications.md)，订阅时序与应用清理约束见 [`knowledge/components/notification-lifecycle.md`](knowledge/components/notification-lifecycle.md)，移除旧包装层的取舍见 [[components/08-native-sonner-notifications]]。

Sonner 自定义通知的绘制层与几何验证边界见 [`knowledge/components/sonner-custom-surfaces.md`](knowledge/components/sonner-custom-surfaces.md)。

图表外部配置的 SSR 与 CSS 边界见 [`knowledge/components/chart-style-inputs.md`](knowledge/components/chart-style-inputs.md)；源码监听中生成 CSS 的循环风险见 [`knowledge/release/watch-rebuilds.md`](knowledge/release/watch-rebuilds.md)。

Accordion 内容测量的循环依赖与裁切检查见 [`knowledge/components/accordion-content-measurement.md`](knowledge/components/accordion-content-measurement.md)。

Scrollspy 示例的实例 ID 与导航锚点必须成对映射，首尾选中可能掩盖断开的关联，见 [`knowledge/showcase/scrollspy-example-anchors.md`](knowledge/showcase/scrollspy-example-anchors.md)。

FieldLabel 的 checked 后代规则可能让单选标签意外出现局部灰底，绘制层与检查边界见 [`knowledge/components/field-label-selection-background.md`](knowledge/components/field-label-selection-background.md)。

PhoneInput 的 Button/Input 尺寸配对、标准搜索输入与空状态的跨样式层显示约束见 [`knowledge/components/phone-input-surfaces.md`](knowledge/components/phone-input-surfaces.md)。

EmojiPicker 隐藏搜索时的 combobox 注册、网格焦点与默认布局边界见 [`knowledge/components/emoji-picker-search-visibility.md`](knowledge/components/emoji-picker-search-visibility.md)。

CardAction 的跨样式层网格定位可能使 Questionnaire 标题与说明并排挤压，原因与检查边界见 [`knowledge/components/card-action-grid-placement.md`](knowledge/components/card-action-grid-placement.md)。

Card 内边距与区块 gap 的独立归属、边框子槽和首图例外的检查边界见 [`knowledge/components/card-spacing-ownership.md`](knowledge/components/card-spacing-ownership.md)。

Questionnaire 的勾号与内圆点可能被应用层 `hidden` 覆盖，状态绘制与检查边界见 [`knowledge/components/questionnaire-choice-indicators.md`](knowledge/components/questionnaire-choice-indicators.md)。

Questionnaire 操作按钮在桌面和移动端都随共享 Button 的尺寸与密度变化，额外最小高度的覆盖风险与验证边界见 [`knowledge/components/questionnaire-action-sizing.md`](knowledge/components/questionnaire-action-sizing.md)。

Badge 实底前景色不能复用于浅底、描边标签，以及文档样式层对暗色配色的影响，见 [`knowledge/components/badge-color-contrast.md`](knowledge/components/badge-color-contrast.md)。

- 工作区与构建：`package.json`、`pnpm-workspace.yaml`、`tsconfig.json`、各包的 `package.json` 与 `vite.config.ts`
- 生成与校验：`packages/tokens/scripts/`（`generate-css.mjs`、`verify-cjs.mjs`、`validate-tokens.mjs`、`token-length-policy.mjs`、`color-contrast-policy.mjs`、`foundation-reference-policy.mjs`、`glass-policy.mjs`）、`scripts/package-contract.mjs`、`packages/components/tests/consumers/verify-packages.mjs`、`packages/components/tests/consumers/verify-react-browser.mjs`、`packages/components/tests/consumers/verify-form-browser.mjs`、`packages/components/tests/consumers/form-consumer-fixture.mjs`
- 交付与发布：`.github/workflows/ci.yml`、`release.yml`、`tag-npm.yml`、`.release-bootstrap.yaml`、`scripts/release-bootstrap/`、`.changeset/config.json`
- 测试与视觉基线：`TESTING.md`、`packages/docs/vitest.config.ts`、`packages/docs/tests/browser/*.vrt.test.tsx` 与其 `__screenshots__/` 基线；当前站点的静态产物见 [`architectures/docs/site.md`](architectures/docs/site.md)
- 设计依据：`.notes/archive/`、`.notes/rem-sizing/` 与 `.notes/glass-effects/` 下已归档或已被实现印证的设计文档
