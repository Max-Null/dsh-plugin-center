# DSH 插件管理中心 — 前置设计

> 版本：v0.1（前置研究）
> 日期：2026-08-16
> 状态：**待实现**（前置设计已落盘，spike 未做）
> 关联：`docs/设计/DSH记忆插件-前置设计.md`、`docs/决策/2026-08-16-分形DSH迁移-重评估映射表.md`
> 结论绑定：DeepSeek Harness pre-release（HEAD `47f9438` @ 2026-08-13，`0.1.0-rc.5`，无 tagged release）

---

## 一、背景与目标

原生 Web「插件」设置页只有一个 `dsh-client-ui-settings-plugin-inventory` 的只读 tab，它消费 `dsh-host-plugin-inventory` 的 `pluginInventory/list` Remote。后者**刻意只返回 4 个字段**——`entryId` / `moduleName`（specifier）/ `enabled` / `fiberPhase`，README 明确写着 **"No provenance or mutation"**：不识别某个 entry 由哪个 bundle/profile/override 引入，也拿不到版本号、简介。

所以原生列表只有「名字 + 是否启用 + 状态点」，展开后只有 entryId + 配置 + cordis 状态。用户要的三样——**来源（官方自带 / 自己安装）、版本号、功能简介**——数据源层面就没有，必须插件自己补。其中版本号是后续「更新检测 / 一键更新 / 自动更新」的**前置基础设施**：有了本地版本，才能和远端最新版比较、才谈得上更新。

社区已有大量「插件市场」（按 star）：`dsh-market`（543）、`dsh-webui-market-plugin`（63）、`dsh-plugin-hub`（33）、`dsh-plugin-workshop`（25）等。它们把「分类浏览 + 搜索 + 一键安装」做得很成熟，但都是**发现/安装导向**，普遍没有做好「已安装插件的元数据视图」。

本设计回答一个问题：**做一个完整的「插件管理中心」——已安装插件富卡片（来源/版本/简介/分类）+ 社区市场 + 分类浏览 + 一键安装 + 更新检测/一键更新，作为社区第三方插件（独立仓库，同 `dsh-memory` / `dsh-chinese-thinking`）。**

定位再上一档：**DSH「一切皆插件」，插件管理就是 DSH 的核心管理功能**。插件生态「一天一个样」——今天 dsh-skin 出 bug，次日不仅修了还加了 video wallpaper 等新功能——没有主动推送，用户睡一觉就会错过全部新特性。所以本插件要像一般 app 的更新日志一样，**每次启动时弹窗推送「你的插件又多了什么新功能」（What's New）**。

## 二、核心原则（DSH 原生的插件管理模型）

1. **Loader 是唯一生命周期权威，插件只做只读投影 + 显式安装触发**。不缓存 Loader 状态、不重写 Loader、不绕过 `dsh plugin add` 的 pnpm 安装路径。
2. **元数据从权威源派生**：版本/简介从每个 specifier 解析出的 `package.json` 读；来源从「specifier 形态 + profile 的 `dsh.profile.bundles` / `dependencies`」判定，不臆测。
3. **走官方扩展点**：host 用 `ctx.loader.entries()` + `createRequire(ctx.baseUrl)`，client 用 `settings.section`（一级 section）+ `conversation.session.header.utilities`（右上角入口）+ `shell.overlay`（启动弹窗），安装用 `dsh plugin` 同款的 pnpm forwarder 语义。
4. **安装 = 改 profile → 重启才生效**（bundle 层在 boot 时 compose），UI 必须把这个边界如实呈现，而不是假装热生效。
5. **主动推送，但不打扰**：DSH 启动时全量检测一次第三方插件更新（每天最多一次），有「新变更」才弹 What's New；用「已读版本」去重（storage-domain 持久化，记录每个插件上次已读到的版本），看过的下次不再弹，只弹「上次看过之后新增的」。

