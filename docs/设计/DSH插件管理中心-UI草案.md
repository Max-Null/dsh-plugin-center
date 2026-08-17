# DSH 插件管理中心 — UI 草案

> 版本：v0.1（草案）
> 日期：2026-08-16
> 关联：`DSH插件管理中心-前置设计.md`
> 可视 demo：`DSH插件管理中心-UI草案.html`（浏览器打开，可切视图/主题/开关弹窗）

---

## 〇、取色约定（硬约束）

组件样式**只允许 `var(--dsw-*)` 引用 token，禁止任何字面量颜色**（hex/rgb/命名色）。

- token 由 `ui-theme` 的 `design-platform.css` 提供，插件中心组件不自己定义。
- 这样皮肤插件（dsh-skin 等）通过 `ctx.theme.overrideTokens` 覆盖 `--dsw-alias-*` 时，插件中心的颜色**自动跟随皮肤**，不会出现「皮肤换了但插件中心还是原色」的割裂。
- HTML demo 里 `:root`/`[data-theme=dark]` 那段 token 定义只是为了让独立 demo 能渲染；真实实现删掉它，直接用 DSH 环境自带的 token。

常用 token 速查：背景 `--dsw-alias-bg-base` / `-layer-1/2/3` / `-module-platform`；边框 `--dsw-alias-border-l1/l2/l3`；文字 `--dsw-alias-label-primary/secondary/tertiary/caption`；强调 `--dsw-alias-state-business-primary`（DeepSeek 蓝）；状态 `--dsw-alias-state-error/success/warn-primary`；交互 `--dsw-alias-interactive-bg-hover/active`。

---

## 一、布局草图（详见 HTML demo）

### 1.1 插件中心 section（设置面板一级 section）

整体复用设置面板 chrome：左侧 `settings.section` 导航 + 右侧内容列。

```
┌ 设置面板 ────────────────────────────────────────────┐
│ ┌导航┐ ┌内容列──────────────────────────────┐        │
│ │通用│ │ 插件中心        已安装24 更新3 失效1 │        │
│ │模型│ │            [检查更新] [Update All]  │        │
│ │插件│ │ ────────────────────────────────   │        │
│ │中心│ │ [已安装] [市场] [更新]    ← 三个视图  │        │
│ │关于│ │                                     │        │
│ │    │ │  (搜索框 / 分类chips / 卡片列表)     │        │
│ └────┘ └─────────────────────────────────────┘        │
└───────────────────────────────────────────────────────┘
```

### 1.2 已安装视图 — 富卡片

每个插件一张卡片，从左到右：**名字 + 版本** → **来源 badge**（官方蓝 / 用户安装橙 / 本地开发灰）→ **状态点**（active 绿 / failed 红）→ 简介 → **分类 tags（多值）** + **兼容性提示** → 操作（详情 / 更新）。

- 来源 badge 三色：`官方` 蓝、`用户安装` 橙、`本地开发` 灰。
- 失效插件卡片整卡红边框 + 「加载失败」tag + 红状态点（原生只给个点，这里补错误原因）。
- 官方插件显示「随 DSH 更新」，不做更新检测。

### 1.3 市场视图 — 分类 chips + 卡片网格

顶部 12 类 chips（全部 / ui / tools / memory / session / skill / theme / workflow / dev / fun …），下面双列卡片：名字 + star + 简介 + 分类 tags + 安装/已安装按钮。

### 1.4 更新视图

有更新的插件列表，每张：`旧版本 → 新版本` + changelog 列表 + 兼容性警告（不兼容时红条）。顶部 `Update All`。

### 1.5 What's New 弹窗

启动时 `shell.overlay` 全屏遮罩 + 居中对话框：标题「插件更新 N 个」+ 每个插件一节（名字 + 版本箭头 + 变更条目）+ 底部「稍后 / 全部标记已读」。

---

## 二、错误码

