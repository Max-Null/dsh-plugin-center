/**
 * dsh-plugin-center browser half. Third-party client bundle — components live
 * in the apply closure to reach the loopback RPC seam. Styles live in one
 * injected <style> sheet (so :hover/:focus work) and use var(--dsw-*) tokens
 * only, so skin plugins restyle this UI too.
 */
import { useCallback, useEffect, useState } from 'react'

// ---- injected stylesheet (single sheet, :hover/:focus live here) ----
const CSS = `
.pc-title { font-size: 18px; font-weight: 600; line-height: 26px; color: var(--dsw-alias-label-primary); }
.pc-sub { font-size: 13px; line-height: 20px; margin-top: 4px; color: var(--dsw-alias-label-tertiary); }
.pc-head { display: flex; align-items: center; gap: 10px; }
.pc-head .pc-sub { margin-top: 0; }
.pc-head .pc-btn { flex: none; }
.pc-count { display: inline-block; min-width: 16px; padding: 0 5px; margin-left: 6px; border-radius: 8px; background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-secondary); font-size: 12px; text-align: center; }
.pc-tab.active .pc-count { background: var(--dsw-alias-state-business-tertiary); color: var(--dsw-alias-state-business-primary); }
.pc-tabs { display: flex; gap: 4px; margin: 16px 0 12px; border-bottom: 1px solid var(--dsw-alias-border-l2); }
.pc-tab { padding: 8px 14px; font-size: 14px; cursor: pointer; background: none; border: none; font-family: inherit; color: var(--dsw-alias-label-tertiary); border-bottom: 2px solid transparent; margin-bottom: -1px; }
.pc-tab:hover { color: var(--dsw-alias-label-secondary); }
.pc-tab.active { color: var(--dsw-alias-label-primary); border-bottom-color: var(--dsw-alias-state-business-primary); }

.pc-card { border: 1px solid var(--dsw-alias-border-l2); border-radius: 10px; padding: 14px 16px; margin-bottom: 10px; background: var(--dsw-alias-bg-layer-1); min-width: 0; transition: border-color .15s; display: flex; flex-direction: column; }
.pc-card:hover { border-color: var(--dsw-alias-border-l3); }
.pc-name { font-weight: 500; color: var(--dsw-alias-label-primary); }
.pc-ver { color: var(--dsw-alias-label-caption); font-size: 12px; }
.pc-desc { color: var(--dsw-alias-label-secondary); font-size: 13px; margin-top: 6px; word-break: break-word; overflow-wrap: break-word; }
.pc-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.pc-spacer { flex: 1; }
.pc-meta { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-top: auto; padding-top: 10px; }

.pc-badge { display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 6px; font-size: 12px; line-height: 1; }
.pc-badge.official { background: var(--dsw-alias-state-business-tertiary); color: var(--dsw-alias-state-business-primary); }
.pc-badge.installed { background: var(--dsw-alias-state-warn-tertiary); color: var(--dsw-alias-state-warn-primary); }
.pc-badge.local, .pc-badge.builtin { background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-tertiary); }
.pc-tag { display: inline-flex; align-items: center; height: 20px; padding: 0 8px; border-radius: 6px; font-size: 12px; line-height: 1; background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-secondary); }
.pc-tag.danger { background: var(--dsw-alias-interactive-bg-hover-danger); color: var(--dsw-alias-state-error-primary); }
.pc-dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--dsw-alias-state-success-primary); }
.pc-dot.failed { background: var(--dsw-alias-state-error-primary); }

.pc-toolbar { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 4px 0; }
.pc-chip { height: 28px; padding: 0 12px; border-radius: 18px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; font-family: inherit; }
.pc-chip:hover { background: var(--dsw-alias-interactive-bg-hover); }
.pc-chip.active { background: var(--dsw-alias-state-business-primary); border-color: var(--dsw-alias-state-business-primary); color: var(--dsw-alias-bg-base); }

.pc-btn { height: 26px; padding: 0 10px; border-radius: 8px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-module-platform); color: var(--dsw-alias-label-primary); font-size: 12px; cursor: pointer; font-family: inherit; }
.pc-btn:hover { background: var(--dsw-alias-interactive-bg-hover); }
.pc-btn.primary { border: none; background: var(--dsw-alias-button-primary-fill); color: var(--dsw-alias-bg-base); }
.pc-btn.primary:hover { background: var(--dsw-alias-button-primary-hover); }
.pc-btn:disabled { opacity: 0.5; cursor: default; }

.pc-search { height: 28px; padding: 0 12px; border-radius: 18px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-primary); font-size: 13px; outline: none; width: 200px; font-family: inherit; }
.pc-search:focus { border-color: var(--dsw-alias-state-business-primary); }
.pc-search::placeholder { color: var(--dsw-alias-label-caption); }
.pc-select { height: 28px; padding: 0 8px; border-radius: 18px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); font-size: 13px; cursor: pointer; font-family: inherit; }
.pc-iconbtn { width: 28px; height: 28px; padding: 0; border-radius: 18px; border: 1px solid var(--dsw-alias-border-l2); background: var(--dsw-alias-bg-base); color: var(--dsw-alias-label-secondary); cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.pc-iconbtn:hover { background: var(--dsw-alias-interactive-bg-hover); }

.pc-grid { display: grid; gap: 12px; }
.pc-grid.double { grid-template-columns: 1fr 1fr; }
.pc-grid.single { grid-template-columns: 1fr; }

.pc-overlay { position: fixed; inset: 0; background: var(--dsw-alias-bg-mask-1); display: flex; align-items: center; justify-content: center; z-index: 100; }
.pc-panel { width: 760px; max-width: 94vw; max-height: 86vh; background: var(--dsw-alias-bg-base); border-radius: 12px; box-shadow: 0 24px 64px rgba(0,0,0,.24); display: flex; flex-direction: column; overflow: hidden; }
.pc-panel-head { flex: none; display: flex; align-items: center; padding: 20px 28px 0; }
.pc-panel-body { flex: 1; min-height: 0; display: flex; flex-direction: column; padding: 8px 28px 20px; }
.pc-scroll { flex: 1; min-height: 0; overflow: auto; }
.pc-close { background: none; border: none; color: var(--dsw-alias-label-tertiary); font-size: 20px; cursor: pointer; padding: 4px 8px; border-radius: 6px; font-family: inherit; }
.pc-close:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.pc-headerbtn { height: 28px; width: 28px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; border: none; background: transparent; cursor: pointer; color: var(--dsw-alias-label-secondary); }
.pc-headerbtn:hover { background: var(--dsw-alias-interactive-bg-hover); color: var(--dsw-alias-label-primary); }
.pc-wn-item { border-bottom: 1px solid var(--dsw-alias-border-l1); padding: 14px 0; }
.pc-wn-item:last-child { border-bottom: none; }
.pc-wn-list { margin-top: 8px; padding-left: 20px; color: var(--dsw-alias-label-secondary); font-size: 13px; }
.pc-toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%); padding: 10px 18px; border-radius: 10px; background: var(--dsw-alias-bg-layer-1); border: 1px solid var(--dsw-alias-border-l2); color: var(--dsw-alias-label-primary); font-size: 13px; box-shadow: 0 8px 32px rgba(0,0,0,.18); z-index: 200; max-width: 80vw; }
.pc-toast.ok { border-color: var(--dsw-alias-state-success-primary); }
.pc-toast.error { border-color: var(--dsw-alias-state-error-primary); }
`
let cssInjected = false
function injectCss(): void {
  if (cssInjected || typeof document === 'undefined') return
  cssInjected = true
  const style = document.createElement('style')
  style.setAttribute('data-plugin', '@max-null/dsh-plugin-center')
  style.textContent = CSS
  document.head.append(style)
}