## 三、现状能力映射

| 需求 | 原生 / 社区现状 | 本插件做法 |
|---|---|---|
| 已安装插件列表 | 原生 4 字段（名字/启用/状态） | 富卡片：来源 badge + 版本 + 简介 + 分类 + 启用 + 状态 |
| 来源（官方/自装/自定义） | ❌ 原生不给 | 🆕 从 specifier 形态 + profile `bundles`/`dependencies` 判定 |
| 版本号 | ❌ 原生不给 | 🆕 `resolve(specifier + '/package.json')` → `version` |
| 功能简介 | ❌ 原生不给 | 🆕 同上 → `description` |
| 插件市场 | ✅ 社区成熟（dsh-market 等） | 🔁 多源实时聚合（awesome / Oh-My-DSH 等目录） |
| 分类浏览 | ✅ awesome 目录 12 类 | 🔁 复用 category，**支持一个插件多分类** |
| 一键安装 | ✅ 社区成熟 | 🔁 host RPC → spawn pnpm（`dsh plugin add` 语义） |
| 更新检测（本地 vs 远端） | ❌ 社区普遍没做 | 🆕 本地 version vs npm/GitHub latest，semver 比较 |
| 一键更新 / 自动更新 | ⚠️ 社区零星 | 🆕 复用安装路径，追加「检测 → 更新 → 重启」闭环 |
| 启动更新推送（What's New） | ❌ 社区没有 | 🆕 启动检测 + 变更摘要 + 已读去重 + 弹窗 |
| 变更摘要（changelog） | ❌ 社区没有 | 🆕 GitHub release notes / CHANGELOG / commits |
| DSH 版本兼容性 | ❌ 社区没有 | 🆕 从 peerDependencies 读「要求的 DSH 版本」，更新前检查适配 |
| 启用/禁用 | ❌ 原生只读 | ⚠️ 后续计划（改 profile patch + 重启，见 §八） |

> 图例：✅ 复用 / 🔁 带走概念重写实现 / 🆕 DSH 空白需新建 / ⚠️ 暂缓。

**关键结论**：市场、分类、一键安装是「红海」，社区已做透，本插件不重新发明，只做**数据集成**；真正的增量是**已安装插件的元数据视图（来源/版本/简介/分类）**——这是原生数据源缺失、社区市场也普遍没做好的空白。

## 四、插件设计（双面插件，独立仓库）

### 4.1 组件划分

| 组件 | 职责 | 挂载的 DSH 扩展点 |
|---|---|---|
| PluginMetaService（host） | 遍历 `ctx.loader.entries()`，resolve 每个 specifier 的 package.json，判定来源 | `ctx.loader` + `createRequire(ctx.baseUrl)` |
| InstallService（host） | 接收安装请求，spawn pnpm 装包 + reconcile bundles | 自写（参考 `apps/cli/src/plugin.ts` 的 pnpm forwarder） |
| UpdateCheckService（host） | 查远端最新版（npm registry / GitHub release），与本地 semver 比较 | 自写（`npm view` / `gh api` / fetch registry） |
| ChangelogService（host） | 拉变更摘要（release notes / CHANGELOG / commits），增量聚合 | 自写（`gh api releases` / fetch raw / `gh api commits`） |
| CompatCheckService（host） | 读插件 peerDependencies 的 DSH 版本约束，更新前检查兼容 | 自写（解析 peerDependencies + semver 匹配） |
| 元数据 Remote | 把富元数据暴露给浏览器 | `TypertRemoteService` + `@Remote`（同原生 inventory） |
| 插件中心 section（client） | 一个完整页：已安装 / 市场 / 分类三个视图 + 更新操作 | `settings.section` slot（一级导航，和 General/Models 并列） |
| 右上角入口按钮（client） | 会话头部右上角快捷入口，点击打开插件中心 | `conversation.session.header.utilities` slot（右对齐工具区） |
| What's New 弹窗（client） | 启动时弹窗展示更新摘要，已读去重 | `shell.overlay` slot |

