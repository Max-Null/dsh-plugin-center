# Release Notes — @max-null/dsh-plugin-center

## 0.4.6 (2026-10-02)

本版只动文档：把安装段改成「先选对 profile」的形式，并补上卸载与自查。

### 变更

- **安装段改为按 DSH 形态选 profile 的对照表**：`dsh web` → profile `web`，官方
  桌面应用 → profile `desktop`。此前只写了「装到你的 profile」，而插件装进哪个
  profile 就只有那个 profile 看得见——装错正是最常见的「装了没反应」。
- 补**前置条件**：内核版本落在 `@deepseek-ai/dsh-*` peer 范围之外时，插件会被
  **静默跳过**——不进 fiber graph，也不出现在「未激活」列表里，界面上不报错。
- 新增**卸载段**与官方「插件」页的说明，附两条自查命令。

### 为什么

- 起因是 issue #1：用户在官方桌面应用里安装后报「原生插件管理被干没了、插件中心
  也没出现」。取证结论是——原生插件管理**没有消失**，只是内容区降级成「本部署
  没有可管理的 profile」（触发条件是宿主缺 `pluginManager` 服务，而本插件在这条
  链上没有任何着力点）；真正的原因是插件装到了与运行实例不同的 profile。
- 文档不准会让用户在这处反复踩，所以按「回源码核对」处理，未改任何代码。

## 0.4.5 (2026-09-29)

### 修复

- `@deepseek-ai/dsh-*` 的 peer 范围由 caret 换成显式区间 `>=0.1.1-rc.1 <0.3.0`，
  使内核 0.2.0-rc.1 判定为兼容。caret 在 0.x 上把上界钉在次版本（`^0.1.1-rc.1`
  即 `>=0.1.1-rc.1 <0.2.0-0`），跨 minor 时插件会被内核**静默跳过**。

## 0.4.4 (2026-09-28)

本版修掉「更新」列表里两条**互相矛盾却同时出现**的错误信息，并把状态与操作移出标题行。

### 修复

- **兼容的插件被成片标成「不兼容当前 DSH」**。根因在内核版本探测：SSiD 1.0.0 把内核
  随包放进 `resources/app.asar/dsh`，而解析链只查 profile 向上链与 `dsh-runtimes` 锚点，
  两处都到不了 → `@deepseek-ai/dsh` 解析为 null → `dshVersion()` 回退 `0.0.0` → 而
  `0.0.0` 不满足任何 `^0.1.x`，于是**所有**声明了 dsh peer 的插件都被判成不兼容。
  实机（内核 0.1.7-rc.2）三个插件全部误报：`dsh-better-sidebar`、`@changfenhuang/dsh-genui`、
  `ds-harness-remote`。两处修：
  - `resolvePackage` 增**内核锚点**：从宿主入口（`process.argv[1]`，即
    `dsh-desktop-host/lib/index.js`）与 `process.resourcesPath` 下的 `app.asar/dsh`、
    `app.asar.unpacked/dsh` 逐级上溯。实测解析重回 `0.1.7-rc.2`。
  - `dshVersion()` 解析不到时返回**空串**，不再返回 `0.0.0`；`detectUpdate` 与
    `buildLlmPackage` 对空串给 `compat: 'unknown'`（不显示标记），而不是给出一个错误的
    「不兼容」。误报会让用户放弃一个其实能升的版本，代价远大于少一个标记。
- **卡片永久挂着几周前的「LLM 已更新」**。host JSONL 是只增日志，`llm-update.result`
  读到的是该插件**最后一条**记录，此前无条件恢复成卡片状态 —— 于是「有新版本可升」与
  「LLM 已更新」并存（实机：三个插件挂着 09-16 / 09-28 的旧记录）。终态是**某次操作的
  回执，不是插件属性**：现在只在 30 分钟内恢复（`shouldRestoreLlmResult`）。

### 变更

- 「更新」卡片分两行：标题行只留插件名与版本变化；`不兼容当前 DSH` / `LLM 已更新` /
  `LLM 更新` 按钮与 `GitHub 变更` 同处底部一行。此前它们全挤在标题行，把 `pc-name`
  压成省略号，插件名显示不全。

### 测试

- 新增 10 条：`meta-resolve.test.ts` 增内核锚点解析与起点构造（3 条，含进程级状态的
  确定性隔离）；`update.test.ts` 增兼容性判定四态（4 条）；`llm-decision.test.ts` 增终态
  时效判据（3 条）。全量 **77 条通过**；`npm run typecheck` 无错。

### 验证

- 真实运行时（`思灵.exe` 的 Node 模式，asar 可读）：`resolvePackage(profile, '@deepseek-ai/dsh')`
  → `0.1.7-rc.2`；上述三个插件按新口径重判全部为 `compatible`。

