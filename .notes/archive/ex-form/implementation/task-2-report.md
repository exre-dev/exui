# Task 2 实施报告

日期：2026-10-19。执行范围仅 Task 2；核心 API、Task 1 的 Form 浏览器套件、能力源文件、skill、`.ai/` 与 source-review 均未由本任务改写。未提交。

## 已实现

- 原 catalog 自包含，移除 ex-form / ex-item 后共 89 家族，raw/module groups 为 86 components + 3 exui。纯 `navigationGroup` helper 与派生 catalog 将 Form 展示在 Components；导航、总览计数及静态预期使用相同分类，展示为 87 Components + 2 Blocks。Form 模块/地址保留 `exui/form`。
- Form gallery 聚合项目/动态列表、最小模型比较、配置式步骤/确认。比较中的 composed/configured 实例独立，保留一个实例对应一个原生 form。
- 三个 Field 扩展直接组合公开 Field primitives；可聚焦控件使用真实 ID/label/description/error 关联，展示内容用 span 标签。没有添加 ExItem 等价私有包装器。宽度配方使用自身命名容器和 `21.75rem` 阈值（9rem heading + 12rem control + .75rem gap），窄时重置 cap/alignment 为全宽。
- `previewFamilies` 记录 Preview 叶函数的规范所有权，分享导出不再依赖叶函数直接作为 pages 注册值。所有新 Form / Field 分享源码独立编译通过。
- 搜索改用当前公开 `createSearchAPI("advanced", { indexes })`，从当前规范页面显式生成索引，示例 ID 跟随规范 owner；URL 由 docPath 生成。面包屑复用分组后的 documentTree。
- 删除旧双语页面，Form/Field 增加完整公开模块和类型/组合说明；旧入口无别名、迁移页面或历史锚点保留。两个已适配上游消费者仅机械迁移 FormItem -> FormField；raw source cache/revision/source locks 与 coverage 未改。
- Form/FormField 摘要对定义分支与绑定的属性豁免通用 90 字符/3 属性裁剪；家族源码数由实际页面集派生，所有 authored extensions 和 Form 次要分支纳入独立消费者集合。

## 示例所有权（Task 3 接口）

| ID | canonical family | 用途 |
| --- | --- | --- |
| exui-form-1 | form (`exui/form`) | 组合式项目、动态成员列表 |
| exui-form-models | form (`exui/form`) | 两个独立实例的组合式/配置式最小比较 |
| exui-form-configured | form (`exui/form`) | 配置式项目步骤、日期、多选、确认与重置 |
| exui-field-settings | field (`components/field`) | 名称、邮箱错误、开关与说明 ARIA |
| exui-field-display | field (`components/field`) | 工作区、安全状态展示 |
| exui-field-layout | field (`components/field`) | 独立字段宽度与左右对齐 |

旧 exui-ex-form-1、exui-ex-item-1/2/3 已删除，没有兼容义务。其余 Glass/ExMessage/upstream ID 不变。

## 验证证据

Node v24.22.0，pnpm 11.9.0。核心构建产物由 Task 1 提供；没有重建 tokens/components。

先增加并观察 red：

- `node --test --test-name-pattern='canonical|Form summaries' scripts/docs-content.test.mjs scripts/docs-sharing.test.mjs scripts/docs-snippets.test.mjs`：三例失败（91 vs 89、旧 API 源码、onSubmit 被裁剪）。实现后同命令三例全绿。
- `pnpm --filter @exre/exui-docs exec vitest run src/showcase/DocsFormGallery.vrt.test.tsx`：桌面/移动端缺失规范 Form/Field gallery 共四例失败；接线后四例全绿。追加实际布局 red 用例后，两个浏览器都暴露宽时仍堆叠的问题；局部容器 CSS 修复后 gallery 六例全绿。

最终 focused green：