### 4.2 来源（provenance）判定算法

对每个 loader entry 的 `moduleName`（specifier）分类：

| specifier 形态 | 来源 | 依据 |
|---|---|---|
| `@deepseek-ai/dsh-*` | **官方** | base/web-app bundle 引入的官方包 |
| `file:///...` | **自定义（本地开发）** | profile `cordis.patch.yml` 的 insert |
| `cordis:*` / 内置 | **内置** | cordis 内建，无 package.json |
| 其他（`dsh-skin`、`@scope/pkg`…） | **用户安装** | 在 profile `dependencies` / `dsh.profile.bundles` 里 |

精确化：host 端用 `ctx.baseUrl`（= profile 目录，即 `~/.dsh/profiles/<name>`）读 `package.json` 的 `dependencies` 和 `dsh.profile.bundles`，把「用户安装」与「官方」进一步区分（官方包也可能出现在依赖里，但以 bundle 来源为准）。再读 `dependencies` 的版本约束（`^0.1.0` vs `file:` vs `link:`），把「用户安装的 npm bundle」和「本地开发插件（file/link）」分得更清。

> 备选（层次 2，暂不采用）：重新 compose profile 用 `renderConfigDump` 的「前缀快照 + 位置 diff」得到逐 entry 来源。准确但重（跑 N 次 `applyEntryPatches`），且依赖 `dsh-app-boot` 的 boot 级函数，第三方插件复用成本高。层次 1 的 specifier 形态判定对「官方/自装/自定义」三分类已足够。

### 4.3 版本 / 简介

```
createRequire(ctx.baseUrl).resolve(`${specifier}/package.json`)  → 读 version / description
```

`file://` specifier 需特殊处理：从文件路径向上找最近带 `package.json` 的目录。`cordis:*` 内置无 package.json，标记为 `null`。

除 version/description 外，同时读 `peerDependencies` 里对 `@deepseek-ai/dsh*` 的版本约束，作为「支持的 DSH 版本范围」（见 §6.6）。

### 4.4 呈现形态（双入口 + 启动推送）

定位是「核心管理功能」，所以不用原生 tab（三级入口），而是：

1. **主入口 — 设置面板一级 section**：注册 `settings.section`（id `plugin-center`，和 General/Models 并列），插件中心的完整内容（已安装 / 市场 / 更新）都在这个 section 里。复用设置面板的 modal、导航、关闭 chrome。
2. **快捷入口 — 会话头部右上角按钮 → 独立 overlay 面板**：注册 `conversation.session.header.utilities`（右对齐工具区），点一下打开**插件中心自己完全可控的 `shell.overlay` 全屏面板**（三视图与设置 section 内容一致）。**不打开设置面板**——实测设置面板的 open 状态是 `SettingsRoot` 组件的局部 `useState`，无全局 API，第三方无法程序化打开（见 §7.3）。
3. **启动推送 — What's New 弹窗**：`shell.overlay`，启动时自动弹出（见 §6.5），不依赖任何入口。

> 右上角 slot 备选：`conversation.session.header.actions`（标题旁操作组，现有 agent-preset/job-list/subagent-catalog）。`utilities` 更「右对齐」，`actions` 更「标题旁」，spike 时二选一定稿。

## 五、市场数据集成

**多源实时聚合**：插件安装本身依赖网络（`dsh plugin add` 走 npm），市场数据没必要离线打包；直接实时 fetch 多个社区聚合库的 raw 数据，合并去重。fetch 由 **host 端**执行（不经过浏览器 CSP）。

预设聚合源（社区确实不止一个目录）：

