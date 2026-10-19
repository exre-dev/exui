# 文档家族导航通知丢失诊断

状态：根因已通过修复前定向浏览器用例确认；父任务授权的两行最小修复已完成，同一原始用例修复后通过。完整运行及独立审查由父任务继续协调。

## 结论与证据边界

修复前，新夹具的 `key={family}` 与生产 `docs.tsx` 的 `key={page.id}` 一致地在家族切换时卸载整个 `ComponentExamplesHost`，包括内部唯一的 `ExMessageContext` / Sonner Toaster。当前安装的 Sonner 2.0.7 不会在新 Toaster 挂载时重放已创建通知，因此外部通知丢失可见宿主。这是生产中已经存在的宿主所有权问题；仅移除夹具 key 会掩盖它。

初始完整运行日志只报告用例 `ShowcaseExampleInteractions.vrt.test.tsx:891` 超过原 15 秒预算，失败截图已显示 Button 家族，且无加载通知或外部通知。父任务停止该已失败完整运行后，未修源码的独立定向运行明确给出 `VitestBrowserElementError: Cannot find element with locator: getByText('External workflow', { exact: true })`，栈为第 899 行导航后的最后一个可见断言。第 898 行加载消息清理断言已通过。这排除了初始消息发布、导航完成或加载清理才是失败位置的猜测。

调查阶段只读；之后只按父任务授权执行两处 key 删除及修复前后同用例浏览器验证。没有构建，没有更改断言、预算或基线，没有提交。原完整运行失败 PNG 已原样备份为 `.notes/test-organization/toast-navigation-before-full.png`；定向失败截图仍保留在原测试截图目录。

## 数据与生命周期链

1. 用例第 892–896 行打开 ExMessage 家族，触发 `ExMessage.loading("Syncing files…")`，发布公共 `toast.success("External workflow")`，并先验证二者可见。
2. 第 897 行切换 Button 家族。生产 `packages/docs/app/routes/docs.tsx:73` 的 `key={page.id}` 和夹具 `packages/docs/tests/browser/fixtures/docs-examples.tsx:37` 的 `key={family}` 均变化。
3. `packages/docs/app/components/ComponentExamplesHost.tsx:65–66` 将 `ExMessageContext` 与 `FamilySession key={family}` 放在同一外层宿主下。外层 key 因而同时销毁通知宿主和局部示例树。
4. `packages/components/src/components/ex-message-context.tsx` 的 layout cleanup 调用 `unmountExMessageHost`。`packages/components/src/lib/ex-message-controller.ts:123–129` 只遍历自己的 `entries` 关闭 `ExMessage` 消息；外部 toast 不在注册表内，因此控制器没有将其关闭。
5. `packages/docs/src/showcase/pages/exui.tsx:164` 还独立清理页面保存的加载句柄。这正是页面拥有的加载消息应被关闭的边界。
6. 本地实际依赖 `packages/components/node_modules/sonner/package.json` 为 2.0.7。其 `dist/index.mjs:921` 将 Toaster 的本地通知 state 初始化为 `[]`；`:957–998` 只订阅未来事件。Observer `:125–131` 的 subscribe 只登记订阅者，不读取已有通知，也没有重放；`:363–365` 的 `getActiveToasts` 虽能读取存量，却未用于初始化 Toaster。
7. 因此重挂载后的 Toaster 空白，即使外部通知还留在模块 store 中。旧宿主中原有通知的 DOM 与倒计时也已随卸载销毁。

相关既定边界见 `.ai/architectures/components/ex-message.md` 和 `.ai/knowledge/components/ex-message-lifecycle.md`：公共 `toast` 和 `ExMessage` 共用一份 Sonner；控制器只管理自身消息，应用应放置单一消息宿主。现有 `ExMessage.vrt.test.tsx:143` 的 raw toast 容量用例验证 store 不被逐出，不覆盖卸载后的 DOM 恢复；packed consumer 的卸载/重挂载用例验证重新发布能工作，也不要求既有 raw toast 自动恢复。