- `node --test scripts/docs-content.test.mjs scripts/docs-static.test.mjs scripts/docs-snippets.test.mjs`：24 passed。
- `node --test scripts/docs-sharing.test.mjs`：12 passed。包含真实根路径/子路径 dev HTTP JSON/Markdown 与所有三个 Form、所有三个 Field 独立源码 tsc 编译。
- `pnpm --filter @exre/exui-docs exec vitest run src/showcase/DocsFormGallery.vrt.test.tsx src/showcase/DocsOverview.vrt.test.tsx src/showcase/ExUIPages.vrt.test.tsx src/showcase/FormContentSizing.vrt.test.tsx`：8 files / 16 cases passed，覆盖桌面/移动端。React 日志仍有既有 flushSync lifecycle 警告，没有失败。
- 最后追加 `pnpm --filter @exre/exui-docs exec vitest run src/showcase/DocsFormGallery.vrt.test.tsx`：2 files / 6 cases passed。真实 extension 的760px卡片中控件256px、标签同行、右到左移动超过20px；320px卡片中控件与 field 同宽、标签在上、无横向溢出且草稿保留。
- `pnpm --filter @exre/exui-docs typecheck`：exit 0，包含 docs prepare、Router typegen 与两个 tsc 配置。
- `pnpm --filter @exre/exui-docs lint`：exit 0，既有 only-export-components warnings。
- `pnpm docs:examples:generate`、`pnpm docs:examples:check`：exit 0，1254 adapted、0 pending、0 legacy、86 upstream families；未下载缓存，报告 cache 0/1528 present。
- docs prepare 生成 `.generated/pages.json`：198 pages，99 per locale。

## 后续依赖和限制

`node scripts/docs-snippets.mjs --write` 按预期阻塞在 `Missing capability example exui-ex-form-1`。没有反复尝试或绕过来源审查。Task 3 先更新能力 registry 和维护源、删除旧页面映射、迁移公开类型关联，再通过现有生成器刷新能力段与 snippets。Form MDX 当前旧 bounded capability 段与旧 source excerpt 仍待该步骤刷新；新 authored modules 已写入，但完整 snippets gate 尚未通过，不能视为所有 MDX 模块已消费编译验证。

父任务负责 Task 3 后的双 base docs build/static/sharing、完整 visual、能力与 skill 门禁和独立代码评审。本任务没有运行 --accept-source-review，未把本地测试当作部署验收。

## 精确变更路径

- `TESTING.md`
- `packages/docs/app/lib/source.server.ts`
- `packages/docs/app/routes/overview.tsx`
- `packages/docs/app/routes/search.ts`
- `packages/docs/app/styles/docs.css`（P2 修复新增范围）
- `packages/docs/content/en/components/field.mdx`
- `packages/docs/content/en/exui/ex-form.mdx`（删除）
- `packages/docs/content/en/exui/ex-item.mdx`（删除）
- `packages/docs/content/en/exui/form.mdx`
- `packages/docs/content/zh-CN/components/field.mdx`
- `packages/docs/content/zh-CN/exui/ex-form.mdx`（删除）
- `packages/docs/content/zh-CN/exui/ex-item.mdx`（删除）
- `packages/docs/content/zh-CN/exui/form.mdx`
- `packages/docs/lib/site-contract.d.mts`
- `packages/docs/lib/site-contract.mjs`
- `packages/docs/src/showcase/ComponentsOverview.tsx`
- `packages/docs/src/showcase/ComponentsOverview.vrt.test.tsx`
- `packages/docs/src/showcase/DocsOverview.vrt.test.tsx`
- `packages/docs/src/showcase/DocsFormGallery.vrt.test.tsx`
- `packages/docs/src/showcase/ExUIPages.vrt.test.tsx`
- `packages/docs/src/showcase/FormExamples.tsx`
- `packages/docs/src/showcase/FormContentSizing.vrt.test.tsx`（P3 修复新增测试范围）
- `packages/docs/src/showcase/OverviewExUIPreviews.tsx`
- `packages/docs/src/showcase/Showcase.tsx`
- `packages/docs/src/showcase/ShowcaseExampleCoverage.vrt.test.tsx`
- `packages/docs/src/showcase/catalog.ts`
- `packages/docs/src/showcase/catalog-presentation.ts`
- `packages/docs/src/showcase/examples/autocomplete/c-autocomplete-12.tsx`
- `packages/docs/src/showcase/examples/number-field/c-number-field-6.tsx`
- `packages/docs/src/showcase/examples/field/exui-extensions.ts`
- `packages/docs/src/showcase/examples/field/exui-field-settings.tsx`
- `packages/docs/src/showcase/examples/field/exui-field-display.tsx`
- `packages/docs/src/showcase/examples/field/exui-field-layout.css`
- `packages/docs/src/showcase/examples/field/exui-field-layout.tsx`
- `packages/docs/src/showcase/pages/components/field.tsx`
- `packages/docs/src/showcase/pages/exui.tsx`
- `packages/docs/src/showcase/translations.ts`
- `scripts/docs-content.test.mjs`
- `scripts/docs-sharing.mjs`
- `scripts/docs-sharing.test.mjs`
- `scripts/docs-snippets.mjs`
- `scripts/docs-snippets.test.mjs`
- `scripts/verify-docs-static.mjs`

