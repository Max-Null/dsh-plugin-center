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
let toastState: { message: string; kind: 'ok' | 'error' } | null = null
const toastListeners = new Set<() => void>()
function showToast(message: string, kind: 'ok' | 'error' = 'ok'): void {
  toastState = { message, kind }
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
    }, 3200)
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

const SOURCE_LABEL: Record<PluginSource, string> = { official: '官方', installed: '用户安装', local: '本地开发', builtin: '内置' }
const CATEGORIES = ['ui', 'usage', 'theme', 'model', 'session', 'memory', 'tools', 'vision', 'skill', 'workflow', 'notify', 'dev', 'market', 'fun']

// ---- views ----
function InstalledView({ search, category, source }: { search: string; category: string | null; source: PluginSource | null }) {
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
  if (error !== null) return <p className="pc-sub">加载失败：{error}</p>
  if (items === null) return <p className="pc-sub">加载中…</p>
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
            <span className={`pc-badge ${p.source}`}>{SOURCE_LABEL[p.source]}</span>
            <span className="pc-spacer" />
            <span className={`pc-dot${p.fiberPhase === 'failed' ? ' failed' : ''}`} />
          </div>
          {p.description !== null && <div className="pc-desc">{p.description}</div>}
          <div className="pc-meta">
            {p.categories.map(c => <span key={c} className="pc-tag">{c}</span>)}
            {p.compatRange !== null && <span className="pc-tag">要求 DSH {p.compatRange}</span>}
            {!p.enabled && <span className="pc-tag">已禁用</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

function MarketView({ category, single, source, search, onCount }: { category: string | null; single: boolean; source: string; search: string; onCount: (n: number) => void }) {
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
  if (error !== null) return <p className="pc-sub">加载失败：{error}</p>
  if (items.length === 0 && !done) return <p className="pc-sub">加载市场目录中…</p>
  const q = search.trim().toLowerCase()
  const filtered = items.filter(m => {
    const matchSearch = q === ''
      || m.name.toLowerCase().includes(q)
      || (m.description.zh || m.description.en).toLowerCase().includes(q)
    return matchSearch && (category === null || m.categories.includes(category))
  })
  const install = (m: MarketPlugin) => {
    setBusy(m.name)
    void rpc('install', { spec: m.spec }).then(
      () => {
        setBusy(null)
        pendingInstall.add(m.spec)
        for (const key of Object.keys(marketCache)) {
          const c = marketCache[key]
          if (c !== undefined) c.plugins = c.plugins.map(p => p.name === m.name ? { ...p, installed: true } : p)
        }
        setItems(prev => prev.map(p => p.name === m.name ? { ...p, installed: true } : p))
        showToast(`已发起安装 ${m.name}，重启 dsh web 后生效`)
      },
      e => {
        setBusy(null)
        showToast(`安装失败：${e instanceof Error ? e.message : String(e)}`, 'error')
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
            <div className="pc-desc">{m.description.zh || m.description.en}</div>
            <div className="pc-meta">
              {m.categories.map(c => <span key={c} className="pc-tag">{c}</span>)}
              <span className="pc-spacer" />
              {m.installed || pendingInstall.has(m.spec)
                ? <span className="pc-tag">{pendingInstall.has(m.spec) ? '待重启生效' : '已安装'}</span>
                : <button className="pc-btn primary" disabled={busy !== null} onClick={() => { install(m) }}>{busy === m.name ? '安装中…' : '安装'}</button>}
            </div>
          </div>
        ))}
      </div>
      {!done && <p className="pc-sub">正在加载更多…（已加载 {items.length} 个）</p>}
    </div>
  )
}

function UpdatesView({ updates, refresh, updateOne, busy }: {
  updates: UpdateDigest[] | null
  refresh: () => void
  updateOne: (name: string) => void
  busy: string | null
}) {
  if (updates === null) return <p className="pc-sub">检查更新中…</p>
  if (updates.length === 0) return (
    <div>
      <p className="pc-sub">没有可用的更新。</p>
      <button className="pc-btn" onClick={refresh}>重新检查</button>
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
            {u.compat === 'incompatible' && <span className="pc-tag danger">不兼容当前 DSH</span>}
            <span className="pc-spacer" />
            <button className="pc-btn primary" disabled={busy !== null} onClick={() => { updateOne(u.name) }}>{busy === u.name || busy === '__all__' ? '更新中…' : '更新'}</button>
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

  const refreshUpdates = useCallback(() => {
    void rpc('checkUpdates', { since: new Date(Date.now() - 30 * 86400_000).toISOString() }).then(
      v => { setUpdates(v as UpdateDigest[]) },
      () => { /* keep previous digests on failure */ },
    )
  }, [])
  useEffect(() => {
    void rpc('listInstalled').then(
      v => {
        const items = v as InstalledPlugin[]
        setInstalledCount(items.length)
        setFailedCount(items.filter(p => p.fiberPhase === 'failed').length)
      },
      () => { /* leave counts at 0 */ },
    )
    refreshUpdates()
  }, [refreshUpdates])

  const updateOne = (name: string) => {
    setBusyUpdate(name)
    void rpc('update', { name }).then(
      () => { setBusyUpdate(null); showToast(`已更新 ${name}，重启 dsh web 后生效`) },
      e => { setBusyUpdate(null); showToast(`更新失败：${e instanceof Error ? e.message : String(e)}`, 'error') },
    )
  }
  // 串行逐个更新（2026-08-17 实测：并发 update 会同时 spawn 多个 pnpm，
  // 同 profile 并发写导致多数失败 + busy 状态互相覆盖闪烁 = 页面闪一下没下文）。
  const updateAll = async () => {
    if (updates === null || updates.length === 0) return
    setBusyUpdate('__all__')
    let okCount = 0
    const failures: string[] = []
    for (const u of updates) {
      try {
        await rpc('update', { name: u.name })
        okCount++
      } catch (e) {
        failures.push(`${u.name}：${e instanceof Error ? e.message : String(e)}`)
      }
    }
    setBusyUpdate(null)
    if (failures.length === 0) {
      showToast(`已更新 ${okCount} 个插件，重启 dsh web 后生效`)
    } else {
      showToast(`更新完成：成功 ${okCount}，失败 ${failures.length}（${failures.join('；')}）`, 'error')
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
      {tab('installed', '已安装', installedCount)}
      {tab('market', '市场', marketCount)}
      {tab('updates', '更新', updates?.length ?? 0)}
    </div>
  )
  const head = (showTitle: boolean) => (
    <div className="pc-head">
      {showTitle && <span className="pc-title">插件中心</span>}
      <span className="pc-sub">已安装 {installedCount} · 有更新 {updates?.length ?? 0} · 失效 {failedCount}</span>
      <span className="pc-spacer" />
      <button className="pc-btn" onClick={refreshUpdates}>检查更新</button>
      <button className="pc-btn primary" disabled={!(updates?.length) || busyUpdate !== null} onClick={() => { void updateAll() }}>更新全部（{updates?.length ?? 0}）</button>
    </div>
  )
  const installedToolbar = view === 'installed' ? (
    <div className="pc-toolbar">
      <input className="pc-search" value={search} onChange={e => { setSearch(e.target.value) }} placeholder="搜索已安装插件" />
      <select className="pc-select" value={installedSource ?? ''} onChange={e => { setInstalledSource(e.target.value === '' ? null : e.target.value as PluginSource) }}>
        <option value="">全部来源</option>
        <option value="official">官方</option>
        <option value="installed">用户安装</option>
        <option value="local">本地开发</option>
        <option value="builtin">内置</option>
      </select>
      <button className={`pc-chip${installedCategory === null ? ' active' : ''}`} onClick={() => { setInstalledCategory(null) }}>全部</button>
      {CATEGORIES.map(c => (
        <button key={c} className={`pc-chip${installedCategory === c ? ' active' : ''}`} onClick={() => { setInstalledCategory(c) }}>{c}</button>
      ))}
    </div>
  ) : null
  const marketToolbar = view === 'market' ? (
    <div className="pc-toolbar">
      <input className="pc-search" value={marketSearch} onChange={e => { setMarketSearch(e.target.value) }} placeholder="搜索社区插件" />
      <select className="pc-select" value={source} onChange={e => { setSource(e.target.value); setCategory(null) }}>
        <option value="awesome">awesome-dsh-plugin</option>
        <option value="oh-my-dsh">Oh-My-DSH</option>
        <option value="all">全部源</option>
      </select>
      <button className={`pc-chip${category === null ? ' active' : ''}`} onClick={() => { setCategory(null) }}>全部</button>
      {CATEGORIES.map(c => (
        <button key={c} className={`pc-chip${category === c ? ' active' : ''}`} onClick={() => { setCategory(c) }}>{c}</button>
      ))}
      <span className="pc-spacer" />
      <button type="button" title={single ? '双列网格' : '单列列表'} aria-label="切换布局" className="pc-iconbtn" onClick={() => { setSingle(v => !v) }}>
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
  return (
    <button type="button" title="插件中心" aria-label="插件中心" className="pc-headerbtn" onClick={openOverlay}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="5" height="5" rx="1" /><rect x="9" y="2" width="5" height="5" rx="1" />
        <rect x="2" y="9" width="5" height="5" rx="1" /><rect x="9" y="9" width="5" height="5" rx="1" />
      </svg>
    </button>
  )
}

function OverlayPanel() {
  const open = useOverlayOpen()
  if (!open) return null
  return (
    <div className="pc-overlay" role="presentation">
      <div className="pc-panel" role="dialog" aria-modal="true" aria-label="插件中心">
        <div className="pc-panel-head">
          <span className="pc-title">插件中心</span>
          <span className="pc-spacer" />
          <button type="button" className="pc-close" onClick={closeOverlay} aria-label="关闭">✕</button>
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
        await rpc('update', { name: u.name })
        okCount++
      } catch (e) {
        failures.push(`${u.name}：${e instanceof Error ? e.message : String(e)}`)
      }
    }
    setBusy(false)
    if (failures.length === 0) {
      showToast(`已更新 ${okCount} 个插件，重启 dsh web 后生效`)
      closeWhatsNew()
    } else {
      showToast(`更新完成：成功 ${okCount}，失败 ${failures.length}（${failures.join('；')}）`, 'error')
    }
  }
  return (
    <div className="pc-overlay" role="presentation">
      <div className="pc-panel" style={{ width: '540px' }} role="dialog" aria-modal="true" aria-label="插件更新">
        <div className="pc-panel-head">
          <span className="pc-title">插件更新</span>
          <span className="pc-sub" style={{ marginTop: 0 }}>{whatsNewDigests.length} 个插件有新版本</span>
          <span className="pc-spacer" />
          <button type="button" className="pc-close" onClick={closeWhatsNew} aria-label="关闭">✕</button>
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
            <button className="pc-btn" onClick={closeWhatsNew}>稍后</button>
            <button className="pc-btn" onClick={closeWhatsNew}>全部标记已读</button>
            <button className="pc-btn primary" disabled={busy} onClick={() => { void updateNow() }}>{busy ? '更新中…' : '立即更新'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---- client plugin body ----
const inject = ['slots', 'connection']

function apply(ctx: { slots: any; connection: any }): void {
  injectCss()
  rpc = async (endpoint: string, payload: unknown = {}): Promise<unknown> => {
    const result = await ctx.connection.rpc.call('/plugin-center', endpoint, payload)
    if (result.ok) return result.value
    throw new Error(result.error?.message ?? `plugin-center: ${endpoint} failed`)
  }

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'plugin-center', order: 50, label: () => '插件中心',
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
