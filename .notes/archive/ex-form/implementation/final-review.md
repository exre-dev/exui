# Form API consolidation 最终独立代码审查

日期：2026-10-19。审查方式：`$code-review working-tree --paths`，路径严格取自最终冻结清单。审查者独立于三个实现阶段；阶段报告用于定位历史证据，未代替本次完整审查。

## 结论与 findings

**PASS — 本次 Form consolidation 范围内，规格符合，未发现尚未解决的可行动缺陷。**

| 严重级别 | 未解决数量 |
| --- | ---: |
| P0 | 0 |
| P1 | 0 |
| P2 | 0 |
| P3 | 0 |

没有需要列出位置与修复建议的未解决 finding。本轮独立审查曾发现 TESTING 的数量事实滞后，已作为一组 P3 修正并复核：91 families 改为 89，原始模块分类改为 86 + 3，独立消费者数量改为 10。历史阶段的 callable Standard Schema P2、两个画廊布局 P2 与内容宽度 P3 均已独立检查修复后的实现和回归意图，没有仅凭历史 PASS 关闭问题。

本结论只覆盖本报告明确列出的 Form 交付范围；不等于批准同工作树中的并行开发工具、测试组织、CI 或发布流程改造。

## 完整范围与冻结

- 基线与最终 HEAD 均为 `ed28078d4cf40b3b187c38c4ff08510953f7dc3c`；本任务未提交。
- 精确路径清单：[final-touched-paths.txt](./final-touched-paths.txt)，405 条，405 个唯一值。
- 冻结记录：[final-review-freeze.json](./final-review-freeze.json)，405 条；记录摘要为 `e999cf203b25de4374e1ea9cf187013de8c4fa8051394114f2aa955dabdae3e5`。
- 当前内容逐项 SHA-256／删除状态与冻结记录一致。清单和冻结路径集合相同，无缺项、额外项或漂移。暂存区为空；已审查未暂存差异、范围内完整新文件、显式纳入的 ignored notes、删除文件基线和迁移目的文件。范围内 whitespace 检查通过。
- 构建输出、缓存、临时验证日志用于证据核对，不作为交付源码。最终报告本身排除在冻结清单之外，避免自指。

| 当前路径分类 | 数量 | 核查方式 |
| --- | ---: | --- |
| 相对基线有逻辑变更 | 52 | 完整差异及相关文件上下文；共享文件逐 hunk 区分本任务与外来内容 |
| 新增或显式纳入的 ignored 文件 | 57 | 完整内容；包含升级指南、任务记录与新增测试目的路径 |
| 基线存在、当前删除 | 31 | 删除前基线、任务意图或迁移映射及目的内容 |
| canonical 内容与基线一致 | 262 | 每个文件完整内容比较，未因生成文件数量大而跳过 |
| 曾新增、后被外来迁移移走的旧路径 | 3 | 接受快照完整旧内容与当前目的文件比较 |
| 合计 | **405** | 全范围完成 |

262 个 canonical 一致项由 174 个 MDX、1 个 token paths 文件，以及 87 个生成注册文件组成。后者为 component loader 和 86 个 family index；均逐个验证完整 canonical 内容等于 HEAD。换行与工作树 stat 导致的 dirty 状态没有被误报为源码差异。

完整范围附录即上述冻结路径清单，逐条字节／删除状态见冻结 JSON；测试迁移的旧到新对应、分类、摘要与行为比较见 [external-test-relocations.json](./external-test-relocations.json)。这些是本报告完整附录，不是抽样或 top-N 列表。

## 需求与实现核查

已完整读取设计、RFC、执行计划、升级指南、阶段报告和路径清单，读取 AGENTS、TESTING 与相关 `.ai`。仓库没有 `.codegraph`，因此没有调用 CodeGraph。遵循用户最新明确决定：项目尚未上线，不提供旧名称兼容层；早期文档的兼容条款不构成本次验收要求。

### 公共 API 与运行时

`Form` 的 composed、schema 配置、instance 配置三分支通过重载及互斥 `never` 约束表达；`NoInfer` 保持 schema 输入输出、字段路径、controls/options/list 的推导边界。公共导出删除 ExForm、FormItem、ExItem 及其旧公共类型，并使用 Form、FormField、Field 体系。没有以 alias 或 redirect 保留被明确删除的公共入口。

运行时使用 `fields !== undefined` 识别配置模式，空数组不会落入 composed 分支。参数检查涵盖配置来源排他性、必需提交处理、默认值结构和 Standard Schema validate；结构合法的 callable schema 也能接受。分支检查和 owner 切换约束在组件生命周期内保持稳定，跨 composed/configured 切换需要新 key；配置来源通过分离的组件边界管理控制器归属。