本报告自身：`.notes/ex-form/implementation/task-2-report.md`。`docs:examples:generate` 也重写了生成注册/loader 的工作区换行，但 `git diff` 无内容差异；无手工修改 generated 注册内容。`.generated/` / `.source/` 等忽略的生成产物随 prepare 刷新。

## 独立复审后的 P2 修复

依据 `task-2-review.md` 的两个 P2，先给真实 `ComponentExamplesHost` 补回归并观察 red：

- `pnpm --filter @exre/exui-docs exec vitest run src/showcase/DocsFormGallery.vrt.test.tsx -t 'wide Form cards|settings responsive'`：桌面项目卡片426px vs宿主872px失败；Settings宽容器仍column，两个浏览器失败。移动视口的单列Form卡片通过，符合问题只在双列网格出现的证据。
- `ProjectFormPreview`、`ConfiguredFormPreview` 去掉各自 `PreviewGrid`，保留真实 `Preview` 叶与wide声明，由唯一 `FormPage` 网格聚合。所有ID与规范owner不变；源码抽取继续基于叶函数。
- Settings外壳改成公开 `FieldGroup`。第一次复测仍失败：真实父容器806px且container-name=field-group/type=inline-size，但站点后置utilities层的flex-col等覆盖public exui层内的@md规则。给 `app/styles/docs.css` 加有界 `@source inline`，将公开Field响应式flex/width/alignment工具类放入同一app层，恢复其原有28rem查询容器语义；未改component源码或公共CSS。
- Settings实际宽卡片872px时断言row、标签/控件同行且左右分离；窄卡片320px时断言column、标签在上、控件与field同宽、无溢出，错误草稿与description/error ARIA仍保留。
- Form三张卡片均断言宽度等于872px宿主。原gallery的独立草稿、提交、Field ARIA、开关与独立21.75rem配方几何继续通过。

最终验证：

- `pnpm --filter @exre/exui-docs exec vitest run src/showcase/DocsFormGallery.vrt.test.tsx src/showcase/ExUIPages.vrt.test.tsx`：4 files / 18 cases passed，desktop+mobile；只有既有flushSync lifecycle warning。
- `node --test --test-name-pattern='canonical|standalone consumers|source documents' scripts/docs-sharing.test.mjs`：3 passed；验证两个修复后的Form叶函数、含FieldGroup的Settings及其余Form/Field完整闭包的独立消费编译。
- `pnpm --filter @exre/exui-docs typecheck`：exit0，198页内容生成、typegen、两份tsc配置通过。
- `git diff --check`：exit0。

本次精确编辑四个源码/测试路径：`packages/docs/src/showcase/pages/exui.tsx`、`packages/docs/src/showcase/examples/field/exui-field-settings.tsx`、`packages/docs/src/showcase/DocsFormGallery.vrt.test.tsx`、`packages/docs/app/styles/docs.css`，另追加本报告。最后一个是相对上一轮review的唯一新增源码路径，已补入上面的完整列表。capability/skill/.ai、Task3改动、core与独立21.75rem配方CSS未改。未commit，停止编辑等待同一reviewer全范围复审。

## Round 2 剩余 P3 修复

依据独立复审的私有 `FormExamples` 夹具finding，为 `FormContentSizing.vrt.test.tsx` 增加实际独立Input的同行、宽度、对齐、窄行与草稿检查，先运行 `pnpm --filter @exre/exui-docs exec vitest run src/showcase/FormContentSizing.vrt.test.tsx`：desktop/mobile两例都red，宽容器内标签与Input相差31.25px，仍纵向排列。