// ---- types (mirror the host wire shapes) ----
type PluginSource = 'official' | 'installed' | 'local' | 'builtin'
type FiberPhase = 'pending' | 'loading' | 'active' | 'failed' | 'unloading' | null

interface InstalledPlugin {
  entryId: string
  name: string
  displayName: string
  version: string | null
  description: string | null
  source: PluginSource
  enabled: boolean
  fiberPhase: FiberPhase
  compatRange: string | null
  repoUrl: string | null
  categories: string[]
}

interface MarketPlugin {
  name: string
  url: string
  spec: string
  categories: string[]
  description: { en: string; zh: string }
  stars: number | null
  npm: string | null
  version: string | null
  installed: boolean
}

interface UpdateDigest {
  name: string
  fromVersion: string
  toVersion: string
  changelog: string[]
  compat: 'compatible' | 'incompatible' | 'unknown'
  compatRange: string | null
}

type Rpc = (endpoint: string, payload?: unknown) => Promise<unknown>

// ---- module-level rpc + overlay state ----
let rpc: Rpc = async () => { throw new Error('plugin-center: rpc not wired') }
let overlayOpen = false
let whatsNewOpen = false
let whatsNewDigests: UpdateDigest[] = []
const overlayListeners = new Set<() => void>()
const whatsNewListeners = new Set<() => void>()

function openOverlay(): void { overlayOpen = true; overlayListeners.forEach(l => l()) }
function closeOverlay(): void { overlayOpen = false; overlayListeners.forEach(l => l()) }
/** 0.1.7：切换开/关（SSiD 标题栏插件中心按钮再点关闭——dsh-header-unify 优先调用）。 */
function toggleOverlay(): void { overlayOpen ? closeOverlay() : openOverlay() }
function closeWhatsNew(): void {
  whatsNewOpen = false
  for (const d of whatsNewDigests) readCache[d.name] = d.toVersion
  void rpc('markRead', { versions: readCache })
  whatsNewListeners.forEach(l => l())
}
function useOverlayOpen(): boolean {
  const [open, setOpen] = useState(overlayOpen)
  useEffect(() => {
    const l = () => { setOpen(overlayOpen) }
    overlayListeners.add(l)
    return () => { overlayListeners.delete(l) }
  }, [])
  return open
}
function useWhatsNewOpen(): boolean {
  const [open, setOpen] = useState(whatsNewOpen)
  useEffect(() => {
    const l = () => { setOpen(whatsNewOpen) }
    whatsNewListeners.add(l)
    return () => { whatsNewListeners.delete(l) }
  }, [])
  return open
}

// ---- read-mark persistence (host-side) ----
let readCache: Record<string, string> = {}