| 聚合库 | 数据形态 | 规模 |
|---|---|---|
| awesome-dsh-plugin | `data/plugins/*.yml`（category + en/zh 简介） | ~880 个，12 类 |
| Oh-My-DSH | `data/curated.json` / PLUGINS.md | ~1117 个 |
| awesome-deepseek-harness / dsh-external hub | README 列表 | 待核实 |
| dsh-suite（活目录，每小时刷新） | 目录数据 | 待核实 |

**合并去重 + 多分类**：以 `name`（owner/repo）或 `url` 为键去重；多源命中同一插件时，取「有 category + 有 en/zh 简介」信息最全的一条。**category 支持多值**（一个插件可同时属于多个分类，如 dsh-memory 既是 memory 又是 tools）：各源给的 category 取并集，缺失时以权威源（awesome-dsh-plugin）为基准。

**12 类枚举**（awesome 目录实测）：`dev` `fun` `market` `memory` `model` `notify` `session` `skill` `theme` `tools` `ui` `workflow`。

**缓存兜底**：内存 + 本地缓存「最近一次成功快照」；打开市场优先展示缓存、后台拉新；全部源 fetch 失败时回退缓存并提示「网络不可达」，不阻塞浏览。

## 六、更新检测与执行

版本号是本插件「更新」能力的根基，闭环是：**本地版本（已装）→ 远端最新版（npm/GitHub）→ semver 比较 → 有更新则提示 → 一键更新 / 自动更新 → 重启生效**。

### 6.1 更新源与版本获取

| 更新源 | 适用 | 取最新版方式 |
|---|---|---|
| npm registry | 已发 npm 的插件（`dsh plugin add` 生态主源） | `npm view <pkg> version`（或 fetch `registry.npmjs.org/<pkg>/latest`） |
| GitHub releases | 未发 npm、只发 GitHub 的社区插件 | `gh api repos/<owner>/<repo>/releases/latest`（或 fetch API） |

解析顺序：先查 npm，命中则用 npm；未命中回退 GitHub release。`file://` / 本地开发插件没有远端源，标记「本地，无更新源」。

**检测分级 + 后台异步**：启动不阻塞首屏——先展示缓存快照，后台并发检测（设并发上限 + 每插件超时），查完再增量更新 + 弹 What's New；距上次检测 < N 分钟则直接用缓存（节流）。

### 6.2 更新执行

- **一键更新**：复用安装路径（`dsh plugin add <pkg>`，pnpm 装最新）+ reconcile bundles + 提示重启。
- **自动更新**：定时检测（可配置周期）+ 可选自动执行；保守起见 v1 默认「只检测提示、不自动执行」，自动执行留到 v2。
- **批量更新（Update All）**：遍历「有更新」集合逐个更新；失败的记录在结果里，不中断整体。
- **事务化 + 回滚**：更新前快照 profile 的 `package.json` + lockfile，失败自动回滚到快照；同时保留手动回退（`add <pkg>@<old>`）作为兜底。

### 6.3 版本比较

本地 `package.json` 的 `version` vs 远端 version，用 semver 规则比较（`major.minor.patch[-prerelease]`）。不依赖重量级 semver 库，手写一个满足 `major.minor.patch[-prerelease]` 的比较即可（或引入 `semver` 作为唯一依赖）。

### 6.4 变更摘要（changelog）

每个「有更新」的插件，拉「从上次已读版本到当前最新」的**增量变更**。**实测关键**：很多社区插件（如 dsh-skin）**不打 GitHub release / tag / CHANGELOG**，所以 release notes / compare 对这类仓库不可用，**commit 历史是唯一可靠来源**，优先级修正为：

1. **GitHub release notes**（有 release 才用）：`gh api repos/<owner>/<repo>/releases?per_page=N` → 取 `tag_name` 大于本地版本的 release，聚合 `body`（markdown）。
2. **CHANGELOG.md**（有文件才用）：fetch 仓库根 CHANGELOG.md，按 `## vX.Y.Z` 分段解析。
3. **GitHub compare API**（有 tag 才用）：`gh api .../compare/<old>...<new>` 拿两个 tag 间的 commit 列表。
4. **commit 历史**（主力兜底，几乎所有仓库都有）：`gh api .../commits?since=<上次已读时间>` → 聚合 commit message（`fix:` / `feat:` 前缀本身就是摘要）。