ContentSizingPreview现复用canonical `exui-field-layout.css`：在独立行外显式加入该配方的查询容器，FieldContent使用已有data-align，不再无条件设置maxWidth/margin。共享CSS的宽行cap改为 `var(--exui-standalone-control-width, 16rem)`，私有夹具通过局部变量选择12/18rem；canonical无变量时仍为原16rem。21.75rem阈值、9rem标签列与窄行全宽规则不变。没有增加store、公开wrapper、模式开关或新功能；当前夹具只有明确的宽时横向、窄时堆叠语义，库自身vertical模式沿用core套件覆盖。

最终聚焦证据：

- `pnpm --filter @exre/exui-docs exec vitest run src/showcase/FormContentSizing.vrt.test.tsx src/showcase/DocsFormGallery.vrt.test.tsx -t 'lets Showcase|actual standalone'`：4 files / 4 passed / 8 skipped。私有独立行宽时18rem=288px；改12rem后192px；右到左移动超过20px；Narrow时320px并与Field同宽、标签在上、无溢出，独立草稿保留。既有绑定字段断言也通过。canonical布局配方默认16rem=256px、左右对齐与窄行全宽继续通过。
- `pnpm --filter @exre/exui-docs typecheck`：exit0，198页、Router typegen和两份tsc配置通过。
- `node --test --test-name-pattern='canonical|source documents' scripts/docs-sharing.test.mjs`：2 passed，规范分享所有权与闭包仍正确。此前独立consumer编译结果保持上下文，本轮没有重复完整pack/build或全部consumer编译。
- `git diff --check`：exit0。

本次精确源码/测试变更：`packages/docs/src/showcase/FormExamples.tsx`、`packages/docs/src/showcase/FormContentSizing.vrt.test.tsx`、`packages/docs/src/showcase/examples/field/exui-field-layout.css`，另追加本报告。新增复审路径仅 `FormContentSizing.vrt.test.tsx`，已加入完整路径清单。原两P2、Settings独立导出、core、skill/capability/.ai与Task3所有改动保持。停止编辑，等待全范围独立复审。

## 最终完整门禁暴露的旧测试/冻结基线同步

完整 `pnpm test:visual` 与父任务static验收期间，由主代理授权仅修改四个额外路径，并通知最终reviewer。现有完整visual runner仍运行时未启动并行Chromium、未中止runner，先做如下最小修复：

- `ShowcaseExampleInteractions.vrt.test.tsx` 仅修改“validates and saves the ExUI form…”一例：从真实Form家族host定位 `[data-share-example-id="exui-form-1"]`，将英文/中文名称、保存按钮、错误消息和status全部限定到项目卡片。保持全局语言切换，以及原DOM控件身份、业务草稿和本地化校验意图。未改其他interaction用例。
- `ShowcaseCatalog.vrt.test.tsx` 仅将导航家族数量91改为89，保留两种语言下逐个导航、实际preview和错误检查的完整遍历。
- `ShowcaseSharing.vrt.test.tsx` 仅更新最后一个旧ExItem分享场景：导航canonical `components/field`，断言14headers和14share wrappers、精确三个扩展 `exui-field-settings/display/layout`，以及原11个 `c-field-1..11` upstream IDs。其他upstream/复制/源码用例保持。
- `scripts/fixtures/docs-site-baseline.json` 根据真实 `loadShareExamples` 返回值，仅删除两family记录ex-form/ex-item、四example记录exui-ex-form-1和exui-ex-item-1/2/3；加入exui-form-models和exui-form-configured，均family=form、extension=false、native=true。严格通用 `assertExampleInventory` 保持不变，未增加豁免。

基线变更证明使用Node24脚本读取修改前JSON与git HEAD逐条deepEqual后，按上述白名单构造新记录，并以id映射检查：

