# 文档导航通知宿主最小修复审查

结论：未发现 P2 或更高等级问题（clean）。本结论仅针对生产与夹具两处外层 key 删除的边界和语义；不代表完整测试或生产路由实际浏览器导航已验收。

## 审查范围

诊断 worker 确认两行修复与 `toast-navigation-report.md` 定稿后，核对报告、最终源码、既有定向红绿日志，以及直接相关的路由、Fumadocs 祖先、消息宿主和页面清理实现。已有 LanguageContext memo 修正沿用前置审查，不重复全分支审查。本轮未执行测试、构建或浏览器，未改共享代码、未提交，仅写入本报告。

## 边界与语义核对

- **生产与夹具一致：** `packages/docs/app/routes/docs.tsx:73` 删除 `key={page.id}`；`packages/docs/tests/browser/fixtures/docs-examples.tsx:37` 删除 `key={family}`。二者继续渲染真实 `ComponentExamplesHost`，不再把消息宿主的身份绑定到家族。已核对修改前后这两行；其余 props、已存在的 useMemo、断言和超时配置保持。
- **真实生产路由可保留宿主：** `app/routes.ts:6` 用同一条 `:locale/docs/*` route 承载家族文档；`app/root.tsx`、`Documentation` 中的 LanguageContext、DocsLayout、DocsPage、示例 section 均无路径或页面 key。实际安装的 Fumadocs `layouts/glass/index.js` 与 `layouts/glass/page/index.js` 使用稳定的 Provider/div 层级承载 children，没有按页面、语言或 toc 重挂主内容的 key。换到另一个有 family 的文档时，生产 Host 与夹具具有相同的持续身份边界。
- **外部 toast 持久性：** `ComponentExamplesHost.tsx:65` 的唯一 `ExMessageContext` 位于 keyed FamilySession 外，家族变化不再卸载它。其 Toaster 能继续保有已经显示的外部 toast 与原期限，不需要重新发布或恢复 store。已核对实际 Sonner 实现：Toaster state 初始化为 `[]`、subscribe 只登记未来事件，支持报告中的重挂后外部 toast 不恢复的因果链；控制器 `unmountExMessageHost` 仅撤销自身 entries，不能由外部 toast 仍在 store 中推断其 DOM 可见。
- **页内 loading 仍清理：** `ComponentExamplesHost.tsx:66` 保留 `<FamilySession key={family}>`。换家族会卸载旧 FamilySession 和 Page；`src/showcase/pages/exui.tsx:164` 的卸载 effect 明确 dismiss 页面保存的 loading handle，并清空引用。这个清理在通知宿主持续挂载时仍会向当前 Toaster 发出关闭事件，不依赖销毁宿主来隐藏通知。旧家族的异步加载另有 cancelled cleanup，换家族不会复用旧 Page 状态。
- **家族、语言和目标示例：** 家族变化仍以内部 key 重建示例树；locale、target、density 不在该 key 中，继续经 props/context 更新当前示例。`FamilySession` 的加载 effect 不依赖 locale/target，target effect 单独更新目标检查，既有同家族草稿与 DOM 连续性保持。`DocsExamples.vrt.test.tsx` 已保留语言、密度、target 同时变化后确认原 input DOM 和 `Retained draft` 的断言；交互套件也保留语言变化、草稿和 DataGrid render-count 断言。
- **范围没有扩大：** 全局普通 ExMessage 也会跨家族保留至自身期限；页面明确拥有的 loading 由页面卸载清理。离开 family 文档到指南、总览或其他 route 仍会卸载宿主，这是该最小修复的既有边界。没有移动通知宿主到根布局、修改公共 Sonner 或改变单宿主约束。

## 运行证据与剩余验收

`toast-navigation-before.log` 将修复前失败定位到原用例第 899 行：导航后找不到 `External workflow`；前面的 loading 清理断言已经完成。`toast-navigation-after.log` 记录同一未删减用例 `1 passed | 77 skipped`、用例 925ms、命令总耗时 5.67s。77 项是标题过滤和既有移动视口 skip，不是新增跳过，也不表示其余交互已运行。源码中的第 891–900 行仍同时断言导航前两条通知可见、导航后 loading 消失且外部 toast 可见，没有提高预算或放宽断言。

上述定向结果证明现有失败用例的红绿回归。生产路由祖先核对提供语义一致性证据，但不代替生产 Router 实际导航、完整浏览器矩阵或完整 `pnpm test`；父任务继续收集这些结果。
