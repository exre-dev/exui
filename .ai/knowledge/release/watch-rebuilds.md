# 源码监听与生成物循环

最后更新：2026-10-28

开发入口等待 Token 与组件首次构建成功后再启动文档站，并持续按依赖顺序监听重建。Token 构建会写回被监听目录内的生成 CSS，因此该文件的监听事件必须被忽略，否则构建本身会持续排队下一轮构建。初始失败终止启动，后续失败保留监听以便修复；退出时需要清理包管理器启动的整个子进程树。

Windows `fs.watch` 的 `filename` 是相对被监听目录的路径，不能把它当成绝对路径传入 `path.relative`。路径忽略条件需要与回调的相对路径语义一致。

Windows Node.js 24 在递归监听 8.3 短路径临时目录时可能触发 libuv 的 `fs-event.c` 路径断言。建立监听前用 `realpathSync.native` 取得规范路径，临时 Vite 测试根目录也须规范化；同一监听回归在 Node.js 22 下通过不足以证明 Node.js 24 路径正确。

回归测试在临时工作区使用真实监听进程和替代构建程序：替代程序保留生成 CSS 写入这一副作用，先证明初始构建不自激，再证明一次源修改只新增一轮 Token 与组件构建。此证据验证监听与排队行为，不代替真实工作区的完整构建门禁。

公共包重建后，正在运行的文档开发服务可能仍返回导入样式表或 JavaScript 的旧转换结果，新浏览器请求也会命中该缓存。Resizable 的方向宽度规则曾已存在于 `packages/components/dist/index.css`，却不在页面的 CSSOM 中，导致无握柄竖线宽度为零。Glass 图标也可能出现详情代码已更新为 `color="blue"`，但旧运行时仅把 `color` 透传到 SVG、内部渐变仍为原色的情况。排查热更新时需比对页面实际加载的规则、运行时行为与磁盘产物，单独通过新进程的 Vitest 或生产构建不能证明旧开发服务已刷新。

当前开发协调器只在完整构建成功后写入重建标记；文档 Vite 插件从原生监听中排除库生成的 `dist`，收到标记变化时先失效模块转换缓存，再请求整页刷新。不排除原生监听会在构建清空或写入中间产物时提前刷新；仅发送 full reload 又仍可能重新提供旧 CSS。整页刷新会重置示例草稿，文档自身修改继续使用普通 HMR。

单独启动文档开发服务并手动重建公共包时，也需要在产物写入完成后更新 `packages/docs/.generated/library-rebuild`；只刷新浏览器不能失效服务端转换缓存。

证据：`scripts/watch.mjs`、`scripts/dev.mjs`、`packages/docs/lib/library-reload.mjs`、`packages/tokens/scripts/generate-css.mjs` 及对应 `watch.test.mjs`、`dev.test.mjs`、`docs-library-reload.test.mjs`。测试命令见根 `TESTING.md`。