- families removed=[ex-form,ex-item]；added=[]；changed=[]；89条保留记录逐条不变。
- examples removed=[exui-ex-form-1,exui-ex-item-1,exui-ex-item-2,exui-ex-item-3]；added=[exui-form-models,exui-form-configured]；changed=[]；1259条保留记录逐条不变。
- 合计恰8条增删记录（2+4+2）。head仍为 `919fecba4101d7d62f0f21019cc3631779e1c25e`；10条exclusions完整deepEqual不变。
- 真实 `loadCatalog` 与新89family基线精确相等；以真实1271个share entries执行未修改的严格 `assertExampleInventory` 通过，冻结baseline examples现1261条，其余为已登记能力扩展；无新strict failure。
- `node --test scripts/docs-static.test.mjs`：7 passed。
- 授权四路径 `git diff --check`：exit0。

本轮尚未执行聚焦浏览器重验，等待主代理确认完整visual runner结束后再运行。父任务负责static重跑与最终完整复审。四个新增精确路径已加入 `task-2-paths.txt`；本段及manifest为仅有的额外记录性修改。停止编辑等待通知。

## 静态搜索验证器的规范URL选择器修复

父任务root static已通过1479个路径、1271组源码、overview与source/settings状态后，旧搜索选择器因裁掉页面ID尾斜杠超时。只读核实实际 `packages/docs/build/client/search/en/index.json` 与zh-CN对应文件：`docs.docs`中Button的精确type=page记录id/url分别为 `/en/docs/components/button/` 和 `/zh-CN/docs/components/button/`。当前公开createSearchAPI从docPath得到同样的canonical尾斜杠URL；安装的Fumadocs UI `components/dialog/search.js:375` 以 `fd-search-option-${item.id}` 生成DOM ID。

经父任务授权，`scripts/verify-docs-static.mjs`仅修改两处selector：searchFor不再对route执行slice(0,-1)，retry选择器补上 `/zh-CN/docs/components/button/` 的尾斜杠。保留真实搜索点击与waitForURL、第一次503后重试及refetch计数断言，没有产品兼容别名或宽泛匹配。

`node --test scripts/docs-static.test.mjs`：7 passed；该路径 `git diff --check`：exit0。完整root static由父任务重新执行；本步骤不宣称整份static已通过。该路径原已在task-2-paths清单，无新增范围。

## 最终复审的测试文档计数同步

按最终reviewer与主代理的精确授权，仅修正 `TESTING.md` 两处残留：ComponentsOverview的“all 91 family cards”改为89；ShowcaseExampleCoverage的“86 component routes and five ExUI routes”改为“86 component routes and three ExUI module routes”。这里描述raw/module路径覆盖（86+3），与展示分组87 Components+2 Blocks区分。未改其他测试文档段落，未新增或生成测试；TESTING原已在scope内。

## 完整三文件浏览器复验最终结果

主代理确认首轮完整visual结束后，按授权使用Node24执行三个完整文件，无 `-t` 过滤：

```text
pnpm --filter @exre/exui-docs exec vitest run src/showcase/ShowcaseCatalog.vrt.test.tsx src/showcase/ShowcaseExampleInteractions.vrt.test.tsx src/showcase/ShowcaseSharing.vrt.test.tsx
```

日志：`.notes/ex-form/implementation/test-visual-migration-fixes.log`。session11631已确认exit0，耗时159.65s；桌面/移动项目共4 passed files、2 skipped files；55 passed、55 skipped、0 failed。跳过来自既有视口条件，未缩减用例、未隐藏失败条目，完整目录导航遍历、交互与分享用例保留。三theme截图诊断为既有日志，未更新截图基线。

主代理独立执行的root static/search/retry与1271sharing triples已报告全通过；本段仅将其标为父任务结果，不当作本agent亲自重跑。后续完整visual第二轮和 `/exui/` build/static/sharing由父任务负责。本agent停止编辑与验证，不运行额外门禁，外部并行dev/tasks/watch/vite/library-reload改动均保持原状且未纳入task-2路径清单。

## 最终源码消费计数文字修正

按最终reviewer与主代理授权，仅把 `TESTING.md` 中“Five representative exported sources”改为“Ten representative exported sources”，与 `docs-sharing.test.mjs` 当前10个完整独立消费者（其中6个为Form/Field）一致。同一行外部并行维护的 `pnpm test scripts/docs-sharing.test.mjs` 命令及其他hunks原样保留。本次纯文字修正未运行测试、浏览器或公共build，随后停止。