## 0.4.3 (2026-09-28)

本版把插件中心对内核的两处调用改到 0.1.7 的契约上，并纠正 0.4.2 对 no-session-face 的误判。

### 修复

- **no-session-face —— 0.4.2 的修法方向错了**。0.4.2 在 `connectWorkspace` 之后加了轮询等
  会话面就绪（`SESSION_FACE_TIMEOUT_MS`），默认「绑定是异步建立的，等一下就好」。真根因是
  **引用根本没建立**：`sessions.binding()` 的契约是「只借用已建立的引用，未 retain 则返回
  undefined」，而 `connectWorkspace` 只创建/复用会话、`open` 只打开视图，**两者都不产生
  retain** —— 第三方必须自己来（先例：ui-subagent 的 `sidebarChat`）。本版改为
  `retain(id, { source: 'pluginCenterLlmUpdate' })`，引用由模块级 `llmRetains` 持有到插件卸载
  （提示词交给会话后它要在后台跑完，期间必须保持被引用）；轮询保留作兜底。
- **会话导航走到已不存在的 `sessions.open`**。新契约的 `ISessions` 没有 `open`，导航归
  `UiWorkspaceService`。三处跳转（发起后 / 复用已有会话 / 查看会话）改走
  `uiWorkspaceSvc.openSession`。
- **市场 AI 推荐的一次性输入带上了不该带的字段**。此前按 `Message` 写，带 `id` 与 `source`；
  新契约里这条走 `RequestUserInput`（`packages/llm/llm/src/types.ts:486-495`），它的 `id` 与
  `source` 都是 `?: never` —— 不许带。要求 id 与 producer-owned source 的是 `MessageBase`，
  不是它。

### 关于 git tag

`0.4.2` 与 `0.4.3` 的代码改动**合并在同一个提交**里（`087ac8b`），无法分离，因此仓库里没有
`v0.4.2` tag —— 与 `0.3.0` 的缺口同类。`v0.4.3` 指向该提交。

## 0.4.2 (2026-09-28)

### 修复

- **兼容的插件被标成「不兼容当前 DSH」**。`resolvePackage` 的解析链够不到 SSiD fork 版的
  内核位置（插件集按设计不带内核包），`@deepseek-ai/dsh` 解析为 null，而 `dshVersion()`
  此时回退 `0.0.0` —— 它不满足任何 `^0.1.x`，于是所有声明 dsh peer 的插件都被判成不兼容。
  补 DSH 安装锚点（`<dshHome>/dsh-runtimes/<runtime>/node_modules`），并修掉「走到盘根就
  `return null`」——它让紧随其后的锚点层永远执行不到。
- **LLM 更新发起后报 no-session-face**。`connectWorkspace` 返回后绑定由 client 侧异步建立，
  立刻取值会拿到 undefined；加轮询等待（上限 5 s）。（真根因见 0.4.3 —— 不是「没等够」，
  是引用根本没建立。）

### 测试

- 新增 `tests/meta-resolve.test.ts`（3 条）：dsh-runtimes 锚点命中、profile 链直连、
  两处都找不到时返回 null。

## 0.4.1 (2026-09-21)

### 变更

- **`skills/dsh-plugin-upgrade/SKILL.md` 修订**（代码未动，仅技能正文随包更新）。四处
  「照抄会误判」的结论改掉，另两处判据可操作化：
  1. `profileDir` 一栏原写「DSH web / SSiD dev / SSiD 安装版各自 profile 不同」——实际 dev
     与安装版**共用** `~/.dsh/profiles/ssid`（dev 裸跑默认不设 `DSH_HOME`，安装版也部署到
     同一个 profile 根）。改成写清怎么认，并点明「对这一个目录动手，两边插件都跟着变」，
     隔离实例才走自己的 `DSH_HOME`。
  2. 「SSiD 内核 0.1.1-rc.2 没有 `remote.session`」已过时（0.1.5-rc.2 上该服务可用且已有
     插件在用）——把「某内核没有某服务」这类必然过期的结论换成「怎么查」。
  3. 补上判据分野：`inject([...])` 式缺服务会让 fiber 停在 pending、拖垮整个 boot，而
     `ctx.get()` 探测式已由作者处理降级、可以升、只是功能降一档 —— 不区分会把本来能升的
     包误杀。
  4. 「profile 声明常为 `^0.4.0`」与实测不符（当时 66 条依赖全是精确 pin，无一带范围符），
     改成「先看清声明形态」。
  另外给决策树补了「目标版本要求 DSH 高于当前」的查法，以及带后缀版本
  （`0.6.2-master-<sha>`）的比较处理：逐段 `Number()` 会在后缀处得到 NaN，这类只走
  「本地超前 → 保持」。

