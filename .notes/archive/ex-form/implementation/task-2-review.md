# Task 2 独立代码审查（Round 3）

日期：2026-10-19。

未发现阻塞问题。**Task 2 规范符合性：PASS；代码质量：PASS。** 当前 P0/P1/P2/P3 均为 0，原 2 项 P2 与后续 1 项 P3 均已关闭。本结论限定于当前 Task 2 阶段；完整变更的交付状态仍为 **PRE-REVIEW ONLY**，须待 Task 3 生成与最终全部门禁完成，不表示可以合并、发布或部署。

## 历史问题关闭证据

1. **P2：Form 聚合网格使 wide 卡片半宽 — 已关闭。** ProjectFormPreview、ConfiguredFormPreview 直接返回 Preview，唯一 FormPage 提供网格。真实 ComponentExamplesHost 回归逐一断言三张卡片宽度等于宿主，规范 ID/owner 未改。
2. **P2：Settings responsive 缺查询容器 — 已关闭。** SettingsFields 使用公开 FieldGroup；docs.css 的有限 @source inline 恢复站点应用 utilities 层中的公开 Field 响应式工具类。真实宿主覆盖宽行 row/标签控件同排、窄行 column/输入全宽、无溢出、草稿和 description/error ARIA。
3. **P3：旧 ContentSizingPreview 独立行不恢复窄宽 — 已关闭。** 私有夹具显式复用 canonical exui-field-layout.css 的独立查询容器与 data-align，删除无条件的 maxWidth/margin；局部变量仅控制宽行上限。共享规则以 `var(--exui-standalone-control-width, 16rem)` 保留 canonical 默认值；21.75rem 查询阈值、9rem 标题列和窄行全宽规则未变。新增实际夹具断言覆盖 288px→192px、右到左移动超过20px、窄行320px与字段同宽、标签在上、无横向溢出及独立草稿；原绑定字段断言仍在。没有引入新模式、状态或公共包装组件。

## 本轮独立验证与测试意图

Node 24.22.0、pnpm 11.9.0。

- `pnpm --filter @exre/exui-docs exec vitest run src/showcase/FormContentSizing.vrt.test.tsx src/showcase/DocsFormGallery.vrt.test.tsx -t 'lets Showcase|actual standalone|wide Form cards|settings responsive'`：4 files，8 passed、4 skipped。覆盖 desktop/mobile、三项历史问题，以及 canonical 配方默认256px上限/左右对齐/窄行全宽与草稿保留。
- `node --test --test-name-pattern='canonical|Form summaries' scripts/docs-content.test.mjs scripts/docs-sharing.test.mjs scripts/docs-snippets.test.mjs`：3/3 passed。覆盖 raw/presentation 分类、canonical Form/Field 来源所有权、必要摘要属性。
- 全部44路径的 `git diff --check`：通过；无暂存差异。

测试针对实际行为，不依靠同 class 或 tsc 代替几何证据。现有真实宿主检查覆盖 gallery 数量/归属、独立实例、单个原生 form、ARIA与开关；既有 ExUIPages 场景保留步骤确认、提交、重置。独立来源编译和真实开发 HTTP 双 base 的既有 green 结果已从完整实施报告核对，本轮不重复声称为亲自重跑。

## 独立导出 Settings 证据（沿用 Round 2）

Settings 源、source exporter 和其依赖 stylesheet 自 Round 2 未变，沿用上轮独立证据，不重复构建。上轮从 createSourceDocument 直接导出13个文件，在系统临时目录按其原始 Vite 配置构建并通过真实 preview/Chromium 验证，未加入 docs.css 或额外桥接：

- 1440px viewport：FieldGroup容器1376px，邮箱字段row、标签/输入同排。
- 320px viewport：字段/输入均256px，column/标签在上，document scrollWidth=320，无溢出。
- 输入invalid后aria-invalid=true，两个description/error ID解析正确；切回1440px后row与invalid草稿均保留。

因此站点的app-only扫描规则并非分享源码遗漏。导出入口直接引入公共stylesheet，其样式层条件不同于文档站将公共CSS置于较低exui层的组合。

## 全范围复核

本轮重新按 code-review working-tree --paths 检查 task-2-paths.txt 的全部44个精确路径，包括新增 FormContentSizing.vrt.test.tsx；核对全部暂存、未暂存、未跟踪和删除状态、累计diff、完整未跟踪文件及更新后的task-2-report.md（含三轮修复追加段）。删除页HEAD内容与相邻实现上下文沿用前两轮已读取证据，未用top-5策略缩减范围。Round 1 focused analyzer输出为task-2-review-analysis.log；其中正则exec等命中不构成实际缺陷。

按最新用户覆盖条件审查：未发布项目无需旧API/type/URL/share兼容。44路径范围内其余契约一致：89 raw家族（86 components + 3 exui）、展示87 Components + 2 Blocks；Form仍由exui/form模块/URL承载；catalog可供Node data URL自包含加载；导航/总览/静态预期共用纯展示分类；Preview叶所有权独立于页面聚合；三组Form和三组Field规范分享归属、闭包与必需摘要属性正确；两处adapted upstream消费者仅机械改名，锁定来源未改。RuntimeForm的unknown→ComponentType<Record<string, unknown>>仅用于非法JS输入运行时测试，合法分支仍使用公开类型。

## 后续集成边界

Task 3的能力registry、双语有界能力段、旧Form source excerpt与Missing capability example exui-ex-form-1属于明确分期的生成依赖，不是本阶段新finding。本阶段可交给后续生成与最终验证；最终还须完成源码接受/生成、完整snippet/skill门禁、双base构建及static/sharing、完整visual/pack与全变更独立审查。本轮未执行这些广泛门禁，也没有把工作树阶段审查当作完整交付验收。未改生产代码/测试，未提交。