host Remote 的失败一律结构化错误码（对齐 DSH `settings-*` 风格），浏览器据 code 展示、不解析 message：

| code | 含义 | UI 动作 |
|---|---|---|
| `plugin-not-found` | 指定插件不在 Loader 树 | 提示并刷新列表 |
| `resolve-failed` | resolve package.json 失败 | 该插件标「未知」，不阻塞 |
| `bad-request` | 参数校验失败 | 提示 |
| `unauthorized` | 非 loopback 调用安装/更新 | 拒绝 |
| `network-unreachable` | 网络不可达 | 静默降级 / 手动重试 |
| `install-failed` | 安装失败 | 提示 + 保留现场 |
| `update-failed` | 更新失败 | 提示 + 自动回滚 |
| `rollback-failed` | 回滚也失败 | 严重提示，给手动 `add <pkg>@<old>` 指引 |
| `incompatible-version` | 目标版本与当前 DSH 不兼容 | 阻止更新，展示版本要求 |
| `unknown-compat` | 读不到兼容性约束 | 仅提示，不阻止 |

---

## 三、API 字段 schema（host Remote 返回）

### 3.1 已安装插件

```ts
interface InstalledPlugin {
  entryId: string          // Loader entry id
  name: string             // specifier（@scope/pkg / dsh-skin / file://...）
  displayName: string      // 短名
  version: string | null   // 本地版本
  description: string | null
  source: 'official' | 'installed' | 'local' | 'builtin'
  categories: string[]     // 多分类
  enabled: boolean
  fiberPhase: 'pending' | 'loading' | 'active' | 'failed' | 'unloading' | null
  compatRange: string | null   // peerDependencies 里的 @deepseek-ai/dsh* 约束
  repoUrl: string | null       // package.json repository
  hasUpdate: boolean
  latestVersion: string | null
}
```

### 3.2 市场插件

```ts
interface MarketPlugin {
  name: string             // owner/repo
  url: string              // GitHub 仓库
  categories: string[]     // 多分类（多源并集）
  description: { en: string; zh: string }
  stars: number | null
  installed: boolean       // 是否已在本地
}
```

### 3.3 更新摘要

```ts
interface UpdateDigest {
  name: string
  fromVersion: string
  toVersion: string
  changelog: string[]          // 增量变更条目（markdown 文本）
  compat: 'compatible' | 'incompatible' | 'unknown'
  compatRange: string | null
}
```

### 3.4 主要 Remote 方法

| 方法 | 入参 | 返回 |
|---|---|---|
| `listInstalled()` | — | `InstalledPlugin[]` |
| `listMarket()` | `{ categories?: string[]; query?: string }` | `MarketPlugin[]` |
| `checkUpdates()` | — | `UpdateDigest[]` |
| `install(pkg)` | `{ name: string; source?: 'npm' \| 'github' }` | `{ ok: true }` |
| `update(pkg)` | `{ name: string }` | `{ ok: true }` |
| `readVersions()` | — | `Record<string, string>`（已读版本，持久化 storage-domain） |
| `markRead(versions)` | `{ versions: Record<string, string> }` | `{ ok: true }` |

---

## 四、已确认（2026-08-16）

1. 来源 badge 三色：官方蓝 / 自装橙 / 本地灰 ✅
2. 市场：默认双列 + 单按钮切换「双列 / 单列」，图标用田字格（双列）/ 两横条（单列）✅
3. 已安装卡片：默认展开，单按钮切换「全收起 / 全展开」，图标用 chevron 上下变换 ✅
4. What's New：居中对话框 ✅
5. 取色：全 `var(--dsw-*)` 引用，兼容 skin 插件 ✅（见 §〇）
6. 切换按钮交互约定：**单按钮 + 单图标，点击时图标原地变换；图标语义为「目标态」**（显示点击后变成的样子，如双列时显示单列图标、展开时显示收起箭头）✅