// ---- client-side caches (avoid re-fetching on every tab switch) ----
let installedCache: InstalledPlugin[] | null = null
const marketCache: Record<string, { plugins: MarketPlugin[]; done: boolean }> = {}

// ---- toast (replaces the native alert) ----
let toastState: { message: string; kind: 'ok' | 'error'; until: number } | null = null
const toastListeners = new Set<() => void>()
function showToast(message: string, kind: 'ok' | 'error' = 'ok', duration = 3200): void {
  toastState = { message, kind, until: Date.now() + duration }
  toastListeners.forEach(l => l())
}

// ---- installs that need a dsh-web restart to take effect ----
const pendingInstall = new Set<string>()

function useToast(): { message: string; kind: 'ok' | 'error' } | null {
  const [t, setT] = useState(toastState)
  useEffect(() => {
    const l = () => { setT(toastState) }
    toastListeners.add(l)
    return () => { toastListeners.delete(l) }
  }, [])
  useEffect(() => {
    if (t === null) return
    const id = setTimeout(() => {
      toastState = null
      toastListeners.forEach(l => l())
    }, Math.max(0, t.until - Date.now()))
    return () => clearTimeout(id)
  }, [t])
  return t
}

async function checkWhatNew(): Promise<void> {
  try {
    const since = new Date(Date.now() - 30 * 86400_000).toISOString()
    const digests = await rpc('checkUpdates', { since }) as UpdateDigest[]
    readCache = await rpc('readVersions') as Record<string, string>
    const fresh = digests.filter(d => readCache[d.name] !== d.toVersion)
    if (fresh.length > 0) {
      whatsNewDigests = fresh
      whatsNewOpen = true
      whatsNewListeners.forEach(l => l())
    }
  } catch { /* silent */ }
}

const CATEGORIES = ['ui', 'usage', 'theme', 'model', 'session', 'memory', 'tools', 'vision', 'skill', 'workflow', 'notify', 'dev', 'market', 'fun']

// ---- i18n（2026-08-17 用户反馈：未适配 DSH 双语切换）----------------------
// DSH locale 机制：ctx.locale 服务 + `locale/change` 事件（快照 active: 'zh'|'en'）。
// 模块级 localeId + 监听器（apply 时接线），组件经 useT 订阅切换重渲染。
type LocaleId = 'zh' | 'en'
const STRINGS = {
  zh: {
    title: '插件中心', tabInstalled: '已安装', tabMarket: '市场', tabUpdates: '更新',
    headSummary: '已安装 {a} · 有更新 {b} · 失效 {c}',
    check: '检查更新', checking: '检查中…', updateAll: '更新全部（{n}）',
    searchInstalled: '搜索已安装插件', allSources: '全部来源',
    srcOfficial: '官方', srcInstalled: '用户安装', srcLocal: '本地开发', srcBuiltin: '内置',
    all: '全部', searchMarket: '搜索社区插件', allMarkets: '全部源',
    gridDouble: '双列网格', gridSingle: '单列列表',
    loadFailed: '加载失败：{e}', loading: '加载中…',
    marketLoading: '加载市场目录中…', loadMore: '正在加载更多…（已加载 {n} 个）',
    checkingUpdates: '检查更新中…', noUpdates: '没有可用的更新。', recheck: '重新检查',
    incompat: '不兼容当前 DSH', update: '更新', updating: '更新中…',
    install: '安装', installing: '安装中…',
    pendingRestart: '待重启生效', installedTag: '已安装',
    disabledTag: '已禁用', requiresDsh: '要求 DSH {r}',
    installQueued: '已发起安装 {n}，重启 dsh web 后生效', installFailed: '安装失败：{e}',
    installNotApplied: '安装未生效',
    updatedOne: '已更新 {n}，重启 dsh web 后生效', updateFailed: '更新失败：{e}',
    updateNotApplied: '更新未生效',
    updatedMany: '已更新 {n} 个插件，重启 dsh web 后生效',
    updateSummary: '更新完成：成功 {a}，失败 {b}（{c}）',
    whatsNewTitle: '插件更新', whatsNewSub: '{n} 个插件有新版本',
    later: '稍后', markAllRead: '全部标记已读', updateNow: '立即更新', close: '关闭',
    checkFail: '检查更新失败，请稍后重试',
    foundUpdates: '发现 {n} 个可更新插件', allUpToDate: '所有插件均为最新',
  },
  en: {
    title: 'Plugin Center', tabInstalled: 'Installed', tabMarket: 'Market', tabUpdates: 'Updates',
    headSummary: '{a} installed · {b} updates · {c} failed',
    check: 'Check updates', checking: 'Checking…', updateAll: 'Update all（{n}）',
    searchInstalled: 'Search installed plugins', allSources: 'All sources',
    srcOfficial: 'Official', srcInstalled: 'User installed', srcLocal: 'Local dev', srcBuiltin: 'Built-in',
    all: 'All', searchMarket: 'Search community plugins', allMarkets: 'All sources',
    gridDouble: 'Two-column grid', gridSingle: 'Single-column list',
    loadFailed: 'Failed to load: {e}', loading: 'Loading…',
    marketLoading: 'Loading market catalog…', loadMore: 'Loading more… ({n} loaded)',
    checkingUpdates: 'Checking for updates…', noUpdates: 'No updates available.', recheck: 'Check again',
    incompat: 'Incompatible with current DSH', update: 'Update', updating: 'Updating…',
    install: 'Install', installing: 'Installing…',
    pendingRestart: 'Restart pending', installedTag: 'Installed',
    disabledTag: 'Disabled', requiresDsh: 'Requires DSH {r}',
    installQueued: 'Install of {n} started; restart dsh web to take effect', installFailed: 'Install failed: {e}',
    installNotApplied: 'Install did not take effect',
    updatedOne: 'Updated {n}; restart dsh web to take effect', updateFailed: 'Update failed: {e}',
    updateNotApplied: 'Update did not take effect',
    updatedMany: 'Updated {n} plugins; restart dsh web to take effect',
    updateSummary: 'Update done: {a} succeeded, {b} failed ({c})',
    whatsNewTitle: 'Plugin updates', whatsNewSub: '{n} plugins have new versions',
    later: 'Later', markAllRead: 'Mark all read', updateNow: 'Update now', close: 'Close',
    checkFail: 'Failed to check updates, please retry later',
    foundUpdates: '{n} updates found', allUpToDate: 'All plugins are up to date',
  },
} as const
type StringKey = keyof typeof STRINGS.zh
let localeId: LocaleId = 'zh'
const localeListeners = new Set<() => void>()
function adoptLocale(id: string | undefined): void {
  const next: LocaleId = id === 'en' ? 'en' : 'zh'
  if (next === localeId) return
  localeId = next
  localeListeners.forEach(l => l())
}
function fmt(tpl: string, vars: Record<string, unknown> = {}): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ''))
}
/** 文案函数 + 语言订阅：DSH 切换语言时组件自动重渲染。 */
function useT(): (key: StringKey, vars?: Record<string, unknown>) => string {
  const [id, setId] = useState(localeId)
  useEffect(() => {
    const l = () => { setId(localeId) }
    localeListeners.add(l)
    return () => { localeListeners.delete(l) }
  }, [])
  return (key, vars) => fmt(STRINGS[id][key] ?? STRINGS.zh[key], vars)
}

