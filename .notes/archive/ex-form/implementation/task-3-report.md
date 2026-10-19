# Task 3 authored-source 阶段报告

日期：2026-10-19。本报告覆盖 Task 3 的维护源、消费示例与升级说明；按父任务要求停在独立 authored-source / notes 审查之前。未执行 source-review 接受、能力生成、参考锁更新或库存生成，未提交。

## 已准备的维护源

- 消费 skill 统一到 Form / FormField，明确三个命名 props 分支、互斥初始化源、`fields !== undefined`、空数组与 undefined 的区别、模式切换的新 React key，以及配置式 children 位于字段/review 之前和 footer 位于其后的实际顺序。
- 组合式示例保留 context/watch、动态对象列表与摘要；schema 配置式示例含 Input/Output 转换、两个编辑步骤、review、重置和英文步骤操作；新增既有实例分支及具名包装器、自定义 footer、绑定字段布局覆盖。
- 新增独立 Field 消费指南与 TSX 示例。每项有自己的容器查询，21.75rem 阈值由 9rem 标题、12rem 内容及 .75rem gap 组成，标题/说明 gap .25rem，控件/错误 gap .5rem。只在宽模式给 FieldContent 限宽/对齐，窄模式全宽。CSS 放在 TSX 的作用域 style 中，仅使用允许的公开依赖，没有导入私有 docs CSS。控件的真实 ID、label、说明和错误 ARIA 显式连接；纯展示值使用 span 标题。
- capabilities.json 将全部九个新增公开名称关联到 form-lifecycle / configured-forms，未新增排除理由。将 standalone-ex-item 能力完整改为 field-layout，移除双语旧片段，以 Field 规范家族、三个实际分享 ID、公开原语和新指南替代。Form 能力关联三个规范 Form 示例；无旧 URL / 示例别名。
- package README 同步当前入口；`.changeset/unified-form-field.md` 为唯一公开包 `@exre/exui` 声明 major 的破坏性移除，没有应用版本。
- `.ai/` 仅更新当前已实现的结构、owner、目录/示例所有权与测试关注点；历史 decision 07 保留原始决策正文并明确标为历史。没有写入临时任务流水、版本控制状态或待实施方案。
- `.notes/ex-form/upgrade-guide.md` 列出移除组件和全部旧 props/layout/span 类型的替换，包含四份完整可编译模式、入口/子项/布局/ARIA/异步/步骤迁移步骤，以及双语 URL 和分享 ID 归属。明确本次有意破坏性移除，不新增兼容页面。

## 规范示例归属

| family | IDs |
| --- | --- |
| exui/form | exui-form-1、exui-form-models、exui-form-configured |
| components/field | exui-field-settings、exui-field-display、exui-field-layout |

能力源采用 Task 2 已验证的这些实际 ID。catalog 共 89 家族，raw module groups 为 86 + 3，展示为 87 Components + 2 Blocks，双语内容各 99 页。升级指南没有保留旧入口别名。

## 实际验证

Node v24.22.0，使用父任务提供的 Node24 PATH；没有运行会生成受控仓库产物的命令。

- `node scripts/exui-skill/verify-examples.mjs`：exit 0，9 个 TSX 示例全部通过。门禁自行新打包 `exre-exui-1.0.0.tgz` 并安装隔离消费者，以固定 Zod 3.25.28 和 strict/skipLibCheck=false 编译；同时检查允许的 import 和示例文档链接。
- `node scripts/exui-skill/verify.mjs`：exit 0，1,382 个可达 Markdown 文件、11,715 个本地链接（含标题锚点）通过。
- 只读对比：升级指南的四个完整 TSX 块分别与已编译的 form-configured、form-configured-instance、form-composed、field-layout 示例逐字相同；全部九个新增公开符号都有能力关联。
- `git -c core.safecrlf=false diff --check -- .ai skills/exui/SKILL.md skills/exui/rules skills/exui/examples skills/exui/references/exui packages/components/README.md packages/docs/exui .changeset`：exit 0。
- 旧 API / old example-file / standalone-ex-item 扫描：当前维护 skill、fragments 和 package README 无旧名称或旧文件链接；旧 API 只在升级指南和明确标记的历史决策中保留解释。现有 source-review 快照与 bounded generated 文档仍保留旧名称，等待后续受控更新。
- `node scripts/exui-capabilities.mjs --check`：按预期 exit 1，停在 **Source review drift**，列出核心旧文件移除、新私有文件和公开导出变化。进入该边界前，registry 的现有 source/page/symbol/share-example/skill-guide 关联校验已通过。没有调用 `--accept-source-review` 绕过该边界。