配置模式的自定义 children 位于自动字段之前，footer 支持节点、函数、null 和默认动作语义；没有额外嵌套 native form。FormShell 负责 native form、提交/重置接线及布局状态；FormField 负责绑定、错误与 ARIA，内部字段布局负责呈现；独立 Field 不承担表单控制器职责。原有异步、依赖、列表、步骤、重置与清理行为的关键路径保持。

### 文档、画廊与独立源码

Form 有三张卡片、四个真实表单实例；models 卡片的两个实例保留独立草稿。Field 有十四张卡片，其中十一张上游示例、三张 canonical 扩展。导航呈现为 87 Components + 2 Blocks；原始 URL/module 分类仍为 86 + 3，Form 保持 `exui/form`。旧 ExForm/ExItem 页面、分享 ID 和旧锚点没有作为兼容入口留下。

真实宿主中的宽卡片、窄容器、标签/控件排列和内容宽度限制已结合 CSS 及浏览器几何断言审查。Settings 的 FieldGroup 容器与样式扫描桥接，以及独立导出来源的响应式行为均有证据。ARIA 关联、错误描述和多实例标识隔离有实际渲染断言。

独立导出按叶级示例 owner 解析源码闭包。两个需要适配的 autocomplete/number-field 消费示例迁移到 FormField；原始上游内容与来源锁未被误改。三个 Form 和三个 Field canonical 分享来源可独立编译。迁移后的十个完整消费者检查继续保留这些六个来源。

静态基线 fixture 的改变核对为删除两个旧 family、删除四个旧分享记录、增加两个新 native Form 记录；其余 89 个保留 family、1,259 个共有示例和十个排除记录未被顺带放宽。搜索 selector 的两个尾斜杠修正与实际索引 ID 和 Fumadocs option ID 生成规则一致，未降低重试或导航断言。

### 技能、生成与知识记录

升级指南完整说明替换入口、三种 Form 用法、FormField/Field 职责和删除行为。指南中的四个 TSX 代码块与已严格编译的对应 skill 示例规范化后一致；九个 skill 示例使用 fresh packed consumer 验证。

受控生成没有绕过 source review：194 个源文件摘要逐项核对通过；独立 capability check 为 31 capabilities / 176 targets。生成的 198 个 page records 与实际 loader 输出逐项深比较一致。公共符号、能力关联、示例 inventory、snippets 和 `.ai` 当前事实与实现相符；历史设计决策保留了历史语境，没有混写成兼容承诺。

## 测试意图与可证明的行为

本审查检查了断言和消费者内容，不以“存在测试文件”代替行为覆盖。

| 关键风险 | 检查到的测试意图与证据 |
| --- | --- |
| 三分支混用、输入输出混淆 | packed Zod 3/4 严格消费者包含正负编译用例；互斥属性、NoInfer、路径、control/list 和公共旧导出删除受检查 |
| 结构合法但 callable 的 schema | FormApi 回归与严格消费者覆盖 callable Standard Schema，运行时结构检查不只接受普通对象 |
| 空 fields、children/footer、模式切换 | FormApi 直接渲染与更新，检查空配置仍为配置模式、自定义内容/动作语义和 key/owner 约束 |
| async、reset、steps、list 生命周期 | Form、FormAsync、FormSteps、FormControls 及相关回归检查真实状态变化与清理，未仅断言内部函数被调用 |
| Field/FormField 职责与可访问性 | FieldLayout、Form 与实际画廊测试检查 label/control/error 关联、无表单绑定的独立布局和多实例隔离 |
| 响应式及外观 | DocsFormGallery、FormContentSizing、FormAppearance 检查真实宿主尺寸、草稿保持、三主题边框和表面一致性 |
| 三卡四表单、十四 Field 卡片 | 当前画廊断言、overview/coverage 的全 family 遍历和来源检查覆盖数量、实际表单及独立草稿 |
| 导出闭包与示例可复制性 | 118 个文档片段、128 个完整导出消费者、十个专项完整来源消费者和九个 packed skill 示例进行编译 |
| native browser 提交与 SSR | packed consumer 在 Chromium 提交表单，验证解析后的数值输出及保留字符串草稿；SSR smoke 使用受限 document/File 环境 |
| 根路径与子路径发布产物 | HTTP/static/browser/sharing 验证路径、资源、搜索/失败重试、交互和 1,271 套 HTML/Markdown/JSON 内容 |

外来测试整合后，FormAppearance 保留六类边框在三主题的断言，并将四种表面一致性断言覆盖到三主题。FormApi 与消费者 fixture 的重要负例没有丢失。原 legacy sharing 文件的精确“十四个 header”断言已随外来退休删除，不能声称逐字保留；十四卡片和 canonical 来源的业务契约由当前画廊与 Node/source 检查覆盖。

## 验证结果与失败历史

详细命令、日志路径与完整过程见 [final-validation.md](./final-validation.md)。以下区分完整运行时快照验证与最终迁移目录集成验证。