// ---- views ----
function InstalledView({ search, category, source }: { search: string; category: string | null; source: PluginSource | null }) {
  const t = useT()
  const [items, setItems] = useState<InstalledPlugin[] | null>(installedCache)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (installedCache !== null) return // already loaded once; reuse across tab switches
    let alive = true
    void rpc('listInstalled').then(
      v => { installedCache = v as InstalledPlugin[]; if (alive) setItems(installedCache) },
      e => { if (alive) setError(e instanceof Error ? e.message : String(e)) },
    )
    return () => { alive = false }
  }, [])
  if (error !== null) return <p className="pc-sub">{t('loadFailed', { e: error })}</p>
  if (items === null) return <p className="pc-sub">{t('loading')}</p>
  const srcLabel: Record<PluginSource, string> = {
    official: t('srcOfficial'), installed: t('srcInstalled'), local: t('srcLocal'), builtin: t('srcBuiltin'),
  }
  const q = search.trim().toLowerCase()
  const filtered = items.filter(p => {
    const matchSearch = q === ''
      || p.displayName.toLowerCase().includes(q)
      || (p.description ?? '').toLowerCase().includes(q)
      || p.name.toLowerCase().includes(q)
    const matchCategory = category === null || p.categories.includes(category)
    const matchSource = source === null || p.source === source
    return matchSearch && matchCategory && matchSource
  })
  return (
    <div>
      {filtered.map(p => (
        <div key={p.entryId} className="pc-card">
          <div className="pc-row">
            <span className="pc-name">{p.displayName}</span>
            {p.version !== null && <span className="pc-ver">v{p.version}</span>}
            <span className={`pc-badge ${p.source}`}>{srcLabel[p.source]}</span>
            <span className="pc-spacer" />
            <span className={`pc-dot${p.fiberPhase === 'failed' ? ' failed' : ''}`} />
          </div>
          {p.description !== null && <div className="pc-desc">{p.description}</div>}
          <div className="pc-meta">
            {p.categories.map(c => <span key={c} className="pc-tag">{c}</span>)}
            {p.compatRange !== null && <span className="pc-tag">{t('requiresDsh', { r: p.compatRange })}</span>}
            {!p.enabled && <span className="pc-tag">{t('disabledTag')}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

function MarketView({ category, single, source, search, onCount }: { category: string | null; single: boolean; source: string; search: string; onCount: (n: number) => void }) {
  const t = useT()
  const [items, setItems] = useState<MarketPlugin[]>(marketCache[source]?.plugins ?? [])
  const [done, setDone] = useState(marketCache[source]?.done ?? false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  useEffect(() => {
    let alive = true
    let timer: ReturnType<typeof setTimeout> | undefined
    // Sync to this source's cache on switch (empty → show "loading", done → reuse).
    const cached = marketCache[source]
    if (cached !== undefined) {
      setItems(cached.plugins)
      setDone(cached.done)
      onCount(cached.plugins.length)
      if (cached.done) return
    } else {
      setItems([])
      setDone(false)
      onCount(0)
    }
    const poll = async () => {
      try {
        const r = await rpc('listMarket', { source }) as { plugins: MarketPlugin[]; done: boolean }
        if (!alive) return
        marketCache[source] = { plugins: r.plugins, done: r.done }
        setItems(r.plugins)
        setDone(r.done)
        onCount(r.plugins.length)
        if (!r.done) timer = setTimeout(poll, 1200)
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : String(e))
      }
    }
    void poll()
    return () => { alive = false; if (timer !== undefined) clearTimeout(timer) }
  }, [source, onCount])
  if (error !== null) return <p className="pc-sub">{t('loadFailed', { e: error })}</p>
  if (items.length === 0 && !done) return <p className="pc-sub">{t('marketLoading')}</p>
  const q = search.trim().toLowerCase()
  const filtered = items.filter(m => {
    const matchSearch = q === ''
      || m.name.toLowerCase().includes(q)
      || (m.description.zh || m.description.en).toLowerCase().includes(q)
    return matchSearch && (category === null || m.categories.includes(category))
  })
  const descOf = (m: MarketPlugin): string => localeId === 'en' ? (m.description.en || m.description.zh) : (m.description.zh || m.description.en)
  const install = (m: MarketPlugin) => {
    setBusy(m.name)
    void rpc('install', { spec: m.spec }).then(
      v => {
        if (v !== true) throw new Error(t('installNotApplied'))
        setBusy(null)
        pendingInstall.add(m.spec)
        for (const key of Object.keys(marketCache)) {
          const c = marketCache[key]
          if (c !== undefined) c.plugins = c.plugins.map(p => p.name === m.name ? { ...p, installed: true } : p)
        }
        setItems(prev => prev.map(p => p.name === m.name ? { ...p, installed: true } : p))
        showToast(t('installQueued', { n: m.name }), 'ok', 5000)
      },
      e => {
        setBusy(null)
        showToast(t('installFailed', { e: e instanceof Error ? e.message : String(e) }), 'error', 8000)
      },
    )
  }
  return (
    <div>
      <div className={`pc-grid ${single ? 'single' : 'double'}`}>
        {filtered.map(m => (
          <div key={m.name} className="pc-card">
            <div className="pc-row">
              <span className="pc-name">{m.name}</span>
              {m.stars !== null && <span className="pc-ver">★ {m.stars}</span>}
              {m.version !== null && <span className="pc-ver">v{m.version}</span>}
            </div>
            <div className="pc-desc">{descOf(m)}</div>
            <div className="pc-meta">
              {m.categories.map(c => <span key={c} className="pc-tag">{c}</span>)}
              <span className="pc-spacer" />
              {m.installed || pendingInstall.has(m.spec)
                ? <span className="pc-tag">{pendingInstall.has(m.spec) ? t('pendingRestart') : t('installedTag')}</span>
                : <button className="pc-btn primary" disabled={busy !== null} onClick={() => { install(m) }}>{busy === m.name ? t('installing') : t('install')}</button>}
            </div>
          </div>
        ))}
      </div>
      {!done && <p className="pc-sub">{t('loadMore', { n: items.length })}</p>}
    </div>
  )
}

function UpdatesView({ updates, refresh, updateOne, busy }: {
  updates: UpdateDigest[] | null
  refresh: () => void
  updateOne: (name: string, version: string) => void
  busy: string | null
}) {
  const t = useT()
  if (updates === null) return <p className="pc-sub">{t('checkingUpdates')}</p>
  if (updates.length === 0) return (
    <div>
      <p className="pc-sub">{t('noUpdates')}</p>
      <button className="pc-btn" onClick={refresh}>{t('recheck')}</button>
    </div>
  )
  return (
    <div>
      {updates.map(u => (
        <div key={u.name} className="pc-card">
          <div className="pc-row">
            <span className="pc-name">{u.name}</span>
            <span className="pc-ver">{u.fromVersion}</span>
            <span className="pc-ver">→</span>
            <span style={{ color: 'var(--dsw-alias-state-business-primary)', fontWeight: 500 }}>{u.toVersion}</span>
            {u.compat === 'incompatible' && <span className="pc-tag danger">{t('incompat')}</span>}
            <span className="pc-spacer" />
            <button className="pc-btn primary" disabled={busy !== null} onClick={() => { updateOne(u.name, u.toVersion) }}>{busy === u.name || busy === '__all__' ? t('updating') : t('update')}</button>
          </div>
          {u.changelog.length > 0 && (
            <ul className="pc-wn-list">
              {u.changelog.slice(0, 5).map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  )
}

type View = 'installed' | 'market' | 'updates'

function CenterPanel({ variant = 'section' }: { variant?: 'section' | 'overlay' }) {
  const t = useT()
  const [view, setView] = useState<View>('installed')
  const [category, setCategory] = useState<string | null>(null)
  const [single, setSingle] = useState(false)
  const [source, setSource] = useState<string>('awesome')
  const [search, setSearch] = useState('')
  const [installedCategory, setInstalledCategory] = useState<string | null>(null)
  const [marketSearch, setMarketSearch] = useState('')
  const [installedSource, setInstalledSource] = useState<PluginSource | null>(null)
  const [installedCount, setInstalledCount] = useState(0)
  const [failedCount, setFailedCount] = useState(0)
  const [marketCount, setMarketCount] = useState(0)
  const [updates, setUpdates] = useState<UpdateDigest[] | null>(null)
  const [busyUpdate, setBusyUpdate] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)

  // silent：挂载自动检查不弹 toast；用户点按钮（silent=false）给明确反馈
  // （2026-08-17 用户反馈：按了「检查更新」没啥变化——原来只有 tab 徽标/列表
  // 变化，人在其他 tab 时完全无感）。
  const refreshUpdates = useCallback((silent = false) => {
    setChecking(true)
    void rpc('checkUpdates', { since: new Date(Date.now() - 30 * 86400_000).toISOString() }).then(
      v => {
        const digests = v as UpdateDigest[]
        // changelog 拉空时保留上次内容（GitHub API 限流/网络抖动会拉空——
        // 2026-08-18 用户实测更新后卡片介绍消失）。
        setUpdates(prev => digests.map(d => {
          if (d.changelog.length > 0) return d
          const old = prev?.find(p => p.name === d.name)
          return old !== undefined && old.changelog.length > 0 ? { ...d, changelog: old.changelog } : d
        }))
        setChecking(false)
        if (!silent) {
          showToast(digests.length > 0 ? t('foundUpdates', { n: digests.length }) : t('allUpToDate'))
        }
      },
      () => {
        setChecking(false)
        if (!silent) showToast(t('checkFail'), 'error')
      },
    )
  }, [t])
  useEffect(() => {
    void rpc('listInstalled').then(
      v => {
        const items = v as InstalledPlugin[]
        setInstalledCount(items.length)
        setFailedCount(items.filter(p => p.fiberPhase === 'failed').length)
      },
      () => { /* leave counts at 0 */ },
    )
    refreshUpdates(true)
  }, [refreshUpdates])

  // 市场计数预载（2026-08-17 实测缺陷：tab 未打开过时徽标恒 0——MarketView
  // 不挂载就没有 onCount 回调）。挂载即拉取；服务端缓存未就绪（done=false）
  // 时每 5s 轮询直到完成，失败 15s 重试。
  useEffect(() => {
    let alive = true
    let timer: ReturnType<typeof setTimeout> | null = null
    const poll = async () => {
      if (!alive) return
      try {
        const r = await rpc('listMarket', { source: 'all' }) as { plugins: MarketPlugin[]; done: boolean }
        if (!alive) return
        marketCache.all = { plugins: r.plugins, done: r.done }
        setMarketCount(r.plugins.length)
        if (!r.done) timer = setTimeout(() => { void poll() }, 5000)
      } catch {
        if (alive) timer = setTimeout(() => { void poll() }, 15000)
      }
    }
    void poll()
    return () => { alive = false; if (timer !== null) clearTimeout(timer) }
  }, [])

  const updateOne = (name: string, version: string) => {
    setBusyUpdate(name)
    void rpc('update', { name, version }).then(
      v => {
        if (v !== true) throw new Error(t('updateNotApplied'))
        setBusyUpdate(null); showToast(t('updatedOne', { n: name }), 'ok', 5000)
      },
      e => { setBusyUpdate(null); showToast(t('updateFailed', { e: e instanceof Error ? e.message : String(e) }), 'error', 8000) },
    )
  }
  // 串行逐个更新（2026-08-17 实测：并发 update 会同时 spawn 多个 pnpm，
  // 同 profile 并发写导致多数失败 + busy 状态互相覆盖闪烁 = 页面闪一下没下文）。
  const updateAll = async () => {
    if (updates === null || updates.length === 0) return
    setBusyUpdate('__all__')
    let okCount = 0
    const okNames: string[] = []
    const failures: string[] = []
    for (const u of updates) {
      try {
        const v = await rpc('update', { name: u.name, version: u.toVersion }) as boolean
        if (v !== true) throw new Error(t('updateNotApplied'))
        okCount++
        okNames.push(u.name)
      } catch (e) {
        failures.push(`${u.name}：${e instanceof Error ? e.message : String(e)}`)
      }
    }
    setBusyUpdate(null)
    if (failures.length === 0) {
      showToast(t('updatedMany', { n: okCount }) + `（${okNames.join('、')}）`, 'ok', 6000)
    } else {
      showToast(t('updateSummary', { a: okCount, b: failures.length, c: failures.join('；') }), 'error', 8000)
    }
    refreshUpdates()
  }

  const tab = (v: View, label: string, count: number | null) => (
    <button key={v} type="button" className={`pc-tab${view === v ? ' active' : ''}`} onClick={() => { setView(v) }}>
      {label}
      {count !== null && <span className="pc-count">{count}</span>}
    </button>
  )
  const tabs = (
    <div className="pc-tabs">
      {tab('installed', t('tabInstalled'), installedCount)}
      {tab('market', t('tabMarket'), marketCount)}
      {tab('updates', t('tabUpdates'), updates?.length ?? 0)}
    </div>
  )
  const head = (showTitle: boolean) => (
    <div className="pc-head">
      {showTitle && <span className="pc-title">{t('title')}</span>}
      <span className="pc-sub">{t('headSummary', { a: installedCount, b: updates?.length ?? 0, c: failedCount })}</span>
      <span className="pc-spacer" />
      <button className="pc-btn" disabled={checking} onClick={() => { refreshUpdates() }}>{checking ? t('checking') : t('check')}</button>
      <button className="pc-btn primary" disabled={!(updates?.length) || busyUpdate !== null} onClick={() => { void updateAll() }}>{t('updateAll', { n: updates?.length ?? 0 })}</button>
    </div>
  )
  const installedToolbar = view === 'installed' ? (
    <div className="pc-toolbar">
      <input className="pc-search" value={search} onChange={e => { setSearch(e.target.value) }} placeholder={t('searchInstalled')} />
      <select className="pc-select" value={installedSource ?? ''} onChange={e => { setInstalledSource(e.target.value === '' ? null : e.target.value as PluginSource) }}>
        <option value="">{t('allSources')}</option>
        <option value="official">{t('srcOfficial')}</option>
        <option value="installed">{t('srcInstalled')}</option>
        <option value="local">{t('srcLocal')}</option>
        <option value="builtin">{t('srcBuiltin')}</option>
      </select>
      <button className={`pc-chip${installedCategory === null ? ' active' : ''}`} onClick={() => { setInstalledCategory(null) }}>{t('all')}</button>
      {CATEGORIES.map(c => (
        <button key={c} className={`pc-chip${installedCategory === c ? ' active' : ''}`} onClick={() => { setInstalledCategory(c) }}>{c}</button>
      ))}
    </div>
  ) : null
  const marketToolbar = view === 'market' ? (
    <div className="pc-toolbar">
      <input className="pc-search" value={marketSearch} onChange={e => { setMarketSearch(e.target.value) }} placeholder={t('searchMarket')} />
      <select className="pc-select" value={source} onChange={e => { setSource(e.target.value); setCategory(null) }}>
        <option value="awesome">awesome-dsh-plugin</option>
        <option value="oh-my-dsh">Oh-My-DSH</option>
        <option value="all">{t('allMarkets')}</option>
      </select>
      <button className={`pc-chip${category === null ? ' active' : ''}`} onClick={() => { setCategory(null) }}>{t('all')}</button>
      {CATEGORIES.map(c => (
        <button key={c} className={`pc-chip${category === c ? ' active' : ''}`} onClick={() => { setCategory(c) }}>{c}</button>
      ))}
      <span className="pc-spacer" />
      <button type="button" title={single ? t('gridDouble') : t('gridSingle')} aria-label={single ? t('gridDouble') : t('gridSingle')} className="pc-iconbtn" onClick={() => { setSingle(v => !v) }}>
        {single ? (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" />
            <rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="2" y="2" width="12" height="5" rx="1" /><rect x="2" y="9" width="12" height="5" rx="1" />
          </svg>
        )}
      </button>
    </div>
  ) : null
  const body = (
    <>
      {view === 'installed' && <InstalledView search={search} category={installedCategory} source={installedSource} />}
      {view === 'market' && <MarketView category={category} single={single} source={source} search={marketSearch} onCount={setMarketCount} />}
      {view === 'updates' && <UpdatesView updates={updates} refresh={refreshUpdates} updateOne={updateOne} busy={busyUpdate} />}
    </>
  )
  if (variant === 'overlay') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 'none' }}>{head(false)}{tabs}{installedToolbar}{marketToolbar}</div>
        <div className="pc-scroll">{body}</div>
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <div style={{ flex: 'none', paddingBottom: '4px' }}>
        {head(true)}
        {tabs}
        {installedToolbar}
        {marketToolbar}
      </div>
      <div className="pc-scroll">{body}</div>
    </div>
  )
}

function HeaderButton() {
  const t = useT()
  return (
    <button type="button" title={t('title')} aria-label={t('title')} className="pc-headerbtn" onClick={openOverlay}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" />
      </svg>
    </button>
  )
}

function OverlayPanel() {
  const t = useT()
  const open = useOverlayOpen()
  if (!open) return null
  return (
    // 0.1.7：点遮罩关闭——overlay 背景点击即 closeOverlay；面板内点击
    // stopPropagation 不冒泡到遮罩（面板内部交互不受影响）。
    <div className="pc-overlay" role="presentation" onClick={closeOverlay}>
      <div className="pc-panel" role="dialog" aria-modal="true" aria-label={t('title')} onClick={(e) => { e.stopPropagation() }}>
        <div className="pc-panel-head">
          <span className="pc-title">{t('title')}</span>
          <span className="pc-spacer" />
          <button type="button" className="pc-close" onClick={closeOverlay} aria-label={t('close')}>✕</button>
        </div>
        <div className="pc-panel-body">
          <CenterPanel variant="overlay" />
        </div>
      </div>
    </div>
  )
}

function Toast() {
  const t = useToast()
  if (t === null) return null
  return <div className={`pc-toast ${t.kind}`}>{t.message}</div>
}

function WhatsNewDialog() {
  const t = useT()
  const open = useWhatsNewOpen()
  const [busy, setBusy] = useState(false)
  if (!open || whatsNewDigests.length === 0) return null
  // 弹窗内串行更新全部（2026-08-17 用户反馈弹窗缺更新入口；串行防 pnpm 并发）
  const updateNow = async () => {
    setBusy(true)
    let okCount = 0
    const failures: string[] = []
    for (const u of whatsNewDigests) {
      try {
        const v = await rpc('update', { name: u.name, version: u.toVersion }) as boolean
        if (v !== true) throw new Error(t('updateNotApplied'))
        okCount++
      } catch (e) {
        failures.push(`${u.name}：${e instanceof Error ? e.message : String(e)}`)
      }
    }
    setBusy(false)
    if (failures.length === 0) {
      showToast(t('updatedMany', { n: okCount }), 'ok', 6000)
      closeWhatsNew()
    } else {
      showToast(t('updateSummary', { a: okCount, b: failures.length, c: failures.join('；') }), 'error', 8000)
    }
  }
  return (
    <div className="pc-overlay" role="presentation">
      <div className="pc-panel" style={{ width: '540px' }} role="dialog" aria-modal="true" aria-label={t('whatsNewTitle')}>
        <div className="pc-panel-head">
          <span className="pc-title">{t('whatsNewTitle')}</span>
          <span className="pc-sub" style={{ marginTop: 0 }}>{t('whatsNewSub', { n: whatsNewDigests.length })}</span>
          <span className="pc-spacer" />
          <button type="button" className="pc-close" onClick={closeWhatsNew} aria-label={t('close')}>✕</button>
        </div>
        <div className="pc-panel-body" style={{ overflow: 'auto' }}>
          {whatsNewDigests.map(u => (
            <div key={u.name} className="pc-wn-item">
              <div className="pc-row">
                <span className="pc-name">{u.name}</span>
                <span className="pc-ver">{u.fromVersion}</span>
                <span className="pc-ver">→</span>
                <span style={{ color: 'var(--dsw-alias-state-business-primary)', fontWeight: 500 }}>{u.toVersion}</span>
              </div>
              {u.changelog.length > 0 && (
                <ul className="pc-wn-list">
                  {u.changelog.slice(0, 5).map((line, i) => <li key={i}>{line}</li>)}
                </ul>
              )}
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
            <button className="pc-btn" onClick={closeWhatsNew}>{t('later')}</button>
            <button className="pc-btn" onClick={closeWhatsNew}>{t('markAllRead')}</button>
            <button className="pc-btn primary" disabled={busy} onClick={() => { void updateNow() }}>{busy ? t('updating') : t('updateNow')}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- client plugin body ----
const inject = ['slots', 'connection']

// ---- 0.1.7：SSiD 标题栏统一按钮组全局控制器 ----
// SSiD 内置插件 dsh-header-unify 监听壳派发的 `ssid:titlebar` CustomEvent，
// 经这三个全局函数驱动插件中心（优先 toggle——再点关闭；开侧栏/底栏前
// 先 close 互斥）。页面卸载时清理，防页面重载/插件重载后残留旧引用。
const GLOBAL_KEYS = ['__pluginCenterOpen', '__pluginCenterToggle', '__pluginCenterClose'] as const
function installGlobals(): void {
  const w = window as unknown as Record<string, unknown>
  w.__pluginCenterOpen = openOverlay
  w.__pluginCenterToggle = toggleOverlay
  w.__pluginCenterClose = closeOverlay
  w.__pluginCenterGlobalsInstalled = true
}
function cleanupGlobals(): void {
  const w = window as unknown as Record<string, unknown>
  for (const key of GLOBAL_KEYS) delete w[key]
  delete w.__pluginCenterGlobalsInstalled
}

function apply(ctx: { slots: any; connection: any; get?: (name: string) => unknown; on?: (event: string, handler: (payload: any) => void) => void }): void {
  injectCss()
  // 0.1.7：暴露全局控制器（防重复安装：已安装则不重复挂监听）。
  if ((window as unknown as Record<string, unknown>).__pluginCenterGlobalsInstalled !== true) {
    installGlobals()
    window.addEventListener('unload', cleanupGlobals)
  }
  rpc = async (endpoint: string, payload: unknown = {}): Promise<unknown> => {
    const result = await ctx.connection.rpc.call('/plugin-center', endpoint, payload)
    if (result.ok) return result.value
    throw new Error(result.error?.message ?? `plugin-center: ${endpoint} failed`)
  }

  // 双语：初始快照 + locale/change 事件（DSH 语言切换时组件经 useT 重渲染）。
  // 用 ctx.get 软获取而非 inject 声明：cordis 对未声明依赖的属性访问直接拒绝
  // （实测 "cannot get property locale without inject" 导致插件加载失败）；
  // locale 服务缺失时静默降级为中文。
  const locale = ctx.get?.('locale') as { getLocale?: () => { active?: string } } | undefined
  const initial = locale?.getLocale?.()?.active
  if (typeof initial === 'string') adoptLocale(initial)
  ctx.on?.('locale/change', (snap: { active?: string } | undefined) => { adoptLocale(snap?.active) })

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'plugin-center', order: 50, label: () => STRINGS[localeId].title,
  }, CenterPanel))

  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities', id: 'plugin-center', order: 50,
  }, HeaderButton))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id: 'plugin-center-panel', order: 50,
  }, OverlayPanel))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id: 'plugin-center-whats-new', order: 51,
  }, WhatsNewDialog))

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id: 'plugin-center-toast', order: 52,
  }, Toast))

  void checkWhatNew()
}

export { inject, apply }