`file://` 本地插件无远端源，跳过。变更摘要归一化为结构化列表（插件名 + 旧→新版本 + 摘要正文），正文支持 markdown 渲染。

### 6.5 启动更新推送（What's New）

```
DSH 启动 → client 加载完成 → 触发「启动更新检测」（每天最多自动一次）
  → host 全量检测第三方插件：本地版本 vs 远端最新版 → 有更新的集合
  → 对每个有更新插件拉增量变更摘要 + 兼容性检查 → 返回「更新摘要」
  → client 对比持久化的「已读版本」→ 只保留 version > 已读版本的新变更
  → 有新变更 → shell.overlay 弹窗（What's New）
  → 用户关闭 → 全部标记已读（写回 host 持久化存储）
```

- **触发时机**：DSH 启动时自动检测，**每天最多一次**（节流）；可随时手动「检查更新」触发。
- **已读持久化**：已读版本存 host 端 `storage-domain`（KV 域 → `DSH_HOME/storages`），跨浏览器、跨重启保留，比 localStorage（只存当前浏览器）体验更好。
- **只推第三方**：官方 `@deepseek-ai/dsh-*` 插件随 DSH 本体更新，不纳入本插件的更新检测/推送（但仍在已安装列表里显示元数据）。
- **降级**：无网络 / 检测失败 → 静默跳过，不弹窗打扰；可手动在插件中心里「检查更新」。

### 6.6 DSH 版本兼容性

插件声明「支持的 DSH 版本」的自然来源是 `package.json` 的 `peerDependencies` 里对 `@deepseek-ai/dsh*` 的约束（如 dsh-skin 的 `@deepseek-ai/dsh-client-runtime: ^0.1.0-rc.6`）。

- **显示**：插件详情卡显示「要求 DSH：^0.1.0-rc.6」。
- **更新前检查**：查新版本插件的 peerDependencies 要求，与当前 DSH 版本做 semver 匹配；不满足则**警告/阻止更新**（「该版本要求 DSH ≥ rc.6，当前 rc.5」）——这正是本仓库今天踩过的 dsh-skin rc.6 vs rc.5 的坑。
- **当前 DSH 版本来源**：读 `@deepseek-ai/dsh`（或 `@deepseek-ai/dsh-client-*`）包的实际 version。
- **降级**：插件没声明 peerDependencies 或约束读不到 → 标记「未知兼容性」，仅提示不阻止。

## 七、待实测清单（spike 验证点）

前置研究阶段用一个最小 spike 验证，用事实代替推测：

- [x] `createRequire(ctx.baseUrl)` 能 resolve 三类 specifier 的 package.json：`@deepseek-ai/dsh-system-prompt`、`dsh-skin`、`file:///H:/.../dsh-memory/src/index.ts`（最后一类需往上找 package.json）
- [x] `ctx.baseUrl` 在 host 插件里确实是 profile 目录（已从 `dsh-client-modules` 源码确认：`ctx.baseUrl` = cordis.yml 目录 = profile 目录）
- [ ] `settings.section` slot 能注册一级 section（id `plugin-center`，和 General/Models 并列）
- [ ] 安装 RPC：host 端 spawn `pnpm add` 到 profile 目录，验证与 `dsh plugin add` 行为一致（含 reconcile bundles）
- [x] 更新检测：npm registry 能取到远端最新版（`fetch registry.npmjs.org/<pkg>/latest`），semver 比较本地 vs 远端
- [ ] 市场多源 fetch：host 端 fetch awesome-dsh-plugin / Oh-My-DSH 的 raw 数据，验证合并去重与缓存兜底
- [ ] 变更摘要：`gh api releases` / CHANGELOG.md / GitHub compare / commits 四路提取 + 增量聚合
- [x] 已读持久化：`ctx.storageDomain.open(defineDomain(...))` 存「已读版本」，跨重启读回（**已被 dsh-memory 插件实测验证过**：defineDomain → 写块 → 关闭域 → 重开 → 读回 ✅，见 `DSH记忆插件-前置设计.md` §五）
- [x] DSH 版本兼容：读插件 peerDependencies 的 `@deepseek-ai/dsh*` 约束 + semver 匹配当前 DSH 版本
- [ ] 右上角入口：`conversation.session.header.utilities`（或 actions）按钮能程序化打开设置面板并定位 plugin-center section

