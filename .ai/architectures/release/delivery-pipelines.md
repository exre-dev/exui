# 交付流水线与门禁

> 当前私有应用是 `packages/docs`（`@exre/exui-docs`），其静态文档站边界见 [`docs/site.md`](../docs/site.md)。下文原 Showcase 测试的历史证据按原名保留。

最后更新：2026-10-23

`release` 模块不产出可安装的包，它由三类互相衔接的门禁组成：合并前质量门禁、打包消费者门禁与基于标签的发布流水线。

## CI 质量门禁

测试按所属工作区归档到 `tests/`；仓库开发、发布与 Skill 测试由 `packages/components/tests/tooling/` 持有，不新增工作区。`scripts/test-suites.mjs` 将所有 Node 套件显式分为快速回归和集成回归，发现测试拒绝遗漏、重复及失效路径。`check` 共用一次 Token 和公开组件库准备，完成静态检查与快速 Node/SSR 回归；`test` 可独立运行同一组快速回归，`test:node` 保留显式全部或定向 Node 入口。PR 与主分支 CI 共用五组完整桌面验证，保留所有 Node、隔离消费者、示例及双 base 文档门禁，排除手机浏览器项目。取舍理由见 [[release/04-local-check-full-ci]]；测试编写原则、执行时机及性能验收口径由 [TESTING.md](../../../TESTING.md) 统一维护。

`.github/workflows/ci.yml` 在 `pull_request` 与推送 `main` 时运行，`verify` 矩阵启动五个独立作业：

| 项 | 取值 |
| --- | --- |
| runner | `windows-latest`（与视觉基线的平台绑定，见 [[showcase/02-windows-pinned-visual-baselines]]） |
| 运行环境 | Node.js 24、pnpm 11.9.0、`pnpm install --frozen-lockfile` |
| 预置 | 缓存并安装 Playwright Chromium（缓存键为 `pnpm-lock.yaml` 哈希） |
| 顶层权限 | `contents: read` |

| 分组 | 验证内容 |
| --- | --- |
| `checks` | 来源锁定、lint 与一致性、全部 Node 回归、文档片段、Skill 示例、发布声明及空白检查 |
| `docs-root` | `/` 的完整 docs 构建、生产样式、静态与分享输出 |
| `docs-prefix` | `/exui/` 的完整 docs 构建、静态与分享输出，以及 main 产物上传 |
| `visual` | `chromium-desktop` 的全部浏览器用例和现有 Windows 截图基线 |
| `consumers` | 全部独立打包消费者 |

每个 CI 作业在独立 checkout 中准备 Token 和公开组件库，不传递或共享可写构建目录。`checks` 与 `visual` 显式执行 `docs:prepare`，不再依赖其他作业的 docs 构建生成内容和 MDX manifest。两种 base 的构建及其输出验证必须在所属作业内连续完成。组件与 docs 构建包含自身类型检查；Token 的 ESM/CommonJS 编译同时承担对应配置的类型检查。每组内按依赖顺序执行并在失败时中止，矩阵通过 `fail-fast: false` 保留其他组的执行。

本地 `pnpm verify` 和 CI 的 `pnpm verify:part` 共同调用 `scripts/tasks.mjs` 的相同分组定义。本地只准备一次公开包，再顺序运行分组，最后保留已验证的 `/exui/` 产物。各阶段命令以协调器源码为准；ReUI 缓存与锁定来源的边界见 [`../components/public-surface.md`](../components/public-surface.md)。

`ci-gate` 以 `if: always()` 依赖整个 `verify` 矩阵，把聚合结果字符串与 `success` 比较。分支保护只要求这一个聚合检查名。工作流并发组按事件和 PR 编号合并同一个 PR 的运行，并取消旧提交；非 PR 使用唯一 run ID，避免 main 的排队运行被替换。

## 文档 Pages 交付

