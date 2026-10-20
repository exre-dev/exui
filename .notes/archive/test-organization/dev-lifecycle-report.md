# Dev 生命周期超时排查

2026-10-19。原完整 `pnpm test` 的 `.notes/test-organization/full-test.log` 在 Node 阶段记录两个超时：`dev starts docs after library readiness, reloads on success and releases descendants` 用时 20006ms，`dev can stop during the initial build without starting docs or leaving descendants` 用时 15012ms；日志没有失败时的进程状态或执行阶段，也没有 Node 阶段的最终 summary。原完整运行的 exec session 已不存在。不能从这份日志确定超时发生在启动、重建、退出还是清理。

检查 Win32 进程表未发现命令行包含 `exui-dev-test-*` 或 `exui-dev-cancel-*` 的遗留测试进程。另有一个真实的 `@exre/exui-docs dev` 进程（当时 PID 94244，经 cmd.exe PID 139040、pnpm PID 5964 启动），命令行不属于测试使用的临时工作区和替代 pnpm；未终止它。

用 Node 24.22.0 直接执行 `--test packages/components/tests/tooling/dev.test.mjs`，两例分别约 2.9s、2.7s 通过。普通 `node` 为 22.22.1，直接执行同一文件也分别约 3.4s、2.6s 通过。随后用 Node 24.22.0 执行 `--test --test-concurrency=2 packages/components/tests/tooling/dev.test.mjs`，两例约 3.2s、2.7s 通过。`scripts/tasks.mjs` 在完整 Node 阶段使用当前进程的 `process.execPath` 和 `--test-concurrency=2`；外层 PowerShell `pnpm.ps1` 固定从 `C:\Program Files\nodejs` 启动，但完整任务的 Node runner 已由父任务核实为 Node 24.22.0。版本或并发参数在单文件运行中都未复现故障。

现已在 `dev.test.mjs` 加入仅在达到现有测试超时后输出的阶段诊断，包括阶段、由该测试启动的 dev PID 和临时工作区路径。Node 的 `t.signal` 在正常完成时也会 abort，因此诊断有耗时门槛，避免成功时输出；用 Node 24 的最小探针确认真正超时时 abort 事件会触发。诊断本身不更改断言、超时时间、生产脚本或子进程控制流程，Node 24 定向复验通过且无额外输出。

当前根因尚未证实。重新执行的真实统一入口在 `.notes/test-organization/full-test-resumed.log` 中完成 Node 阶段：265 passed、0 failed、0 skipped，69.657 秒；两个生命周期用例分别 3.810 秒和 3.113 秒通过。诊断没有触发。此次完整批次通过不能反推原先超时的原因，因此不修改 `scripts/dev.mjs` 或 `scripts/watch.mjs`。若后续再次超时，再按诊断阶段和仍在运行的自有测试进程查明具体等待点。
