# Dev 生命周期诊断增量审查

结论：未发现 P2 或更高等级问题（clean）。本结论仅针对诊断增量，不代表原超时根因已经查明或完整测试已通过。

## 范围与证据

- 只比较 `.notes/test-organization/baseline/scripts/dev.test.mjs` 与 `packages/components/tests/tooling/dev.test.mjs`，已批准的相对 import 路径迁移不再重复审查；全局审查沿用 `final-review.md`。
- 父任务确认 `dev-lifecycle-report.md` 已定稿后读取该报告，并核对当前源码及差异。审查源码 SHA-256：`5FF49B6D0463405A1903215FCAA4A19F3C4945D7F01106459E2DD0CDC24454A5`。
- 本轮未运行测试、构建或浏览器，未修改共享代码，未提交；仅写入本报告。

## 语义核对

- 两例总预算仍为 `20_000` 和 `15_000`（当前源码第 19、77 行）；`waitFor` 的 `8_000` deadline 与 `30`ms 轮询间隔保持，没有新增 skip、重试或放宽条件。
- 新增 `t.signal` abort 监听、`startedAt`、阶段字符串及 `console.error`（第 22–28、54、63、66、71、80–86、105、108、114 行）。监听只读取时间、阶段、该测试的 dev PID 与临时目录并输出诊断，不取消测试、不修改进程控制、不吞异常。耗时门槛抑制正常快速完成时的 abort 日志，不构成测试通过条件。
- 首例保留 Token/组件先后顺序、事件总数、首次与重建 marker、退出码和后代进程不存在断言；次例保留退出码、初始构建进程不存在及 docs marker 不存在断言。全部断言参数和等待目标未变。
- `spawn` 参数、IPC stop、close 监听注册顺序，以及 `finally` 中的 `stopChild(dev)` 和递归删除自有临时根目录均未变。新增阶段记录没有改变这些操作的相对次序。

## 运行证据边界

诊断报告记录了原完整运行的 20s/15s 超时，以及 Node 24、Node 22 和 Node 24 concurrency=2 单文件通过；其结论仍是根因未证实。当前 `full-test-resumed.log:4624–4625` 又记录真正完整任务中的两例分别以 `3810.2966`ms、`3113.3855`ms 通过。本审查只读取这些既有证据，没有把单文件通过或这两行结果推断为完整 `pnpm test`、远端 CI 或部署验收成功。