main 的 `docs-prefix` 作业将通过 `/exui/` 静态与分享验证的 `packages/docs/build/client` 保存为 `docs-site-<run_id>-<run_attempt>`，保留七天并包含隐藏文件。上传属于该作业的门禁；PR 不上传可发布产物。其他组尚未结束时产物可能已经上传，但 Pages 仅在整个来源 CI 成功后获得消费资格。

`.github/workflows/docs-pages.yml` 是成功 main CI 的独立消费者，与 npm Release 平行。`prepare` 只持有仓库和 Actions 读取权限，核对工作流名、事件、结论、分支、来源仓库与 head 仓库，按精确运行 ID 和次数取产物。它在下载前检查 main，下载时要求摘要一致，打包前检查站点根、中英文总览、搜索、路由数据、资源和示例源码，并拒绝符号链接及仓库元数据。部署作业不 checkout、不执行站点文件、不重新构建。

Pages 中间产物命名为 `github-pages-<deploy_run_id>-<prepare_run_attempt>`；`deploy` 必须消费 prepare 的名称输出，不能用自己的运行次数重算。只有完成上传后 prepare 才输出发布资格。两个上传阶段都显式保留隐藏文件，避免站点文件在传输中消失。

仅 `deploy` 申请 Pages 和 OIDC 写权限，使用 `github-pages` environment，并在固定 `docs-pages` 并发组中串行运行且不取消进行中的部署。取得机会后先读取已启用的 Pages 配置，要求路径与 `/exui/` 构建相符，再核对 main；过期来源正常跳过，查询和配置错误失败。最后一次检查后的 main 更新由后续 CI 接续发布。工作流及 environment 的 URL 来自 Pages 实际输出。

恢复接口是完整重跑。来源产物缺失或过期需要重跑当前 main 的整个 CI；Pages 准备或部署失败则在来源仍合格时重跑整个 Docs Pages。部分作业重跑会改变运行次数，不能回退消费前一次的同名来源，也不能按 deploy 的次数猜测 prepare 产物。内容回退使用 main 上的新 revert 提交。工作流不自动启用 Pages；本地验证不证明远端 environment、deployment 或公开站点已验收。

证据：`.github/workflows/ci.yml`、`.github/workflows/docs-pages.yml`、`packages/docs/tests/node/docs-pages.test.mjs`。站点产物边界见 [`../docs/site.md`](../docs/site.md)。

## 发布声明

`.release-bootstrap.yaml` 是仓库的对外声明，`node scripts/release-bootstrap/verify.mjs --root .` 逐字段校验它：

| 字段 | 值 | 含义 |
| --- | --- | --- |
| `schemaVersion` | `1` | 声明格式版本 |
| `provider` | `github` | 必需的工作流文件为 `.github/workflows/ci.yml` 与 `release.yml` |
| `defaultBranch` | `main` | 发布基线 |
| `packageManager` | `pnpm` | 包管理器 |
| `tagStrategy` | `adaptive` | 发布标签形态由仓库是否为 workspace 决定 |
| `changesets.required` | `false` | 不强制每个 PR 携带 Changeset |
| `ci.aggregateCheck` | `ci-gate` | 聚合检查名 |
| `ci.scripts` | `lint`、`typecheck`、`build` | 声明引用的质量脚本必须真实存在于根 `package.json` |
| `hooks[].id` | `npm` | 每个 hook 一个 provider、一个包集合 |

`verify.mjs` 还会拒绝未替换的模板占位符、缺失的 Changesets 配置，以及非 kebab-case 或重名的 hook id。

## 版本与标签流水线

`.github/workflows/release.yml` 由 `CI` 工作流运行完成事件触发，`if` 条件同时要求仓库变量 `RELEASE_AUTOMATION_ENABLED == 'true'`、事件类型为 `push`、结论为成功、分支为 `main`，且被验证的仓库就是本仓库。并发组 `release-main` 且不取消进行中的运行，使相邻合并串行化。

作业内的阶段：