| 门禁 | 已核对结果 |
| --- | --- |
| Tokens / upstream / lint / typecheck / 根路径 build | 通过；Tokens 56 项；lint 存在既有 warnings，未宣称零警告 |
| verify:pack | 通过；隔离 npm/pnpm 消费、Zod 3.25.28/4.6.5 严格编译、SSR、生产构建与 Chromium 真实交互 |
| Skill 与文档消费者 | 九个 fresh packed 示例；118 个片段、128 个完整消费者；1,382 Markdown / 11,713 links 检查通过 |
| Capability / docs content / sharing Node | 38 / 29 / 12 项通过；生成与源摘要另行只读复核 |
| 根路径静态与分享 | exit 0；1,479 paths、204 documents、1,271 examples；1,271 套分享内容 |
| 隔离完整 Chromium | exit 0；113 文件通过、5 文件跳过；1,261 用例通过、249 既有跳过、0 失败，437.29 秒 |
| 隔离 `/exui/` 生产构建及对应静态/分享 | 顺序执行并 exit 0；1,479 paths、204 documents、1,271 examples / sharing triples |
| 最终迁移目录 Form 浏览器集成 | 18 文件、184 用例通过，0 失败、0 跳过 |
| 最终迁移目录相关 Node 集成 | content/sharing/snippets/static 共 33 用例通过，0 失败、0 跳过 |

首轮完整 visual 出现四项旧测试契约失败：全局 Project name 匹配多个表单、两项 91-family 旧计数、一项旧 ExItem route。对应三个完整文件最小迁移后为 55 passed / 55 既有 viewport skips；未为这些失败更新截图基线或删除测试。静态基线和搜索 ID 的问题也经过具体根因修正，随后根路径完整验证通过。

第二轮共享工作树 visual 和当时的子路径验证保留失败记录。日志含 `@exre/exui` 暂时无法解析及其他失败，但没有据此把所有失败一概证明为并行构建导致，也没有把失败运行计为通过。为获得独立结论，在原 HEAD 的 detached 工作树仅 overlay 本任务 279 个来源路径；逐项比较双方与接受记录后，完成了上述完整 Chromium 通过结果。

曾从共享输出捕获的 6,561 个文件摘要可复现，但 `/exui/` 验证发现根路径链接，因而明确拒绝。该摘要仅证明复制完整性。最终子路径结论来自隔离工作树重新生产构建后立即串行验证的实际输出，不来自被拒绝的 capture。

最后的 184 browser + 33 Node 结果专门验证当前迁移后的 Form 测试目录集成。此前 1,261 通过结果证明隔离快照的不变运行时行为；不将其表述为已经完整批准外来重组后的全部 runner。临时隔离工作树在比较与门禁完成后已由主代理清理，源摘要和成功/失败日志仍保留。

## 外来变更与迁移边界

同一工作树发生了并行的 dev/watch/tasks、Vite reload、包脚本、CI/release、run-command、ReUI restore 与测试组织改动。这些实现不属于 Form review。AGENTS 新增命令说明仅作为当前上下文，不据此重新认定旧命令日志失败，也不宣称本次独立验证了新的总入口。

共享 `.ai/architectures/release/delivery-pipelines.md` 与 TESTING 已读取完整当前上下文；结论仅覆盖本任务的 Form、计数及生命周期相关内容。两个 workspace package manifests 的差异在比较时仅涉及 scripts；exports、dependencies、published files 等与已验证 public consumer 的相关契约未变化。

外来迁移影响 23 个旧路径：18 个 relocated、3 个 consolidated、2 个 externally-removed，关联 19 个唯一当前目的文件。已完整比较接受快照旧内容与这些新文件，检查相对 import/path 调整及全部业务断言变化。FormApi、消费者 fixture 和 catalog JSON 内容保持；五个其他 Form/Field 测试只有换行差异。其余目的文件的真实变更均按测试意图复核，未恢复旧目录、覆盖外来改动或省略缺失旧路径。

ComponentsOverview 合并进 DocsOverview；FormSurfaceOutline 与 FormSurfaces 合并进 FormAppearance；legacy ShowcaseCatalog 与 ShowcaseSharing 为外来显式删除。报告接受的是本次 Form 契约在当前目的文件中的保留及验证，不批准 legacy 套件退休决策或所有外来工具链变动。

## 剩余边界与质量判断

本次公开 API、运行时、示例、来源导出、消费技能和升级说明相互一致。测试既检查静态契约，也检查状态变化、真实容器几何及公开包消费者，能够支持本范围 PASS。

249 个既有跳过项没有作为通过项计数；既有 lint/browser warnings 没有隐去。独立消费者编译与已测宿主布局不构成任意第三方 CSS 环境的保证。外来 runner/CI/release 改造仍由其所属任务负责；本报告没有远端 CI、托管部署或 registry 发布的完成声明。

报告保存后再次逐项核对 405 个冻结条目；本报告以该最终无漂移核对结果为生效条件。
