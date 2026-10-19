# 测试重组最终集成审查

结论：本轮确认的 1 项 P2 迁移问题已修复并完成限定复核；当前没有未关闭的 P2 或更高等级发现。该结论是代码与契约审查结论，完整运行验收仍待父任务收集最终证据。

## 范围与依据

- 依据已批准的 `plans/2026-10-19-test-organization.md`、任务前工作树快照、Node/browser 路径映射及两份独立审查报告。遵循用户修正：工具测试归入 `packages/components/tests/tooling/`，不新增 workspace。
- 审查根 runner、包脚本、测试迁移与删减、专用消费者和静态验证器、Vitest/TypeScript/lint/基线接线、CI/发布调用与维护文档。只检查本次新增的生产 `LanguageContext` 稳定性修正，不把既有 Form 和业务改动归入本次变更。
- 本审查只读源码与既有日志，执行了静态路径/manifest/所有权比对；未运行构建、浏览器、打包或完整测试，未修改共享源码或生成产物。

## 已关闭发现

### P2：测试迁移后保留原有 CODEOWNERS 匹配

发现时 `.github/CODEOWNERS:7` 仍匹配已删除的 `/scripts/verify-packages.mjs`；`/scripts/release-bootstrap/` 规则也不再匹配迁走的三个发布测试。其余规则没有组件目录或全局兜底，所以这些文件失去原有负责人的自动匹配。这是迁移造成的治理契约变化，不需要假定远端是否启用强制 code-owner approval 才能成立。

修复后的 `.github/CODEOWNERS:7` 指向 `/packages/components/tests/consumers/verify-packages.mjs`，`:8` 保留生产 `/scripts/release-bootstrap/`，`:9` 新增 `/packages/components/tests/tooling/release/`；负责人均保持 `@wojzj57 @Xiamolc007`。

限定复核将 `node-path-map.json` 全部 52 个映射逐项与原 CODEOWNERS 的精确/目录规则比较。原先匹配的全部 4 个迁移文件（`verify-packages.mjs`、`npm.test.mjs`、`package-contract.test.mjs`、`runtime.test.mjs`）在新路径均获得相同负责人。该问题关闭。

## 集成契约核对

- **执行与路径：** `scripts/tasks.mjs:5` 从脚本 URL 定位仓库根，`:20` 对所有子进程固定该 cwd，并使用当前 Node、pnpm JS 入口和参数数组。components/docs 的子包测试入口传入仓库相对 glob，因此从子包启动仍能正确执行；Token 测试使用包内相对 glob。定向根 Node 路径保留字面传递。
- **完整测试入口：** `scripts/tasks.mjs:7` 统一收集 package tests；`:104` 只执行一次 Node 收集，随后包含 snippets、生产样式、Skill 示例、Chromium、packed consumers 和两个 base 的静态/分享验证。`:114-118` 保持根输出先验收，再构建并验收 `/exui/`；最后的 Pages 输出对应最后验收的 base。`verify` 在同一流程增加源锁、lint、一致性、发布配置和空白检查，没有再调用另一套完整 test 流程。
- **迁移与删减：** Node 的两项源码表达式快照删除与计划一致；真实 endpoint 合并保留完整 JSON/Markdown、query、no-cache、HEAD、缺失 ID、隔离缓存及两个 base。浏览器完整家族循环与交互用例主体保留；独立审查确认缩略图、分享边界、持久化 remount、Form 背景/边框断言已转移，Tabs 只移除无图片比较的人工截图用例。
- **生产宿主等价性：** `packages/docs/tests/browser/fixtures/docs-examples.tsx:35` 已包含生产 `section.docs-examples.not-prose`，对应 `app/routes/docs.tsx:70` 的作用域。该 CSS 边界的先前 P2 已由浏览器审查关闭。夹具的语言 context memo 与生产 `docs.tsx:59` 使用相同的语言/回调依赖原则，不存在仅在测试中稳定 context 而掩盖生产差异的情况；原 DataGrid render-count 断言保留。
- **发现与静态工具：** Vitest include 改为 `tests/browser/**/*.vrt.test.tsx`；docs TypeScript include 与三个包 lint 均覆盖迁移目录。discovery regression 拒绝遗留在 scripts/src/app/lib 的测试。没有测试转发 shim 或新 workspace/lock importer。
- **消费者与发布边界：** 对照任务前快照，三个子包 manifest 的全部非 scripts 字段逐项相同；公开包 files/exports/dependencies 未改变，`tests/` 不在发布 files 清单。packed React/Form 控制器的新绝对路径和 docs Playwright/consumer Vite 解析边界正确，应用继续消费 tarball 公共入口。实际发布实现及发布声明未因重组改变；release workflow 使用迁移后的发布测试路径，CI 继续由 Windows/Node 24 的 `pnpm verify` 汇总。
- **基线与说明：** 采纳独立浏览器审查的 24 张 Recipe PNG 逐字节一致证据；本轮没有重生成或改写 PNG。README、TESTING、AGENTS 的主要测试入口说明与实际 runner 一致，`.ai` 中当前测试路径和边界引用已迁移。

## 运行证据与剩余验收

- `node-full.log` 的已结束批次明确记录 265 passed、0 failed、0 skipped；这支持全部 36 个 Node 文件的该次运行结果。
- `node-review.md` 记录 Node 24.22.0 下 runner/discovery 的 10 项通过；本审查没有重跑它们。父任务已记录 typecheck/lint 成功，但其时点早于最后一次轻量浏览器夹具修正。
- 本审查读取 `full-test.log` 时，真正的完整 `pnpm test` 仍在运行，日志处于根 docs 预渲染阶段，尚无完整命令退出码和后续全部阶段结果。不得由这一部分日志推断完整测试成功。
- 浏览器先前 acceptance 批次包含一次 DataGrid 超时；孤立重跑成功不替代修正后完整矩阵。最终需要完整 `pnpm test` 的 Node、修正后浏览器矩阵、Skill、packed consumers 及双 base 静态/分享阶段的结束证据，并由父任务记录最后改动后的相关静态检查。该证据仍不代表远端 CI、npm 发布或托管站点已验收。

## 父任务最终验收附记

上述审查之后，真实生产宿主的通知生命周期问题通过原保留用例被定位并最小修复：生产与夹具同时移除 Host 外层 key，保留内部 FamilySession key；该增量已由独立 `toast-navigation-review.md` 限定复核，原通知断言红绿通过。当前持续身份边界以该报告为准，先前关于外层页面 key 的文字是当次审查状态。

最终源码已完成全部保留测试阶段：Node265、浏览器1243（225既有视口跳过）、Skill9、packed consumers、根路径与/exui/静态/分享均通过；最后lint/空白/路径/24基线哈希通过。因用户中断，使用前置日志 `full-test-final.log` 与退出0的续跑日志 `remaining-verification.log` 组成分段证据，没有单次不中断的完整命令退出记录。详见 `completion.md`。本附记由父任务记录运行验收，不冒充原独立审查者重跑了这些阶段。