### 7.1 已验证结果（2026-08-16，`.spike-plugin-center.mjs`）

| 验证点 | 结果 |
|---|---|
| resolve `@deepseek-ai/dsh-system-prompt` | ✅ 0.1.0-rc.5 + description |
| resolve `dsh-skin`（裸包） | ✅ 0.3.1 + description |
| resolve `file://.../dsh-memory/src/index.ts` | ✅ 往上 2 级找到 `@max-null/dsh-memory@0.2.0` |
| resolve `file://.../dsh-chinese-thinking/src/index.ts` | ✅ `@max-null/dsh-chinese-thinking@0.2.0` |
| resolve `cordis:group`（内置） | ✅ 正确标记 null（无 package.json） |
| peerDependencies → 版本约束 | ✅ `dsh-skin` → `@deepseek-ai/dsh-client-runtime ^0.1.0-rc.6` |
| semver 比较 | ✅ `0.1.0-rc.5 < 0.1.0-rc.6`、`0.2.0 < 0.3.1`、正式版 > prerelease |
| npm registry 最新版 | ✅ `dsh-skin → 0.4.1`（**今天又更新了，印证「一天一个样」**）、`@max-null/dsh-memory → 0.2.0` |
| 更新检测组合 | ✅ `dsh-skin` 本地 0.3.1 vs 远端 0.4.1 → 检测到有更新 |

**关键发现**：`file://` 本地插件往上找 package.json 完全可行（dsh-memory 的 specifier 是 `src/index.ts`，往上 2 级就是 package.json）。npm registry fetch（非 `npm view`，避开子进程 pipe 限制）能稳定取远端版本。

### 7.2 已验证结果（市场多源 fetch + changelog，2026-08-16，`.spike-plugin-center2.mjs`）

| 验证点 | 结果 |
|---|---|
| awesome-dsh-plugin `data/plugins` 列表 | ✅ git trees 拿到 **1054 个 yml**（昨天 880，今天又涨，印证「一天一个样」） |
| awesome yml 解析 | ✅ `url/name/category/description` 字段齐全，en/zh 双语 |
| Oh-My-DSH 数据形态 | ✅ `data/curated.json`（43KB，min_stars/overrides 策展覆盖）+ `PLUGINS.md`（237KB，1397 条自动生成目录）两种形态 |
| 多源合并去重 | ✅ 以 name 为键，category 取并集、desc/stars 取非空值 |
| GitHub release notes（dsh-skin） | ⚪ **releases 数量 0** —— 作者不打 release |
| GitHub compare（dsh-skin） | ⚪ **404** —— 无 tag，compare 不可用 |
| CHANGELOG.md（dsh-skin） | ⚪ **无此文件** |
| commit 历史（dsh-skin） | ✅ 有，commit message 即摘要（`fix: 0.3.1 wallpaper/video polish (#14)`） |

**关键发现（修正 §6.4）**：社区插件普遍**不打 release / tag / CHANGELOG**（dsh-skin 三样都没有），changelog 提取必须**以 commit 历史为主力**，release notes / CHANGELOG / compare 只是「有就用」的增强。

### 7.3 已验证（client 形态，2026-08-16，挂载实测）

