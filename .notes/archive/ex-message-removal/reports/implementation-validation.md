# ExMessage 移除实施与验证

日期：2026-10-19\
结果：批准范围已实施，所需验证门禁已分阶段完成；未发布包或修改下游应用。

## 交付

- [已批准 Spec](../specs/2026-10-19-ex-message-removal-design.md)
- [实施 RFC](../rfcs/ex-message-removal-rfc.md)
- [中文升级指南](../../../../packages/docs/content/zh-CN/getting-started/ex-message-migration.mdx)
- [英文升级指南](../../../../packages/docs/content/en/getting-started/ex-message-migration.mdx)
- [安装后的 skill 本地升级指南](../../../../skills/exui/references/exui/ex-message-migration.md)

删除 `ExMessage`、`ExMessageContext`、四个公开类型及旧控制器源码。不保留兼容别名、旧文档家族或两个旧分享 ID。保留既有 Sonner 呈现适配，通知从同一公开包的 `Toaster/toast` 消费。

本仓库的宿主、Glass 操作、源码分享、能力清单、README、唯一消费 skill 和 `.ai/` 已同步。应用示例展示 loading 同 ID 更新、Promise、取消、截止、迟到及重复回调、同步订阅完成和卸载清理；页面只清理自己拥有的通知。

发布分级按用户后续明确决定：保留合并后的 `.changeset/form-and-notification-updates.md` 及其 `minor` 级别，说明正文继续列出 Breaking Changes。该决定覆盖原 Spec 的 major Changeset 约定，不改变 API 删除范围。

## 验证结果

环境：Node.js 24.22.0，pnpm 11.9.0。

| 门禁 | 结果 |
| --- | --- |
| `pnpm check` | 通过：公开声明、工作区类型、lint、源码锁、文档与 skill 一致性 |
| 全量 Node 回归 | `node --test --test-concurrency=2 "packages/*/tests/**/*.test.mjs"`：265/265 通过 |
| 文档示例 | 118 个验证模块、129 个完整家族消费者编译通过；生产样式 Chromium 检查通过 |
| 隔离 skill 消费 | 10 个示例针对实际 tarball 验证通过 |
| 全量 Chromium | 1221 通过，224 按既有条件跳过；唯一失败为旧 ExUI 模块数断言，修正后该用例聚焦复测通过 |
| 实际 tarball 独立消费者 | 通过：六个旧名称的类型负例、运行时旧导出缺席、同 ID loading/进度/成功/失败、Promise 结果和关闭；其余保留门禁亦通过 |
| 发布配置、空白检查 | 通过 |
| 根路径 `/` | 静态 HTTP、Chromium 交互和源码分享通过：1477 个预渲染路径、1269 组 HTML/Markdown/JSON |
| 子路径 `/exui/` | 重新构建后，同一组静态 HTTP、Chromium 交互和源码分享检查通过 |

`pnpm verify` 并非一次从头到尾返回成功：首次构建遇到 `dist/tokens` 缺失，重试构建通过；之后发现两处迁移测试预期需要修正。已保留通过的构建，重新运行全量 Node 回归，并按 `scripts/tasks.mjs` 的顺序完成其余独立门禁。未重复执行已通过且不受后续测试文本修改影响的构建。

两处测试修正均有失败证据和复测结果：

1. 源码分享原先对整个 Markdown 禁止出现其他示例文案，但合法共享词典包含该文案。改为检查所选源码，并精确要求导出的 Sonner TSX 只有 `c-sonner-21.tsx`；壳隔离断言保留。
2. 库存用例仍预期三个 ExUI 模块。改为精确要求模块 ID 为 `form`、`glass`，保留 86 个 components 的断言。聚焦复测 1 通过，移动端按既有条件跳过。

新增回调示例的 14 个桌面/移动端用例全部通过；Glass 导航回归确认自身通知消失、外部任务通知保留。独立评审提出的 Glass 清理和 skill 完整指南链接问题已修复，复审及上述两处测试修正复审均无 P2 及以上问题。

## 证据与边界

本地执行日志位于 `C:/Users/grimeszhang/AppData/Local/Temp/exui-ex-message-removal-20261019-172236/`：`verify.log`、`verify-serial.log`、`verify-resumed.log`、`verify-final-stages.log`。最后一份日志以 `All remaining verification stages passed` 结束，进程退出码为 0。

最终 `packages/docs/build/client` 为通过检查的 `/exui/` 产物。以上是本地源码、实际打包消费者与静态产物证据，不代表包已发布、线上部署完成或下游应用已升级。
