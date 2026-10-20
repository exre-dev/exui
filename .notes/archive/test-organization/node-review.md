# Node migration and root runner review

审查结论：在本次限定范围内，未发现有证据支持的 P2 或更高等级问题。

## 范围与依据

- 对照已批准计划的 Task 1、Task 3、`node-report.md`、迁移路径映射，以及 `.notes/test-organization/baseline/` 中迁移前的 Node 套件和根入口快照。未将工作树中既有组件与业务改动纳入审查。
- 逐项检查迁移后的 imports、`createRequire`、`new URL`、仓库与包根目录、fixture 位置，以及 consumer/release 子进程路径。专用 verifier 对照原位置的 Git 内容检查迁移差异；其业务断言变化不作为本轮迁移新增行为认定。
- 检查 `scripts/tasks.mjs`、三个现有包与根 manifest、CI/Release/npm hook 引用及公开包边界。没有增加 workspace 或 lockfile importer；components/docs manifest 的非 scripts 字段与任务基线一致，公开包的 files/exports/dependencies 未被此次迁移修改，tests 不在发布 files 清单内。

## 已核对的行为

- 映射共 52 项，缺失的 8 项均为已批准删除的快照 fixture；其余映射目标存在。当前共有 36 个不同的 Node 套件：34 个映射套件，以及新增的 discovery 与 library-build-barrier 套件，均在统一收集范围内。没有旧位置的测试转发 shim。
- docs-example-copy 只删除批准的两项源码快照断言。重复 Vite endpoint suite 的整份 JSON/Markdown 比较、query、cache-control、HEAD、缺失 ID 与非 HTML 错误检查已保留在 docs-dev-sources，并覆盖 `/` 与 `/exui/`。
- root `test:node` 保留字面路径传递与公共包构建前置；`test` 和 `verify` 均只调用一次 `packages/*/tests/**/*.test.mjs`，显式使用 `--test-concurrency=2`。`verify` 追加 lint/source/consistency/release/whitespace 检查，未重复执行根测试阶段。
- 完整测试入口包含 Node、snippets、生产样式与 Chromium、Skill examples、visual、packed consumers，以及两个 docs base 的静态和分享验证。第二次 docs build 与两个 `/exui/` verifier 连续执行；没有在构建另一 base 后才验证前一个输出。
- packed consumer 的 React/Form 子 verifier 使用基于 `import.meta.url` 的新绝对路径启动，保留隔离 consumer cwd；专用 browser controller 仍从 docs 解析固定的 Playwright，从隔离 consumer 解析 Vite，应用继续消费 tarball 的公共入口。

## 本次执行证据与限制

使用 Node 24.22.0，并把其 bin 目录置于本次进程 PATH 首位后，从仓库根运行：

```text
node --test --test-concurrency=2 packages/components/tests/tooling/tasks.test.mjs packages/components/tests/tooling/test-discovery.test.mjs
```

结果：10 passed，0 failed，退出码 0，11.396 秒。运行器断言已包含新的 concurrency 参数，覆盖真实子进程的 cwd/Node/字面参数、错误中止、阶段次数与双 base 顺序。

依照审查委派限制，没有重跑构建、完整 Node 批次、浏览器或 packed/static 集成门禁。`node-report.md` 的 254 项批次仍是 253 passed / 1 watcher failed，随后 watcher 单独通过；本次轻量审查不能证明限制并发后完整批次已经通过，也不代表远端 CI 或发布验收。