| 验证点 | 结果 |
|---|---|
| `settings.section` 一级 section | ✅ 挂载后设置导航出现「插件中心」，和通用/模型并列 |
| `conversation.session.header.utilities` 右上角按钮 | ✅ 会话头部右上角出现田字格图标 |
| 右上角按钮「程序化打开设置面板」 | ❌ **走不通**：设置面板 open 状态是 `SettingsRoot` 组件的局部 `useState`，`openSection(id)` 只通过 `settings.onboarding` 传给 onboarding step（仅 blank 会话激活），无全局 API。**形态修正为「右上角 → 独立 `shell.overlay` 面板」**（见 §4.4） |
| client bundle 注册 id | ⚠️ 必须等于**完整包名**（`@max-null/dsh-plugin-center`），裸名会报 `loaded without registering` |

## 八、风险与决策点

1. **启用/禁用（后续计划）**：原生 inventory 明确只读，社区有 `plugin-switch`、`dsh-plugin-hub` 等做 enable/disable，但那是改 profile patch 层 + 重启，且可能破坏 bundle 一致性。记入 backlog，v1 只做「读 + 装 + 更新检测/一键更新」。
2. **安装/更新后需重启**：bundle 层 boot 时 compose，装完必须重启才生效。UI 要明确提示，不做「装了立刻能用」的假象。
3. **`file://` specifier 的 package.json 定位深度**：本地开发插件可能在任意层级，往上找几级、找不到了怎么办，spike 里定。
4. **市场多源聚合**：多源数据字段不完全一致（category 取值、简介语种、有无 yml），去重与归一化是主要工作；单源故障靠缓存兜底 + 其他源补位。
5. **来源判定精度**：层次 1（specifier 形态）对「官方/自装/自定义」够用，但「官方 bundle 引入的非 @deepseek-ai 包」会误判，接受这个误差（用户主诉是区分「官方自带 vs 自己装」）。
6. **更新源可达性**：`npm view`/`gh api` 依赖网络与凭据；未发 npm 的 GitHub 插件、私有源、镜像 registry 都要有降级路径（查不到 = 「未知」，不阻塞列表）。
7. **自动更新的破坏面**：v1 不自动执行，只检测提示，把「何时更新、更新哪些」的决定权留给用户，避免后台更新改坏正在跑的 profile。
8. **变更摘要质量不稳定**：不是每个作者都写 release notes / CHANGELOG；commit 历史兜底会混入噪音。摘要是「尽力而为」，抓不到就只显示「版本号变了」，不为了凑内容编造。
9. **推送打扰的平衡**：每天最多自动一次 + 已读去重收敛（只弹新变更）+ 「不再提示」开关，把打扰权交还用户。
10. **DSH 版本兼容的降级**：插件未声明 peerDependencies 或约束读不到 → 标「未知兼容性」仅提示不阻止，不因兼容性判断缺失而卡死更新。
11. **已读持久化的跨进程边界**：`storage-domain` 的 `domain/changed` 是进程内事件，多端/多进程并发写有延迟；「已读版本」是低频数据，接受最终一致（同机器跨浏览器已足够）。

## 九、功能清单（v1 / backlog）

**v1（核心闭环）**：已安装富卡片（来源/版本/简介/分类/兼容性）、多源市场 + 多分类浏览、一键安装、更新检测 + 一键更新 + **Update All**、启动 What's New、**失效插件诊断**（fiber `failed` 高亮 + 错误信息）、**插件详情卡**（简介/来源/版本/changelog/GitHub 链接）。

**backlog（v2）**：更新历史时间线、依赖关系（`inject` 依赖，解释「为什么装 A 带了 B」）、导出/导入插件清单、安装前风险提示（扫描权限面：spawn/网络/文件系统）、市场热度排序（GitHub star）、自动更新（默认关，用户手动开）、启用/禁用开关。