## 0.4.0 (2026-09-21)

本版把包内的 `dsh-plugin-upgrade` 技能正式注册进 DSH 的技能注册表——此前它只以文件形式
随包发布，等于没有。

### 修复

- **技能在干净机器上找不到**：`skill` 工具报 `dsh-plugin-upgrade is unknown or no longer
  available`。根因是技能文件虽随包发布（`files` 含 `skills`），却从未注册成 skill provider
  ——DSH 的技能加载器只扫文件系统上的固定根（项目 `.dsh/skills`、`~/.dsh/skills`、bundled
  等），**不会**翻 `node_modules`。于是开发机上靠一份手工拷贝到 `~/.dsh/skills` 能用，
  任何没拷过的机器上，LLM 更新流程一开始就加载不到 skill。这属于「提示词不自足」：
  不报错，只是永远找不到。
- 修掉 `package.json` description 里的一处编码残骸（em dash 的 UTF-8 字节被按 GBK 解成
  `U+95B3` + `?`，npm 页面上显示为乱码）。

### 变更

- 新增 `src/skill-provider.ts`：注册 packaged `SkillProvider`（`rank 550`，与
  `@max-null/dsh-skills` 同档——低于用户自己的技能目录，用户永远可覆盖；高于 bundled），
  从包内 `skills/` 读取。技能随包走、不写用户目录、无需任何安装步骤。
- `skills` 服务走 `ctx.inject(['skills'], cb)`：可选依赖，缺失时插件其余部分照常工作。

### 测试

- 新增 `tests/skill-provider.test.ts`（5 条）：依赖声明、服务缺失时降级、候选字段
  （rank / source / provider / invocation / resourceBase）、正文剥离 frontmatter、列举顺序稳定。
- 全量 64 条通过；`npm run typecheck` 无错。

### 验证

- 隔离实例实测：`Skill` 工具一次命中 `dsh-plugin-upgrade`（2 秒、无绕路），而该实例的
  `~/.dsh/skills` 中并无手工拷贝 → 该技能只可能来自新注册的 provider。

### 关于 git tag

`0.3.0` **没有对应的 git tag**：它的代码状态（09-17 那批 RPC 双路径改动）当时位于工作树中
未提交，版本号本身从未进过任何提交；后来它与 0.4.0 的改动一并提交为 `ec3556e`，无法还原
0.3.0 的独立状态。给它补一个指向 `ec3556e` 的 tag 是假精确，故不补；npm 上的 0.3.0 仍然有效，
缺口由来记在此处。

## 0.3.0 (2026-09-17)

本版为 minor：除修复 web 环境的面板加载失败外，插件对外**新增了一种传输形态**
（`POST /api/plugin-center`），旧的逻辑通道保留为兼容回退。

### 修复

- 修正 web 环境下插件中心面板的「加载失败：transport failure for /plugin-center/listInstalled: HTTP 405」。
  根因在宿主侧：`ctx.connection.rpc.handle()` 注册逻辑通道时会访问 `client-connection`
  未声明的 `webServer` 注入，cordis 属性代理抛错后注册静默失败（DSH 源码形态特有；
  打包内核形态不受影响）。上游报告：deepseek-ai/deepseek-harness discussions #6880。

### 变更

- 传输层改为双路径自适应：
  - 宿主提供 `connection.fetch.register` → 注册 `POST /api/plugin-center` 精确路由
    （只写 Connection 自己的路由表，不触碰 `owner.webServer`）；
  - 宿主只提供逻辑通道注册表（老打包内核）→ 自动回退 `/plugin-center`；
  - 浏览器侧先试新路由，**收到 404 才回退**（新路由未注册时 `/api/*` 是 404，根路径才是 405）。
- `connection` 服务改用 `ctx.inject(['connection'], cb)` 获取：它在插件 apply 时尚未就绪，
  且 `ctx.plugin(P)` 不等待依赖。

### 兼容性

- 插件中心对外的端点集合、请求体与响应信封（RpcResult）均未变。
- 面板端与宿主端需同版本升级（浏览器侧的传输策略随之切换）。

### 测试

- 新增 `tests/rpc-transport.test.ts`（9 条）：传输层选择、服务晚到时不抢先注册、
  路由派发、JSON 解析失败、缺 endpoint 字段与引擎异常收敛为 `internal` 信封。
- 全量 59 条通过；`npm run typecheck` 无错。

### 验证

- web（源码形态）实测：`POST /api/plugin-center` → 200，面板恢复（已安装 184 · 有更新 1 · 失效 0）。
