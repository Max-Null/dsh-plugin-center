/**
 * Plugin-center engine: the process-local composition of metadata, market,
 * and update detection. Read-only over the Loader except install/update, which
 * delegate to pnpm (mirroring `dsh plugin add`). The market catalog is fetched
 * in batches behind a process-local cache, so listMarket returns what is ready
 * so far and the client waterfalls until done.
 */
import { Service, type Context, type FiberState } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/cordis-plugin-loader'
import { fileURLToPath } from 'node:url'
import { basename, dirname, join } from 'node:path'
import { mkdir, readFile, writeFile, appendFile } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { buildInstalledPlugin, clearPackageCache, resolvePackage, type InstalledPlugin, type PluginSource } from './meta.ts'
import {
  fetchAwesomePluginsJson, fetchDshMarketPlugins, fetchOhMyDshOverrides, fetchOhMyDshPlugins,
  mapConcurrent, mergePlugins, type MarketPlugin,
} from './market.ts'
import {
  detectUpdate, installPlugin, preparePluginUpdate, updatePlugin,
  buildLlmPackage, dependencySpecifierOf, isSameUpstream, normalizeRepoUrl, sourceOf,
  type LlmUpdatePackage, type PnpmResult, type UpdateDigest,
} from './update.ts'
import { reconcileInstalled, readDependencyKeys } from './reconcile.ts'
import { readDisabledState, setDisabled, escapeRegExp, effectiveDisabledStance } from './toggle.ts'
import { appendLlmLog, readLlmLogLatest, type LlmLogRecord } from './llm-log.ts'

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** The plugin-center engine (provided by this package's host half). */
    pluginCenter: PluginCenterEngine
  }
}

/** Runtime mirror of cordis FiberState (a cross-package const enum). */
const FIBER_PHASE: Record<FiberState, string | null> = {
  0: 'pending',
  1: 'loading',
  2: 'active',
  3: 'failed',
  4: null,
  5: 'unloading',
}

/** Sources that participate in update detection (official/builtin follow DSH itself). */
const UPDATABLE: ReadonlySet<InstalledPlugin['source']> = new Set(['installed', 'local'])

/** Which market directory the client wants to browse. */
export type MarketSource = 'all' | 'awesome' | 'oh-my-dsh' | 'dsh-market'

/** What's New read-mark result, returned by listMarket so the client waterfalls. */
export interface MarketSnapshot {
  plugins: MarketPlugin[]
  done: boolean
}

/** One AI recommendation (suggest). */
export interface Suggestion {
  name: string
  reason: string
  /** Install spec resolved at suggest time (npm name or github:owner/repo). */
  spec: string | null
  /** GitHub stars when the catalog knows them. */
  stars: number | null
}

/** One-shot diagnostics report (diagnostics). */
export interface DiagnosticsReport {
  dshVersion: string
  baseUrl: string
  node: string
  installed: InstalledPlugin[]
  disabled: Record<string, boolean>
  pnpmLogTail: string
}

/**
 * Extract the first image URL from a plugin's README (P2 screenshots):
 * markdown or HTML image syntax, relative paths resolved against the raw
 * branch root; only GitHub-hosted images are accepted.
 */