## 最小修复评估

已同时移除生产 `docs.tsx:73` 的外层 `key={page.id}` 与夹具 `docs-examples.tsx:37` 的外层 `key={family}`，保留 `ComponentExamplesHost.tsx:66` 现有 `FamilySession key={family}`。未改动已有 useMemo 或其他重组改动。

- 同一 docs route 内的示例家族切换继续卸载局部页面树、清理加载句柄、interval 和 Portal；全局 Tooltip、GlassSeed 与单一 ExMessageContext 保持。
- 外部通知仍由原 Toaster 持有，原始关闭期限继续计时，不需要复制 store、重新发布或修改公共 Sonner。
- 全局普通 ExMessage 也将跨家族保留至自身期限；页面显式拥有的加载消息仍通过页面 cleanup 关闭。这是本修复的实际生产行为变化。
- 离开示例文档到无 `family` 的指南、总览或其他 route 仍卸载宿主。本方案只修复同一文档 route 内家族切换的现有用例契约。

已检查是否存在其他强制重挂载边界：

- `packages/docs/app/routes.ts:6` 用同一条 `:locale/docs/*` route 承载所有文档页。
- `packages/docs/app/root.tsx` 的 Layout 与 App 均无 pathname key，App 只渲染 Outlet。
- `Documentation` 的 LanguageContext、DocsLayout、DocsPage 与 section 均无 key。
- 实际安装的 Fumadocs 16.17.4 `dist/layouts/glass/index.js:19–74` 和 `dist/layouts/glass/page/index.js:20–36` 使用稳定 Provider/div 承载 children，没有按 pathname、页面 ID 或 toc 给内容重新设 key。

连续性评估：locale 和 target 不改变 `FamilySession key={family}`，与现有保留断言一致。`DocsExamples.vrt.test.tsx:12–14` 本就使用无外层 key 的真实 Host；其草稿测试在语言、密度与 target 一起变化后确认原 input DOM 与 `Retained draft` 保留。完整交互套件仍保留语言翻译、草稿和 DataGrid 主题/密度不重复渲染断言。上述是源码契约证据，尚不代替修复后的运行验收。

其他选项：将通知宿主提升到 docs 根布局、删除各路由重复宿主，可以覆盖跨 route 导航，但涉及 overview、SSR/激活顺序和现有单宿主限制，范围明显大于本失败所需；修改公共 Sonner 以重放 store 会引入期限、已关闭状态和所有权语义，也不应作为本轮最小修复。

## 定向验证与剩余验收

使用 Node 24.22.0 显式启动 Corepack pnpm 11.9.0，并将 Node 24 bin 放在当前子进程 PATH 首位，命令参数为：

```text
pnpm --filter @exre/exui-docs exec vitest run tests/browser/ShowcaseExampleInteractions.vrt.test.tsx -t "cleans a page-owned loading toast"
```

- 修复前：退出 1，1 failed、77 skipped（标题过滤与移动视口原有跳过），耗时 21.33s，失败用例耗时 15,741ms；错误定位第 899 行。日志 `.notes/test-organization/toast-navigation-before.log`。
- 两行修复后：退出 0，1 passed、77 skipped，两个原始视口项目（desktop active、mobile expected skip），耗时 5.67s，用例耗时 925ms。日志 `.notes/test-organization/toast-navigation-after.log`。

以上证明现有失败用例的红绿回归，不代表完整浏览器矩阵、生产 Router 的实际导航或完整 `pnpm test` 已通过。独立限定审查、相关 type/lint、完整交互/家族覆盖及完整入口由父任务统一收集。本次没有提高 15 秒预算、增加 skip 或删除断言。

失败截图：`packages/docs/tests/browser/__screenshots__/ShowcaseExampleInteractions.vrt.test.tsx/adapted-source-example-interactions-cleans-a-page-owned-loading-toast-on-navigation-and-preserves-another-notification-1.png`。