## 尚未验证与后续门禁

本阶段的 skill 门禁只证明编译和链接，不证明新 TSX 配方的浏览器外观。Task 2 的真实 gallery 证据见其独立报告。这里未重跑全量 tokens/typecheck/lint/build/visual/pack，也未把父任务报告的 Task 1 pack PASS 当成本阶段新增执行结果。

独立源与 notes 审查通过后，由父任务授权受控接受 source-review、生成 capability bounded 段、刷新 skill reference 锁与公开库存、刷新 snippets。之后运行完整能力/skill/双 base 文档与共享门禁及全仓复审。新片段中的 tsx verify 模块尚未通过生成后的完整 docs-snippets 门禁，不能将 skill 示例编译等同于全部 MDX 消费验证。

未触碰 Task 2 path list 中的文件，未改 TESTING、上游 raw 示例或锁定 revision。scripts/verify-form-browser.mjs、scripts/verify-packages.mjs 的日志标签未修改。

## 精确变更路径

以下为本 worker 的 authored 变更，不包含其他任务已经存在的工作区修改。

```text
.ai/README.md
.ai/architectures/components/forms.md
.ai/architectures/docs/site.md
.ai/architectures/release/delivery-pipelines.md
.ai/architectures/showcase/consumption.md
.ai/decisions/README.md
.ai/decisions/components/07-ex-item-presentation-boundary.md
.ai/knowledge/components/forms-lifecycle.md
.changeset/unified-form-field.md (new)
packages/components/README.md
packages/docs/exui/capabilities.json
packages/docs/exui/en/configured-forms.md
packages/docs/exui/en/form-lifecycle.md
packages/docs/exui/en/field-layout.md (new)
packages/docs/exui/en/standalone-ex-item.md (deleted)
packages/docs/exui/zh-CN/configured-forms.md
packages/docs/exui/zh-CN/form-lifecycle.md
packages/docs/exui/zh-CN/field-layout.md (new)
packages/docs/exui/zh-CN/standalone-ex-item.md (deleted)
skills/exui/SKILL.md
skills/exui/rules/anti-patterns.md
skills/exui/rules/compose.md
skills/exui/rules/layout.md
skills/exui/references/exui/form.md
skills/exui/references/exui/field-layout.md (new)
skills/exui/examples/form-composed.tsx
skills/exui/examples/form-configured.tsx
skills/exui/examples/form-configured-instance.tsx (new)
skills/exui/examples/form-field-layout.tsx (new)
skills/exui/examples/field-layout.tsx (new)
skills/exui/examples/form-item-layout.tsx (deleted)
.notes/ex-form/upgrade-guide.md (new, ignored notes)
.notes/ex-form/implementation/task-3-report.md (new, ignored notes)
```

这里停止写入，等待父任务的独立 authored-source / notes 审查。source-review.json、bounded generated 文档、references/components、reference lock 和 generated inventories 均未由本 worker 更新。

## 受控生成阶段（独立审查通过后）

父任务确认 Task 2 round 3 全部 44 路径和 Task 3 authored 33 路径均通过独立审查后，授权继续本阶段。上文的“尚未生成 / 停止写入”描述仅对应先前 authored 阶段；以下为接受审查快照之后实际执行的结果。Node v24.22.0、pnpm 11.9.0，沿用已验证的当前公共构建产物，没有重建共享产物或重跑 pack/skill 安装。

顺序执行，均 exit 0：

1. `node scripts/exui-capabilities.mjs --accept-source-review`：接受已独立审阅的实现/公开导出快照，31 capabilities；此命令没有生成文档。
2. `pnpm docs:capabilities:generate`：31 capabilities、176 个受控生成目标；通过原有 reference lock 验证后更新有界段及相应锁项。
3. `node scripts/exui-skill/update-inventories.mjs --write`：1,547 个公开名称、361 个 Token paths、607 个 CSS properties。
4. `node scripts/docs-snippets.mjs --write`：89 家族 × 两种语言的 source-linked 摘录。
5. `pnpm docs:content:generate`：198 pages、99 per locale。

