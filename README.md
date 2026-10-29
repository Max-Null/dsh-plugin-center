# dsh-plugin-center

This plugin belongs to the **`@max-null/*` family** — a set of plugins that together form the **[SSID (思灵 · Seek Soul in Darkness)](https://github.com/Max-Null/seek-soul-in-darkness)** desktop experience. SSID is the box that bundles them all: `dsh-capture` · `dsh-chat-rail` · `dsh-chinese-thinking` · `dsh-draft-polish` · `dsh-guardian` · `dsh-habit` · `dsh-memory` · `dsh-node-appearance` · `dsh-plugin-center` · `dsh-quick-toolbar` · `dsh-skill-mcp-center` · `dsh-ssid-panels` · `dsh-ssid-zh-ui` · `dsh-achievements` · `dsh-allostasis` · `dsh-skills` · `dsh-ssid-env` · `dsh-ssid-pwsh-retry` · `dsh-tone-layer`.

本插件属于 **`@max-null/*` 插件系列**——这一系列共同构成 **[SSID（思灵 · Seek Soul in Darkness）](https://github.com/Max-Null/seek-soul-in-darkness)** 桌面体验。SSID 是整合它们的盒：`dsh-capture` · `dsh-chat-rail` · `dsh-chinese-thinking` · `dsh-draft-polish` · `dsh-guardian` · `dsh-habit` · `dsh-memory` · `dsh-node-appearance` · `dsh-plugin-center` · `dsh-quick-toolbar` · `dsh-skill-mcp-center` · `dsh-ssid-panels` · `dsh-ssid-zh-ui` · `dsh-achievements` · `dsh-allostasis` · `dsh-skills` · `dsh-ssid-env` · `dsh-ssid-pwsh-retry` · `dsh-tone-layer`。

Update checker for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) — adds an **Updates** tab to the built-in Plugins page.

给 DSH 内置的「插件」页加一个**更新** tab：列出已安装插件的上游新版本，一键交给官方安装流程执行。

自 0.5.0 起不再自带市场、安装、启停与诊断面板——那些官方已经有了（`plugin-manager` + `plugin-market`，后者通过「索引源」提供可安装清单）。本插件只保留官方唯一没有的那件事：**更新检测**。

## Features / 功能

- **Updates tab / 更新 tab** — 内置「插件」页的第三个 tab（排在「已安装 / 发现」之后），列出每个有上游新版本的已安装插件、它的 changelog 行，以及逐行一个**更新**按钮；顶部另有「更新全部」。
- **In-place upgrade / 原地升级** — 更新走本插件自己的 `update`（`pnpm add name@version`）。官方 `installBundle` 对已安装的包直接以 `already-installed` 拒绝，只能装新包。
- **LLM update / LLM 更新** — 每行一个「LLM 更新」，顶部一个「LLM 更新全部」：确认后发起一个「插件更新」会话，由 agent 按 `dsh-plugin-upgrade` skill 决策。机械更新看不到 peer/依赖风险，也会把 vendor 魔改覆盖回官方版——见 `docs/设计/LLM驱动插件更新-设计方案.md`。
- **Startup reminder / 启动提醒** — 有新版时启动弹一次（每天一次节流）。
- **DSH compatibility / 兼容性** — peer 范围与当前内核不符的条目标记号并禁用按钮。
- **Skin-compatible / 皮肤兼容** — 每个颜色都用 `var(--dsw-*)` token，皮肤插件同样能改这套 UI。
- **Packaged upgrade skill / 自带升级技能** — `dsh-plugin-upgrade` 技能随包内置（`SkillProvider`，rank 550），干净机器上 LLM 更新流程也能直接加载。

## Screenshots / 截图

装完后没有独立入口——它长在内置「插件」页里，作为第三个 tab。

**入口 / Entry：** 侧栏「插件」→「更新」tab

| 更新 / Updates |
| :---: |
| ![更新 tab](docs/shots/update-tab-1.png) |

## Market index sources / 插件市场索引源

自 0.5 起本插件不再自带市场，官方「发现」页吃的是 format 1 索引。**目前只有 awesome-dsh-plugin 发布了这种索引**（下表三个地址都是它那一份的镜像），另外两个市场没有发布：

| 市场 | 原始清单 | format 1 索引 |
| :--- | :--- | :--- |
| awesome-dsh-plugin | `plugins.json` 7557 条 | ✓ 过滤后 3917 条 |
| Oh-My-DSH | `curated.json`（精选覆盖层：19 条 manual + 340 overrides） | ✗ 未发布 |
| dsh-market | `plugins.json` 16090 条 | ✗ 未发布（`dshmarket.com/index.json` 是 awesome 那份的转发） |

这意味着官方发现页目前看不到 Oh-My-DSH 与 dsh-market 的内容。要让它们也进发现页，只能由各市场自己在 CI 里生成 format 1——dsh-market 的数据其实够用（16090 条里 3704 条的首条安装命令是 npm 包名形态、5232 条带 `dshEngines`），缺的只是逐个查 registry 补精确版本与发布时间。

### 添加方式

**插件 → 发现 → 索引源**，粘贴下面任一地址（配一个就够）：

| 索引源 | 说明 |
| :--- | :--- |
| `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json` | **推荐**，走 npm 分发（`dsh-plugin-catalog` 包） |
| `https://awesome-dsh-plugin.com/index.json` | 原站镜像 |
| `https://dshmarket.com/index.json` | dsh-market 域名下的同一份转发 |

两点实测结论（2026-10-30 拉取核对）：

- **三个地址是同一份文件**：title 都是「Awesome DSH Plugin 插件精选」，插件数都是 3917，首条都是 `@yolk_vat-y/dsh-project-memory`。**配一个就够**，配三个会在索引源列表里出现三条同名条目——官方按索引的 `title` 展示、不显示 URL，所以同名条目分不出来。这是展示限制，不是索引坏了。
- 优先 jsdelivr 那个：DSH 给索引源的时间上限是 **15 秒**，原站在部分网络下会超时，超时等于市场页面空白。

### 其他可用的索引源

生态里不止 awesome 一家。下面四个都在 2026-10-30 逐个探测过、可用：

| 索引源 | 名称 | 条数 |
| :--- | :--- | ---: |
| `https://www.dsh.so/market/index.json` | DSH.SO（自述「安装验证 + 安全审计」） | 9404 |
| `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json` | Awesome DSH Plugin | 3917 |
| `https://dshopen.org/index.json` | Open Plugin Market（自述「照顾小开发者」） | 944 |
| `https://silentforfar.github.io/dsh-market-index/index.json` | Silentforfar 的个人插件 | 4 |

没有按专业领域拆分的市场，都是全量索引。多个索引源可以同时配，发现页按源切换显示，不会合并成一张表。

## Install / 安装

A `dsh` installation keeps one profile per surface, and **a plugin is visible only in the profile it was installed into**. Installing into the wrong one is the usual reason an install looks like it did nothing.

`dsh` 的每种使用形态各有一个 profile，**插件装进哪个 profile，就只有那个 profile 看得见它**——「装完没反应」通常就是这个原因。

| DSH | Profile | Command |
| :--- | :--- | :--- |
| `dsh web` (CLI + browser) | `web` | `dsh plugin --profile web add @max-null/dsh-plugin-center` |
| Official desktop app / 官方桌面应用 | `desktop` | `dsh plugin --profile desktop add @max-null/dsh-plugin-center` |

From the GitHub source, replace the package name with `github:Max-Null/dsh-plugin-center`。从 GitHub 源码安装时把包名换成 `github:Max-Null/dsh-plugin-center`。

Restart DSH, then open **插件** in the sidebar and switch to the **更新 / Updates** tab. 重启 DSH 后打开侧栏「插件」，切到「更新」tab。

Requirements / 前置条件：DSH runtime within `>=0.1.1-rc.1 <0.3.0` (the `@deepseek-ai/dsh-*` peer range). A runtime outside it makes DSH skip this bundle **silently** — no error, no entry. 内核须落在 `>=0.1.1-rc.1 <0.3.0` 内；范围外 DSH 会**静默跳过**这个 bundle，不报错也不出现条目。

### Uninstall / 卸载

```sh
dsh plugin --profile <your profile> remove @max-null/dsh-plugin-center
```

### The built-in Plugins page / 官方自带的「插件」页

If the sidebar **Plugins** page shows *本部署没有可管理的 profile，无法安装或启停插件。*, that message is the DSH kernel's own and does not come from this plugin. DSH renders it whenever the host has no `pluginManager` service (`packages/boot/plugin-inventory/src/index.ts`), and that service is gated in `packages/bundle/base/cordis.patch.yml` by a single `disabled: !!js "!ctx.get('profileContext')"` row. This plugin contributes one **Updates** tab to that page and nothing else; it neither provides nor affects `pluginManager`.

侧栏「插件」页出现 *本部署没有可管理的 profile* 时，那句话来自 DSH 内核，不是本插件。DSH 在宿主没有 `pluginManager` 服务时就会显示它，而该服务在 `packages/bundle/base/cordis.patch.yml` 里只由一行 `disabled: !!js "!ctx.get('profileContext')"` 决定。本插件只往那一页贡献一个**更新** tab，既不提供也不影响 `pluginManager`。

Two checks / 两条自查：

1. Remove this plugin, restart, and reopen the page. **If the message is still there, this plugin was never the cause.** 卸掉本插件、重启，再看那一页——若那句话仍在，就与它无关。
2. Look in `~/.dsh/profiles/<your profile>/cordis.patch.yml` for a row that switches the manager off, and delete that row:

   ```yaml
   - id: plugin-manager
     disabled: true
   ```

   在 `~/.dsh/profiles/<你的 profile>/cordis.patch.yml` 里找有没有把管理器关掉的条目（形如上），删掉它即可恢复官方插件页。

## Development / 开发

```sh
pnpm install
pnpm build   # tsc (host) + esbuild (browser bundle)
```

## License / 许可

[MIT](./LICENSE)
