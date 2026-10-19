# 测试整理验收

用户已批准实施；仓库工具测试使用现有 `packages/components/tests/tooling/`，不新增工作区、依赖或测试框架。保留任务开始时已有的 Form、文档站和开发流程修改，本次不提交或发布。

## 已落地

- 三个既有子包的 `tests/` 持有全部 36 个 Node 测试文件、54 个浏览器测试文件及专用夹具、消费者验证器。
- 根 `pnpm test` 准备构建并串行执行完整回归；`pnpm test:node [files...]` 支持全部或定向 Node 回归。`verify` 复用完整测试阶段并增加源码、lint、一致性和发布检查。
- 合并两处真实 Vite endpoint 测试并保留不同边界；移除两项源码表达式快照及 8 个专用 JSON；删除或合并 5 个净减少的浏览器套件。独有缩略图、复制失败、草稿连续性、持久化、表单背景/边框断言均迁入保留套件。
- 保留全部真实交互用例、双语全家族覆盖、异步 Form、文件生命周期、键盘/ARIA、恢复原子性、隔离 tarball 消费者和 24 张正式截图基线。基线 SHA256 与任务前备份一致。
- 已同步 manifest、Vitest、TypeScript、lint、CI/release、CODEOWNERS、README、TESTING 及相关 `.ai/` 路径。维护测试命令的唯一说明为根 `TESTING.md`。
- 保留的导航通知用例发现并修复生产文档的宿主重挂问题：外层 Host 保持，内部 FamilySession 仍按家族卸载；页面 loading 清理而外部通知保留。原断言定向红绿验证通过，独立限定审查 clean。

## 最终验收证据

完整入口所含阶段已全部在最终源码上通过。本次因用户中断而按原顺序分段验收：`full-test-final.log` 记录前置构建、Node、示例、样式与 Skill；`remaining-verification.log` 记录完整浏览器及其后所有阶段，续跑命令退出 0，最后一行为 `ALL REMAINING STAGES PASSED`。未取得单次不中断的完整 `pnpm test` 退出记录，不将两份日志冒充为该记录。

- Token、公共组件、根路径与 `/exui/` 文档构建通过，包含 TypeScript 检查；另有先前 `pnpm typecheck` 通过记录。
- Node：265 passed、0 failed、0 skipped，55.969 秒。
- 文档示例：118 个验证模块、128 个完整家族消费者编译通过；生产样式与临时 Chromium 变体检查通过；9 个隔离 Skill 示例通过。
- 完整浏览器：54 源文件、108 视口项目文件中 107 passed / 1 既有视口跳过；1,243 passed、225 既有视口跳过、0 failed，326.15 秒。通知导航与 DataGrid render-count 原用例均通过；没有提高时间预算。
- packed-consumer：全部通过（119.0 秒）。覆盖 npm/pnpm tokens-only、严格类型、样式、React/通知/Glass/Chart/Dialog/Form 浏览器消费，以及 Zod 3.25.28 / 4.6.5 的严格类型、SSR、生产构建和 schema 输入输出交互。
- 两种 base：根路径与 `/exui/` 均通过 1,479 条预渲染路径、204 个文档、1,271 组示例分享的 HTTP/静态/浏览器检查；两种 base 的 1,271 组 HTML/Markdown/JSON 分享文件也均通过。最后保留匹配 `/exui/` 验收的构建输出。
- 最后一次 `pnpm lint` 退出 0（既有 Fast Refresh mixed-export 警告）；`git diff --check`、无遗留目录测试检查、24 张正式基线 SHA256 检查全部通过。无新 workspace 或 lockfile importer。
- Node/runner、浏览器迁移及最终集成均经独立审查。生产 CSS 作用域、CODEOWNERS 路径及后续通知生命周期修复已限定复核；生命周期失败诊断也通过限定审查。无未关闭的已确认 P2+ 发现。

原 `full-test.log` 是中断前未完成且有生命周期超时的批次；`full-test-resumed.log` 则在浏览器中发现真实通知缺陷后被停止，均不作为完整通过证据。生命周期两例随后在完整 Node 批次中通过，未改预算/断言。原超时根因未证实，详见 `dev-lifecycle-report.md`；不据重跑成功反推原因，也不修改生产 dev/watch。

本地检查不表示远端 CI、发布或托管站点验收。