```text
checkout EXPECTED_MAIN（= 被验证的 head_sha，fetch-depth: 0）
  → 安装依赖
  → node scripts/release-bootstrap/verify.mjs --root .
  → 计划：拉取 origin/main 并要求其仍等于 EXPECTED_MAIN；
         强制建立本地 main 引用（Changesets 按 baseBranch 解析本地 ref，
         而 checkout 处于 detached 状态）；
         changeset status --output → plan.mjs → mode: version | recover | no-op
  → mode == version：version.mjs 应用版本计划，lockfile-only 安装，
         重新跑 tokens:check / typecheck / lint / build / verify:pack / test:release，
         再以 --verify 复核，保证写回的版本差异与校验过的完全一致
  → mode != no-op：用 Release App 生成仓库范围令牌，配置机器人身份与 git 凭据
  → mode == version：只 git add 版本结果里列出的路径，
         提交前确认暂存区非空，提交后再次要求 origin/main 未前进，再推送
  → mode != no-op：tags.mjs 逐个创建并推送注解标签
```

标签阶段只对"被提交的版本差异所声明的"发布创建标签：`tags.mjs` 要求目标提交是受信任的 `chore(release): version packages` 提交、是 `origin/main` 的祖先，并且远端已存在的同名标签必须是注解标签且指向同一提交。已存在的注解标签被视为可恢复状态而非冲突。`plan.mjs` 在 HEAD 提交主题已是 `chore(release): version packages` 时直接返回 `recover` 模式，使中断的发布无需再次升版本即可续跑。设计取舍见 [[release/02-tag-driven-oidc-release]]。

`release-diff.mjs` 对版本提交只允许公开包版本、关联依赖、锁文件、对应 changelog 和 Changeset 删除。Changeset 文件名的主体必须匹配 `[A-Za-z0-9_-]+`；Changesets 本身接受的点号名称仍会被这里拒绝。准备发布说明时就应采用兼容名称，避免直到版本应用后才触发差异守卫。

消费 skill 的导出清单由 `scripts/exui-skill/update-inventories.mjs` 从当前源码生成，不嵌入包版本号。仅提升版本时公开面未变，清单必须继续通过检查，避免版本提交后出现无关的清单过期失败；真正的导出变化仍需显式重新生成。清单只表示源码中的符号，消费者的版本契约仍以已安装包的声明为准。

## npm 发布钩子

`.github/workflows/tag-npm.yml` 只在推送匹配 `@exre/exui@*` 的标签时运行，使用 `npm-release` environment 并申请 `id-token: write` 以走 OIDC，不依赖长期 npm 写令牌。步骤顺序：

```text
checkout 标签（fetch-depth: 0）
  → 重新拉取真正的注解标签对象（checkout 会留下指向 peeled commit 的 ref）
     → hook-context.mjs 校验：提交匹配、标签为注解标签、标签属于版本差异、
       提交主题受信任、提交是 origin/main 的祖先、目标包公开且版本与标签一致
  → 全局安装 npm@11.9.0（OIDC 支持下限）
  → 安装依赖
  → release:verify + build + verify:pack
  → npm.mjs 发布
```

`npm.mjs` 只发布声明中的包：打包后重新校验 tarball 内的 manifest，再以 `npm publish --access public --provenance --ignore-scripts` 发布，预发布版本落到 `next` 标签。发布前查询官方注册表，已存在则跳过（幂等），不可用或返回不一致元数据则中止。整个钩子要求运行上下文必须是 GitHub Actions 且仓库为 `exre-dev/exui`，无法在开发者机器上执行，见 `knowledge/release/release-automation-activation.md`。

## 打包消费者门禁

`packages/components/tests/consumers/verify-packages.mjs` 用 `pnpm verify:pack` 运行，是唯一在 workspace 之外验证产物的环节。它先做仓库边界检查（根包与文档应用必须私有，且不得占用公开包名），再 pack 公共包并按 `package-contract.mjs` 校验 manifest 与产物清单，然后建立独立的临时消费者 fixture：