后续只读门禁，均 exit 0：

| 命令 | 实际结果 |
| --- | --- |
| `pnpm docs:capabilities:check` | 31 capabilities、176 generated targets，一致 |
| `node scripts/exui-skill/sync-references.mjs --check` | locked references verified；可选下载归档不存在，按离线锁验证 |
| `node scripts/exui-skill/update-inventories.mjs --check` | 1,547 public exports、361 Token paths、607 CSS properties，一致 |
| `node scripts/exui-skill/verify.mjs` | 1,382 reachable Markdown、11,713 local links（含 heading targets）通过 |
| `pnpm test:docs-capabilities` | 38 tests passed，0 failed，含 capabilities、docs snippets 和 sync-references 回归 |
| `pnpm docs:snippets:verify` | 118 verified modules、128 complete family source consumers 编译通过 |
| `pnpm docs:content:check` | 198 pages、99 per locale |
| `git -c core.safecrlf=false diff --check` | 全工作区 whitespace 检查通过 |

另以只读比较确认：reference lock 仅 field.md 哈希改变，source identity 和 catalog hash 不变；移除 skill capability 有界段后，field.md 的上游正文与原锁定版本一致；公开导出库存没有 ExForm/FormItem/ExItem 名称。未调用 sync `--lock`、上游 rebase/adoption 或 archive refresh。没有维护测试因旧计数/名称而失败，因此没有修改测试实现或放宽断言。

按父任务追加授权，用 codebase-documenter 在 `.ai/architectures/docs/site.md` 补入已验证的宿主样式层事实：站点 utilities 可能覆盖公共 Field 的响应式查询类，docs.css 的有界 `@source inline(...)` 保留响应式；普通 responsive Field 需要 FieldGroup，区别于逐项 21.75rem 内容限宽配方。记录依据为实际宿主/独立源码验证，不保存任务日志。

同一追加授权允许修改已完成 Task 2 审查的 TESTING.md。本 worker 只修正 Form 消费门禁和旧 ExItem 套件说明，现准确描述三个命名分支、真实 compiler 负例、callable Standard Schema、FieldLayout 的显式关联/布局，以及 FormApi 的运行时形状与挂载身份；没有声称旧 auto-ID/controlId 或兼容层仍存在，未改其他测试工作流。

### 生成阶段精确路径

以下为本阶段新增的逻辑内容变更路径（四个 MDX 已有 Task 2 authored 变更，本阶段仅生成其有界段/源码摘录）：

```text
TESTING.md
packages/docs/content/en/components/field.mdx
packages/docs/content/en/exui/form.mdx
packages/docs/content/zh-CN/components/field.mdx
packages/docs/content/zh-CN/exui/form.mdx
packages/docs/exui/source-review.json
skills/exui/references/components/field.md
skills/exui/references/generated/component-reference-lock.json
skills/exui/references/generated/component-exports.md
.ai/architectures/docs/site.md (additional verified style-boundary paragraph)
.notes/ex-form/implementation/task-3-report.md (this stage appended)
.notes/ex-form/implementation/task-3-generation-paths.txt (new ignored manifest)
```

`docs-snippets --write` 按既有实现重写全部 178 家族 MDX 摘录文件；除上述四页外没有新增逻辑内容差异，部分 Windows 文件仅换行规范化。inventory 命令也写入 token-paths.md，但其内容没有变化。忽略的 `packages/docs/.generated/pages.json` 已按既有生成器刷新。

完整持久写入目标清单位于 `task-3-generation-paths.txt`，共 188 条，逐条列出 178 个 MDX、source-review、field reference/lock、两份 inventories、pages manifest、TESTING、`.ai`、报告和清单自身；其中包含上述内容未变化但命令确实写入的文件。旧页面删除仍属于 Task 2，不由此阶段重新创建或重命名。

这里再次停止写入。完整 build/typecheck/visual/pack 和双 base static/sharing 由父任务执行；本阶段无组件实现、上游身份/原始示例/来源锁改动，无提交或子 agent。