async function extractFirstImage(repo: string): Promise<string | null> {
  for (const branch of ['HEAD', 'master', 'main']) {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/README.md`, {
        signal: AbortSignal.timeout(12000),
      })
      if (!res.ok) continue
      const text = await res.text()
      const markdown = /!\[[^\]]*\]\(([^)]+)\)/u.exec(text)
      const html = /<img[^>]+src=["']([^"']+)["']/iu.exec(text)
      const raw = markdown?.[1] ?? html?.[1]
      if (raw === undefined || raw === '') continue
      const url = /^https?:\/\//u.test(raw)
        ? raw
        : `https://raw.githubusercontent.com/${repo}/${branch}/${raw.replace(/^\.?\//u, '')}`
      if (/^https:\/\/(raw\.)?githubusercontent\.com\//u.test(url)) return url
      if (/^https:\/\/github\.com\//u.test(url)) {
        return url.replace(/^https:\/\/github\.com\/(.+?)\/blob\//u, 'https://raw.githubusercontent.com/$1/')
      }
    } catch { /* try next branch */ }
  }
  return null
}

export class PluginCenterEngine extends Service {
  static inject = ['loader']

  private awesomeCache: MarketPlugin[] = []
  private awesomeDone = false
  private awesomeFetching = false
  /** 上次 fetch 失败时刻（0=未失败过）：失败后冷却 60s 再重试，
   *  防止瞬时网络故障让源永久失效（2026-08-22 dsh-market（0）实测）。 */
  private awesomeFailedAt = 0
  private ohMyDshCache: MarketPlugin[] = []
  private ohMyDshDone = false
  private ohMyDshFetching = false
  private ohMyDshFailedAt = 0
  private dshMarketCache: MarketPlugin[] = []
  private dshMarketDone = false
  private dshMarketFetching = false
  private dshMarketFailedAt = 0
  /** README-extracted screenshot URL per plugin name (lazy, P2). */
  private readonly screenshotCache = new Map<string, string | null>()
  private installedNamesCache: Set<string> | null = null
  private updatesCache: { since: string; at: number; digests: UpdateDigest[] } | null = null
  private readonly updatesTtlMs = 5 * 60_000
  /** 串行链：同 profile 的 pnpm 调用禁止并发（并发 add 会撞 store 锁/写坏 lock）。 */
  private pnpmChain: Promise<unknown> = Promise.resolve()

  constructor(ctx: Context) {
    super(ctx, 'pluginCenter')
    // Warm caches in the background once the host is up, so opening the panel
    // hits preloaded data instead of fetching on first paint. The loader is
    // already settled (injected dependency), so entries() is complete here.
    void this.warmup()
  }

  /** Background preload of market + installed metadata; failures fall back to lazy load. */
  private async warmup(): Promise<void> {
    try { await this.listInstalled() } catch { /* listInstalled is re-run on demand */ }
    this.prefetchAwesome()
    this.prefetchOhMyDsh()
    this.prefetchDshMarket()
  }

  /** The profile directory (cordis.yml anchor) — the resolution and install cwd. */
  private get baseUrl(): string {
    if (this.ctx.baseUrl === undefined) {
      throw new Error('plugin-center: ctx.baseUrl is unset — the host needs the profile anchor')
    }
    const raw = this.ctx.baseUrl
    // ctx.baseUrl is a file:// URL; createRequire and pnpm need a plain path.
    return raw.startsWith('file://') ? fileURLToPath(raw) : raw
  }

  /** DSH home directory, for the read-mark persistence file. */
  private get dshHome(): string {
    const env = process.env.DSH_HOME
    if (env !== undefined && env !== '') return env
    return dirname(dirname(this.baseUrl)) // baseUrl = …/profiles/<name> → …/
  }

  private get readVersionsPath(): string {
    return join(this.dshHome, 'plugin-center-read-versions.json')
  }

  /** Durable read-mark: which plugin version the user has already seen. */
  async readVersions(): Promise<Record<string, string>> {
    try {
      return JSON.parse(await readFile(this.readVersionsPath, 'utf8')) as Record<string, string>
    } catch {
      return {}
    }
  }

  /** Persist the read-mark (best-effort; a quota/IO failure just loses the mark). */
  async markRead(versions: Record<string, string>): Promise<void> {
    try {
      const path = this.readVersionsPath
      await mkdir(dirname(path), { recursive: true })
      await writeFile(path, JSON.stringify(versions), 'utf8')
    } catch { /* best-effort */ }
  }

  /** 弹窗当天已展示标记（2026-08-27）：host 文件（DSH web 端口随机，
   *  localStorage 按 origin 隔离会丢；文件侧稳定）。 */
  private get whatsNewDailyPath(): string {
    return join(this.dshHome, 'plugin-center-whatsnew-daily.json')
  }

  async whatsNewDaily(): Promise<string> {
    try {
      const parsed = JSON.parse(await readFile(this.whatsNewDailyPath, 'utf8')) as unknown
      return typeof parsed === 'object' && parsed !== null && typeof (parsed as { day?: unknown }).day === 'string'
        ? (parsed as { day: string }).day
        : ''
    } catch {
      return ''
    }
  }

  async markWhatsNewDaily(day: string): Promise<void> {
    try {
      const path = this.whatsNewDailyPath
      await mkdir(dirname(path), { recursive: true })
      await writeFile(path, JSON.stringify({ day, at: new Date().toISOString() }), 'utf8')
    } catch { /* best-effort */ }
  }

  /** Current DSH version, read from the installed @deepseek-ai/dsh package. */
  async dshVersion(): Promise<string> {
    const resolved = await resolvePackage(this.baseUrl, '@deepseek-ai/dsh')
    return resolved?.pkg.version ?? '0.0.0'
  }

  /** Non-group Loader entries, cross-matched with market categories. */
  async listInstalled(): Promise<InstalledPlugin[]> {
    const views: { id: string; name: string; disabled: boolean; fiberPhase: string | null }[] = []
    for (const entry of this.ctx.loader.entries()) {
      if (entry.options.group) continue
      views.push({
        id: entry.id,
        name: entry.options.name,
        // The patch layer is the toggle source of truth; the Loader's own
        // stance misreports profile-bundle plugins as disabled.
        disabled: effectiveDisabledStance(this.baseUrl, entry.id, entry.options.name),
        fiberPhase: entry.fiber === undefined ? null : FIBER_PHASE[entry.fiber.state],
      })
    }
    // 市场多键索引（2026-09-01 修：@max-null/* 等被 awesome 收录但无标签——
    // 原匹配键只有 m.name（awesome 的 owner/repo 形态），而 installed 的
    // p.name 是 npm 名（@scope/name），形态不一致匹配失败；oh-my-dsh 又是
    // 裸名，三种形态需全部覆盖。同名不同 owner（如 dsh-memory 有 4 个源、
    // dsh-pocket 3 个）用裸名兜底时必须唯一，否则误配）。
    const merged = mergePlugins([this.awesomeCache, this.ohMyDshCache])
    const byNpm = new Map<string, { cats: string[]; name: string }>()
    const byRepo = new Map<string, { cats: string[]; name: string }>()
    const byBase = new Map<string, { cats: string[]; count: number; name: string }>()
    for (const m of merged) {
      if (m.npm !== null) byNpm.set(m.npm, { cats: m.categories, name: m.name })
      if (m.name.includes('/')) byRepo.set(m.name.toLowerCase(), { cats: m.categories, name: m.name })
      const base = m.name.split('/').pop() ?? m.name
      const cur = byBase.get(base)
      if (cur === undefined) byBase.set(base, { cats: m.categories, count: 1, name: m.name })
      else {
        cur.cats = [...new Set([...cur.cats, ...m.categories])]
        cur.count++
      }
    }
    // 返回分类 + 命中的市场条目名（owner/repo；无 repository 字段的包用它补
    // 作者，如 context-doctor → Zhenyu98/dsh-context-doctor，2026-09-01）。
    const categoriesOf = (p: InstalledPlugin): { cats: string[]; marketName: string | null } => {
      let hit = byNpm.get(p.name)
      if (hit !== undefined) return { cats: hit.cats, marketName: hit.name }
      if (p.repoUrl !== null) {
        const repo = normalizeRepoUrl(p.repoUrl)
        if (repo !== '') {
          hit = byRepo.get(repo.toLowerCase())
          if (hit !== undefined) return { cats: hit.cats, marketName: hit.name }
        }
      }
      const base = p.displayName
      const b = byBase.get(base)
      if (b !== undefined && b.count === 1) return { cats: b.cats, marketName: b.name }
      return { cats: [], marketName: null }
    }
    const plugins = await Promise.all(views.map(v => buildInstalledPlugin(this.baseUrl, v)))
    // Sort local dev first, then third-party installs, then official, then builtin.
    const SOURCE_ORDER: Record<PluginSource, number> = { local: 0, installed: 1, official: 2, builtin: 3 }
    return plugins
      .map(p => {
        const r = categoriesOf(p)
        return { ...p, categories: r.cats, catalogName: p.repoUrl === null ? r.marketName : null }
      })
      .sort((a, b) => SOURCE_ORDER[a.source] - SOURCE_ORDER[b.source])
  }

  /** Start the awesome catalog fetch (with failed-retry cooldown). */
  private prefetchAwesome(): void {
    if (this.awesomeFetching) return
    if (this.awesomeDone && this.awesomeCache.length > 0) return
    if (this.awesomeDone && Date.now() - this.awesomeFailedAt < 60_000) return
    this.awesomeFetching = true
    this.awesomeDone = false
    void (async () => {
      try {
        const [plugins, overrides] = await Promise.all([fetchAwesomePluginsJson(), fetchOhMyDshOverrides()])
        const merged = mergePlugins([plugins]).map((p) => {
          const override = overrides[p.name]
          return override?.category !== undefined && override.category !== ''
            ? { ...p, categories: [...new Set([...p.categories, override.category])] }
            : p
        })
        this.awesomeCache = merged
        await this.fillNpmVersions()
      } catch {
        this.awesomeFailedAt = Date.now()
      }
      this.awesomeDone = true
      this.awesomeFetching = false
    })()
  }

  /** Backfill npm latest versions into the awesome cache (best-effort, concurrent). */
  private async fillNpmVersions(): Promise<void> {
    const targets = this.awesomeCache.filter(p => p.npm !== null)
    if (targets.length === 0) return
    const versions = await mapConcurrent(targets.map(p => p.npm!), 50, this.fastNpmVersion)
    const versionByNpm = new Map<string, string>()
    targets.forEach((p, i) => {
      const version = versions[i] ?? null
      if (version !== null) versionByNpm.set(p.npm!, version)
    })
    this.awesomeCache = this.awesomeCache.map(p =>
      p.npm !== null && versionByNpm.has(p.npm) ? { ...p, version: versionByNpm.get(p.npm)! } : p)
  }

  /** Single-registry latest version for the market bulk backfill (npmmirror is fast). */
  private async fastNpmVersion(name: string): Promise<string | null> {
    try {
      const res = await fetch(`https://registry.npmmirror.com/${name}/latest`, {
        signal: AbortSignal.timeout(5000),
      })
      if (!res.ok) return null
      return (await res.json() as { version?: string }).version ?? null
    } catch {
      return null
    }
  }

  /** Start the Oh-My-DSH fetch (single PLUGINS.md parse, with failed-retry cooldown). */
  private prefetchOhMyDsh(): void {
    if (this.ohMyDshFetching) return
    if (this.ohMyDshDone && this.ohMyDshCache.length > 0) return
    if (this.ohMyDshDone && Date.now() - this.ohMyDshFailedAt < 60_000) return
    this.ohMyDshFetching = true
    this.ohMyDshDone = false
    void (async () => {
      try {
        this.ohMyDshCache = mergePlugins([await fetchOhMyDshPlugins()])
      } catch {
        this.ohMyDshFailedAt = Date.now()
      }
      this.ohMyDshDone = true
      this.ohMyDshFetching = false
    })()
  }

  /** Start the dsh-market fetch (2BingLing/dsh-market, ~3900 plugins, trimmed, with failed-retry cooldown). */
  private prefetchDshMarket(): void {
    if (this.dshMarketFetching) return
    if (this.dshMarketDone && this.dshMarketCache.length > 0) return
    if (this.dshMarketDone && Date.now() - this.dshMarketFailedAt < 60_000) return
    this.dshMarketFetching = true
    this.dshMarketDone = false
    void (async () => {
      try {
        this.dshMarketCache = mergePlugins([await fetchDshMarketPlugins()])
      } catch {
        this.dshMarketFailedAt = Date.now()
      }
      this.dshMarketDone = true
      this.dshMarketFetching = false
    })()
  }

  /** Installed plugin names (no file IO) — cached so market polling stays cheap. */
  private async installedNames(): Promise<Set<string>> {
    if (this.installedNamesCache !== null) return this.installedNamesCache
    const names = new Set<string>()
    for (const entry of this.ctx.loader.entries()) {
      if (!entry.options.group) names.add(entry.options.name)
    }
    this.installedNamesCache = names
    return names
  }

  /** Market snapshot for one source: what is cached so far, plus whether done. */
  async listMarket(source: MarketSource = 'all'): Promise<MarketSnapshot> {
    const installedNames = await this.installedNames()
    const decorate = (plugins: MarketPlugin[]): MarketPlugin[] =>
      plugins.map(p => ({ ...p, installed: installedNames.has(p.name) || installedNames.has(p.spec) }))
    if (source === 'awesome') {
      this.prefetchAwesome()
      return { plugins: decorate(this.awesomeCache), done: this.awesomeDone && this.awesomeCache.length > 0 }
    }
    if (source === 'oh-my-dsh') {
      this.prefetchOhMyDsh()
      return { plugins: decorate(this.ohMyDshCache), done: this.ohMyDshDone && this.ohMyDshCache.length > 0 }
    }
    if (source === 'dsh-market') {
      this.prefetchDshMarket()
      // Score-first order (best first) so the big catalog reads usefully.
      return {
        plugins: decorate(this.dshMarketCache).sort((a, b) => (b.score?.total ?? 0) - (a.score?.total ?? 0)),
        done: this.dshMarketDone && this.dshMarketCache.length > 0,
      }
    }
    this.prefetchAwesome()
    this.prefetchOhMyDsh()
    this.prefetchDshMarket()
    return {
      plugins: decorate(mergePlugins([this.awesomeCache, this.ohMyDshCache, this.dshMarketCache])),
      done: (this.awesomeDone && this.awesomeCache.length > 0)
        && (this.ohMyDshDone && this.ohMyDshCache.length > 0)
        && (this.dshMarketDone && this.dshMarketCache.length > 0),
    }
  }

  /** Detect updates for every installed third-party/local plugin, TTL-cached. */
  async checkUpdates(sinceIso: string): Promise<UpdateDigest[]> {
    const now = Date.now()
    const hit = this.updatesCache
    if (hit !== null && hit.since === sinceIso && now - hit.at < this.updatesTtlMs) return hit.digests
    const [installed, localDsh] = await Promise.all([this.listInstalled(), this.dshVersion()])
    // 只检测 profile 直接声明的插件。由内核 bundle 间接引入的内部插件——
    // 如 @deepseek-ai/cordis-plugin-timer / cordis-plugin-hmr(dsh-base 的
    // cordis.patch.yml insert 条目)——名字不在 profile dependency 里,由 DSH
    // 内核版本管理,用户无法也不应单独更新;不按此过滤会把它们误报进更新列表
    // (且每次都报,npm 一直有小版本漂移),LLM 还会误判为"安装位置不符"而空跑。
    const managed = readDependencyKeys(this.baseUrl)
    const candidates = installed.filter(p => UPDATABLE.has(p.source) && p.version !== null && managed.has(p.name))
    const digests = await Promise.all(candidates.map(async p => {
      // 同名异源保护(2026-08-29):本地自定义来源(依赖声明 vendor/tarball/
      // local-file)时,校验 npm 同名包是否同一上游——不一致(如 dream12347
      // 定制 vs hkkz9522 独立同名项目)排除出更新列表,防误报与覆盖定制。
      // 无法判定(任一侧缺 repository,如 dsh-session-manager 0.2.2 作者未
      // 声明)同样排除:宁少报不漏报——漏报只少一个提示,误报是 LLM 白跑 +
      // 用户被误导;人工核对入口见 InstalledView/LLM 会话。
      const spec = dependencySpecifierOf(this.baseUrl, p.name)
      const src = spec === null ? 'npm' : sourceOf(spec, this.baseUrl)
      if (src === 'vendor' || src === 'tarball' || src === 'local-file') {
        const same = await isSameUpstream(p.repoUrl, p.name)
        if (same !== true) return null
      }
      return detectUpdate(p.name, p.version!, p.repoUrl, p.author, p.compatRange, localDsh, sinceIso)
    }))
    this.updatesCache = { since: sinceIso, at: now, digests: digests.filter((d): d is UpdateDigest => d !== null) }
    return this.updatesCache.digests
  }

  async install(spec: string): Promise<PnpmResult> {
    return this.enqueuePnpm(async () => {
      // Snapshot inside the serialized chain: concurrent installs would
      // otherwise diff each other's additions.
      const before = readDependencyKeys(this.baseUrl)
      const result = await installPlugin(spec, this.baseUrl)
      if (result.ok) {
        // `dsh plugin add` reconciles bundles into dsh.profile.bundles and
        // reports non-plugin repos; mirror that so "restart to take effect"
        // is true for real bundles and honest for repo-only packages
        // (2026-08-22: EAC 装完不生效——无插件入口，提示误导).
        try {
          const { note } = reconcileInstalled(this.baseUrl, before)
          if (note !== '') result.detail = note
        } catch { /* best-effort */ }
      }
      return result
    })
  }

  /** Update one installed plugin to the detected target version (exact — see update.ts).
   *  三段式（2026-08-22）：
   *  1. 先尝试直装（绝大多数成功：纯 JS 包、或原生模块未被宿主加载——无锁）；
   *  2. 直装失败且是文件锁（EPERM/rename）→ 特殊路径：
   *     - SSiD（kernel 声明 SSID_PENDING_CONSUMER=1）→ 转两段式：预下载到
   *       ~/.ssid/pending-plugin-updates/，重启时由 kernel 在 boot DSH 前安装；
   *     - 官方 dsh web（无消费方）→ 仿社区市场返回可复制 CLI 指令；
   *  3. 非锁失败（网络/版本）→ 原样报错。 */
  async update(name: string, version: string): Promise<PnpmResult> {
    // 1) 直装：成败都在这一步见分晓（锁只发生在最后「替换已加载原生模块」）。
    const direct = await this.enqueuePnpm(() => updatePlugin(name, version, this.baseUrl))
    if (direct.ok) return { ...direct, direct: true }
    // 2) 锁类失败 → 特殊路径；其余失败原样返回。
    if (!/EPERM|operation not permitted|EBUSY|rename/i.test(direct.detail)) return direct
    if (process.env.SSID_PENDING_CONSUMER === '1') {
      return this.enqueuePnpm(() => preparePluginUpdate(name, version, this.baseUrl))
    }
    const profileName = basename(this.baseUrl) || 'web'
    return { ok: true, detail: '', durationMs: direct.durationMs, command: `dsh plugin --profile ${profileName} add ${name}@${version}` }
  }

  /** LLM 驱动更新准备：采集信息包供确认面板/会话 prompt 使用（2026-08-28）。
   *  只读采集（npm/GitHub/本地 package.json），不执行任何安装——执行由 LLM
   *  Agent 在「插件更新」会话中按 skill 决策后完成。 */
  async llmUpdatePrepare(name: string): Promise<LlmUpdatePackage | null> {
    // 非 profile 直接声明的插件(bundle 内核内部项)不提供 LLM 更新入口——
    // 与 checkUpdates 同一判据,避免用户对不可独立更新的包触发决策。
    if (!readDependencyKeys(this.baseUrl).has(name)) return null
    // 从已安装列表找该插件的元数据（版本/repo/兼容范围）
    const installed = await this.listInstalled()
    const p = installed.find(i => i.name === name)
    if (p === undefined || p.version === null) return null
    const localDsh = await this.dshVersion()
    const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
    // detectUpdate 同款采集参数,复用 buildLlmPackage
    return buildLlmPackage(p.name, p.version, p.repoUrl, p.compatRange, localDsh, since, this.baseUrl)
  }

  /** 追加一条 LLM 更新动作日志(JSONL,供 client 轮询结果展示)。 */
  async appendLlmUpdateLog(entry: { name: string; action: string; detail: string; status: 'pending' | 'running' | 'success' | 'failed' }): Promise<void> {
    await appendLlmLog(entry)
  }

  /** 读取某个插件最近一条 LLM 更新动作(JSONL 逆序找 name 匹配);
   *  无记录返回 null。client 轮询据此做三态(进行中/成功/失败)。 */
  async readLlmUpdateResult(name: string): Promise<LlmLogRecord | null> {
    return readLlmLogLatest(name)
  }

  /** 串行执行一次 pnpm 操作并失效缓存（无论成败都放行链条后续任务）。 */
  private enqueuePnpm(op: () => Promise<PnpmResult>): Promise<PnpmResult> {
    const run = this.pnpmChain.then(async () => {
      const result = await op()
      this.installedNamesCache = null
      this.updatesCache = null
      // pnpm rewrote node_modules on disk: drop the process-local package.json
      // snapshot so the next listInstalled reads the new versions.
      clearPackageCache()
      return result
    })
    this.pnpmChain = run.catch(() => {})
    return run
  }

  /** 失效「已安装/更新」快照缓存。LLM 更新是另一个 Agent 直接改 profile
   *  跑 pnpm install,不走本插件的 enqueuePnpm 路径,故此处需显式触发——
   *  否则 updatesCache(5min TTL)保留旧版本,UI 仍显示已更新的插件为"可更新"。 */
  invalidateCaches(): void {
    this.installedNamesCache = null
    this.updatesCache = null
    clearPackageCache()
  }

  /** Temporary diagnostics for the empty-update bug; removed once root-caused. */
  async debug(): Promise<{ baseUrl: string; installed: { name: string; version: string | null; source: string }[] }> {
    return {
      baseUrl: this.baseUrl,
      installed: (await this.listInstalled()).map(p => ({ name: p.name, version: p.version, source: p.source })),
    }
  }

  /** Disable/enable one loader entry through the profile patch layer.
   *  2026-08-25 禁用失效：`dsh plugin add` 清单的 insert 子条目无 id，loader
   *  每次启动分配随机运行时 id，按它写禁用行重启后永远匹配不到。当 patch
   *  文件中没有 `- id: <entryId>` 行时，改用该条目的包名 name 作寻址键
   *  （setDisabled 内按 name 把 insert 子条目升级为稳定 id 后再写禁用行）。 */
  async toggle(id: string, name: string, disabled: boolean): Promise<{ ok: boolean; detail: string; nowDisabled: boolean | null }> {
    // 老调用方（未透传 name 的 client）兜底：从 loader 实时取包名。
    const entryName = name !== '' ? name : [...this.ctx.loader.entries()].find(e => e.id === id)?.options.name ?? ''
    if (entryName === '') {
      return { ok: false, detail: `entry "${id}" not found in loader`, nowDisabled: null }
    }
    // 寻址键：patch 文件中已有 `- id: <id>` 行 → 稳定 id 直接用；否则是该
    // 条目的随机运行时 id → 只能用 name 找到它的 insert 子条目。
    const patchId = id.replace(/^include:/u, '')
    let key = entryName
    try {
      const patchPath = join(this.baseUrl, 'cordis.patch.yml')
      if (existsSync(patchPath)
        && new RegExp(`^- id: ${escapeRegExp(patchId)}$`, 'm').test(readFileSync(patchPath, 'utf8'))) {
        key = patchId
      }
    } catch { /* 读失败：走 name 寻址，由 setDisabled 报具体错误 */ }
    const result = await setDisabled(this.baseUrl, key, entryName, disabled)
    this.installedNamesCache = null
    return result
  }

  /** One-shot diagnostics: environment, installed surface, patch stance, pnpm log tail. */
  async diagnostics(): Promise<DiagnosticsReport> {
    const [installed, dshVersion] = await Promise.all([this.listInstalled(), this.dshVersion()])
    let pnpmLogTail = ''
    try {
      const logPath = join(this.baseUrl, 'plugin-center-pnpm.log')
      if (existsSync(logPath)) {
        const text = readFileSync(logPath, 'utf8')
        pnpmLogTail = text.slice(-4000)
      }
    } catch { /* best-effort */ }
    return {
      dshVersion,
      baseUrl: this.baseUrl,
      node: process.version,
      installed,
      disabled: Object.fromEntries(readDisabledState(join(this.baseUrl, 'cordis.patch.yml'))),
      pnpmLogTail,
    }
  }

  /** Screenshot URL for one dsh-market plugin, lazily extracted from its README. */
  async screenshot(name: string): Promise<string | null> {
    const cached = this.screenshotCache.get(name)
    if (cached !== undefined) return cached
    this.screenshotCache.set(name, null) // placeholder against concurrent dup fetches
    const repo = this.dshMarketCache.find(p => p.name === name || p.spec === name)?.name ?? name
    const url = await extractFirstImage(repo)
    this.screenshotCache.set(name, url)
    return url
  }

  /** AI recommendation: keyword-filtered candidates ranked by the model. */
  async suggest(query: string): Promise<Suggestion[]> {
    const q = query.trim()
    if (q === '') return []
    await this.waitAllSources()
    const llm = this.ctx.get('llm') as
      | { stream?: (opts: Record<string, unknown>) => AsyncIterable<{ type?: string; text?: string; reason?: { kind?: string } }> }
      | undefined
    if (llm?.stream === undefined) {
      throw new Error('llm 服务不可用（当前 profile 未提供 dsh-llm）')
    }
    const tokens = q.toLowerCase().split(/[\s,，、;；]+/u).filter(Boolean)
    // 候选 = 三源合并（2026-08-22：此前只用 dsh-market，awesome/Oh-My-DSH
    // 的精选插件进不了推荐；合并后按 name 去重、spec 优先 npm 名）。
    const scored = this.combinedMarketCache()
      .map(p => ({
        p,
        hits: tokens.reduce((n, tok) => n + (
          p.name.toLowerCase().includes(tok)
          || p.description.zh.toLowerCase().includes(tok)
          || p.description.en.toLowerCase().includes(tok)
          || p.categories.some(c => c.includes(tok)) ? 1 : 0
        ), 0),
      }))
      .sort((a, b) => (b.hits - a.hits) || (b.p.stars ?? 0) - (a.p.stars ?? 0))
      .slice(0, 25)
    if (scored.length === 0) return []
    const list = scored.map(({ p }) => `- ${p.name} | ${p.stars ?? 0}★ | ${p.description.zh.slice(0, 60)}`).join('\n')
    const system = '你是 DeepSeek Harness 插件市场的推荐助手。根据用户需求从候选插件中选择 3-5 个最合适的，只输出一个 JSON 数组（不要 markdown 代码块、不要任何多余文字）：[{"name":"插件名","reason":"一句话中文推荐理由（20 字以内）"}]。名称必须从候选列表原样复制，禁止改写、拼接或编造'
    // Message 契约：content 是 ContentBlock 数组（非字符串），且需要 id/source。
    const chunks = llm.stream({
      provider: 'deepseek-official',
      model: 'deepseek-v4-flash',
      messages: [{
        id: 'plugin-center-suggest',
        role: 'user',
        content: [{ type: 'text', text: `用户需求：${q}\n\n候选插件列表（名称 | 星标 | 简介）：\n${list}` }],
        source: { kind: 'plugin', plugin: 'dsh-plugin-center' },
      }],
      system,
      // 800 会把 3-5 条中文推荐截断成不完整 JSON（2026-08-22 实测
      // "模型输出无法解析" + 截断的 JSON 片段）；2000 留足余量。
      maxTokens: 2000,
      signal: AbortSignal.timeout(90000),
    })
    let text = ''
    let failed = false
    let failureDetail = ''
    for await (const chunk of chunks) {
      if (chunk.type === 'text-delta') text += chunk.text ?? ''
      else if (chunk.type === 'finish' && (chunk.reason?.kind === 'error' || chunk.reason?.kind === 'aborted')) {
        failed = true
        // LlmFailure { code, message }——必须透出，否则用户只看到笼统的
        // "模型推荐失败"而无法诊断（2026-08-22 实测空 text + 无详情）。
        const f = (chunk.reason as { failure?: { code?: string; message?: string } }).failure
        failureDetail = f ? `${f.code ?? 'unknown'}: ${f.message ?? ''}` : chunk.reason.kind
      }
    }
    if (failed || text.trim() === '') {
      throw new Error(`模型推荐失败，请重试${failureDetail !== '' ? `（${failureDetail.slice(0, 200)}）` : text === '' ? '' : `（模型返回：${text.slice(0, 80)}）`}`)
    }
    const start = text.indexOf('[')
    const end = text.lastIndexOf(']')
    if (start < 0 || end <= start) throw new Error(`模型输出无法解析：${text.slice(0, 200)}`)
    try {
      const parsed = JSON.parse(text.slice(start, end + 1)) as unknown
      if (!Array.isArray(parsed)) throw new Error('bad shape')
      // Attach the catalog identity (spec/stars) here, so the client never
      // has to reverse-match by name — the model may echo either the npm
      // name or the owner/repo form (2026-08-22: stars went missing because
      // "Deepseek-Harness-EAC" (npm) did not match the cache key
      // "zouyuxuan122/Deepseek-Harness-EAC").
      return parsed
        .filter((item): item is { name: string; reason: string } =>
          item !== null && typeof item === 'object'
          && typeof (item as { name?: unknown }).name === 'string'
          && typeof (item as { reason?: unknown }).reason === 'string')
        .slice(0, 5)
        .map(item => {
          // 模型可能改写 owner/路径（幻觉，如 zhu1090093659 非真实 owner）
          // 或输出 monorepo 子路径——先精确匹配（name/spec/npm），再 # 截断，
          // 最后回退 repo 名匹配（2026-08-22：DamonKoy/dsh-web-ui#dsh-web-ui-all
          // 被输出成 zhu1090093659/dsh-web-ui#packages/...，精确匹配失败无星）。
          const base = item.name.split('#')[0]!.trim()
          const repo = base.split('/').pop() ?? ''
          const hit = this.combinedMarketCache().find(p =>
            p.name === base || p.spec === base || p.npm === base
            || (p.name.split('/').pop()?.split('#')[0] ?? '') === repo)
          return {
            name: item.name,
            reason: item.reason,
            spec: hit?.spec ?? null,
            stars: hit?.stars ?? null,
          }
        })
    } catch {
      // 截断的 JSON（maxTokens 用尽/中止）会解析失败——展示更长片段辅助诊断。
      throw new Error(`模型输出无法解析：${text.slice(0, 400)}`)
    }
  }

  /** Wait for all three market sources (fetch or failure), with a hard deadline. */
  private async waitAllSources(): Promise<void> {
    this.prefetchAwesome()
    this.prefetchOhMyDsh()
    this.prefetchDshMarket()
    const deadline = Date.now() + 65_000
    while (!(this.awesomeDone && this.ohMyDshDone && this.dshMarketDone) && Date.now() < deadline) {
      await new Promise(resolve => setTimeout(resolve, 200))
    }
  }

  /** 三源市场合并（按 name 去重；spec 优先 npm 名——比 github 回退更可靠）。 */
  private combinedMarketCache(): MarketPlugin[] {
    const map = new Map<string, MarketPlugin>()
    for (const list of [this.awesomeCache, this.ohMyDshCache, this.dshMarketCache]) {
      for (const p of list) {
        const cur = map.get(p.name)
        if (cur === undefined) {
          map.set(p.name, p)
          continue
        }
        map.set(p.name, {
          ...cur,
          spec: p.npm ?? cur.npm ?? p.spec ?? cur.spec,
          npm: cur.npm ?? p.npm,
          // 同一条目多源星数不同：取最大值（2026-08-22：awesome ★4 曾
          // 覆盖 dsh-market 高星——合并顺序导致低星胜出）。
          stars: Math.max(cur.stars ?? 0, p.stars ?? 0) || null,
          score: cur.score ?? p.score,
          description: cur.description.zh !== '' && cur.description.en !== '' ? cur.description : p.description,
        })
      }
    }
    return [...map.values()]
  }
}