| fixture | 断言重点 |
| --- | --- |
| npm + pnpm 的 tokens-only 消费者 | 依赖树中不得出现任何 React 运行时、类型包或组件实现库（含 pnpm 虚拟店与嵌套 `node_modules`）；字体依赖必须装上；CJS/ESM 两棵 Token 树逐值相等且深度冻结；主题与密度键名完整；缺失 React 时导入组件根入口必须以缺失 React 报错 |
| tokens 类型消费者 | 在 `skipLibCheck: false` 下用 Bundler 与 NodeNext 两种解析编译 `.ts`/`.mts`/`.cts`；`.cts` 走 `import = require` 并断言非法属性与赋值被拒绝；通过 `tsc --listFiles` 证明加载的是 CommonJS 声明入口 |
| tokens 样式消费者 | 独立 Vite 构建能解析字体资源、含配方变量、且不泄漏组件 Tailwind 样式 |
| React 消费者 | `skipLibCheck: false` 类型检查、生产构建、服务端渲染冒烟（Button、字段、Chart），并断言包与消费者解析到**同一个** React 实例 |
| 生产构建的浏览器断言 | `packages/components/tests/consumers/verify-react-browser.mjs` 在 Chromium 中验证图表两点数据、ExUI 图例与 hover 后变化的 tooltip 值、Dialog 经 portal 打开、表单提交、Escape 归还焦点，以及 16px / 32px 根字号下的 Button 几何与 portal Dialog 内边距 |
| Form 隔离消费者 | `packages/components/tests/consumers/form-consumer-fixture.mjs` 按 Zod 3.25.28 与 4.6.5 各建一个临时消费者，依次做 `skipLibCheck: false` 类型检查、生产构建、`--ssr` 构建与 SSR 冒烟；再由 `packages/components/tests/consumers/verify-form-browser.mjs` 在 Chromium 中断言 schema 错误到达绑定控件（含 `aria-invalid`）、非法输出不调用 `onSubmit`、成功解析恰好调用一次、解析后的数值输出不覆盖字符串草稿、重新校验成功后清除错误，且无浏览器运行时错误 |

fixture 一律建在 `os.tmpdir()` 下的临时目录并在 `finally` 中清理；控制器复用文档应用锁定的 Playwright 依赖，浏览器只服务隔离消费者的构建产物。打包与技能示例校验共用 `scripts/run-command.mjs`：Windows 上通过当前 Node 的 npm/Corepack JavaScript 入口执行包管理器，保留参数边界；浏览器仍在独立子进程中运行，以便清理临时目录前释放原生绑定。门禁的失效模式与不可替代性见 [[release/03-packed-consumer-gates]]。

## 脚本模块

`scripts/release-bootstrap/` 是一组可单测的纯模块，由 `node --test "packages/components/tests/tooling/release/*.test.mjs"` 用 Node 内置测试运行器覆盖（`*.test.mjs`），测试使用临时本地 Git 仓库并注入 npm 注册表边界，从不真实发布：

| 模块 | 职责 |
| --- | --- |
| `_lib.mjs` | 参数解析、`fail(code, message)`、workspace 清单发现、glob 匹配、`adaptiveTag` / `parseTag`、`git()` |
| `plan.mjs` | 由 Changesets status 产出 `version` / `recover` / `no-op` 计划；拒绝私有包与版本不匹配 |
| `version.mjs` | 应用版本计划并支持 `--verify` 复核写回结果 |
| `release-diff.mjs` | 从受信任的版本提交中还原本次发布的包与标签 |
| `tags.mjs` | 创建、冲突检测与恢复注解标签 |
| `hook-context.mjs` | 发布前把标签、提交、包与主分支关系收敛成上下文文件 |
| `npm.mjs` | 注册表状态查询、存在即跳过、tarball 复校验与发布 |
| `verify.mjs` | 校验发布声明、Changesets 配置、质量脚本与 provider 文件 |

`adaptiveTag` 依据仓库是否为 workspace 决定标签形态：workspace 用 `<包名>@<版本>`，单包仓库用 `v<版本>`。本仓库始终是 workspace，因此标签形如 `@exre/exui@<版本>`。
